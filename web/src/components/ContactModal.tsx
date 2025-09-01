"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Phone, Mail, Check } from "lucide-react";

export default function ContactModal({
  phone,
  email,
  variant = "header", // "header" | "cta"
}: {
  phone: string;
  email: string;
  variant?: "header" | "cta";
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

  const buttonClass =
    variant === "header"
      ? "px-5 py-2 rounded-lg bg-gradient-to-r from-[#6E0A6B] to-purple-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all hover:cursor-pointer"
      : "px-10 py-5 rounded-xl bg-white text-[#6E0A6B] font-semibold shadow-xl hover:scale-105 transition-transform text-lg hover:cursor-pointer";

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* фон */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* окно */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#111] rounded-2xl shadow-2xl p-8 animate-fadeUp">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#6E0A6B]">
          Контакты
        </h2>

        <div className="grid gap-6 text-center">
          <button
            onClick={() => copyToClipboard(phone, 'phone')}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#6E0A6B] to-purple-600 text-white font-medium shadow-md hover:scale-105 transition-transform cursor-pointer"
          >
            {copiedPhone ? <Check size={20} /> : <Phone size={20} />}
            {copiedPhone ? "Скопировано!" : phone}
          </button>

          <button
            onClick={() => copyToClipboard(email, 'email')}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-[#6E0A6B] text-[#6E0A6B] font-medium hover:bg-[#6E0A6B] hover:text-white transition cursor-pointer"
          >
            {copiedEmail ? <Check size={20} /> : <Mail size={20} />}
            {copiedEmail ? "Скопировано!" : email}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className={buttonClass}>
        Связаться с нами
      </button>
      {mounted && open && createPortal(modal, document.body)}
    </>
  );
}