import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'sell' | 'logout' | 'buy';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  full?: boolean;
  selected?: boolean;
}

const base = 'rounded-xl';

const toggleSize = 'text-[1.25rem] h-[3.6875rem] font-bold';

const toggleUnselected =
  'bg-(--gray-white) ';

const toggleVariants = {
  buy: {
    selected:
      'bg-(--buy-primary) hover:bg-(--buy-primary-hover) text-white',
    unselected: 'text-(--buy-primary-text)',
  },
  sell: {
    selected:
      'bg-(--sell-primary) hover:bg-(--sell-primary-hover) text-white',
    unselected: 'text-(--sell-primary-text)',
  },
} as const;

export default function Button({
  variant = 'primary',
  full,
  selected = true,
  className,
  children,
  ...props
}: ButtonProps) {
  const getToggleStyle = (v: keyof typeof toggleVariants) =>
    clsx(
      selected ? toggleVariants[v].selected : toggleUnselected + ' ' + toggleVariants[v].unselected,
      toggleSize
    );

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-(--cta-primary) hover:bg-(--cta-primary-hover) text-white text-[1.375rem] h-[4.8125rem] font-bold',
    buy: getToggleStyle('buy'),
    sell: getToggleStyle('sell'),
    logout:
      'bg-(--blue-500) hover:bg-(--blue-500-hover) text-white text-[1.25rem] w-[5.875rem] h-[2.6875rem] font-semibold',
  };

  return (
    <button
      {...props}
      className={clsx(base, variantStyles[variant], full && 'w-full', className)}
    >
      {children}
    </button>
  );
}
