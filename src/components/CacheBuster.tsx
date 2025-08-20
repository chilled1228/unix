"use client";

import { useEffect } from 'react';

export function CacheBuster() {
  useEffect(() => {
    // Force cache refresh on component mount
    const timestamp = Date.now();
    
    // Add timestamp to CSS files to force reload
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link) => {
      const href = (link as HTMLLinkElement).href;
      if (href && !href.includes('?v=')) {
        (link as HTMLLinkElement).href = `${href}?v=${timestamp}`;
      }
    });

    // Clear service worker cache if it exists
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update();
        });
      });
    }

    // Clear browser cache programmatically
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  }, []);

  return null;
}

// Utility function to clear cache manually
export const clearBrowserCache = () => {
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Force reload without cache
  window.location.reload();
};

// Component to show cache clear button in development
export function CacheClearButton() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button
      onClick={clearBrowserCache}
      className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors z-50"
      title="Clear browser cache and reload"
    >
      Clear Cache
    </button>
  );
}
