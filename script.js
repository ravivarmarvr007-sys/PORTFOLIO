/* ==========================================================================
   DARSHAN // PORTFOLIO JAVASCRIPT
   Cyber Canvas, Interactive Terminal, Tactical Audio & Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initNavigation();
  initLiveTelemetry();
  initAudioSynthesizer();
});

/* ==========================================================================
   1. INTERACTIVE CYBER PARTICLE CANVAS
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = Math.min(window.innerWidth < 768 ? 35 : 75, 90);
  const mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      
      // Cyber colors: cyan, neon green, magenta
      const colors = ['#00f0ff', '#00ff88', '#ff0055'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce at boundary
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactive repelling force
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 3;
          this.y -= dirY * force * 3;
        }
      }

      this.draw();
    }
  }

  // Create Particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Connect particles with faint cyber lines
  function connect() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00f0ff';
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
    }
    connect();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. NAVIGATION, MOBILE DRAWER & ACTIVE LINK HIGHLIGHT
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Sticky header class toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active nav link
    let current = '';
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 180;
      if (window.scrollY >= secTop) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });

    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   3. LIVE TELEMETRY & FOOTER INDICATORS
   ========================================================================== */
function initLiveTelemetry() {
  const pingEl = document.getElementById('live-ping');
  const clockEl = document.getElementById('runtime-clock');
  const startTime = Date.now();

  // Fluctuate simulated ping between 11ms and 19ms
  setInterval(() => {
    if (pingEl) {
      const ping = Math.floor(Math.random() * 8) + 12;
      pingEl.textContent = `${ping}ms`;
    }
  }, 3000);

  // Runtime stopwatch
  setInterval(() => {
    if (clockEl) {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
      const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      const secs = String(diff % 60).padStart(2, '0');
      clockEl.textContent = `${hours}:${mins}:${secs}`;
    }
  }, 1000);
}

/* ==========================================================================
   4. COPY EMAIL TO CLIPBOARD WITH FEEDBACK
   ========================================================================== */
window.copyEmail = function () {
  playCyberBeep(880, 0.08);
  const email = 'elipayaluga@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    const copyText = document.getElementById('copy-text');
    const copyIcon = document.getElementById('copy-icon');
    
    if (copyText && copyIcon) {
      copyText.textContent = 'COPIED!';
      copyText.style.color = '#00ff88';
      copyIcon.className = 'fa-solid fa-check';
      copyIcon.style.color = '#00ff88';

      setTimeout(() => {
        copyText.textContent = 'COPY';
        copyText.style.color = '';
        copyIcon.className = 'fa-regular fa-copy';
        copyIcon.style.color = '';
      }, 2500);
    }
  }).catch((err) => {
    console.error('Failed to copy text: ', err);
  });
};

/* ==========================================================================
   5. INTERACTIVE TERMINAL SIMULATOR
   ========================================================================== */
window.runTermCmd = function (cmd) {
  playCyberBeep(640, 0.05);
  const terminal = document.getElementById('interactive-terminal');
  if (!terminal) return;

  const cmdLine = document.createElement('p');
  cmdLine.className = 'term-output';
  cmdLine.innerHTML = `<span class="term-prompt">darshan@cyber-core:~$</span> ${cmd}`;
  terminal.appendChild(cmdLine);

  let responseHtml = '';
  switch (cmd) {
    case 'whoami':
      responseHtml = `<span class="text-cyan">[USER] DARSHAN</span><br>
      <span class="text-secondary">ROLE: B.Sc. Computer Science Researcher // AI &amp; Data Science Specialist &amp; Game Developer.</span><br>
      <span class="text-green">STATUS: Ready for mission deployments.</span>`;
      break;

    case 'skills':
      responseHtml = `<span class="text-green">[ARSENAL SPECIFICATION]</span><br>
      • AI/DS: Neural Networks, Machine Learning, Data Analytics, NumPy, Pandas<br>
      • Python: Scalable Backends, Automation, High-Concurrency Pipelines<br>
      • Systems: Low-level C, Pointer Arithmetic, Deterministic State Machines`;
      break;

    case 'ping':
      responseHtml = `<span class="text-crimson">[TRANSMITTING PACKETS...]</span><br>
      64 bytes from hq.darshan.net: icmp_seq=1 ttl=64 time=12.4 ms<br>
      64 bytes from hq.darshan.net: icmp_seq=2 ttl=64 time=14.1 ms<br>
      <span class="text-green">[STATUS] All packets delivered with 0% loss.</span>`;
      break;

    default:
      responseHtml = `<span class="text-crimson">Command not recognized: ${cmd}. Available: whoami, skills, ping</span>`;
  }

  const resLine = document.createElement('p');
  resLine.className = 'term-output';
  resLine.innerHTML = responseHtml;
  terminal.appendChild(resLine);

  terminal.scrollTop = terminal.scrollHeight;
};

