import { FC, Ref, CanvasHTMLAttributes, forwardRef } from 'react';

interface ICanvas extends CanvasHTMLAttributes<HTMLCanvasElement> {
  ref: Ref<HTMLCanvasElement>;
  hidden: boolean;
}

const Canvas: FC<ICanvas> = forwardRef((props, ref: Ref<HTMLCanvasElement>) => {
  return (
    <canvas
      {...props}
      ref={ref}
      width={300}
      height={300}
      className={`touch-none border border-gray-300 ${
        props.hidden && 'hidden'
      }`}
    />
  );
});

export { Canvas };
