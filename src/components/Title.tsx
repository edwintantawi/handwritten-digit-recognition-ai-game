import { FC } from 'react';

interface ITitle {
  quest: number[];
  restQuestsLength: number;
  totalQuest: number;
  scores: number;
}

const Title: FC<ITitle> = ({ quest, restQuestsLength, totalQuest, scores }) => {
  return (
    <header className="flex flex-col sm:flex-row gap-4 items-center justify-between py-4">
      <h1 className="text-3xl font-bold">
        Penjumlahan: {quest[0]} + {quest[1]} = ?
      </h1>
      <div className="flex sm:flex-col gap-x-6">
        <p>
          Soal:{' '}
          <span className="font-bold">
            {restQuestsLength}/{totalQuest}
          </span>
        </p>
        <p>
          Nilai: <span className="font-bold">{scores}</span>
        </p>
      </div>
    </header>
  );
};

export { Title };
