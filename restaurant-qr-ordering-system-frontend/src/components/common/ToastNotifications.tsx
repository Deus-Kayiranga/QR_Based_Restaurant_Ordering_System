import React, { useState, useEffect, useCallback } from 'react';
import { X, Bell, ShoppingCart, CreditCard, AlertCircle, CheckCircle2, ChefHat } from 'lucide-react';
import { WS_UI_EVENT, type WsUiPayload } from '../../contexts/wsEvents';
import { cn } from '../../utils/classNames';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'alert' | 'success' | 'kitchen' | 'info';
  timestamp: Date;
}

const toastTypeConfig = {
  order: {
    icon: ShoppingCart,
    bg: 'bg-white',
    border: 'border-l-4 border-l-primary',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    badge: 'bg-primary/10 text-primary',
  },
  payment: {
    icon: CreditCard,
    bg: 'bg-white',
    border: 'border-l-4 border-l-success',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    badge: 'bg-success/10 text-success',
  },
  kitchen: {
    icon: ChefHat,
    bg: 'bg-white',
    border: 'border-l-4 border-l-warning',
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    badge: 'bg-warning/10 text-warning',
  },
  success: {
    icon: CheckCircle2,
    bg: 'bg-white',
    border: 'border-l-4 border-l-success',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    badge: 'bg-success/10 text-success',
  },
  alert: {
    icon: AlertCircle,
    bg: 'bg-white',
    border: 'border-l-4 border-l-danger',
    iconBg: 'bg-danger/10',
    iconColor: 'text-danger',
    badge: 'bg-danger/10 text-danger',
  },
  info: {
    icon: Bell,
    bg: 'bg-white',
    border: 'border-l-4 border-l-secondary',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    badge: 'bg-secondary/10 text-secondary',
  },
};

function guessType(payload: WsUiPayload): Toast['type'] {
  const topic = payload.topic?.toLowerCase() || '';
  const title = payload.title?.toLowerCase() || '';
  if (topic.includes('payment') || title.includes('payment')) return 'payment';
  if (topic.includes('kitchen') || title.includes('kitchen') || title.includes('food')) return 'kitchen';
  if (topic.includes('order') || title.includes('order')) return 'order';
  if (title.includes('success') || title.includes('ready')) return 'success';
  if (title.includes('alert') || title.includes('low') || title.includes('error')) return 'alert';
  return 'info';
}

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 350);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = toastTypeConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-2xl shadow-xl border border-border transition-all duration-350',
        config.bg,
        config.border,
        visible && !exiting
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-full'
      )}
      style={{ minWidth: '320px', maxWidth: '400px' }}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', config.iconBg)}>
        <Icon size={20} className={config.iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-textPrimary leading-tight">{toast.title}</p>
          <button
            onClick={() => { setExiting(true); setTimeout(() => onDismiss(toast.id), 350); }}
            className="p-1 rounded-lg hover:bg-bg transition-colors flex-shrink-0"
          >
            <X size={14} className="text-textSecondary" />
          </button>
        </div>
        <p className="text-xs text-textSecondary mt-0.5 leading-relaxed">{toast.message}</p>
        <p className="text-[10px] text-textSecondary/60 font-bold uppercase tracking-widest mt-2">
          {toast.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((payload: WsUiPayload) => {
    const newToast: Toast = {
      id: `${Date.now()}-${Math.random()}`,
      title: payload.title,
      message: payload.message,
      type: guessType(payload),
      timestamp: new Date(),
    };
    setToasts(prev => [newToast, ...prev].slice(0, 5)); // max 5 toasts
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<WsUiPayload>;
      addToast(customEvent.detail);
    };
    window.addEventListener(WS_UI_EVENT, handler);
    return () => window.removeEventListener(WS_UI_EVENT, handler);
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      style={{ zIndex: 9999 }}
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={dismissToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
