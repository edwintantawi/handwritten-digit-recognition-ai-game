import { PointerEvent, useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Canvas } from './components/Canvas';
import { questsOfSum } from './utils/quests';
import { Title } from './components/Title';
import { WrongAlert } from './components/WrongAlert';

function App() {
  const TOTAL_QUEST = 10;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [onPress, setOnPress] = useState<boolean>(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [scores, setScores] = useState(0);
  const [quests, setQuests] = useState(questsOfSum(TOTAL_QUEST));
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() => {
    tf.loadLayersModel('/models/model.json')
      .then((model) => {
        setModel(model);
      })
      .catch((error) => console.error({ error }));
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    setCtx(canvasRef.current.getContext('2d'));
  }, [canvasRef]);

  useEffect(() => {
    console.log({ quests });
  }, [quests]);

  useEffect(() => {
    if (!ctx) return;
    ctx.lineWidth = 30;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
  }, [ctx]);

  const modelPredict = (input: number[]) => {
    const tensorImage = [tf.tensor(input).reshape([1, 28, 28, 1])];

    (model?.predict(tensorImage) as tf.Tensor).array().then((results: any) => {
      if (!results?.length) return;

      const scores = results[0] as number[];
      const predicted = scores.indexOf(Math.max(...scores));
      setResult(predicted);
      if (predicted === quests[0][2]) {
        setIsWrong(false);
        setQuests((prev) => prev.slice(1));
        setScores((prev) => prev + 1);
        handleClearCanvas();
      } else {
        setIsWrong(true);
      }
    });
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

  const handleClearCanvas = () => {
    ctx?.clearRect(
      0,
      0,
      canvasRef.current?.width ?? 0,
      canvasRef.current?.height ?? 0
    );

    setResult(null);
    setIsWrong(false);
  };

  const handleAnswer = () => {
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 28, 28);
      const data = ctx?.getImageData(0, 0, 28, 28).data ?? [];

      const input = [];

      const ALPHA_COLOR_INDEX = 3;
      for (var i = 0; i < data.length; i += 4) {
        input.push(data[i + ALPHA_COLOR_INDEX]);
      }

      modelPredict(input);
    };

    img.src = canvasRef.current?.toDataURL('image/png') ?? '';
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!onPress) return;

    const { pageX, pageY } = event;
    const posX = pageX - (canvasRef.current?.offsetLeft ?? 0);
    const posY = pageY - (canvasRef.current?.offsetTop ?? 0);

    ctx?.lineTo(posX, posY);
    ctx?.stroke();
  };

  const handleRetry = () => {
    setQuests(questsOfSum(TOTAL_QUEST));
  };

  return (
    <div className="h-screen overflow-hidden max-w-lg mx-auto px-4">
      {Boolean(quests.length) && (
        <Title
          quest={quests[0]}
          restQuestsLength={quests.length}
          totalQuest={TOTAL_QUEST}
          scores={scores}
        />
      )}

      {isWrong && <WrongAlert answer={result ?? 0} />}

      <main className="flex justify-center mt-8 min-h-[300px]">
        <Canvas
          hidden={!Boolean(quests.length)}
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />

        {!Boolean(quests.length) && (
          <img src="/icons/trophy.svg" alt="" width={150} />
        )}
      </main>
      {Boolean(quests.length) ? (
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={handleClearCanvas}
            className="flex-1 bg-red-500 px-6 py-3 text-white font-bold rounded-md text-xs md:text-base">
            Bersihkan
          </button>

          <button
            onClick={handleAnswer}
            className="flex-1 bg-green-500 px-6 py-3 text-white font-bold rounded-md text-xs md:text-base">
            Jawab
          </button>
        </div>
      ) : (
        <div className="flex flex-col p-6 gap-4 border border-gray-300 rounded-lg text-xs md:text-base text-center">
          <p>
            Selamat, kamu telah menyelesaikan{' '}
            <span className="font-bold">{TOTAL_QUEST}</span> soal
          </p>
          <button
            className="bg-green-500 text-white font-bold py-3 px-4 rounded-md"
            onClick={handleRetry}>
            Mulai lagi
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
