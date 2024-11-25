import { BaseWidgetProps } from '../../../src';
import React, { useEffect, useState } from 'react';

// Air Quality Widget
export interface AirQualityProps extends BaseWidgetProps {
  aqi: number;
}

export const AirQualityWidget: React.FC<AirQualityProps> = ({ x, y, scale, color, aqi }) => {
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return '#00E400';
    if (aqi <= 100) return '#FFFF00';
    if (aqi <= 150) return '#FF7E00';
    if (aqi <= 200) return '#FF0000';
    if (aqi <= 300) return '#8F3F97';
    return '#7E0023';
  };

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x.value}px`,
        top: `${y.value}px`,
        transform: `scale(${scale.value})`,
        backgroundColor: color.value,
        width: '160px',
        height: '160px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui',
      }}
    >
      <div className="text-sm mb-2 text-white">Air Quality Index</div>
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center flex-col mb-2"
        style={{ backgroundColor: getAqiColor(aqi) }}
      >
        <div className="text-2xl font-bold text-black">{aqi}</div>
        <div className="text-xs text-black">{getAqiStatus(aqi)}</div>
      </div>
      <div className="text-xs text-white opacity-80">
        Updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

// Weather Widget
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'windy';

export interface WeatherProps extends BaseWidgetProps {
  temperature: number;
  condition: WeatherCondition;
}

export const WeatherWidget: React.FC<WeatherProps> = ({ x, y, scale, color, temperature, condition }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x.value}px`,
        top: `${y.value}px`,
        transform: `scale(${scale.value})`,
        backgroundColor: color.value,
        width: '160px',
        height: '160px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui',
        color: 'white',
      }}
    >
      <div className="text-sm mb-2">Current Weather</div>
      <div className="text-4xl font-bold my-4">{temperature}°C</div>
      <div className="text-sm capitalize">{condition}</div>
    </div>
  );
};

// Clock Widget
export interface ClockProps extends BaseWidgetProps {
  format: '12h' | '24h';
}

export const ClockWidget: React.FC<ClockProps> = ({ x, y, scale, color, format }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    if (format === '12h') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x.value}px`,
        top: `${y.value}px`,
        transform: `scale(${scale.value})`,
        backgroundColor: color.value,
        width: '160px',
        height: '160px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui',
        color: 'white',
      }}
    >
      <div className="text-sm mb-2">Current Time</div>
      <div className="text-3xl font-bold my-2">{formatTime(time)}</div>
      <div className="text-sm">
        {time.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        })}
      </div>
    </div>
  );
};