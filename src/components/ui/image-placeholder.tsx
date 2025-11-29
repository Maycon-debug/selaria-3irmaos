"use client";

import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  className?: string;
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function ImagePlaceholder({
  className = "",
  text = "Imagem não disponível",
  size = "md",
}: ImagePlaceholderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-500",
        className
      )}
    >
      <ImageIcon className={cn(sizeClasses[size], "mb-2 opacity-50")} />
      <span className="text-xs opacity-75 text-center px-2">{text}</span>
    </div>
  );
}

