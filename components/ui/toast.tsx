"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

type ToastListener = (toast: ToastItem) => void;
const toastListeners = new Set<ToastListener>();

export const toast = {
  success: (message: string, title?: string, duration = 4000) => {
    dispatchToast({
      id: Math.random().toString(36).substring(2, 9),
      type: "success",
      title: title || "Success",
      message,
      duration,
    });
  },
  error: (message: string, title?: string, duration = 5000) => {
    dispatchToast({
      id: Math.random().toString(36).substring(2, 9),
      type: "error",
      title: title || "Error",
      message,
      duration,
    });
  },
  warning: (message: string, title?: string, duration = 4500) => {
    dispatchToast({
      id: Math.random().toString(36).substring(2, 9),
      type: "warning",
      title: title || "Notice",
      message,
      duration,
    });
  },
  info: (message: string, title?: string, duration = 4000) => {
    dispatchToast({
      id: Math.random().toString(36).substring(2, 9),
      type: "info",
      title: title || "Information",
      message,
      duration,
    });
  },
};

function dispatchToast(item: ToastItem) {
  toastListeners.forEach((listener) => listener(item));
}

interface ToastContextValue {
  toasts: ToastItem[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  dismiss: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((item: ToastItem) => {
    setToasts((prev) => [item, ...prev].slice(0, 5));
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    toastListeners.add(addToast);
    return () => {
      toastListeners.delete(addToast);
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </aside>
  );
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    if (!item.duration) return;
    const timer = setTimeout(() => {
      onDismiss(item.id);
    }, item.duration);
    return () => clearTimeout(timer);
  }, [item, onDismiss]);

  const config = {
    success: {
      border: "border-emerald-500/30 dark:border-emerald-500/20",
      bg: "bg-card/95 dark:bg-zinc-900/95",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: <CheckCircle2 className="w-4 h-4 shrink-0" />,
    },
    error: {
      border: "border-rose-500/30 dark:border-rose-500/20",
      bg: "bg-card/95 dark:bg-zinc-900/95",
      iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      icon: <AlertCircle className="w-4 h-4 shrink-0" />,
    },
    warning: {
      border: "border-amber-500/30 dark:border-amber-500/20",
      bg: "bg-card/95 dark:bg-zinc-900/95",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
    },
    info: {
      border: "border-blue-500/30 dark:border-blue-500/20",
      bg: "bg-card/95 dark:bg-zinc-900/95",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      icon: <Info className="w-4 h-4 shrink-0" />,
    },
  }[item.type];

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200",
        config.bg,
        config.border
      )}
    >
      <div
        className={cn(
          "p-2 rounded-xl border flex items-center justify-center shrink-0 mt-0.5",
          config.iconBg
        )}
      >
        {config.icon}
      </div>

      <div className="flex-1 min-w-0 pr-1">
        {item.title && (
          <h4 className="text-xs font-bold tracking-tight text-foreground">
            {item.title}
          </h4>
        )}
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 break-words">
          {item.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0 cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
