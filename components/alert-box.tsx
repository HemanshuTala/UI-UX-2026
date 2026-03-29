'use client';

import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface AlertBoxProps {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export function AlertBox({
  type,
  title,
  message,
  icon,
  actions,
}: AlertBoxProps) {
  const typeConfig = {
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: <AlertCircle className="h-5 w-5 text-red-400" />,
      titleColor: 'text-red-400',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
      titleColor: 'text-yellow-400',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: <Info className="h-5 w-5 text-blue-400" />,
      titleColor: 'text-blue-400',
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      titleColor: 'text-green-400',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`rounded-lg border ${config.bg} ${config.border} p-4`}
    >
      <div className="flex gap-3">
        {icon || config.icon}
        <div className="flex-1">
          <h4 className={`font-semibold ${config.titleColor}`}>{title}</h4>
          {message && (
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          )}
          {actions && <div className="mt-3">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
