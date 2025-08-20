"use client";

import { useEffect, useState } from 'react';

// Hook to detect mobile device
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

// Hook to detect touch device
export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouchDevice;
}

// Component to add mobile-specific meta tags and optimizations
export function MobileOptimizations() {
  useEffect(() => {
    // Prevent zoom on input focus for iOS
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      if (input instanceof HTMLElement) {
        input.style.fontSize = '16px';
      }
    });

    // Add mobile-specific viewport handling
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Improve touch scrolling on iOS
    (document.body.style as any).webkitOverflowScrolling = 'touch';

    // Add safe area insets for devices with notches
    document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
    document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
    document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
  }, []);

  return null;
}

// Mobile-friendly button component
interface MobileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function MobileButton({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button'
}: MobileButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-brand-primary-600 text-white hover:bg-brand-primary-700 focus:ring-brand-primary-500',
    secondary: 'bg-brand-secondary-600 text-white hover:bg-brand-secondary-700 focus:ring-brand-secondary-500',
    outline: 'border-2 border-brand-primary-600 text-brand-primary-600 hover:bg-brand-primary-50 focus:ring-brand-primary-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[48px]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// Mobile-friendly input component
interface MobileInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'tel';
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email';
}

export function MobileInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  disabled = false,
  autoComplete = 'off',
  inputMode
}: MobileInputProps) {
  const baseClasses = 'w-full px-4 py-3 border border-brand-secondary-300 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 transition-colors min-h-[44px] text-base';

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      inputMode={inputMode}
      className={`${baseClasses} ${className}`}
      style={{ fontSize: '16px' }} // Prevent zoom on iOS
    />
  );
}

// Mobile-friendly container with safe areas
interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  withSafeArea?: boolean;
}

export function MobileContainer({ children, className = '', withSafeArea = false }: MobileContainerProps) {
  const safeAreaClasses = withSafeArea 
    ? 'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]'
    : '';

  return (
    <div className={`${safeAreaClasses} ${className}`}>
      {children}
    </div>
  );
}
