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

// Noise Widget
export interface NoiseProps extends BaseWidgetProps {
  decibels: number;
}

export const NoiseWidget: React.FC<NoiseProps> = ({ x, y, scale, color, decibels }) => {
  const getNoiseLevel = (db: number) => {
    if (db <= 40) return 'Quiet';
    if (db <= 60) return 'Moderate';
    if (db <= 80) return 'Loud';
    if (db <= 100) return 'Very Loud';
    return 'Extreme';
  };

  const getNoiseLevelColor = (db: number) => {
    if (db <= 40) return '#00E400'; // Green
    if (db <= 60) return '#FFFF00'; // Yellow
    if (db <= 80) return '#FF7E00'; // Orange
    if (db <= 100) return '#FF0000'; // Red
    return '#7E0023'; // Dark Red
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
      <div className="text-sm mb-2 text-white">Noise Level</div>
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center flex-col mb-2"
        style={{ backgroundColor: getNoiseLevelColor(decibels) }}
      >
        <div className="text-2xl font-bold text-black">{decibels}</div>
        <div className="text-xs text-black">dB</div>
      </div>
      <div className="text-xs text-white opacity-80">{getNoiseLevel(decibels)}</div>
    </div>
  );
};

// Humidity Widget
export interface HumidityProps extends BaseWidgetProps {
  humidity: number;
}

export const HumidityWidget: React.FC<HumidityProps> = ({ x, y, scale, color, humidity }) => {
  const getHumidityStatus = (humid: number) => {
    if (humid <= 30) return 'Dry';
    if (humid <= 50) return 'Comfortable';
    if (humid <= 70) return 'Humid';
    return 'Very Humid';
  };

  const getHumidityColor = (humid: number) => {
    if (humid <= 30) return '#87CEEB'; // Light Blue (Dry)
    if (humid <= 50) return '#00FF00'; // Green (Comfortable)
    if (humid <= 70) return '#FFFF00'; // Yellow (Humid)
    return '#FF6347'; // Tomato Red (Very Humid)
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
      <div className="text-sm mb-2 text-white">Humidity</div>
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center flex-col mb-2"
        style={{ backgroundColor: getHumidityColor(humidity) }}
      >
        <div className="text-2xl font-bold text-black">{humidity}</div>
        <div className="text-xs text-black">%</div>
      </div>
      <div className="text-xs text-white opacity-80">{getHumidityStatus(humidity)}</div>
    </div>
  );
};

// Air Pressure Widget
export interface AirPressureProps extends BaseWidgetProps {
  pressure: number;
}

export const AirPressureWidget: React.FC<AirPressureProps> = ({ x, y, scale, color, pressure }) => {
  const getPressureStatus = (press: number) => {
    if (press < 1000) return 'Low';
    if (press <= 1013) return 'Normal';
    if (press <= 1022) return 'High';
    return 'Very High';
  };

  const getPressureColor = (press: number) => {
    if (press < 1000) return '#FF6347'; // Tomato Red (Low)
    if (press <= 1013) return '#00FF00'; // Green (Normal)
    if (press <= 1022) return '#FFFF00'; // Yellow (High)
    return '#8A2BE2'; // Blue Violet (Very High)
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
      <div className="text-sm mb-2 text-white">Air Pressure</div>
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center flex-col mb-2"
        style={{ backgroundColor: getPressureColor(pressure) }}
      >
        <div className="text-2xl font-bold text-black">{pressure}</div>
        <div className="text-xs text-black">hPa</div>
      </div>
      <div className="text-xs text-white opacity-80">{getPressureStatus(pressure)}</div>
    </div>
  );
};