import React, { useState, useEffect } from 'react';

// Interface for sensor data
interface SensorData {
  sensorId: string;
  value: number;
  type: string;
  stamp: string;
}

// Interface for average data
interface AverageData {
  averageValue: number;
  count: number;
  measurementType: string;
  startDate: string;
  endDate: string;
}

// Function to fetch data for custom date range
export const fetchCustomRangeSensorData = async (
  fromDate: Date, 
  toDate: Date, 
  valueType: string = 'pm10'
): Promise<AverageData | null> => {
  const sensorId = '1004';

  const formatDate = (date: Date) => {
    return date.toISOString().replace('Z', '%2b01:00');
  };

  try {
    const username = 'brumtech';
    const password = 'brumibrumi123';
    
    const response = await fetch(
      `https://skopje.pulse.eco/rest/dataRaw?sensorId=${sensorId}&from=${formatDate(fromDate)}&to=${formatDate(toDate)}&type=${valueType}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SensorData[] = await response.json();

    if (data.length === 0) return null;

    // Calculate average
    const total = data.reduce((sum, item) => sum + parseFloat(item.value), 0);
    const averageValue = Number((total / data.length).toFixed(2));

    return {
      averageValue,
      count: data.length,
      measurementType: valueType,
      startDate: fromDate.toISOString(),
      endDate: toDate.toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch custom range sensor data:', error);
    return null;
  }
};

// FromTo Data Widget
export const FromToDataWidget: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>(() => {
    const defaultFrom = new Date();
    defaultFrom.setDate(defaultFrom.getDate() - 7); // Default to 7 days ago
    return defaultFrom.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [valueType, setValueType] = useState<string>('pm10');
  const [averageData, setAverageData] = useState<AverageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      
      // Ensure to date is after from date
      if (to <= from) {
        setError('End date must be after start date');
        setIsLoading(false);
        return;
      }

      const data = await fetchCustomRangeSensorData(from, to, valueType);
      
      if (data) {
        setAverageData(data);
        setError(null);
      } else {
        setError('No data available for selected range');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Color coding function for PM10 values
  const getValueColor = (value: number) => {
    if (value <= 50) return '#00E400'; // Good
    if (value <= 100) return '#FFFF00'; // Moderate
    if (value <= 150) return '#FF7E00'; // Unhealthy for Sensitive Groups
    if (value <= 200) return '#FF0000'; // Unhealthy
    return '#8F3F97'; // Very Unhealthy
  };

  // Measurement type options
  const measurementTypes = ['pm10', 'pm25', 'temperature', 'humidity'];

  return (
    <div style={{
      width: '300px',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#f0f0f0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2>Custom Range Sensor Data</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
        <div>
          <label>From Date: </label>
          <input 
            type="date" 
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        
        <div>
          <label>To Date: </label>
          <input 
            type="date" 
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        
        <div>
          <label>Measurement Type: </label>
          <select 
            value={valueType}
            onChange={(e) => setValueType(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
          >
            {measurementTypes.map(type => (
              <option key={type} value={type}>{type.toUpperCase()}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={handleFetchData}
          disabled={isLoading}
          style={{
            padding: '10px',
            backgroundColor: isLoading ? '#cccccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>

      {error && (
        <p style={{color: 'red', textAlign: 'center'}}>{error}</p>
      )}

      {averageData && (
        <div>
          <div 
            style={{
              backgroundColor: getValueColor(averageData.averageValue),
              borderRadius: '50%',
              width: '120px',
              height: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto',
              marginBottom: '10px'
            }}
          >
            <span style={{fontSize: '28px', fontWeight: 'bold'}}>
              {averageData.averageValue}
            </span>
            <span style={{fontSize: '14px'}}>
              {averageData.measurementType === 'pm10' || averageData.measurementType === 'pm25' 
                ? 'µg/m³' 
                : averageData.measurementType === 'temperature' 
                ? '°C' 
                : '%'}
            </span>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <p><strong>Measurement Type:</strong> {averageData.measurementType.toUpperCase()}</p>
            <p><strong>Samples:</strong> {averageData.count}</p>
            <p>
              <strong>Date Range:</strong> 
              {new Date(averageData.startDate).toLocaleDateString()} - 
              {new Date(averageData.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FromToDataWidget;