import React, { useEffect, useRef, useState } from 'react';
import { Bell, AlertCircle, Video, Mic, Phone, VideoOff, MicOff } from 'lucide-react';

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md ${className}`}>
            {children}
        </div>
    );
};

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`p-4 ${className}`}>
            {children}
        </div>
    );
};

const ClassRoom = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [alertSound, setAlertSound] = useState<HTMLAudioElement | null>(null);
    const [isSendingFrame, setIsSendingFrame] = useState(false);
    const [frameCount, setFrameCount] = useState(0);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const studentId = "student123"; // Replace with a dynamic student ID if needed
    const [socketConnected, setSocketConnected] = useState<boolean>(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const frameIntervalRef = useRef<number | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);

    // Initialize beep sound
    useEffect(() => {
        console.log("Initializing alert sound...");
        const audio = new Audio('/beep.mp3'); // Ensure the beep file exists in your public folder
        audio.volume = 0.5; // Set volume to 50%

        // Pre-load the sound
        audio.load();
        audio.oncanplaythrough = () => {
            console.log("Alert sound loaded successfully");
            setAlertSound(audio);
        };

        audio.onerror = (e) => {
            console.error("Error loading alert sound:", e);
        };

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    // Start camera when component mounts
    useEffect(() => {
        startCamera();

        // Cleanup function to stop camera when component unmounts
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (frameIntervalRef.current) {
                clearInterval(frameIntervalRef.current);
            }
        };
    }, []);

    // Set up frame sending interval after camera starts
    useEffect(() => {
        if (stream && isVideoOn && isCameraReady) {
            // Clear any existing interval
            if (frameIntervalRef.current) {
                clearInterval(frameIntervalRef.current);
            }

            // Set new interval to send frames
            const intervalId = setInterval(() => {
                if (videoRef.current) {
                    sendFrame(videoRef.current);
                }
            }, 1000); // Send frame every second

            frameIntervalRef.current = intervalId;

            // Update socket connection status
            setSocketConnected(true);

            return () => {
                if (frameIntervalRef.current) {
                    clearInterval(frameIntervalRef.current);
                }
            };
        }
    }, [stream, isVideoOn, isCameraReady]);

    const startCamera = async () => {
        try {
            console.log("Starting camera...");
            setCameraError(null);

            // Stop any existing stream first
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                console.log("Video element source set");
            }
            setStream(mediaStream);

            // Wait for video to be ready
            if (videoRef.current) {
                videoRef.current.onloadedmetadata = () => {
                    console.log("Video metadata loaded, starting playback");
                    videoRef.current?.play().catch(e => {
                        console.error("Error playing video:", e);
                        setCameraError("Failed to play video stream");
                    });
                    setIsCameraReady(true);
                };
            }

            setIsVideoOn(true);
            setIsAudioOn(true);

            console.log("Camera started successfully");
        } catch (err) {
            console.error("Error accessing camera:", err);
            setCameraError(`Failed to access camera: ${err instanceof Error ? err.message : String(err)}`);
            setIsVideoOn(false);
        }
    };

    // Function to send frame to backend
    async function sendFrame(frame: HTMLVideoElement) {
        try {
            setIsSendingFrame(true);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Check if the video is ready and has dimensions
            if (frame.videoWidth === 0 || frame.videoHeight === 0) {
                console.log("Video not ready yet, skipping frame");
                setIsSendingFrame(false);
                return;
            }

            canvas.width = frame.videoWidth || 640;
            canvas.height = frame.videoHeight || 480;

            ctx?.drawImage(frame, 0, 0, canvas.width, canvas.height);

            // Convert canvas to base64
            const base64Image = canvas.toDataURL('image/jpeg');
            const base64Data = base64Image.split(',')[1]; // Extract only the base64 part

            if (!base64Data) {
                console.error("Failed to capture frame as base64");
                setIsSendingFrame(false);
                return;
            }

            const data = {
                frame: base64Data,
                student_id: studentId,
            };

            // Send frame to the backend using fetch - make sure this URL matches your backend
            const response = await fetch('http://localhost:5000/api/process_frame', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                setProcessedImage(result.processed_frame);
                setSocketConnected(true);

                if (result.warnings && result.warnings.length > 0) {
                    // Only add meaningful warnings (not "No Warning")
                    const significantWarnings = result.warnings.filter((warning: string) =>
                        warning !== "No Warning");

                    if (significantWarnings.length > 0) {
                        setWarnings(prev => [...prev, ...significantWarnings]);
                        // Only play sound for actual warnings
                        alertSound?.play();
                    }
                }

                // Increment frame counter for monitoring
                setFrameCount(prev => prev + 1);
            } else {
                console.error("Error processing frame:", await response.text());
                setSocketConnected(false);
            }
        } catch (error) {
            console.error("Error sending frame:", error);
            setSocketConnected(false);
            setCameraError("Connection to detection server lost. Please reconnect.");
        } finally {
            setIsSendingFrame(false);
        }
    }

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOn(videoTrack.enabled);
            }
        }
    };

    const toggleAudio = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioOn(audioTrack.enabled);
            }
        }
    };

    const endCall = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setStream(null);
            setIsVideoOn(false);
            setIsAudioOn(false);
            if (frameIntervalRef.current) {
                clearInterval(frameIntervalRef.current);
                frameIntervalRef.current = null;
            }
            setSocketConnected(false);
        }
    };

    const clearWarnings = () => {
        setWarnings([]);  // Clears the warning messages on the frontend
    };

    const handleReconnect = () => {
        console.log("Attempting to reconnect...");
        // Stop current stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        // Reset states
        setWarnings([]);
        setSocketConnected(false);

        // Delay before reconnecting
        setTimeout(() => {
            // Restart camera and socket connection
            startCamera();
        }, 1000);
    };


    return (
        <div className="flex h-screen p-4 bg-blue-50">
            <div className="flex flex-col items-center flex-1 p-6 bg-white shadow-lg rounded-xl">
                <h2 className="mb-4 text-lg font-semibold">Matching Learning Class</h2>
                <div className="relative w-full max-w-4xl overflow-hidden bg-gray-900 rounded-lg aspect-video">
                    {cameraError ? (
                        <div className="flex flex-col items-center justify-center w-full h-full text-white">
                            <AlertCircle className="w-12 h-12 mb-2 text-red-500" />
                            <p className="text-center">{cameraError}</p>
                            <button
                                onClick={startCamera}
                                className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                                Retry Camera Access
                            </button>
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="object-cover w-full h-full"
                            muted
                        />
                    )}
                    <div className="absolute flex items-center px-6 py-3 space-x-4 transform -translate-x-1/2 rounded-full bottom-4 left-1/2 bg-gray-800/60">
                        <button
                            onClick={toggleAudio}
                            className={`p-3 rounded-full ${isAudioOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {isAudioOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
                        </button>
                        <button
                            onClick={toggleVideo}
                            className={`p-3 rounded-full ${isVideoOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            {isVideoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
                        </button>
                        <button
                            onClick={endCall}
                            className="p-3 bg-red-500 rounded-full hover:bg-red-600"
                        >
                            <Phone className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`}>
                        <span className="text-xs font-medium text-white">
                            {socketConnected ? 'Connected' : 'Disconnected'}
                        </span>
                        {!socketConnected && (
                            <button
                                onClick={handleReconnect}
                                className="px-2 py-1 ml-2 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                                Reconnect
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-1/3 ml-4 space-y-4">
                <Card>
                    <CardContent>
                        <h3 className="mb-2 font-semibold text-md">Notifications</h3>
                        <div className="flex items-center p-2 space-x-2 bg-gray-100 rounded-lg">
                            <Bell className="text-blue-500" />
                            <span>New lesson available: 'Illustrator Basics'</span>
                        </div>
                        <div className="flex items-center p-2 mt-2 space-x-2 bg-gray-100 rounded-lg">
                            <Bell className="text-blue-500" />
                            <span>Quiz deadline extended</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-md">Warnings</h3>
                            {warnings.length > 0 && (
                                <button
                                    onClick={clearWarnings}
                                    className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                        {warnings.length > 0 ? (
                            warnings.map((warning, index) => (
                                <div key={index} className="flex items-center p-2 mt-2 space-x-2 text-red-600 bg-red-100 rounded-lg">
                                    <AlertCircle />
                                    <span>{warning}</span>
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-center text-gray-500">No warnings</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ClassRoom;