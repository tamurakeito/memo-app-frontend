import { useState, useEffect } from "react";

const useTwoFingerSwipe = () => {
  const [gesture, setGesture] = useState("");

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        setGesture("Two fingers detected");
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];

        const deltaX = touch2.clientX - touch1.clientX;
        const deltaY = touch2.clientY - touch1.clientY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) {
            setGesture("Swipe Right");
          } else {
            setGesture("Swipe Left");
          }
        } else {
          if (deltaY > 0) {
            setGesture("Swipe Down");
          } else {
            setGesture("Swipe Up");
          }
        }
      }
    };

    const handleTouchEnd = () => {
      setGesture("");
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return gesture;
};

export default useTwoFingerSwipe;
