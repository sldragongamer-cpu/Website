// Particle Network Animation - Futuristic Background
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = -1000;
  let mouseY = -1000;
  let animationId;

  const PARTICLE_COUNT = 90;
  const CONNECTION_DIST = 150;
  const MOUSE_CONNECT_DIST = 200;
  const PARTICLE_SPEED = 0.3;
  const COLORS = ['0, 240, 255', '123, 47, 247', '255, 0, 170'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
      this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
      this.radius = Math.random() * 2 + 1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) { this.vx *= -1; }
      if (this.y < 0 || this.y > canvas.height) { this.vy *= -1; }

      // Mouse interaction
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_CONNECT_DIST) {
        const force = (MOUSE_CONNECT_DIST - dist) / MOUSE_CONNECT_DIST;
        this.vx += (dx / dist) * force * 0.02;
        this.vy += (dy / dist) * force * 0.02;
      }

      // Limit speed
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > PARTICLE_SPEED * 2) {
        this.vx = (this.vx / speed) * PARTICLE_SPEED * 2;
        this.vy = (this.vy / speed) * PARTICLE_SPEED * 2;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();

      // Glow
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(${this.color}, 0.3)`;
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouseX > 0 && mouseY > 0) {
        const dx = particles[i].x - mouseX;
        const dy = particles[i].y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_CONNECT_DIST) {
          const opacity = (1 - dist / MOUSE_CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(255, 0, 170, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 0;

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
    animate();
  }

  // Mouse tracking
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  window.addEventListener('resize', resize);

  // Start after a small delay to not block rendering
  setTimeout(init, 100);
})();
