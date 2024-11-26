import React, { useEffect, useState } from 'react';

// Define the type for sensor data
interface SensorData {
  aqi: number;
  measurementType: string;
  timestamp: string;
}

// Function to fetch current sensor data
export const fetchSensorData = async (): Promise<SensorData | null> => {
  const sensorId = '1004';
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const formatDate = (date: Date) => {
    return date.toISOString().replace('Z', '%2b01:00');
  };
  
  try {
    const username = 'brumtech';
    const password = 'brumibrumi123';
    const response = await fetch(
      `https://skopje.pulse.eco/rest/dataRaw?sensorId=${sensorId}&from=${formatDate(twentyFourHoursAgo)}&to=${formatDate(now)}`,
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
    
    const data: any[] = await response.json();
    
    // Sort and get the most recent entry
    const sortedData = data.sort((a, b) => new Date(b.stamp).getTime() - new Date(a.stamp).getTime());
    const latestEntry = sortedData[0];
    
    return latestEntry ? {
      sensorId: latestEntry.sensorId,
      aqi: parseFloat(latestEntry.value),
      measurementType: latestEntry.type,
      timestamp: latestEntry.stamp,
      position: latestEntry.position
    } : null;
    
  } catch (error) {
    console.error('Failed to fetch raw sensor data:', error);
    return null;
  }
};

// Main App Component
export const CurrentDataWidget: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchSensorData();
        if (data) {
          setSensorData(data);
          setError(null);
        } else {
          setError('No data could be retrieved');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    getData();
    const interval = setInterval(getData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Current Sensor Data</h1>
      {error ? (
        <p style={{color: 'red'}}>Error: {error}</p>
      ) : sensorData ? (
        <div>
          <p>
            <strong>Measurement Type:</strong> {sensorData.measurementType}
          </p>
          <p>
            <strong>Value:</strong> {sensorData.aqi}
          </p>
        </div>
      ) : (
        <p>Loading sensor data...</p>
      )}
    </div>
  );
};

export default CurrentDataWidget;