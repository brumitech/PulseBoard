import { IAnimatable, Animation, Prop, BaseWidgetProps } from '@pulseboard/shared';
import { useEffect, useRef, useState } from 'react';

// Widget component
const Widget: React.FC<BaseWidgetProps & { aqi: number, measurementType: string }> = ({ x, y, scale, color, aqi, measurementType }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x.value}px`,
        top: `${y.value}px`,
        transform: `scale(${scale.value})`,
        backgroundColor: color.value,
        width: '80px',
        height: '80px',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
      }}
    >
      <div>
        <strong>{aqi}</strong>
      </div>
      <div>N/A</div>
    </div>
  );
};

// Animatable definition
const widgetAnimatable: IAnimatable<BaseWidgetProps, { aqi: number }> = {
  id: 'widget-1',
  component: Widget,
  // componentProps: { aqi: 0 },
  componentProps: { 
    aqi: 0, 
    measurementType: 'PM10' // or 'PM2.5', 'Temperature'
  },
  start: 1000,
  duration: 2000,
  keyframes: [
    {
      timestamp: 0,
      props: {
        x: 0,
        y: 0,
        scale: 1,
        color: 'rgb(255,0,0)'
      },
    },
    {
      timestamp: 1500,
      props: {
        x: 100,
        y: 100,
        scale: 2,
        color: 'rgb(0,255,0)'
      },
    },
    {
      timestamp: 3000,
      props: {
        x: 200,
        y: 200,
        scale: 0.2,
        color: 'rgb(0,0,255)'
      },
    },
  ],
  props: {
    x: Prop.number(0, 'X', 'pos'),
    y: Prop.number(0, 'Y', 'pos'),
    scale: Prop.number(1, 'Scale'),
    color: Prop.color('rgb(255,0,0)', 'Background Color')
  },

  // once: (animatable) => {
  //   const fetchData = async () => {
  //     const username = 'brumtech';
  //     const password = 'brumibrumi123';
  //     const credentials = window.btoa(`${username}:${password}`);

  //     const headers = new Headers({
  //       Authorization: `Basic ${credentials}`,
  //     });

  //     try {
  //       const response = await fetch('https://skopje.pulse.eco/rest/sensor', {
  //         method: 'GET',
  //         headers,
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       console.log('Sensors fetched:', data);
  //       // modify aqi here
  //       animatable.componentProps.aqi = data[0].type;
  //     } catch (error) {
  //       console.error('Failed to fetch sensors:', error);
  //     }
  //   };

  once: (animatable) => {
    const fetchData = async () => {
      const valueTypes = ['pm10', 'pm25', 'temperature', 'humidity', 'noise']; // Supported measurement types
  
      try {
        // Fetch current data for all sensors
        const response = await fetch('https://skopje.pulse.eco/rest/current', {
          method: 'GET',
          headers: new Headers({
            Authorization: `Basic ${window.btoa('brumtech:brumibrumi123')}`,
          }),
        });
  
        const data = await response.json();
        
        // Find the first sensor with the desired measurement type
        const selectedData = data.find(
          sensor => valueTypes.includes(sensor.type.toLowerCase())
        );
  
        if (selectedData) {
          animatable.componentProps.aqi = selectedData.value;
          animatable.componentProps.measurementType = selectedData.type;
        }
      } catch (error) {
        console.error('Failed to fetch sensors:', error);
      }
    };
  
    fetchData(); 
    const intervalId = setInterval(fetchData, 15 * 60 * 1000);
  },

    console.log('once');

    fetchData(); // Immediate fetch on start
    const intervalId = setInterval(fetchData, 15 * 60 * 1000); // Fetch every 15 minutes
  },

  onStart: (animatable, t) => {
    console.log(`Animation started for ${animatable.id} at ${t}ms`);
  },

  onUpdate: (animatable, t) => {
  },

  onEnd: (animatable, t) => {
    console.log(`Animation ended for ${animatable.id} at ${t}ms`);
  },
};

export const CurrentDataWidget: React.FC = () => {
  const animationRef = useRef<Animation | null>(null);
  const animatablesRef = useRef<IAnimatable<BaseWidgetProps, { aqi: number }>[]>([widgetAnimatable]);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    animationRef.current = new Animation('example', 3000, animatablesRef.current);

    const originalSetT = animationRef.current.setT.bind(animationRef.current);
    animationRef.current.setT = (t: number) => {
      originalSetT(t);
      forceUpdate((prev) => prev + 1);
    };

    animationRef.current.play();

    return () => {
      animationRef.current?.stop();
    };
  }, []);

  return (
    <div>
      {animatablesRef.current.map((animatable) => {
        const Component = animatable.component;
        const t = animationRef.current?.getT() || 0;
        const isVisible = t >= animatable.start && t <= animatable.start + animatable.duration;

        // Convert props object for component props
        const animProps = animatable.props;
        const compProps = animatable.componentProps;

        const finalProps = {...animProps, ...compProps}

        return (
          <div
            key={animatable.id}
            style={{
              visibility: isVisible ? 'visible' : 'hidden',
              position: 'absolute',
            }}
          >
            <Component {...finalProps} />
          </div>
        );
      })}
    </div>
  );
};

export { CurrentDataWidget as CurrentData } from './CurrentDataWidget';