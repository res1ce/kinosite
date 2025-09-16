"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Phone, Mail, Check, X } from "lucide-react";
import React from "react";

export default function ContactModal({
  phone,
  email,
  children,
}: {
  phone: string;
  email: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const copyToClipboard = async (text: string, type: 'phone' | 'email') => {
    try {
      await navigator.clipboard.writeText(text);
      
      if (type === 'phone') {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    } catch (err) {
      console.error('Не удалось скопировать: ', err);
    }
  };

  // Clone children and add onClick handler
  const triggerElement = typeof children === 'object' && children !== null && 'type' in children 
    ? React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
        onClick: () => setOpen(true)
      })
    : (
        <button onClick={() => setOpen(true)}>
          {children}
        </button>
      );

  const modal = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 animate-scaleIn border border-gray-200 dark:border-gray-700">
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Наши контакты
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Нажмите, чтобы скопировать
            </p>
          </div>

          {/* Contact buttons */}
          <div className="space-y-4">
            <button
              onClick={() => copyToClipboard(phone, 'phone')}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-6 h-6">
                {copiedPhone ? (
                  <Check size={20} className="animate-bounce" />
                ) : (
                  <Phone size={20} />
                )}
              </div>
              <span className="flex-1 text-left">
                {copiedPhone ? "Скопировано!" : phone}
              </span>
            </button>

            <button
              onClick={() => copyToClipboard(email, 'email')}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-6 h-6">
                {copiedEmail ? (
                  <Check size={20} className="animate-bounce" />
                ) : (
                  <Mail size={20} />
                )}
              </div>
              <span className="flex-1 text-left">
                {copiedEmail ? "Скопировано!" : email}
              </span>
            </button>
          </div>

          {/* Additional info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Работаем ежедневно с 9:00 до 18:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {triggerElement}
      {mounted && open && createPortal(modal, document.body)}
    </>
  );
}