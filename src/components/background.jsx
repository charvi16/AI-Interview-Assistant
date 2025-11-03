import React, { useEffect, useRef } from "react";

// Interactive Plasma Field Effect
const PlasmaFieldEffect = ({ isActive = true }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const clickWavesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      clickWavesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: 300,
        intensity: 1.5,
        startTime: timeRef.current,
      });

      if (clickWavesRef.current.length > 5) {
        clickWavesRef.current = clickWavesRef.current.slice(-5);
      }
    };

    canvas.addEventListener("click", handleClick);

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      timeRef.current += 0.01;

      clickWavesRef.current = clickWavesRef.current.filter((wave) => {
        wave.radius += 1.5;
        wave.intensity = Math.max(0, 1 - wave.radius / wave.maxRadius);
        return wave.radius < wave.maxRadius;
      });

      for (let x = 0; x < canvas.width; x += 4) {
        for (let y = 0; y < canvas.height; y += 4) {
          let value =
            Math.sin(x * 0.01 + timeRef.current) +
            Math.sin(y * 0.01 + timeRef.current * 1.2) +
            Math.sin((x + y) * 0.01 + timeRef.current * 0.8) +
            Math.sin(Math.sqrt(x * x + y * y) * 0.01 + timeRef.current);

          let clickEffect = 0;
          clickWavesRef.current.forEach((wave) => {
            const distance = Math.sqrt((x - wave.x) ** 2 + (y - wave.y) ** 2);
            const waveEffect = Math.sin(
              distance * 0.05 - (timeRef.current - wave.startTime) * 8
            );
            const falloff = Math.max(0, 1 - distance / wave.maxRadius);
            clickEffect += waveEffect * wave.intensity * falloff * 2;
          });

          value += clickEffect;

          const normalized = (value + 6) / 12;
          let hue = (normalized * 360 + timeRef.current * 50) % 360;

          let saturation = 0.9;
          let lightness = 0.2;

          clickWavesRef.current.forEach((wave) => {
            const distance = Math.sqrt((x - wave.x) ** 2 + (y - wave.y) ** 2);
            const influence =
              Math.max(0, 1 - distance / wave.maxRadius) * wave.intensity;
            if (influence > 0.1) {
              hue = (hue + 60 * influence) % 360;
              saturation = Math.min(1, saturation + influence * 0.5);
              lightness = Math.min(0.8, lightness + influence * 0.3);
            }
          });

          const c = saturation * (1 - Math.abs(2 * lightness - 1));
          const x1 = c * (1 - Math.abs((hue / 60) % 2 - 1));
          const m = lightness - c / 2;

          let r, g, b;
          if (hue < 60) {
            r = c;
            g = x1;
            b = 0;
          } else if (hue < 120) {
            r = x1;
            g = c;
            b = 0;
          } else if (hue < 180) {
            r = 0;
            g = c;
            b = x1;
          } else if (hue < 240) {
            r = 0;
            g = x1;
            b = c;
          } else if (hue < 300) {
            r = x1;
            g = 0;
            b = c;
          } else {
            r = c;
            g = 0;
            b = x1;
          }

          r = Math.floor((r + m) * 255);
          g = Math.floor((g + m) * 255);
          b = Math.floor((b + m) * 255);

          let alpha = normalized * 120;
          clickWavesRef.current.forEach((wave) => {
            const distance = Math.sqrt((x - wave.x) ** 2 + (y - wave.y) ** 2);
            const influence =
              Math.max(0, 1 - distance / wave.maxRadius) * wave.intensity;
            alpha += influence * 120;
          });
          alpha = Math.min(255, alpha);

          for (let dx = 0; dx < 4 && x + dx < canvas.width; dx++) {
            for (let dy = 0; dy < 4 && y + dy < canvas.height; dy++) {
              const index = ((y + dy) * canvas.width + (x + dx)) * 4;
              data[index] = r;
              data[index + 1] = g;
              data[index + 2] = b;
              data[index + 3] = alpha;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        cursor: "pointer",
        pointerEvents: "none",
        zIndex : 0,
      }}
    />
  );
};

export default function Background() {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
    >
      <PlasmaFieldEffect isActive={true} />
    </div>
  );
}
