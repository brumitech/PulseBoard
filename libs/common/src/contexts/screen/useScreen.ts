import { useState, useEffect } from 'react';
import { ScreenInfo } from './types';

export function useScreen() {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
    targetWidth: 1920,
    targetHeight: 1080,
    containerWidth: 0,
    containerHeight: 0,
    scale: 1,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.querySelector('.preview-container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerAspect = containerRect.width / containerRect.height;
      const targetAspect = screenInfo.targetWidth / screenInfo.targetHeight;

      let scale: number;
      let containerWidth: number;
      let containerHeight: number;

      if (containerAspect > targetAspect) {
        // Container is wider than needed - height is limiting factor
        containerHeight = containerRect.height;
        containerWidth = containerHeight * targetAspect;
        scale = containerHeight / screenInfo.targetHeight;
      } else {
        // Container is taller than needed - width is limiting factor
        containerWidth = containerRect.width;
        containerHeight = containerWidth / targetAspect;
        scale = containerWidth / screenInfo.targetWidth;
      }

      setScreenInfo((prev) => ({
        ...prev,
        containerWidth,
        containerHeight,
        scale,
      }));
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [screenInfo.targetWidth, screenInfo.targetHeight]);

  return screenInfo;
}