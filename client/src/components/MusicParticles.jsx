import React, { useRef, useEffect, useState } from "react";

const MusicParticles = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null });
  const [particleCount, setParticleCount] = useState(0); // Estado para controlar a quantidade de partículas

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const calculateParticleCount = (currentWidth) => {
      if (currentWidth < 640) {
        // Telas pequenas (mobile)
        return 20;
      } else if (currentWidth < 1024) {
        // Telas médias (tablet)
        return 35;
      } else {
        // Telas grandes (desktop)
        return 45;
      }
    };

    // Define a quantidade inicial de partículas
    setParticleCount(calculateParticleCount(width));

    const MAX_DISTANCE = 250; // Ajustado para conexões mais visíveis
    const MOUSE_MAX_DISTANCE = 300; // Ajustado para interação do mouse
    const NOTE_TYPES = ["standard", "eighth", "quarter", "half", "whole"]; // Adicionado 'half', 'whole'
    let particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      // Recalcula a quantidade de partículas no redimensionamento
      setParticleCount(calculateParticleCount(width));
      // Re-inicializa as partículas para aplicar a nova contagem
      initParticles();
    };
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8; // Velocidade um pouco maior
        this.vy = (Math.random() - 0.5) * 0.8; // Velocidade um pouco maior
        this.baseRadius = 3.5; // Raio base ligeiramente maior para a cabeça da nota
        this.radius = this.baseRadius;
        this.color = "rgba(160, 184, 247, 0.65)"; // Cor ligeiramente mais opaca
        this.pulseSpeed = 0.025 + Math.random() * 0.015; // Pulsação mais suave
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.type = NOTE_TYPES[Math.floor(Math.random() * NOTE_TYPES.length)];
        this.stemLength = 25; // Comprimento da haste
        // Define a direção da haste (para cima ou para baixo) com base na posição Y
        this.stemDirection = this.y > height / 2 ? -1 : 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        this.pulsePhase += this.pulseSpeed;
        this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 1.0; // Pulsação mais notável
        if (this.radius < this.baseRadius) this.radius = this.baseRadius;
      }

      draw() {
        // Gradiente de brilho ao redor da nota
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          this.radius * 0.2,
          this.x,
          this.y,
          this.radius * 2.5 // Aumenta a área do brilho
        );
        gradient.addColorStop(0, "rgba(160, 184, 247, 0.55)");
        gradient.addColorStop(1, "rgba(160, 184, 247, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Sombra para dar profundidade
        ctx.shadowColor = "rgba(160, 184, 247, 0.7)";
        ctx.shadowBlur = 10; // Sombra mais suave

        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2; // Linhas um pouco mais grossas

        switch (this.type) {
          case "standard":
          case "quarter": // Semínima
            this.drawQuarterNote();
            break;
          case "eighth": // Colcheia
            this.drawEighthNote();
            break;
          case "half": // Mínima
            this.drawHalfNote();
            break;
          case "whole": // Semibreve
            this.drawWholeNote();
            break;
          default:
            this.drawQuarterNote(); // Padrão
            break;
        }

        ctx.shadowBlur = 0; // Reseta a sombra para não afetar outras coisas
      }

      // Desenha a cabeça da nota (oval inclinada)
      drawNoteHead(filled = true) {
        ctx.beginPath();
        // Elipse inclinada para simular a cabeça da nota musical
        ctx.ellipse(
          this.x,
          this.y,
          this.radius * 1.5, // Proporção da cabeça da nota ajustada
          this.radius * 1.1, // Proporção da cabeça da nota ajustada
          -Math.PI / 8,
          0,
          Math.PI * 2
        );
        if (filled) {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      }

      // Desenha a haste da nota
      drawStem() {
        // Calcula a posição da haste com base na direção
        const stemXOffset =
          this.radius * 1.5 * (this.stemDirection === 1 ? 0.8 : -0.8);
        const stemYStartOffset = this.radius * 1.1 * this.stemDirection;
        const stemYEndOffset = this.stemLength * this.stemDirection;

        const stemX = this.x + stemXOffset;
        const stemYStart = this.y - stemYStartOffset;
        const stemYEnd = this.y - stemYEndOffset;

        ctx.beginPath();
        ctx.moveTo(stemX, stemYStart);
        ctx.lineTo(stemX, stemYEnd);
        ctx.stroke();
        return { x: stemX, y: stemYEnd };
      }

      // Desenha uma semibreve (cabeça oval vazia)
      drawWholeNote() {
        ctx.beginPath();
        ctx.ellipse(
          this.x,
          this.y,
          this.radius * 1.8,
          this.radius * 1.4,
          -Math.PI / 8,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Desenha uma mínima (cabeça vazia com haste)
      drawHalfNote() {
        this.drawNoteHead(false); // Cabeça vazia
        this.drawStem();
      }

      // Desenha uma semínima (cabeça preenchida com haste)
      drawQuarterNote() {
        this.drawNoteHead(true); // Cabeça preenchida
        this.drawStem();
      }

      // Desenha uma colcheia (semínima com flag)
      drawEighthNote() {
        this.drawQuarterNote(); // Desenha a semínima
        const stemEnd = this.drawStem(); // Obtém o final da haste

        // Desenha a flag, com base na direção da haste
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        if (this.stemDirection === 1) {
          // Haste para cima, flag para a direita
          ctx.moveTo(stemEnd.x, stemEnd.y);
          ctx.bezierCurveTo(
            stemEnd.x + 10,
            stemEnd.y + 5,
            stemEnd.x + 10,
            stemEnd.y + 15,
            stemEnd.x + 5,
            stemEnd.y + 20
          );
        }
        ctx.stroke();
      }
      // Desenha uma pausa de semínima
      drawQuarterRest() {
        ctx.beginPath();
        ctx.lineWidth = 2;
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
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
            ctx.lineWidth = 1.5; // Linha de conexão mais fina
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
          ctx.lineWidth = 3.5; // Linha de conexão com o mouse ajustada
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

    if (particleCount > 0) {
      initParticles();
      animate();
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseleave", mouseLeave);
    };
  }, [particleCount]);

 return (
    // MUDANÇA AQUI: De 'absolute' para 'fixed' e z-index negativo para garantir que fique atrás de tudo
    <div className="fixed inset-0 -z-0 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export default MusicParticles;
