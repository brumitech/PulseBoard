import React, { useEffect, useState } from 'react';

// Define the type for sensor data
interface SensorData {
  aqi: number;
  measurementType: string;
}

// Function to fetch current sensor data
export const fetchSensorData = async (): Promise<SensorData | null> => {
  const valueTypes = ['pm10', 'pm25', 'temperature', 'humidity', 'noise'];
  const username = 'brumtech';
  const password = 'brumibrumi123';
  const credentials = window.btoa(`${username}:${password}`);

  const headers = new Headers({
    Authorization: `Basic ${credentials}`,
  });

  try {
    console.log('Fetching data from API...');
    const response = await fetch('https://skopje.pulse.eco/rest/sensor/768284ed-72be-4c18-b764-1f9de38b365f', {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any[] = await response.json();

    console.log('API Response:', data); // Debug API response
    // const sensor = '768284ed-72be-4c18-b764-1f9de38b365f'
    
    const selectedData = data.find((sensor) =>
      valueTypes.includes(sensor.type.toLowerCase())
    );

    if (selectedData) {
      console.log('Selected Sensor Data:', selectedData); // Debug selected data
      return {
        aqi: selectedData.value,
        measurementType: selectedData.type,
      };  
    } else {
      console.warn('No matching sensor data found.');
    }
  } catch (error) {
    console.error('Failed to fetch sensors:', error);
  }

  return null;
};

// Main App Component
export function App(): JSX.Element {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchSensorData();
      setSensorData(data);
    };

    getData();

    const interval = setInterval(getData, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Current Sensor Data</h1>
      {sensorData ? (
        <div>
          <p>
            <strong>Measurement Type:</strong> {sensorData.measurementType}
          </p>
          <p>
            <strong>AQI:</strong> {sensorData.aqi}
          </p>
        </div>
      ) : (
        <p>Loading sensor data...</p>
      )}
    </div>
  );
}

export default App;
//{"sensorId":"768284ed-72be-4c18-b764-1f9de38b365f","position":"42.00749898337447,21.366037371793425","comments":"Gjorce Petrov (SP Planet) round about, towards Gjorce Petrov","type":"3","description":"SP Planet","status":"ACTIVE"},