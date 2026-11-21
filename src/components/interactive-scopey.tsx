'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

interface InteractiveScopeyProps {
  isEmailFocused?: boolean;
  isPasswordFocused?: boolean;
  showPassword?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  isLoading?: boolean;
}

export default function InteractiveScopey({
  isEmailFocused = false,
  isPasswordFocused = false,
  showPassword = false,
  isSuccess = false,
  isError = false,
  isLoading = false,
}: InteractiveScopeyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ dx: 0, dy: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!isPasswordFocused) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 180);
      }
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, [isPasswordFocused]);

  // Window mouse move listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setMousePos({
        dx: e.clientX - centerX,
        dy: e.clientY - centerY,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setMousePos({
        dx: touch.clientX - centerX,
        dy: touch.clientY - centerY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Compute pupil displacement target
  let targetPupilX = 0;
  let targetPupilY = 0;
  let targetTiltX = 0;
  let targetTiltY = 0;

  if (isEmailFocused) {
    // Look down-right towards the email input field
    targetPupilX = 9;
    targetPupilY = 10;
    targetTiltX = -4;
    targetTiltY = 8;
  } else if (isPasswordFocused) {
    if (showPassword) {
      // Peeking look!
      targetPupilX = 7;
      targetPupilY = 4;
      targetTiltX = -2;
      targetTiltY = 6;
    } else {
      targetPupilX = 0;
      targetPupilY = 0;
      targetTiltX = -2;
      targetTiltY = 0;
    }
  } else {
    // Normal cursor tracking with clamped radius
    const dist = Math.hypot(mousePos.dx, mousePos.dy);
    const angle = Math.atan2(mousePos.dy, mousePos.dx);
    const maxOffset = 13;
    const offset = Math.min(dist * 0.04, maxOffset);
    targetPupilX = Math.cos(angle) * offset;
    targetPupilY = Math.sin(angle) * offset;

    // Subtle 3D perspective tilt
    targetTiltX = Math.max(-10, Math.min(10, -mousePos.dy * 0.02));
    targetTiltY = Math.max(-12, Math.min(12, mousePos.dx * 0.022));
  }

  // Smooth springs for buttery 60fps tracking
  const springConfig = { stiffness: 220, damping: 22 };
  const pupilX = useSpring(targetPupilX, springConfig);
  const pupilY = useSpring(targetPupilY, springConfig);
  const tiltX = useSpring(targetTiltX, springConfig);
  const tiltY = useSpring(targetTiltY, springConfig);

  useEffect(() => {
    pupilX.set(targetPupilX);
    pupilY.set(targetPupilY);
    tiltX.set(targetTiltX);
    tiltY.set(targetTiltY);
  }, [targetPupilX, targetPupilY, targetTiltX, targetTiltY, pupilX, pupilY, tiltX, tiltY]);

  // Hand positions logic
  const isHandsCovering = isPasswordFocused && !showPassword;
  const isPeeking = isPasswordFocused && showPassword;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto aspect-square flex items-center justify-center select-none"
      style={{ perspective: 800 }}
    >
      {/* Soft Hovering Shadow */}
      <motion.div
        animate={{
          scale: [1, 0.88, 1],
          opacity: [0.35, 0.22, 0.35],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-4 w-40 sm:w-48 h-6 bg-[#202820]/15 rounded-full blur-md"
      />

      {/* Main Mascot Body Container with 3D Tilt & Floating Bob */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
        }}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 260 260"
          className="w-full h-full overflow-visible drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ambient Body Shading */}
            <linearGradient id="bodyGrad" x1="60" y1="60" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F5F7F4" />
              <stop offset="100%" stopColor="#E4ECE2" />
            </linearGradient>

            {/* Glossy Visor Screen Gradient */}
            <linearGradient id="visorGrad" x1="130" y1="90" x2="130" y2="170" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1B241D" />
              <stop offset="100%" stopColor="#0E1410" />
            </linearGradient>

            {/* Leaf Gradient */}
            <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6BC955" />
              <stop offset="100%" stopColor="#348D32" />
            </linearGradient>

            {/* LED Glow Filter */}
            <filter id="ledGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Soft Ambient Shadow */}
            <radialGradient id="hologramPod" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#52B040" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#52B040" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* --- PROPULSION LEAF WINGS (SIDES) --- */}
          {/* Left Leaf Thruster */}
          <motion.g
            animate={{
              rotate: [-3, 3, -3],
              y: [-1, 2, -1],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '65px 145px' }}
          >
            {/* Left Wing Base Ring */}
            <ellipse cx="60" cy="145" rx="16" ry="11" fill="#E4ECE2" stroke="#CAD6C7" strokeWidth="2.5" />
            <ellipse cx="60" cy="145" rx="11" ry="7" fill="#348D32" />
            {/* Left Leaf Propeller */}
            <path
              d="M 58 145 C 30 135 15 155 35 165 C 55 170 65 152 58 145 Z"
              fill="url(#leafGrad)"
              stroke="#2A7328"
              strokeWidth="1.5"
            />
            {/* Leaf Vein */}
            <path d="M 52 148 Q 38 152 30 158" stroke="#8DEB78" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>

          {/* Right Leaf Thruster */}
          <motion.g
            animate={{
              rotate: [3, -3, 3],
              y: [2, -1, 2],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '195px 145px' }}
          >
            {/* Right Wing Base Ring */}
            <ellipse cx="200" cy="145" rx="16" ry="11" fill="#E4ECE2" stroke="#CAD6C7" strokeWidth="2.5" />
            <ellipse cx="200" cy="145" rx="11" ry="7" fill="#348D32" />
            {/* Right Leaf Propeller */}
            <path
              d="M 202 145 C 230 135 245 155 225 165 C 205 170 195 152 202 145 Z"
              fill="url(#leafGrad)"
              stroke="#2A7328"
              strokeWidth="1.5"
            />
            {/* Leaf Vein */}
            <path d="M 208 148 Q 222 152 230 158" stroke="#8DEB78" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>

          {/* --- SPHERICAL DRONE BODY --- */}
          {/* Main White Sphere Shell */}
          <circle
            cx="130"
            cy="135"
            r="72"
            fill="url(#bodyGrad)"
            stroke="#D6E0D4"
            strokeWidth="3.5"
          />

          {/* Subtle Panel Seam Lines for Tech/Robotic Look */}
          <path
            d="M 130 63 C 158 63 182 78 194 100"
            stroke="#C9D6C7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 66 120 C 63 130 63 140 66 150"
            stroke="#C9D6C7"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Side Botanical Emblems (Eco Drone Port) */}
          <circle cx="198" cy="130" r="14" fill="#348D32" />
          <circle cx="198" cy="130" r="11" fill="#FFFFFF" />
          {/* Tiny Embossed Leaf in Port */}
          <path
            d="M 198 123 C 193 126 193 134 198 137 C 203 134 203 126 198 123 Z"
            fill="#348D32"
          />

          {/* --- TOP SPROUT ANTENNA --- */}
          <motion.g
            animate={{
              rotate: [-4, 4, -4],
            }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '130px 65px' }}
          >
            {/* Sprout Stem */}
            <path
              d="M 130 65 Q 128 45 134 32"
              stroke="#348D32"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Left Sprout Leaf */}
            <path
              d="M 129 48 C 114 42 110 52 118 60 C 126 62 129 55 129 48 Z"
              fill="url(#leafGrad)"
              stroke="#2A7328"
              strokeWidth="1.5"
            />
            {/* Glowing Sensor Bulb Tip */}
            <motion.circle
              cx="135"
              cy="31"
              r="7"
              fill="#42D392"
              filter="url(#ledGlow)"
              animate={{
                scale: isLoading ? [1, 1.3, 1] : isSuccess ? [1, 1.4, 1] : [1, 1.15, 1],
                fill: isSuccess ? '#48E587' : isError ? '#F87171' : '#42D392',
              }}
              transition={{
                duration: isLoading ? 0.8 : 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.g>

          {/* --- HIGH-TECH GLOSSY VISOR --- */}
          {/* Visor Outer Mint Bezel */}
          <rect
            x="76"
            y="94"
            width="108"
            height="82"
            rx="41"
            fill="#348D32"
            stroke="#2A7328"
            strokeWidth="3"
          />
          {/* Inner Dark Visor Glass */}
          <rect
            x="80"
            y="98"
            width="100"
            height="74"
            rx="37"
            fill="url(#visorGrad)"
          />

          {/* Visor Specular Glass Reflection (Curved Arc Highlight) */}
          <path
            d="M 94 106 C 114 100 146 100 166 106 C 160 112 100 112 94 106 Z"
            fill="#FFFFFF"
            opacity="0.14"
          />

          {/* --- DIGITAL LED EYES & EXPRESSION --- */}
          <g filter="url(#ledGlow)">
            {/* Case A: Success Celebration Eyes (Curved Happy Arcs) */}
            {isSuccess ? (
              <>
                <path
                  d="M 100 138 Q 110 125 120 138"
                  stroke="#48E587"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 140 138 Q 150 125 160 138"
                  stroke="#48E587"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Big Happy Smile */}
                <path
                  d="M 122 147 Q 130 156 138 147"
                  stroke="#48E587"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : isError ? (
              /* Case B: Error / Confused Eyes */
              <>
                <line x1="102" y1="135" x2="118" y2="135" stroke="#F87171" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="142" y1="135" x2="158" y2="135" stroke="#F87171" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M 125 152 Q 130 146 135 152" stroke="#F87171" strokeWidth="3" strokeLinecap="round" fill="none" />
              </>
            ) : (
              /* Case C: Interactive Eyes with Dynamic Tracking */
              <>
                {/* Left Eye */}
                <motion.g
                  style={{
                    x: pupilX,
                    y: pupilY,
                  }}
                >
                  <motion.ellipse
                    cx="110"
                    cy="133"
                    rx={isBlinking ? 7 : 7.5}
                    ry={isBlinking ? 1 : 10.5}
                    fill="#3EE59A"
                    transition={{ duration: 0.1 }}
                  />
                  {/* Eye Sparkle / Pupil Light */}
                  {!isBlinking && (
                    <circle cx="112" cy="130" r="2.5" fill="#FFFFFF" />
                  )}
                </motion.g>

                {/* Right Eye */}
                <motion.g
                  style={{
                    x: pupilX,
                    y: pupilY,
                  }}
                >
                  <motion.ellipse
                    cx="150"
                    cy="133"
                    rx={isBlinking ? 7 : 7.5}
                    ry={isBlinking ? 1 : 10.5}
                    fill="#3EE59A"
                    transition={{ duration: 0.1 }}
                  />
                  {/* Eye Sparkle / Pupil Light */}
                  {!isBlinking && (
                    <circle cx="152" cy="130" r="2.5" fill="#FFFFFF" />
                  )}
                </motion.g>

                {/* Friendly Smile */}
                <motion.path
                  d="M 124 147 Q 130 153 136 147"
                  stroke="#3EE59A"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    x: pupilX,
                    y: pupilY,
                  }}
                />
              </>
            )}
          </g>

          {/* Loading Radar Scan Arc when authenticating */}
          {isLoading && (
            <motion.circle
              cx="130"
              cy="135"
              r="34"
              stroke="#48E587"
              strokeWidth="2.5"
              strokeDasharray="25 60"
              fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '130px 135px' }}
            />
          )}

          {/* --- ROBOTIC HANDS / PRIVACY GESTURE --- */}
          {/* Left Hand */}
          <motion.g
            animate={
              isHandsCovering || isPeeking
                ? {
                    // Both hands raised to cover visor
                    x: 35,
                    y: -36,
                    rotate: 22,
                  }
                : {
                    // Resting cute side pose
                    x: 0,
                    y: 0,
                    rotate: 0,
                  }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            style={{ transformOrigin: '75px 175px' }}
          >
            {/* White Arm Segment */}
            <path
              d="M 80 165 Q 70 178 78 188"
              stroke="#D6E0D4"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Hand Palm / Claws in Green */}
            <circle cx="78" cy="188" r="10" fill="#348D32" stroke="#2A7328" strokeWidth="2" />
            <circle cx="73" cy="184" r="3.5" fill="#52B040" />
            <circle cx="77" cy="180" r="3.5" fill="#52B040" />
            <circle cx="83" cy="183" r="3.5" fill="#52B040" />
          </motion.g>

          {/* Right Hand */}
          <motion.g
            animate={
              isHandsCovering
                ? {
                    // Full cover password
                    x: -35,
                    y: -36,
                    rotate: -22,
                  }
                : isPeeking
                ? {
                    // Peeking! Right hand slightly lowered so right eye peeks
                    x: -16,
                    y: -14,
                    rotate: -10,
                  }
                : {
                    // Resting pose / friendly wave
                    x: 0,
                    y: 0,
                    rotate: 0,
                  }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            style={{ transformOrigin: '185px 175px' }}
          >
            {/* White Arm Segment */}
            <path
              d="M 180 165 Q 190 178 182 188"
              stroke="#D6E0D4"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Hand Palm / Claws in Green */}
            <circle cx="182" cy="188" r="10" fill="#348D32" stroke="#2A7328" strokeWidth="2" />
            <circle cx="177" cy="183" r="3.5" fill="#52B040" />
            <circle cx="183" cy="180" r="3.5" fill="#52B040" />
            <circle cx="187" cy="184" r="3.5" fill="#52B040" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
