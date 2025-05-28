import React, { useRef, useEffect, useState } from "react";

const MusicParticles = () => {
  const canvasRef = useRef(null);
  const [msg, setMsg] = useState("Aguardando permissão do microfone...");
  const mouse = useRef({ x: null, y: null });
  const audioLevel = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const PARTICLE_COUNT = 30;
    const MAX_DISTANCE = 210;
    const MOUSE_MAX_DISTANCE = 190;
    const NOTE_TYPES = ["standard", "eighth", "quarter", "pause"];
    let particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.85;
        this.vy = (Math.random() - 0.5) * 0.85;
        this.baseRadius = 4.2;
        this.radius = this.baseRadius;
        this.color = "rgba(160, 184, 247, 0.55)";
        this.pulseSpeed = 0.03 + Math.random() * 0.02;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.type = NOTE_TYPES[Math.floor(Math.random() * NOTE_TYPES.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        this.pulsePhase += this.pulseSpeed;
        const audioPulse = audioLevel.current * 9;
        this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 1.5 + audioPulse;
        if (this.radius < this.baseRadius) this.radius = this.baseRadius;
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          this.radius * 0.2,
          this.x,
          this.y,
          this.radius * 2
        );
        gradient.addColorStop(0, "rgba(160, 184, 247, 0.55)");
        gradient.addColorStop(1, "rgba(160, 184, 247, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = "rgba(160, 184, 247, 0.7)";
        ctx.shadowBlur = 8;

        switch (this.type) {
          case "standard":
            this.drawStandardNote();
            break;
          case "eighth":
            this.drawEighthNote();
            break;
          case "quarter":
            this.drawQuarterNote();
            break;
          case "pause":
            this.drawPause();
            break;
          default:
            break;
        }

        ctx.shadowBlur = 0;
      }

      drawStandardNote() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(160, 184, 247, 0.45)";
        ctx.lineWidth = 2;
        ctx.moveTo(this.x + this.radius * 0.7, this.y);
        ctx.lineTo(this.x + this.radius * 0.7, this.y - 18);
        ctx.stroke();
      }

      drawEighthNote() {
        this.drawStandardNote();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(160, 184, 247, 0.5)";
        ctx.lineWidth = 2;
        ctx.moveTo(this.x + this.radius * 0.7, this.y - 6);
        ctx.lineTo(this.x + this.radius * 1.5, this.y - 14);
        ctx.stroke();
      }

      drawQuarterNote() {
        this.drawStandardNote();
        ctx.beginPath();
        ctx.fillStyle = "rgba(160, 184, 247, 0.35)";
        ctx.moveTo(this.x + this.radius * 0.7, this.y - 28);
        ctx.quadraticCurveTo(
          this.x + this.radius * 2,
          this.y - 20,
          this.x + this.radius * 0.7,
          this.y - 16
        );
        ctx.closePath();
        ctx.fill();
      }

      drawPause() {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(160, 184, 247, 0.5)";
        ctx.lineWidth = 3;
        ctx.moveTo(this.x - this.radius * 0.5, this.y - 10);
        ctx.quadraticCurveTo(
          this.x + this.radius * 1,
          this.y - 16,
          this.x + this.radius * 0.5,
          this.y + 10
        );
        ctx.stroke();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < MAX_DISTANCE) {
            const opacity = 0.3 * (1 - distance / MAX_DISTANCE);
            ctx.strokeStyle = `rgba(160, 184, 247, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      if (mouse.current.x !== null && mouse.current.y !== null) {
        let distToCursor = MOUSE_MAX_DISTANCE;
        let connected = [];

        const particlesNearCursor = (distance) =>
          particles.filter((p) => {
            const dx = p.x - mouse.current.x;
            const dy = p.y - mouse.current.y;
            return Math.sqrt(dx * dx + dy * dy) < distance;
          });

        while (connected.length < 2 && distToCursor <= 350) {
          connected = particlesNearCursor(distToCursor);
          if (connected.length < 2) {
            distToCursor += 15;
          } else {
            break;
          }
        }

        connected.forEach((p) => {
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const opacity = 0.55 * (1 - distance / distToCursor);
          ctx.strokeStyle = `rgba(160, 184, 247, ${opacity})`;
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.stroke();
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    };

    const setupAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const analyze = () => {
          analyser.getByteFrequencyData(dataArray);
          let values = 0;
          for (let i = 0; i < dataArray.length; i++) {
            values += dataArray[i];
          }
          const average = values / dataArray.length;
          audioLevel.current = average / 255;

          setMsg("Visualização ativada — faça algum som para ver o efeito");
          requestAnimationFrame(analyze);
        };
        analyze();
      } catch (e) {
        setMsg(
          "Permissão de microfone negada ou erro no áudio. Atualize e tente novamente."
        );
        audioLevel.current = 0;
      }
    };

    const mouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const mouseLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseleave", mouseLeave);

    initParticles();
    animate();
    setupAudio();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#0C0C0C]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-lg bg-white/10 text-[#a0b8f7] backdrop-blur-md shadow-md">
        {msg}
      </div>
    </div>
  );
};

export default MusicParticles;
