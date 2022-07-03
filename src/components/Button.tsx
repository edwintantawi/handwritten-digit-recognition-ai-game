import { FC, ReactNode } from 'react';

type Variants = 'success' | 'error';

interface IButton {
  children: ReactNode;
  className?: string;
  variant: Variants;
  fullWidth?: boolean;
  onClick?: () => void;
}

const Button: FC<IButton> = ({
  children,
  className,
  variant,
  fullWidth = false,
  onClick,
}) => {
  let variantClassNames = [];
  const baseClassNames = [
    'px-6 py-3 text-white font-bold rounded-md text-xs md:text-base text-center',
  ];

  if (fullWidth) baseClassNames.push('w-full');
  if (variant === 'success') variantClassNames.push('bg-green-500 text-white');
  if (variant === 'error') variantClassNames.push('bg-red-500 text-white');

  const composedClassNames = `
    ${baseClassNames.join(' ')} 
    ${variantClassNames.join(' ')} 
    ${className}
  `;

  return (
    <button onClick={onClick} className={composedClassNames}>
      {children}
    </button>
  );
};

export { Button };
