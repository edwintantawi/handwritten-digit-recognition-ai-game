import { FC } from 'react';

interface IWrongAlert {
  answer: number | string;
}

const Alert: FC<IWrongAlert> = ({ answer }) => {
  return (
    <div className="flex flex-col p-4 gap-4 border border-gray-300 bg-red-500 text-white rounded-lg text-xs md:text-base text-center">
      <p>
        Kamu menjawab <span className="font-bold">{answer}</span> namun itu
        salah, silahkan coba lagi
      </p>
    </div>
  );
};

export { Alert };
