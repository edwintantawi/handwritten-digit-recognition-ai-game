import { useEffect, RefObject, useState, PointerEvent } from 'react';
import { formatImageAlphaColor } from '../utils/imageFormater';

export interface IDrawHandler {
  handlePointerUp: () => void;
  handlePointerDown: (event: PointerEvent<HTMLCanvasElement>) => void;
  handlePointerMove: (event: PointerEvent<HTMLCanvasElement>) => void;
}

const useCanvas = (ref: RefObject<HTMLCanvasElement>) => {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [onPress, setOnPress] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;
    setCtx(ref.current.getContext('2d'));
  }, [ref]);

  useEffect(() => {
    if (!ctx) return;
    ctx.lineWidth = 30;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
  }, [ctx]);

  const clear = () => {
    ctx?.clearRect(0, 0, ref.current?.width ?? 0, ref.current?.height ?? 0);
  };

  const handlePointerUp = () => {
    setOnPress(false);
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    setOnPress(true);

    const { clientX, clientY } = event;

    ctx?.moveTo(clientX, clientY);
    ctx?.beginPath();
  };

  const getCanvasData = () => {
    return new Promise<number[]>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, 28, 28);
        const data = ctx?.getImageData(0, 0, 28, 28).data!;
        const result = formatImageAlphaColor(data);
        return resolve(result);
      };
      img.src = ref.current?.toDataURL('image/png') ?? '';
    });
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!onPress) return;

    const { pageX, pageY } = event;
    const posX = pageX - (ref.current?.offsetLeft ?? 0);
    const posY = pageY - (ref.current?.offsetTop ?? 0);

    ctx?.lineTo(posX, posY);
    ctx?.stroke();
  };

  const drawHandler: IDrawHandler = {
    handlePointerUp,
    handlePointerDown,
    handlePointerMove,
  };

  return { clear, getCanvasData, drawHandler };
};

export { useCanvas };
