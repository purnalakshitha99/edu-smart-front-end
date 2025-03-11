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

  const startCamera = async () => {
    try {
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
      }
      setStream(mediaStream);

      setIsVideoOn(true);  //set default value true
      setIsAudioOn(true);  //set default value true
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
      stream.getTracks().forEach(track => {
        track.stop();
      });
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
      setIsVideoOn(false);
      setIsAudioOn(false);
    }
  };

  return (
    <div className="flex h-screen p-4 bg-blue-50">
      {/* Left Side - Online Classroom */}
      <div className="flex flex-col items-center flex-1 p-6 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-lg font-semibold">Matching Learning Class</h2>
        <div className="relative w-full max-w-4xl overflow-hidden bg-gray-900 rounded-lg aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="object-cover w-full h-full"
            muted // Add muted attribute
          />
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
        </div>
      </div>

      {/* Right Side - Notifications & Warnings */}
      <div className="flex flex-col w-1/3 ml-4 space-y-4">
        {/* Notifications */}
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

        {/* Warnings */}
        <Card>
          <CardContent>
            <h3 className="mb-2 font-semibold text-md">Warnings</h3>
            <div className="flex items-center p-2 space-x-2 text-red-600 bg-red-100 rounded-lg">
              <AlertCircle />
              <span>Low engagement detected</span>
            </div>
            <div className="flex items-center p-2 mt-2 space-x-2 text-yellow-600 bg-yellow-100 rounded-lg">
              <AlertCircle />
              <span>Student inactive for 10 minutes</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ClassRoom;