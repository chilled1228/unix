"use client";

import { useState, useEffect } from 'react';
import { HelpCircle, Keyboard, X, Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-brand-secondary-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-brand-secondary-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`}
          />
        </div>
      )}
    </div>
  );
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', description: 'Focus input field' },
    { key: 'c', description: 'Copy ISO 8601 format' },
    { key: 'u', description: 'Toggle UTC/local view' },
    { key: 't', description: 'Open timezone selection' },
    { key: 'h', description: 'Toggle history panel' },
    { key: '?', description: 'Show keyboard shortcuts' },
    { key: 'Escape', description: 'Close modals' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-brand-secondary-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-brand-secondary-200 dark:border-brand-secondary-700">
          <h2 className="text-lg font-semibold text-brand-secondary-900 dark:text-brand-secondary-100 flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-brand-secondary-400 hover:text-brand-secondary-600 dark:hover:text-brand-secondary-300"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between">
                <span className="text-brand-secondary-700 dark:text-brand-secondary-300">
                  {shortcut.description}
                </span>
                <kbd className="px-2 py-1 text-xs font-mono bg-brand-secondary-100 dark:bg-brand-secondary-700 text-brand-secondary-900 dark:text-brand-secondary-100 rounded border border-brand-secondary-300 dark:border-brand-secondary-600">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HelpButton() {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <>
      <Tooltip content="Show keyboard shortcuts">
        <button
          onClick={() => setShowShortcuts(true)}
          className="p-2 text-brand-secondary-400 hover:text-brand-secondary-600 dark:hover:text-brand-secondary-300 transition-colors"
          aria-label="Show keyboard shortcuts"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </Tooltip>
      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </>
  );
}

export function PrivacyNote() {
  return (
    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
      <div className="text-blue-800 dark:text-blue-200">
        <strong>Privacy:</strong> All conversions happen locally in your browser. 
        No data is sent to our servers or stored remotely.
      </div>
    </div>
  );
}

export function EmptyStateGuidance() {
  const sampleTimestamps = [
    { value: '1640995200', description: 'New Year 2022' },
    { value: '1577836800', description: 'New Year 2020' },
    { value: '0', description: 'Unix Epoch (1970)' },
  ];

  return (
    <div className="text-center py-8 text-brand-secondary-500">
      <div className="mb-4">
        <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium mb-2">Enter a Unix timestamp to get started</p>
        <p className="text-sm">Try one of these examples:</p>
      </div>
      <div className="space-y-2">
        {sampleTimestamps.map((sample) => (
          <button
            key={sample.value}
            onClick={() => {
              // This would be passed as a prop in real implementation
              console.log('Set timestamp:', sample.value);
            }}
            className="block w-full p-3 bg-brand-secondary-50 dark:bg-brand-secondary-800 hover:bg-brand-secondary-100 dark:hover:bg-brand-secondary-700 rounded-lg border border-brand-secondary-200 dark:border-brand-secondary-700 transition-colors"
          >
            <div className="font-mono text-brand-primary-600 dark:text-brand-primary-400">
              {sample.value}
            </div>
            <div className="text-xs text-brand-secondary-500 dark:text-brand-secondary-400">
              {sample.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Global keyboard shortcuts handler
export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();
      if (handlers[key]) {
        e.preventDefault();
        handlers[key]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