window.clearTerm = function () {
  playCyberBeep(420, 0.05);
  const terminal = document.getElementById('interactive-terminal');
  if (!terminal) return;
  terminal.innerHTML = `
    <p class="term-output text-green">[INIT] Terminal buffer reset.</p>
    <div class="term-line">
      <span class="term-prompt">darshan@cyber-core:~$</span>
      <span class="term-cursor"></span>
    </div>
  `;
};

/* ==========================================================================
   6. PROJECT DEEP-DIVE MODALS
   ========================================================================== */
const projectDetails = {
  mafia: {
    title: 'MISSION_BRIEF // GAME_MAFFIA.EXE',
    html: `
      <h4>// PROJECT SYNOPSIS: GAME MAFFIA</h4>
      <p>
        <strong>Game Maffia</strong> is an atmospheric, high-stakes tactical strategy simulation engineered around the gritty narrative dynamics of a futuristic cyberpunk underworld. 
        Players navigate rival syndicate turf wars, underground economies, and tactical skirmishes.
      </p>

      <div class="modal-spec-box">
        <span class="text-crimson">// TECHNICAL ARCHITECTURE</span><br>
        • <strong>Syndicate AI Decision Trees:</strong> Heuristic state machines simulating competitive boss AI behavior, proactive territory expansion, and retaliation strategies.<br>
        • <strong>Turn-Based &amp; Real-Time Hybrid Engine:</strong> Optimized tick cycles ensuring responsive tactical decision making without frame drops.<br>
        • <strong>Cyberpunk Noir Styling:</strong> Dynamic lighting shaders, rain-slicked city streets, and neon tactical HUD overlays.
      </div>

      <p>
        <strong>Key Engineering Highlights:</strong> Modular entity-component-system (ECS) design patterns allow rapid additions of syndicate factions, tactical perks, and weapon matrices.
      </p>
    `
  },
  atm: {
    title: 'SOURCE_AUDIT // ATM_SIMULATOR.C',
    html: `
      <h4>// SYSTEM ARCHITECTURE: ATM MACHINE SIMULATOR</h4>
      <p>
        The <strong>ATM Machine Simulator</strong> is a low-level, high-reliability transactional banking core written in pure standard C. 
        It demonstrates strict adherence to deterministic hardware logic, memory safety, and secure authentication state transitions.
      </p>

      <div class="modal-spec-box">
        <span class="text-cyan">// CORE SYSTEM ATTRIBUTES</span><br>
        • <strong>Deterministic State Machine:</strong> Strictly enforced states: <code>STATE_IDLE &rarr; STATE_AUTH &rarr; STATE_MENU &rarr; STATE_DISPENSE &rarr; STATE_RECEIPT</code>.<br>
        • <strong>Memory Leak Prevention:</strong> Explicit resource allocation checks with Valgrind-verified 0-leak execution lifecycle.<br>
        • <strong>Greedy Dispensing Algorithm:</strong> Calculates optimal note denomination distribution while preserving machine vault reserves.<br>
        • <strong>Encrypted Ledger I/O:</strong> Persistent binary file operations logging timestamped, tamper-evident audit trails.
      </div>

      <p>
        <strong>Key Engineering Highlights:</strong> Built to mirror real-world embedded banking terminal protocols with defensive input sanitation against buffer overflow exploits.
      </p>
    `
  }
};

window.openProjectModal = function (projectId) {
  playCyberBeep(720, 0.06);
  const modal = document.getElementById('project-modal');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');

  const data = projectDetails[projectId];
  if (data && modal && titleEl && bodyEl) {
    titleEl.textContent = data.title;
    bodyEl.innerHTML = data.html;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
};

window.closeProjectModal = function () {
  playCyberBeep(380, 0.05);
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
  }
});

/* ==========================================================================
   7. WEB AUDIO API TACTICAL SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioSynthesizer() {
  const soundBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  if (soundBtn && soundIcon) {
    soundBtn.addEventListener('click', () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      soundEnabled = !soundEnabled;

      if (soundEnabled) {
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        soundIcon.className = 'fa-solid fa-volume-high text-cyan';
        playCyberBeep(520, 0.05);
        setTimeout(() => playCyberBeep(780, 0.08), 70);
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
      }
    });
  }
}

function playCyberBeep(freq = 440, duration = 0.05) {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Audio Context might require user interaction first
  }
}
