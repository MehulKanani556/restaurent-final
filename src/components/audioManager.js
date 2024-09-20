import { useRef } from "react";

const useAudioManager = () => {
  // const notificationSound = useRef(null);
  const notificationSound = new Audio(require("../Image/notification-sound.mp3"));

  const playNotificationSound = () => {
  // alert("Playing notification sound");
    // Ensure this function is called in response to a user interaction
    if (notificationSound) {
      notificationSound.play().catch(error => {
        console.error("Playback failed:", error);
      });
    }
  };

  return { playNotificationSound };
};

export default useAudioManager;