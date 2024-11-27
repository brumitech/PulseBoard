import { useState, useEffect } from 'react';

interface ScreenInfo {
  width: number;
  height: number;
  scale: number;
}

const useScreen = () => {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
    width: 1920, // Mock resolution
    height: 1080, // Mock resolution
    scale: 1, // Default scale factor
  });

  useEffect(() => {
    // Mocking a fixed screen resolution for now.
    // Future: Update to handle real resolutions or dynamically resize.
    const handleResize = () => {
      const editorWidth = window.innerWidth; // Current editor container width
      const editorHeight = window.innerHeight; // Current editor container height

      const scale = Math.min(
        editorWidth / screenInfo.width,
        editorHeight / screenInfo.height
      );

      setScreenInfo((prev) => ({
        ...prev,
        scale,
      }));
    };

    handleResize(); // Initial calculation
    window.addEventListener('resize', handleResize); // Adjust on window resize

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [screenInfo.width, screenInfo.height]);

  return screenInfo;
};

export default useScreen;
