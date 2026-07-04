'use client';

import { FieldTooltip } from '@/components/admin/FieldTooltip';

interface FieldLabelProps {
  tooltip: string;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  inline?: boolean;
}

export function FieldLabel({
  tooltip,
  children,
  htmlFor,
  className = '',
  inline = false,
}: FieldLabelProps) {
  const baseClass = inline
    ? 'inline-flex items-center'
    : 'mb-1 flex items-center text-sm font-medium';

  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={`${baseClass} ${className}`.trim()}>
        {children}
        <FieldTooltip content={tooltip} />
      </label>
    );
  }

  return (
    <span className={`${baseClass} ${className}`.trim()}>
      {children}
      <FieldTooltip content={tooltip} />
    </span>
  );
}
