import React, { useEffect, useRef, useState } from 'react';
import { Bell, AlertCircle, Video, Mic, Phone, VideoOff, MicOff } from 'lucide-react';
import axios from 'axios';

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

interface DrowsinessResponse {
    processed_frame: string;
    warnings: string[];
    error?: string;
}

interface EmotionResponse {
    processed_frame: string;
    emotion: string | null;
    updated_database?: boolean;
    error?: string;
}

const ClassRoom = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [emotion, setEmotion] = useState<string | null>(null);
    const [alertSound, setAlertSound] = useState<HTMLAudioElement | null>(null);
    const [isSendingFrame, setIsSendingFrame] = useState(false);
    const [frameCount, setFrameCount] = useState(0);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [socketConnected, setSocketConnected] = useState<boolean>(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const frameIntervalRef = useRef<number | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);

    // Get user information from localStorage
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userId, setUserId] = useState(localStorage.getItem("userid"));
    const [userImage, setUserImage] = useState(localStorage.getItem("imageurl"));

    const drowsinessApiUrl = 'http://localhost:5001/api/process_frame';
    const emotionApiUrl = 'http://localhost:5003/api/process_frame';

    // Initialize beep sound
    useEffect(() => {
        const beep = new Audio('beep.mp3');
        beep.volume = 0.5;
        setAlertSound(beep);

        return () => {
            beep.pause();
        };
    }, []);

    // Check if user is logged in
    useEffect(() => {
        if (!token || !userId) {
            // Redirect to login if not authenticated
            window.location.href = "/auth";
        }
    }, [token, userId]);

    // Start camera when component mounts
    useEffect(() => {
        startCamera();

        return () => {
            // Clean up when component unmounts
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
            if (frameIntervalRef.current) {
                clearInterval(frameIntervalRef.current);
            }

            const intervalId = setInterval(() => {
                if (videoRef.current) {
                    sendFrame(videoRef.current);
                }
            }, 1000);

            frameIntervalRef.current = intervalId;
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
            setCameraError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: isAudioOn
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;

                // Add an event listener to confirm when video is actually playing
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play()
                        .then(() => {
                            console.log("Camera started successfully");
                            setIsCameraReady(true);
                        })
                        .catch(err => {
                            console.error("Error playing video:", err);
                            setCameraError("Could not play video stream. Please check permissions.");
                        });
                };
            }

            setStream(mediaStream);
        } catch (err) {
            console.error("Error accessing camera:", err);
            let errorMessage = "Failed to access camera. ";

            if (err instanceof DOMException) {
                if (err.name === 'NotAllowedError') {
                    errorMessage += "Camera access was denied. Please check your browser permissions.";
                } else if (err.name === 'NotFoundError') {
                    errorMessage += "No camera device found. Please connect a camera.";
                } else if (err.name === 'NotReadableError') {
                    errorMessage += "Camera is already in use by another application.";
                } else {
                    errorMessage += `Error: ${err.message}`;
                }
            } else {
                errorMessage += "Unknown error occurred.";
            }

            setCameraError(errorMessage);
        }
    };

    const sendFrame = async (frame: HTMLVideoElement) => {
        // Don't send if we're already sending or if user is not authenticated
        if (isSendingFrame || !token || !userId) return;

        try {
            setIsSendingFrame(true);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (frame.videoWidth === 0 || frame.videoHeight === 0) {
                console.log("Video not ready yet, skipping frame");
                setIsSendingFrame(false);
                return;
            }

            canvas.width = frame.videoWidth || 640;
            canvas.height = frame.videoHeight || 480;

            ctx?.drawImage(frame, 0, 0, canvas.width, canvas.height);

            const base64Image = canvas.toDataURL('image/jpeg');
            const base64Data = base64Image.split(',')[1];

            if (!base64Data) {
                console.error("Failed to capture frame as base64");
                setIsSendingFrame(false);
                return;
            }

            // Include the student_id (user ID) in the request data
            const data = {
                frame: base64Data,
                student_id: userId,
                username: localStorage.getItem("username")
            };

            // Send frame to both backends concurrently
            const [drowsinessResponse, emotionResponse] = await Promise.all([
                axios.post<DrowsinessResponse>(drowsinessApiUrl, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }),
                axios.post<EmotionResponse>(emotionApiUrl, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            // Process drowsiness response
            if (drowsinessResponse.status === 200) {
                const drowsinessResult = drowsinessResponse.data;
                setProcessedImage(drowsinessResult.processed_frame);

                if (drowsinessResult.warnings && drowsinessResult.warnings.length > 0) {
                    const significantWarnings = drowsinessResult.warnings.filter(
                        (warning: string) => warning !== "No Warning"
                    );

                    if (significantWarnings.length > 0) {
                        setWarnings(prev => {
                            // Limit warnings to the most recent 10
                            const newWarnings = [...prev, ...significantWarnings];
                            return newWarnings.slice(-10);
                        });
                        alertSound?.play();
                    }
                }
            } else {
                console.error("Error processing drowsiness:", drowsinessResponse.statusText);
            }

            // Process emotion response
            if (emotionResponse.status === 200) {
                const emotionResult = emotionResponse.data;
                setEmotion(emotionResult.emotion);

                if (emotionResult.updated_database) {
                    console.log("Emotion data saved to database");
                }
            } else {
                console.error("Error processing emotion:", emotionResponse.statusText);
            }

            setFrameCount((prev) => prev + 1);
            setSocketConnected(true); // If both are successful, consider connected

        } catch (error: any) {
            console.error("Error sending frame:", error);
            setSocketConnected(false);
            if (error.response && error.response.status === 401) {
                // Token expired or invalid
                setCameraError("Authentication expired. Please log in again.");
                localStorage.removeItem("token");
                setTimeout(() => {
                    window.location.href = "/auth";
                }, 2000);
            } else {
                setCameraError("Connection to detection server lost. Please reconnect.");
            }
        } finally {
            setIsSendingFrame(false);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            const videoTracks = stream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !isVideoOn;
            });
            setIsVideoOn(!isVideoOn);
        }
    };

    const toggleAudio = () => {
        if (stream) {
            const audioTracks = stream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !isAudioOn;
            });
            setIsAudioOn(!isAudioOn);
        }
    };

    const endCall = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setStream(null);
        window.location.href = "/dashboard"; // Redirect to dashboard after ending call
    };

    const clearWarnings = () => {
        setWarnings([]);
    };

    const handleReconnect = () => {
        endCall();
        startCamera();
    };

    return (
        <div className="flex h-screen p-4 bg-blue-50">
            <div className="flex flex-col items-center flex-1 p-6 bg-white shadow-lg rounded-xl">
                <h2 className="mb-4 text-lg font-semibold">Matching Learning Class</h2>
                <div className="relative w-full max-w-4xl overflow-hidden bg-gray-900 rounded-lg aspect-video">
                    {cameraError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white bg-black bg-opacity-80">
                            <AlertCircle size={40} className="mb-2 text-red-500" />
                            <p className="mb-4 text-center">{cameraError}</p>
                            <button
                                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                onClick={handleReconnect}
                            >
                                Retry Camera Access
                            </button>
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        className="object-cover w-full h-full"
                        autoPlay
                        playsInline
                        muted={!isAudioOn}
                    />
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-4 space-x-4 bg-black bg-opacity-50">
                        <button
                            className={`p-3 rounded-full ${isVideoOn ? 'bg-blue-500' : 'bg-red-500'}`}
                            onClick={toggleVideo}
                        >
                            {isVideoOn ? <Video size={20} color="white" /> : <VideoOff size={20} color="white" />}
                        </button>
                        <button
                            className={`p-3 rounded-full ${isAudioOn ? 'bg-blue-500' : 'bg-red-500'}`}
                            onClick={toggleAudio}
                        >
                            {isAudioOn ? <Mic size={20} color="white" /> : <MicOff size={20} color="white" />}
                        </button>
                        <button className="p-3 bg-red-500 rounded-full" onClick={endCall}>
                            <Phone size={20} color="white" />
                        </button>
                    </div>
                    <div className="absolute top-4 left-4">
                        <div className={`flex items-center px-2 py-1 text-sm ${socketConnected ? 'bg-green-500' : 'bg-red-500'} text-white rounded-md`}>
                            {socketConnected ? 'Connected' : 'Disconnected'}
                        </div>
                    </div>
                </div>
                {emotion && (
                    <div className="mt-4 text-lg font-semibold">
                        Detected Emotion: {emotion}
                    </div>
                )}
            </div>

            <div className="flex flex-col w-1/3 ml-4 space-y-4">
                {/* Removing the Notifications Card */}
                {/* <Card>
                    <CardContent>
                        <h3 className="mb-2 font-semibold text-md">Notifications</h3>
                        <div className="p-4 space-y-2 text-sm bg-gray-100 rounded">
                            <div className="flex items-center space-x-2">
                                <Bell size={16} />
                                <span>Frame count: {frameCount}</span>
                            </div>
                            {processedImage && (
                                <div className="mt-2">
                                    <img
                                        src={`data:image/jpeg;base64,${processedImage}`}
                                        alt="Processed frame"
                                        className="w-full rounded"
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card> */}

                <Card>
                    <CardContent className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-md">Warnings</h3>
                            {warnings.length > 0 && (
                                <button
                                    className="text-xs text-blue-500 hover:text-blue-700"
                                    onClick={clearWarnings}
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                        <div className="p-4 space-y-2 rounded bg-yellow-50">
                            {warnings.length > 0 ? (
                                warnings.map((warning, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm text-yellow-800">
                                        <AlertCircle size={16} />
                                        <span>{warning}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">No warnings</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ClassRoom;