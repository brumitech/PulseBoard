import React, { useEffect, useState } from 'react';

// Interface for Average Data
export interface AverageDataProps extends BaseWidgetProps {
  averageType: 'day' | 'week' | 'month';
  valueType: 'pm10' | 'pm25' | 'temperature' | 'humidity';
  sensorId?: string;
}

// Function to fetch average data
export const fetchAverageData = async (
  averageType: 'day' | 'week' | 'month',
  valueType: string,
  sensorId: string = '-1', // Default to city-wide average
  fromDate?: Date,
  toDate?: Date
): Promise<{ average: number, count: number } | null> => {
  // If no dates provided, use current date range
  // const now = toDate || new Date();
  const now = new Date('2024-11-01T00:00:00')
  // const from = fromDate || new Date(now.getTime() - getTimePeriod(averageType));
  const from = new Date('2024-10-01T00:00:00')

  const formatDate = (date: Date) => {
    return date.toISOString().replace('Z', '%2b01:00');
  };

  try {
    const username = 'brumtech';
    const password = 'brumibrumi123';
    const response = await fetch(
      `https://skopje.pulse.eco/rest/avgData/${averageType}?sensorId=${sensorId}&type=${valueType}&from=${formatDate(from)}&to=${formatDate(now)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${window.btoa(`${username}:${password}`)}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any[] = await response.json();

    if (data.length === 0) return null;

    // Calculate average
    const totalValue = data.reduce((sum, item) => sum + parseFloat(item.value), 0);
    const average = totalValue / data.length;

    return {
      average: Number(average.toFixed(2)),
      count: data.length
    };

  } catch (error) {
    console.error('Failed to fetch average data:', error);
    return null;
  }
};

// Utility function to get time period in milliseconds
const getTimePeriod = (averageType: 'day' | 'week' | 'month'): number => {
  switch (averageType) {
    case 'day': return 24 * 60 * 60 * 1000; // 1 day
    case 'week': return 7 * 24 * 60 * 60 * 1000; // 1 week
    case 'month': return 30 * 24 * 60 * 60 * 1000; // Approximate 1 month
  }
};

// Average Data Widget
export const AverageDataWidget: React.FC<AverageDataProps> = ({ 
  x, y, scale, color, 
  averageType = 'month', 
  valueType = 'pm10',
  sensorId = '-1' 
}) => {
  const [averageData, setAverageData] = useState<{ average: number, count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAverageData(averageType, valueType, sensorId);
        if (data) {
          setAverageData(data);
          setError(null);
        } else {
          setError('No average data available');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60 * 60 * 1000); // Refresh hourly
    return () => clearInterval(interval);
  }, [averageType, valueType, sensorId]);

  const getValueColor = (value: number) => {
    switch (valueType) {
      case 'pm10':
      case 'pm25':
        // AQI-like color scale for particulate matter
        if (value <= 50) return '#00E400';
        if (value <= 100) return '#FFFF00';
        if (value <= 150) return '#FF7E00';
        if (value <= 200) return '#FF0000';
        return '#8F3F97';
      case 'temperature':
        // Temperature color scale
        if (value < 0) return '#87CEEB';
        if (value < 10) return '#4169E1';
        if (value < 20) return '#00FF00';
        if (value < 30) return '#FFD700';
        return '#FF4500';
      case 'humidity':
        // Humidity color scale
        if (value <= 30) return '#87CEEB';
        if (value <= 50) return '#00FF00';
        if (value <= 70) return '#FFFF00';
        return '#FF6347';
      default:
        return '#333';
    }
  };

  const getValueUnit = () => {
    switch (valueType) {
      case 'pm10':
      case 'pm25':
        return 'µg/m³';
      case 'temperature':
        return '°C';
      case 'humidity':
        return '%';
      default:
        return '';
    }
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
      <div className="text-sm mb-2 text-white">
        {averageType.charAt(0).toUpperCase() + averageType.slice(1)} Avg {valueType.toUpperCase()}
      </div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : averageData ? (
        <>
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center flex-col mb-2"
            style={{ backgroundColor: getValueColor(averageData.average) }}
          >
            <div className="text-2xl font-bold text-black">{averageData.average}</div>
            <div className="text-xs text-black">{getValueUnit()}</div>
          </div>
          <div className="text-xs text-white opacity-80">
            Samples: {averageData.count}
          </div>
        </>
      ) : (
        <div className="text-white">Loading...</div>
      )}
    </div>
  );
};

// Example usage in App component
export const ADW: React.FC = () => {
  return (
    <div>
      <AverageDataWidget 
        x={{ value: 100 }}
        y={{ value: 100 }}
        scale={{ value: 1 }}
        color={{ value: '#333' }}
        averageType="month"
        valueType="pm10"
      />
    </div>
  );
};