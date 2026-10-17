"use client";

import React from "react";

interface FacelessCoderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function FacelessCoderLottie({
  className = "",
  size = "lg",
}: FacelessCoderProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-full max-w-[280px] sm:max-w-[340px] aspect-square",
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-card via-card to-accent/30 border border-border/80 shadow-xl flex items-center justify-center p-4 group select-none ${sizeClasses[size]} ${className}`}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial from-primary/15 via-transparent to-transparent opacity-70 pointer-events-none" />

      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="hoodieGrad" x1="60" y1="120" x2="260" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#18181b" />
            <stop offset="0.5" stopColor="#27272a" />
            <stop offset="1" stopColor="#09090b" />
          </linearGradient>

          <linearGradient id="faceVoid" x1="160" y1="130" x2="160" y2="230" gradientUnits="userSpaceOnUse">
            <stop stopColor="#09090b" />
            <stop offset="1" stopColor="#000000" />
          </linearGradient>

          <linearGradient id="neonCyan" x1="0" y1="0" x2="320" y2="320" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06b6d4" />
            <stop offset="0.5" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>

          <linearGradient id="neonEmerald" x1="80" y1="80" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Halo Ring with pulsing animation */}
        <circle
          cx="160"
          cy="160"
          r="142"
          stroke="url(#neonCyan)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          className="animate-[spin_40s_linear_infinite] opacity-60 origin-center"
        />
        <circle
          cx="160"
          cy="160"
          r="128"
          stroke="url(#neonEmerald)"
          strokeWidth="1"
          strokeDasharray="12 16"
          className="animate-[spin_25s_linear_infinite_reverse] opacity-40 origin-center"
        />

        {/* Top Terminal Header Bar */}
        <rect x="44" y="32" width="232" height="28" rx="8" fill="#18181b" stroke="#27272a" strokeWidth="1" />
        <circle cx="58" cy="46" r="3.5" fill="#ef4444" />
        <circle cx="70" cy="46" r="3.5" fill="#f59e0b" />
        <circle cx="82" cy="46" r="3.5" fill="#10b981" />
        <text
          x="100"
          y="49.5"
          fill="#a1a1aa"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="600"
          letterSpacing="0.05em"
        >
          luisthe.dev ~ terminal
        </text>

        {/* Binary / Hex Background Stream */}
        <g opacity="0.18" fill="currentColor" fontSize="7.5" fontFamily="monospace" className="text-primary">
          <text x="50" y="80">01001100 01110101 01101001 01110011</text>
          <text x="50" y="94">0x7F4B 0x89C1 GO_MICROSERVICES</text>
          <text x="50" y="108">REDIS::CIRCUIT_BREAKER::CLOSED</text>
          <text x="50" y="278">HIGH_AVAILABILITY 99.9% UPTIME</text>
          <text x="50" y="292">POSTGRESQL // NEON // EVENT_LOOP</text>
        </g>

        {/* Faceless Silhouette: Shoulders / Body */}
        <path
          d="M65 310 C65 240, 100 215, 125 205 L195 205 C220 215, 255 240, 255 310 Z"
          fill="url(#hoodieGrad)"
          stroke="#3f3f46"
          strokeWidth="1.5"
        />

        {/* Hoodie Outer Shape */}
        <path
          d="M96 170 C96 100, 125 76, 160 76 C195 76, 224 100, 224 170 C224 220, 204 246, 160 246 C116 246, 96 220, 96 170 Z"
          fill="url(#hoodieGrad)"
          stroke="#52525b"
          strokeWidth="2"
        />

        {/* Hoodie Inner Void (No Face) */}
        <path
          d="M116 168 C116 118, 134 98, 160 98 C186 98, 204 118, 204 168 C204 206, 188 226, 160 226 C132 226, 116 206, 116 168 Z"
          fill="url(#faceVoid)"
        />

        {/* Subtle Neon Visor / Cyber Scan Line inside Face Void */}
        <path
          d="M130 160 Q160 166 190 160"
          stroke="url(#neonCyan)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
          opacity="0.95"
        />

        {/* Glowing Cursor Symbol inside the Visor */}
        <rect
          x="156"
          y="157"
          width="8"
          height="5"
          rx="1"
          fill="#38bdf8"
          className="animate-pulse"
        />

        {/* Floating Architect Tech Badges */}
        <g filter="url(#softGlow)">
          {/* Golang / Backend Node */}
          <g transform="translate(36, 140)">
            <rect width="44" height="20" rx="6" fill="#18181b" stroke="#06b6d4" strokeWidth="1" />
            <text x="22" y="13.5" fill="#38bdf8" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              Go/PHP
            </text>
          </g>

          {/* Redis / Caching Node */}
          <g transform="translate(240, 140)">
            <rect width="44" height="20" rx="6" fill="#18181b" stroke="#ef4444" strokeWidth="1" />
            <text x="22" y="13.5" fill="#f87171" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              Redis
            </text>
          </g>

          {/* Microservices Node */}
          <g transform="translate(110, 260)">
            <rect width="100" height="22" rx="7" fill="#18181b" stroke="#10b981" strokeWidth="1" />
            <circle cx="122" cy="271" r="3" fill="#10b981" className="animate-ping" />
            <text x="162" y="274.5" fill="#34d399" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              Systems Architect
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
