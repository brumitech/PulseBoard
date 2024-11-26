import React from 'react';
import { BaseWidgetProps } from '@pulseboard/shared';

export const RectangleWidget: React.FC<BaseWidgetProps> = ({ x, y, scale, color }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x.value}px`,
        top: `${y.value}px`,
        transform: `scale(${scale.value})`,
        backgroundColor: color.value,
        width: '100px',
        height: '100px',
      }}
    />
  );
};