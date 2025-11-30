"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppFloatingProps {
  phoneNumber?: string;
  message?: string;
}

export function WhatsAppFloating({ 
  phoneNumber = "5581999999999",
  message = "Olá! Gostaria de saber mais sobre seus produtos."
}: WhatsAppFloatingProps) {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popup */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 mb-4 w-72 sm:w-80 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden transform transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25D366] to-[#20BA5A] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">WhatsApp</h3>
                <p className="text-white/90 text-xs">Normalmente responde em minutos</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/30"
              aria-label="Fechar"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900">
            <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-4">
              Olá! 👋 Como posso ajudar você hoje?
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-[#25D366] to-[#20BA5A] hover:from-[#20BA5A] hover:to-[#1DA851] text-white text-center py-3 px-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
              onClick={() => setIsOpen(false)}
            >
              Iniciar conversa
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-2xl hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center group",
          isOpen && "rotate-90"
        )}
        aria-label="Abrir WhatsApp"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
        )}
        
        {/* Pulse animation */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse opacity-50" />
          </>
        )}
      </button>
    </div>
  );
}

