import { BaseWidgetProps, IAnimatable, Animation, lerp } from '@pulseboard/shared'
import { useEffect, useRef, useState } from 'react';

const Widget: React.FC<BaseWidgetProps & { airQualityIndex?: number }> = ({ 
  x, 
  y, 
  scale, 
  colorR, 
  colorB, 
  colorG, 
  airQualityIndex 
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        transform: `scale(${scale})`,
        backgroundColor: `rgba(${colorR},${colorG},${colorB},1)`,
        width: "80px",
        height: "80px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "12px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <div>
        <strong>AQI</strong>
      </div>
      <div>{airQualityIndex ?? "N/A"}</div>
    </div>
  );
};

const widgetAnimatable: IAnimatable<BaseWidgetProps & { airQualityIndex?: number }> = {
  id: "widget-1",
  component: Widget,
  keyframes: [
    { timestamp: 0, props: { x: 0, y: 0, scale: 1, colorR: 255, colorB: 0, colorG: 0 } },
    { timestamp: 1000, props: { x: 100, y: 50, scale: 1.5, colorB: 255, colorR: 0, colorG: 0 } },
    { timestamp: 2000, props: { x: 200, y: 100, scale: 1, colorG: 255, colorB: 0, colorR: 0 } },
  ],
  props: {
    colorR: 0,
    colorG: 0,
    colorB: 0,
    scale: 1,
    x: 0,
    y: 0,
    airQualityIndex: undefined,
  },

  // Lifecycle handlers
  onStart: (animatable, generalTime) => {
    //console.log(`Animation started for ${animatable.id} at ${generalTime}ms`);
  },

  onUpdate: async (animatable, generalTime) => {
    // Fetch data every 15 seconds
    if (generalTime % 15000 === 0) {
      const username = "brumtech";
      const password = "brumibrumi123";
      const credentials = window.btoa(`${username}:${password}`); // Base64 encode the credentials
    
      const headers = new Headers({
        Authorization: `Basic ${credentials}`,
      });
    
      try {
        const response = await fetch("https://skopje.pulse.eco/rest/sensor", {
          method: "GET",
          headers: headers,
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log(data); // Array of sensors
        return data;
      } catch (error) {
        console.error("Failed to fetch sensors:", error);
      }    
    }
  },

  onEnd: (animatable, generalTime) => {
    //console.log(`Animation ended for ${animatable.id} at ${generalTime}ms`);
  },
};

export const App: React.FC = () => {
  const animationRef = useRef<Animation | null>(null);
  const animatablesRef = useRef<IAnimatable<any>[]>([widgetAnimatable]);
  const [, forceUpdate] = useState(0); // Dummy state to trigger updates

  useEffect(() => {
    // Initialize the animation
    animationRef.current = new Animation(
      "example",
      3000,
      animatablesRef.current,
      lerp
    );

    // Override the `setT` function in the Animation class
    const originalSetT = animationRef.current.setT.bind(animationRef.current);
    animationRef.current.setT = (t: number) => {
      originalSetT(t); // Perform the original logic
      forceUpdate((prev) => prev + 1); // Trigger a React re-render
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
        return <Component key={animatable.id} {...animatable.props} />;
      })}
    </div>
  );
};

export default App;