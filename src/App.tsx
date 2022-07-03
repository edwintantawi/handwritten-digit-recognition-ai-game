import { useRef, useState } from 'react';
import { questsOfSum } from './utils/quests';
import { Canvas } from './components/Canvas';
import { Title } from './components/Title';
import { Alert } from './components/Alert';
import { Button } from './components/Button';
import { useCanvas } from './hooks/useCanvas';
import { useTensorflowModel } from './hooks/useTensorflowModel';

const App = () => {
  const TOTAL_QUEST = 10;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { clear, getCanvasData, drawHandler } = useCanvas(canvasRef);
  const { predict } = useTensorflowModel('/models/model.json');

  const [result, setResult] = useState<number | undefined>(undefined);
  const [scores, setScores] = useState(0);
  const [quests, setQuests] = useState(questsOfSum(TOTAL_QUEST));
  const [isWrong, setIsWrong] = useState(false);

  const hasQuest = Boolean(quests.length);

  const handleReset = () => {
    clear();
    setResult(undefined);
    setIsWrong(false);
  };

  const handleAnswer = async () => {
    const imageData = await getCanvasData();
    const predicted = await predict(imageData);
    const questAnswer = quests[0][2];

    setResult(predicted);

    if (predicted !== questAnswer) return setIsWrong(true);

    setIsWrong(false);
    setQuests((prev) => prev.slice(1));
    setScores((prev) => prev + 1);
    handleReset();
  };

  const handleRetry = () => {
    setQuests(questsOfSum(TOTAL_QUEST));
  };

  return (
    <div className="h-screen overflow-hidden max-w-lg mx-auto px-4">
      {hasQuest && (
        <Title
          quest={quests[0]}
          restQuestsLength={TOTAL_QUEST - quests.length + 1}
          totalQuest={TOTAL_QUEST}
          scores={scores}
        />
      )}

      {isWrong && <Alert answer={result ?? '-'} />}

      <main className="flex justify-center mt-8 min-h-[300px]">
        <Canvas hidden={!hasQuest} ref={canvasRef} drawHandler={drawHandler} />

        {!hasQuest && <img src="/icons/trophy.svg" alt="" width={150} />}
      </main>
      {hasQuest && (
        <div className="flex mt-8 gap-4">
          <Button fullWidth variant="error" onClick={handleReset}>
            Bersihkan
          </Button>

          <Button fullWidth variant="success" onClick={handleAnswer}>
            Jawab
          </Button>
        </div>
      )}

      {!hasQuest && (
        <div className="flex flex-col p-6 gap-4 border border-gray-300 rounded-lg">
          <p className="text-xs md:text-base text-center">
            Selamat, kamu telah menyelesaikan{' '}
            <span className="font-bold">{TOTAL_QUEST}</span> soal
          </p>

          <Button fullWidth variant="success" onClick={handleRetry}>
            Mulai lagi
          </Button>
        </div>
      )}
    </div>
  );
};

export { App };
