import type { ReactNode } from 'react';

interface PageSectionProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function PageSection({
  title,
  subtitle,
  children,
}: PageSectionProps) {
  return (
    <div className="px-20 pt-10 pb-12.5">
      <h3 className="text-[2.5rem] font-bold text-(--gray-800) mb-2">
        {title}
      </h3>
      {subtitle && (
        <p className="text-[1.25rem] text-(--gray-700) mb-10">{subtitle}</p>
      )}
      {children}
    </div>
  );
}
