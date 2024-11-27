import React, { useState, useEffect } from 'react';

// Interface for sensor data
interface SensorData {
  sensorId: string;
  value: number;
  type: string;
  stamp: string;
}

// Function to fetch data for custom date range with chunking
export const fetchCustomRangeSensorData = async (
  fromDate: Date, 
  toDate: Date, 
  valueType: string = 'pm10'
): Promise<SensorData[] | null> => {
  const sensorId = '1004';

  const formatDate = (date: Date) => {
    return date.toISOString().replace('Z', '%2b01:00');
  };

  // Function to chunk date range into weekly segments
  const getDateChunks = (start: Date, end: Date): { from: Date, to: Date }[] => {
    const chunks: { from: Date, to: Date }[] = [];
    let currentStart = new Date(start);

    while (currentStart < end) {
      const currentEnd = new Date(currentStart);
      currentEnd.setDate(currentStart.getDate() + 7);
      
      // Ensure we don't go beyond the original end date
      if (currentEnd > end) {
        currentEnd.setTime(end.getTime());
      }

      chunks.push({ from: new Date(currentStart), to: currentEnd });
      currentStart.setDate(currentStart.getDate() + 7);
    }

    return chunks;
  };

  try {
    const username = 'brumtech';
    const password = 'brumibrumi123';

    // Split the date range into weekly chunks
    const dateChunks = getDateChunks(fromDate, toDate);
    
    // Fetch data for each chunk
    const allMeasurements: SensorData[] = [];

    for (const chunk of dateChunks) {
      const response = await fetch(
        `https://skopje.pulse.eco/rest/dataRaw?sensorId=${sensorId}&from=${formatDate(chunk.from)}&to=${formatDate(chunk.to)}&type=${valueType}`,
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
      allMeasurements.push(...data);
    }

    if (allMeasurements.length === 0) return null;

    // Sort measurements by timestamp
    return allMeasurements.sort((a, b) => new Date(a.stamp).getTime() - new Date(b.stamp).getTime());
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
  const [measurements, setMeasurements] = useState<SensorData[] | null>(null);
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

      // Check date range limit
      const monthsDifference = (to.getFullYear() - from.getFullYear()) * 12 + 
                                (to.getMonth() - from.getMonth());
      
      if (Math.abs(monthsDifference) > 3) {
        setError('Please select a date range within 3 months');
        setIsLoading(false);
        return;
      }

      const data = await fetchCustomRangeSensorData(from, to, valueType);
      
      if (data) {
        setMeasurements(data);
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
      width: '400px',
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

      {measurements && (
        <div style={{ 
          maxHeight: '400px', 
          overflowY: 'auto', 
          border: '1px solid #ccc', 
          borderRadius: '8px',
          padding: '10px'
        }}>
          <h3>Measurements ({measurements.length} total)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#e0e0e0' }}>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Timestamp</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((measurement, index) => (
                <tr key={index} style={{ 
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                  color: getValueColor(parseFloat(measurement.value.toString()))
                }}>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    {new Date(measurement.stamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>
                    {measurement.value}
                    {valueType === 'pm10' || valueType === 'pm25' 
                      ? ' µg/m³' 
                      : valueType === 'temperature' 
                      ? ' °C' 
                      : ' %'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FromToDataWidget;