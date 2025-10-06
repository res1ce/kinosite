'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AccessibilityContextType {
  isAccessibilityMode: boolean;
  toggleAccessibilityMode: () => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get accessibility mode from localStorage
    const savedMode = localStorage.getItem('accessibilityMode') === 'true';
    setIsAccessibilityMode(savedMode);
    
    if (savedMode) {
      document.documentElement.classList.add('accessibility-mode');
      console.log('✅ Accessibility mode enabled from localStorage');
    }
  }, []);

  const toggleAccessibilityMode = () => {
    const newMode = !isAccessibilityMode;
    setIsAccessibilityMode(newMode);
    localStorage.setItem('accessibilityMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('accessibility-mode');
    } else {
      document.documentElement.classList.remove('accessibility-mode');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <AccessibilityContext.Provider value={{ isAccessibilityMode, toggleAccessibilityMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

