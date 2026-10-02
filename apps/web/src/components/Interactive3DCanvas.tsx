import React, { useEffect, useRef } from 'react';

interface Interactive3DCanvasProps {
  className?: string;
}

interface AmbientStar {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

export const Interactive3DCanvas: React.FC<Interactive3DCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    // Google 4 Signature Colors
    const googleColors = [
      '#4285F4', // Google Blue
      '#EA4335', // Google Red
      '#FBBC05', // Google Yellow
      '#34A853', // Google Green
    ];

    // Responsive Canvas Dimensions with DPR scaling for Retina sharpness
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let clientW = canvas.parentElement?.clientWidth || 800;
    let clientH = canvas.parentElement?.clientHeight || 450;
    canvas.width = clientW * dpr;
    canvas.height = clientH * dpr;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      clientW = canvas.parentElement.clientWidth;
      clientH = canvas.parentElement.clientHeight;
      canvas.width = clientW * dpr;
      canvas.height = clientH * dpr;
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Pause rendering when scrolled out of viewport
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);

    // Interactive Mouse Parallax & Camera Angle
    let targetRotX = 0.15; // default gentle tilt
    let targetRotY = 0;
    let rotX = 0.15;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const mouseNormX = (x / rect.width) * 2 - 1;
      const mouseNormY = (y / rect.height) * 2 - 1;
      targetRotY = mouseNormX * 0.35;
      targetRotX = 0.15 + mouseNormY * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initialize 40 ambient 3D stars spread throughout the volumetric space
    const stars: AmbientStar[] = Array.from({ length: 42 }, (_, i) => ({
      x: (Math.random() - 0.5) * 2.2,
      y: (Math.random() - 0.5) * 2.2,
      z: (Math.random() - 0.5) * 600,
      radius: Math.random() * 1.8 + 0.8,
      color: googleColors[i % googleColors.length],
      twinkleSpeed: Math.random() * 0.03 + 0.015,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    // 4 Orbiting Google 3D Spheres with wide Lissajous orbits covering all 4 quadrants
    const spheres = [
      {
        color: '#4285F4',
        radius: 28,
        speedX: 0.012,
        speedY: 0.016,
        phaseX: 0,
        phaseY: 1.0,
        rangeX: 0.44,
        rangeY: 0.38,
        zAmp: 130,
      },
      {
        color: '#EA4335',
        radius: 24,
        speedX: 0.010,
        speedY: 0.014,
        phaseX: Math.PI * 0.6,
        phaseY: Math.PI * 0.3,
        rangeX: 0.42,
        rangeY: 0.36,
        zAmp: 110,
      },
      {
        color: '#FBBC05',
        radius: 20,
        speedX: 0.014,
        speedY: 0.011,
        phaseX: Math.PI * 1.2,
        phaseY: Math.PI * 0.8,
        rangeX: 0.40,
        rangeY: 0.42,
        zAmp: 95,
      },
      {
        color: '#34A853',
        radius: 26,
        speedX: 0.011,
        speedY: 0.015,
        phaseX: Math.PI * 1.8,
        phaseY: Math.PI * 1.5,
        rangeX: 0.46,
        rangeY: 0.34,
        zAmp: 120,
      },
    ];

    let time = 0;

    const render = () => {
      if (isVisible) {
        time += 0.022;

        // Smooth camera lerp
        rotX += (targetRotX - rotX) * 0.05;
        rotY += (targetRotY - rotY) * 0.05;

        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, clientW, clientH);

        // Grid sizing that extends well past boundaries to ensure 100% complete coverage
        const spanX = clientW * 1.55;
        const spanY = clientH * 1.6;
        const cols = Math.min(52, Math.max(34, Math.floor(clientW / 26)));
        const rows = Math.min(36, Math.max(22, Math.floor(clientH / 22)));
        const spacingX = spanX / (cols - 1);
        const spacingY = spanY / (rows - 1);
        const startX = -spanX / 2;
        const startY = -spanY / 2;
        const fov = Math.max(520, clientW * 0.55);

        // Precompute 3D Wave Mesh Grid Points
        const points2D: Array<Array<{ x: number; y: number; scale: number; depth: number }>> = [];

        for (let r = 0; r < rows; r++) {
          points2D[r] = [];
          for (let c = 0; c < cols; c++) {
            const rawX = startX + c * spacingX;
            const rawY = startY + r * spacingY;

            // Multi-frequency harmonic 3D wave undulation across both axes
            const distFromCenter = Math.sqrt(rawX * rawX + rawY * rawY);
            const rawZ =
              Math.sin(rawX * 0.006 + time * 1.3) * 42 +
              Math.cos(rawY * 0.008 + time * 1.1) * 38 +
              Math.sin((rawX + rawY) * 0.005 + time * 0.9) * 30 +
              Math.cos(distFromCenter * 0.005 - time * 1.2) * 22;

            // 3D Camera Rotation (Yaw around Y, Pitch around X)
            const x1 = rawX * cosY - rawZ * sinY;
            const z1 = rawZ * cosY + rawX * sinY;

            const y2 = rawY * cosX - z1 * sinX;
            const z2 = z1 * cosX + rawY * sinX;

            // Perspective Projection
            const depth = z2 + fov;
            const scale = depth > 20 ? fov / depth : 0;
            const screenX = clientW / 2 + x1 * scale;
            const screenY = clientH / 2 + y2 * scale;

            points2D[r][c] = { x: screenX, y: screenY, scale, depth: z2 };
          }
        }

        // Draw Ambient 3D Stars Drifting in Deep Background
        stars.forEach((star) => {
          const sx = star.x * clientW * 0.6;
          const sy = star.y * clientH * 0.6;
          const sz = star.z + Math.sin(time + star.twinklePhase) * 40;

          const sx1 = sx * cosY - sz * sinY;
          const sz1 = sz * cosY + sx * sinY;
          const sy2 = sy * cosX - sz1 * sinX;
          const sz2 = sz1 * cosX + sy * sinX;

          const depth = sz2 + fov;
          if (depth > 20) {
            const scale = fov / depth;
            const screenX = clientW / 2 + sx1 * scale;
            const screenY = clientH / 2 + sy2 * scale;

            if (screenX >= 0 && screenX <= clientW && screenY >= 0 && screenY <= clientH) {
              const twinkle = (Math.sin(time * star.twinkleSpeed * 30 + star.twinklePhase) + 1) * 0.5;
              const starAlpha = Math.min(0.7, Math.max(0.1, twinkle * scale * 0.6));
              ctx.globalAlpha = starAlpha;
              ctx.fillStyle = star.color;
              ctx.beginPath();
              ctx.arc(screenX, screenY, star.radius * scale, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });

        // Draw 3D Wave Mesh Connecting Lines (covering 100% of the canvas)
        ctx.lineWidth = 1;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p = points2D[r][c];
            if (p.scale <= 0) continue;

            const alpha = Math.max(0.04, Math.min(0.26, (p.scale - 0.4) * 0.45));

            // Horizontal Line
            if (c < cols - 1) {
              const pNext = points2D[r][c + 1];
              if (pNext.scale > 0) {
                const colorIdx = (c + r) % googleColors.length;
                ctx.strokeStyle = googleColors[colorIdx];
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(pNext.x, pNext.y);
                ctx.stroke();
              }
            }

            // Vertical Line
            if (r < rows - 1) {
              const pDown = points2D[r + 1][c];
              if (pDown.scale > 0) {
                const colorIdx = (c + r + 1) % googleColors.length;
                ctx.strokeStyle = googleColors[colorIdx];
                ctx.globalAlpha = alpha * 0.75;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(pDown.x, pDown.y);
                ctx.stroke();
              }
            }
          }
        }

        // Draw Glowing Particles on Mesh Grid Nodes
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p = points2D[r][c];
            if (p.scale <= 0) continue;

            // Only draw node if within canvas bounds + 20px padding
            if (p.x < -20 || p.x > clientW + 20 || p.y < -20 || p.y > clientH + 20) continue;

            const nodeRadius = Math.max(1, p.scale * 2.2);
            const color = googleColors[(c + r) % googleColors.length];
            const nodeAlpha = Math.max(0.15, Math.min(0.75, (p.scale - 0.3) * 0.7));

            ctx.globalAlpha = nodeAlpha;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Draw 4 Large Google 3D Spheres with Ambient Glow Halos Sweeping Entire Canvas
        spheres.forEach((sphere) => {
          const sx = Math.sin(time * sphere.speedX * 25 + sphere.phaseX) * (clientW * sphere.rangeX);
          const sy = Math.cos(time * sphere.speedY * 25 + sphere.phaseY) * (clientH * sphere.rangeY);
          const sz = Math.sin(time * 0.016 * 25 + sphere.phaseX * 0.5) * sphere.zAmp;

          // Rotate in 3D camera
          const sx1 = sx * cosY - sz * sinY;
          const sz1 = sz * cosY + sx * sinY;
          const sy2 = sy * cosX - sz1 * sinX;
          const sz2 = sz1 * cosX + sy * sinX;

          const sDepth = sz2 + fov;
          if (sDepth > 20) {
            const sScale = fov / sDepth;
            const screenX = clientW / 2 + sx1 * sScale;
            const screenY = clientH / 2 + sy2 * sScale;
            const projectedRadius = Math.max(6, sphere.radius * sScale);

            // Outer Soft Halo
            const glowGrad = ctx.createRadialGradient(
              screenX,
              screenY,
              projectedRadius * 0.2,
              screenX,
              screenY,
              projectedRadius * 3.2
            );
            glowGrad.addColorStop(0, sphere.color);
            glowGrad.addColorStop(0.45, sphere.color + '44');
            glowGrad.addColorStop(1, 'transparent');

            ctx.globalAlpha = Math.min(0.65, Math.max(0.18, sScale * 0.55));
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(screenX, screenY, projectedRadius * 3.2, 0, Math.PI * 2);
            ctx.fill();

            // Core 3D Shaded Sphere
            const sphereGrad = ctx.createRadialGradient(
              screenX - projectedRadius * 0.32,
              screenY - projectedRadius * 0.32,
              projectedRadius * 0.08,
              screenX,
              screenY,
              projectedRadius
            );
            sphereGrad.addColorStop(0, '#FFFFFF');
            sphereGrad.addColorStop(0.35, sphere.color);
            sphereGrad.addColorStop(1, sphere.color + 'AA');

            ctx.globalAlpha = Math.min(0.92, Math.max(0.35, sScale * 0.8));
            ctx.fillStyle = sphereGrad;
            ctx.beginPath();
            ctx.arc(screenX, screenY, projectedRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ willChange: 'transform' }}
    />
  );
};

