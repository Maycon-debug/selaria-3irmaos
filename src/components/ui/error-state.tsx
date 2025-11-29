"use client";

import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

export function ErrorState({
  title = "Ops! Algo deu errado",
  message = "Não foi possível carregar os produtos no momento. Por favor, tente novamente mais tarde.",
  showRetry = false,
  onRetry,
  showHomeButton = false,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
        {title}
      </h3>
      
      <p className="text-neutral-600 dark:text-neutral-400 text-center max-w-md mb-6">
        {message}
      </p>
      
      <div className="flex gap-3">
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        )}
        
        {showHomeButton && (
          <Link href="/">
            <Button
              variant="outline"
              className="bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

