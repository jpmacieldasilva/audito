"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ 
  children, 
  className,
  hover = true 
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl shadow-2xl",
        hover && "hover:bg-white/10 hover:shadow-3xl transition-all duration-300",
        className
      )}
      whileHover={hover ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
