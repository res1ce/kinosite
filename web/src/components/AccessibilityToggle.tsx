'use client';

import { Eye } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { AccessibilityContext } from "./AccessibilityProvider";

interface AccessibilityToggleProps {
  variant?: 'desktop' | 'mobile' | 'hero';
  showLabel?: boolean;
}

export default function AccessibilityToggle({ variant = 'desktop', showLabel = false }: AccessibilityToggleProps) {
  const context = useContext(AccessibilityContext);
  const [localMode, setLocalMode] = useState(false);
  
  // Initialize local mode if context is not available
  useEffect(() => {
    if (!context) {
      const savedMode = localStorage.getItem('accessibilityMode') === 'true';
      setLocalMode(savedMode);
      
      if (savedMode) {
        document.documentElement.classList.add('accessibility-mode');
      }
    }
  }, [context]);
  
  const isAccessibilityMode = context?.isAccessibilityMode || localMode;
  const toggleAccessibilityMode = context?.toggleAccessibilityMode || (() => {
    const newMode = !localMode;
    setLocalMode(newMode);
    localStorage.setItem('accessibilityMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('accessibility-mode');
    } else {
      document.documentElement.classList.remove('accessibility-mode');
    }
  });

  const baseClasses = "transition-all duration-300";
  
  const variantClasses = {
    desktop: "p-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:bg-blue-500/20 group",
    mobile: "p-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:bg-blue-500/20",
    hero: "w-full px-6 py-3 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/20 dark:hover:bg-white/10 group"
  };

  const iconClasses = {
    desktop: "text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300",
    mobile: "text-blue-600 dark:text-blue-400",
    hero: "text-white/90 group-hover:scale-110 transition-transform duration-300"
  };

  const labelClasses = {
    desktop: "text-gray-700 dark:text-gray-200",
    mobile: "text-gray-700 dark:text-gray-200",
    hero: "text-white font-medium"
  };

  const iconSize = variant === 'hero' ? 24 : 20;

  return (
    <button
      onClick={toggleAccessibilityMode}
      className={`${baseClasses} ${variantClasses[variant]} hover:scale-105 transition-all duration-300 shimmer-effect hover-glow`}
      aria-label="Версия для слабовидящих"
      title="Версия для слабовидящих"
    >
      <div className="flex items-center justify-center gap-2">
        <Eye 
          size={iconSize} 
          className={iconClasses[variant]}
          strokeWidth={isAccessibilityMode ? 2.5 : 2}
        />
        {showLabel && (
          <span className={labelClasses[variant]}>
            Версия для слабовидящих
          </span>
        )}
      </div>
    </button>
  );
}

