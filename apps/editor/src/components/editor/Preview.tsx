import { useAnimationContext, useScreenContext, Transformable } from "@pulseboard/common";

const Preview = () => {
  const { animatables, selectedAnimatable, selectAnimatable } = useAnimationContext();
  const screen = useScreenContext();

  const convertToVirtualCoords = (clientX: number, clientY: number) => {
    const container = document.querySelector('.preview-container');
    if (!container) return { x: 0, y: 0 };

    const rect = container.getBoundingClientRect();
    const canvasLeft = rect.left + (rect.width - screen.containerWidth) / 2;
    const canvasTop = rect.top + (rect.height - screen.containerHeight) / 2;

    const virtualX = (clientX - canvasLeft) / screen.scale;
    const virtualY = (clientY - canvasTop) / screen.scale;

    return { x: virtualX, y: virtualY };
  };

  return (
    <div className="absolute inset-0">
      <div
        className="absolute bg-black"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${screen.containerWidth}px`,
          height: `${screen.containerHeight}px`,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {animatables.map((animatable) => (
          <Transformable
            key={animatable.id}
            animatable={animatable}
            selected={animatable.id === selectedAnimatable?.id}
            onSelect={() => selectAnimatable(animatable)}
            convertToVirtualCoords={convertToVirtualCoords}
          />
        ))}
      </div>
    </div>
  );
};

export default Preview;