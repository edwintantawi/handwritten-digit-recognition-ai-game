import { FC, Ref, CanvasHTMLAttributes, forwardRef } from 'react';
import { IDrawHandler } from '../hooks/useCanvas';

interface ICanvas extends CanvasHTMLAttributes<HTMLCanvasElement> {
  ref: Ref<HTMLCanvasElement>;
  hidden: boolean;
  drawHandler: IDrawHandler;
}

const Canvas: FC<ICanvas> = forwardRef(
  ({ hidden, drawHandler, ...props }, ref: Ref<HTMLCanvasElement>) => {
    return (
      <canvas
        {...props}
        ref={ref}
        width={300}
        height={300}
        className={`touch-none border border-gray-300 ${hidden && 'hidden'}`}
        onPointerDown={drawHandler.handlePointerDown}
        onPointerUp={drawHandler.handlePointerUp}
        onPointerMove={drawHandler.handlePointerMove}
      />
    );
  }
);

export { Canvas };
