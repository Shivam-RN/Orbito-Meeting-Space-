import React, { useCallback, useEffect, useRef, useState } from "react";
import {dummyRemoteParticipants} from "../assets/asset";
import { toast } from "react-hot-toast";

const useWebRTC = (roomId, user, onMeetingEnded, enabled = true) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState(dummyRemoteParticipants);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const localStreamRef = useRef(null);

  const initLocalStream = useCallback(async () => {
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
        return stream;
      }
    } catch (_error) {
      toast.error(
        "Mock Error: Unable to access camera and microphone. Please check your device settings and permissions.",
      );
    }
    return null;
  }, []);

  useEffect(() => {
    initLocalStream();
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [initLocalStream]);

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = newState;
      }
      toast(newState ? "Microphone turned on" : "Microphone turned off")
    }
  };

  const toggleVideo = () => {
    const newState = !videoEnabled;
    setVideoEnabled(newState);
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = newState;
      }
      toast(newState ? "Camera turned on" : "Camera turned off")
    }
  };

  const endMeeting = useCallback(() => {
   if (onMeetingEnded) {
      onMeetingEnded("Meeting Ended");
    }
  }, [onMeetingEnded]);

  return {
    localStream,
    remoteUsers,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
    endMeeting
  }
};

export default useWebRTC;