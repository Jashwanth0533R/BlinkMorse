/* ==========================================================================
   BlinkMorse Core JavaScript Engine (demo_website)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================================================
  // Lenis Smooth Scroll Setup
  // ==========================================================================
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect GSAP ScrollTrigger to Lenis scroll updates
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Lock scroll during preloader
  if (lenis) lenis.stop();
  document.body.style.overflow = 'hidden';

  // ==========================================================================
  // Custom Text Splitting Utility (SplitText Alternative)
  // ==========================================================================
  function splitTextIntoChars(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const text = element.innerText;
      element.innerHTML = '';
      text.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        element.appendChild(span);
      });
    });
  }

  // Split text for custom character reveals
  splitTextIntoChars('.char-reveal');

  // ==========================================================================
  // Preloader & Cinematic Intro Animation
  // ==========================================================================
  const preloader = document.getElementById("preloader");
  const introLidUpper = document.querySelector(".intro-eye-lid-upper");
  const introLidLower = document.querySelector(".intro-eye-lid-lower");
  const introPupil = document.querySelector(".intro-eye-pupil");
  const introPupilCenter = document.querySelector(".intro-eye-pupil-center");
  
  // Set initial SVG properties for line drawing
  introLidUpper.style.strokeDasharray = "100";
  introLidUpper.style.strokeDashoffset = "100";
  introLidLower.style.strokeDasharray = "100";
  introLidLower.style.strokeDashoffset = "100";

  // Create timeline for preloader reveal
  const introTl = gsap.timeline({
    onComplete: () => {
      // Unlock scroll and fade out preloader
      if (lenis) lenis.start();
      document.body.style.overflow = '';
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          preloader.style.display = "none";
          // Trigger Hero entry animations once preloader is gone
          triggerHeroAnimations();
        }
      });
    }
  });

  // Intro steps
  introTl.to(".intro-eye-line", { duration: 1 }) // Thin line glows
         .to(introLidUpper, { opacity: 1, strokeDashoffset: 0, duration: 1.2, ease: "power2.out" }, "+=0.2")
         .to(introLidLower, { opacity: 1, strokeDashoffset: 0, duration: 1.2, ease: "power2.out" }, "<")
         .to(introPupil, { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.5")
         .to(introPupilCenter, { opacity: 1, duration: 0.5 }, "-=0.2")
         .to(".preloader-text-container", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
         .to({}, { duration: 1.2 }); // Wait at the end of preloader

  // Generate background neural nodes for preloader
  const introNeuralNodesContainer = document.getElementById("intro-neural-nodes");
  for (let i = 0; i < 15; i++) {
    const node = document.createElement("div");
    node.className = "intro-node";
    node.style.position = "absolute";
    node.style.width = "4px";
    node.style.height = "4px";
    node.style.backgroundColor = "rgba(0, 229, 255, 0.4)";
    node.style.borderRadius = "50%";
    node.style.left = `${Math.random() * 100}%`;
    node.style.top = `${Math.random() * 100}%`;
    node.style.opacity = "0";
    introNeuralNodesContainer.appendChild(node);
    
    // Animate node fades
    introTl.to(node, { opacity: 1, duration: 0.2 }, `-=${0.2 + (Math.random() * 0.8)}`);
  }

  // ==========================================================================
  // Hero Section Particles & Glow Canvas
  // ==========================================================================
  const heroCanvas = document.getElementById("hero-canvas");
  const heroCtx = heroCanvas.getContext("2d");
  let heroWidth = (heroCanvas.width = window.innerWidth);
  let heroHeight = (heroCanvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    heroWidth = heroCanvas.width = window.innerWidth;
    heroHeight = heroCanvas.height = window.innerHeight;
  });

  // Magnetic hover mouse coordinates
  let mouse = { x: heroWidth / 2, y: heroHeight / 2, tx: heroWidth / 2, ty: heroHeight / 2 };
  window.addEventListener("mousemove", (e) => {
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
  });

  // Particle models: dots and dashes
  class MorseParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * heroWidth;
      this.y = heroHeight + 50 + Math.random() * 100;
      this.type = Math.random() > 0.5 ? "dot" : "dash";
      this.size = this.type === "dot" ? 4 : 12; // Dash width
      this.speedY = 0.5 + Math.random() * 1.0;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = 0.15 + Math.random() * 0.3;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < -50 || this.x < -50 || this.x > heroWidth + 50) {
        this.reset();
      }
    }
    draw() {
      heroCtx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
      heroCtx.shadowBlur = 4;
      heroCtx.shadowColor = "#00E5FF";
      heroCtx.beginPath();
      if (this.type === "dot") {
        heroCtx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        heroCtx.fill();
      } else {
        // Draw rounded dashes
        heroCtx.roundRect(this.x - this.size / 2, this.y - 2, this.size, 4, 2);
        heroCtx.fill();
      }
      heroCtx.shadowBlur = 0; // Reset shadow
    }
  }

  // Create 15-20 Morse particles (reduced by 80%)
  const particles = Array.from({ length: 18 }, () => new MorseParticle());

  // Render loop
  function animateHeroBackground() {
    heroCtx.clearRect(0, 0, heroWidth, heroHeight);

    // Dynamic easing for mouse glow tracking
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;

    // Single large cyan radial glow moving slowly with mouse
    const gradient = heroCtx.createRadialGradient(
      mouse.x, mouse.y, 10,
      mouse.x, mouse.y, 350
    );
    gradient.addColorStop(0, "rgba(0, 229, 255, 0.06)");
    gradient.addColorStop(1, "rgba(5, 8, 22, 0)");
    heroCtx.fillStyle = gradient;
    heroCtx.fillRect(0, 0, heroWidth, heroHeight);

    // Draw Morse particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animateHeroBackground);
  }
  animateHeroBackground();

  // ==========================================================================
  // Hero CTA Magnetic Interaction
  // ==========================================================================
  const magneticButtons = document.querySelectorAll(".magnetic-btn");
  magneticButtons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Move slightly towards cursor
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    btn.addEventListener("mouseleave", () => {
      // Snap back
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)"
      });
    });
  });

  // ==========================================================================
  // Hero Entry Animations (Triggered after preloader)
  // ==========================================================================
  function triggerHeroAnimations() {
    const heroTl = gsap.timeline();
    heroTl.from(".hero-title", {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power3.out"
    })
    .from(".hero-tagline", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6")
    .from(".hero-subtext", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6")
    .from(".hero-buttons .btn", {
      opacity: 0,
      y: 15,
      stagger: 0.15,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    .from(".hero-eye-wireframe", {
      scale: 0.8,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out"
    }, "0.3")
    .from(".main-header", {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "0.5");
  }

  // ==========================================================================
  // WWDC Transition (Scale and Round Corners)
  // ==========================================================================
  gsap.registerPlugin(ScrollTrigger);
  
  // Transition Hero viewport on scroll down
  gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "bottom bottom",
      end: "bottom top",
      scrub: true
    }
  })
  .to("#hero", {
    scale: 0.97,
    borderRadius: "24px",
    filter: "brightness(0.3)",
    ease: "none"
  });

  // ==========================================================================
  // Impact Statement Reveal (Line-by-line reveal)
  // ==========================================================================
  gsap.to(".impact-line", {
    scrollTrigger: {
      trigger: "#impact",
      start: "top 70%",
      end: "bottom 30%",
      scrub: true
    },
    opacity: 1,
    y: 0,
    stagger: 0.3,
    ease: "power2.out"
  });

  // Slowly rotate wireframe inside impact section
  gsap.to(".impact-eye-wireframe svg", {
    scrollTrigger: {
      trigger: "#impact",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    },
    rotation: 20,
    ease: "none"
  });

  // Stagger reveal Problem Cards
  gsap.from(".problem-card", {
    scrollTrigger: {
      trigger: ".problem-grid",
      start: "top 75%",
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: 40,
    stagger: 0.15,
    duration: 0.8,
    ease: "power2.out"
  });

  // ==========================================================================
  // Why Morse - Scroll character reveal animation
  // ==========================================================================
  const charSpans = document.querySelectorAll(".philosophical-pitch span");
  gsap.to(charSpans, {
    scrollTrigger: {
      trigger: "#why-morse",
      start: "top 80%",
      end: "bottom 60%",
      scrub: 0.5
    },
    className: "revealed",
    stagger: 0.02,
    ease: "none"
  });

  // ==========================================================================
  // Problem Section Looping SVG Animation (6s duration loop)
  // ==========================================================================
  const problemSvg = document.getElementById("problem-anim-svg");
  if (problemSvg) {
    const problemTl = gsap.timeline({ repeat: -1 });

    // Set initial states
    gsap.set("#anim-eye-group", { opacity: 0 });
    gsap.set("#anim-bubble-group", { opacity: 0, scale: 0.8, transformOrigin: "center" });
    gsap.set(".anim-morse-symbol", { opacity: 0, y: 10 });
    gsap.set("#anim-eye-outline", { strokeDasharray: 300, strokeDashoffset: 300 });

    // 0s to 1.5s: Vocal waves pulse
    problemTl.to(".vocal-wave", {
      strokeDashoffset: 10,
      opacity: 0.5,
      stagger: 0.15,
      duration: 0.5,
      repeat: 2,
      yoyo: true
    })
    // 1.5s: Sound waves slowly disappear
    .to("#anim-speech-group", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    })
    // 2.0s: Eye outline draws itself
    .to("#anim-eye-group", {
      opacity: 1,
      duration: 0.2
    })
    .to("#anim-eye-outline", {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.out"
    })
    // Pupil appears
    .fromTo("#anim-eye-pupil, #anim-eye-core", {
      scale: 0,
      opacity: 0,
      transformOrigin: "center"
    }, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.5)"
    }, "-=0.4")
    // Eye blinks twice (scaleY to 0.1 and back)
    .to("#anim-eye-pupil, #anim-eye-core, #anim-eye-outline", {
      scaleY: 0.1,
      transformOrigin: "center",
      duration: 0.12,
      repeat: 3,
      yoyo: true,
      ease: "power2.inOut"
    }, "+=0.2")
    // Morse symbols emerge
    .to(".anim-morse-symbol", {
      opacity: 1,
      y: -15,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out"
    }, "+=0.2")
    // Communication bubble appears
    .to("#anim-bubble-group", {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1, 0.75)"
    }, "-=0.3")
    // Hold state
    .to({}, { duration: 1.5 })
    // Fade out for reset
    .to("#problem-anim-svg g", {
      opacity: 0,
      duration: 0.5
    })
    // Restore speech group
    .to("#anim-speech-group", {
      opacity: 1,
      duration: 0.1
    });
  }

  // ==========================================================================
  // Workflow Timeline Stagger Reveal
  // ==========================================================================
  const timelineRows = document.querySelectorAll(".timeline-row-item");
  timelineRows.forEach(row => {
    gsap.from(row, {
      scrollTrigger: {
        trigger: row,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: "power3.out"
    });
  });

  // ==========================================================================
  // Live Blink Test Engine (Webcam + MediaPipe vs Manual Sim)
  // ==========================================================================
  
  // Dashboard view toggle buttons
  const btnModeCamera = document.getElementById("btn-mode-camera");
  const btnModeSim = document.getElementById("btn-mode-sim");
  const btnToggleFlowchart = document.getElementById("btn-toggle-flowchart");
  const webcamView = document.getElementById("webcam-view-content");
  const simView = document.getElementById("sim-view-content");
  const flowchartPanel = document.getElementById("dashboard-flowchart-panel");
  const dashboardBody = document.querySelector(".dashboard-body");

  btnModeCamera.addEventListener("click", () => {
    btnModeCamera.classList.add("active");
    btnModeSim.classList.remove("active");
    webcamView.classList.add("active");
    simView.classList.remove("active");
    stopSimulationMode();
  });

  btnModeSim.addEventListener("click", () => {
    btnModeSim.classList.add("active");
    btnModeCamera.classList.remove("active");
    simView.classList.add("active");
    webcamView.classList.remove("active");
    startSimulationMode();
  });

  if (btnToggleFlowchart && flowchartPanel && dashboardBody) {
    btnToggleFlowchart.addEventListener("click", () => {
      const isActive = btnToggleFlowchart.classList.toggle("active");
      if (isActive) {
        flowchartPanel.classList.add("active");
        dashboardBody.classList.add("flowchart-open");
      } else {
        flowchartPanel.classList.remove("active");
        dashboardBody.classList.remove("flowchart-open");
      }
    });
  }

  // Console output elements
  const displayMorse = document.getElementById("display-morse-buffer");
  const displayText = document.getElementById("display-text-output");
  const consoleLogs = document.getElementById("console-logs");
  
  let currentMorseBuffer = "";
  let currentTextOutput = "";

  // Morse Translation map (from scripts/morse_translator.py)
  const MORSE_DICT = {
    '.-':'A', '-...':'B', '-.-.':'C', '-..':'D', '.':'E',
    '..-.':'F', '--.':'G', '....':'H', '..':'I', '.---':'J',
    '-.-':'K', '.-..':'L', '--':'M', '-.':'N', '---':'O',
    '.--.':'P', '--.-':'Q', '.-.':'R', '...':'S', '-':'T',
    '..-':'U', '...-':'V', '.--':'W', '-..-':'X', '-.--':'Y',
    '--..':'Z', '-----':'0', '.----':'1', '..---':'2', '...--':'3',
    '....-':'4', '.....':'5', '-....':'6', '--...':'7', '---..':'8', '----.':'9'
  };

  // Helper: Append log to terminal
  function logTerminal(message) {
    const p = document.createElement("p");
    p.className = "log-line";
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    p.innerText = `[${timeStr}] ${message}`;
    consoleLogs.appendChild(p);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

  // Delete last letter or active buffer
  document.getElementById("btn-clear-letter").addEventListener("click", () => {
    if (currentMorseBuffer !== "") {
      currentMorseBuffer = "";
      displayMorse.innerText = "Ready";
      updateFlowchartHighlight(currentMorseBuffer);
      logTerminal("Active Morse buffer cleared.");
    } else if (currentTextOutput && currentTextOutput !== "READY" && currentTextOutput !== "HELLO") {
      currentTextOutput = currentTextOutput.slice(0, -1);
      displayText.innerText = currentTextOutput || "READY";
      logTerminal("Last decoded letter removed.");
    }
  });

  // Clear buffers (Clear Simulator)
  document.getElementById("btn-clear-all").addEventListener("click", () => {
    currentMorseBuffer = "";
    currentTextOutput = "";
    displayMorse.innerText = "Ready";
    displayText.innerText = "READY";
    updateFlowchartHighlight(currentMorseBuffer);
    logTerminal("Console input buffers and simulation queue cleared.");
  });

  // Text-To-Speech Playback (Speak Text)
  document.getElementById("btn-tts-speak").addEventListener("click", () => {
    const text = displayText.innerText.trim();
    if (!text || text === "READY") {
      logTerminal("Speech synthesis error: No output text buffer to speak.");
      return;
    }
    
    if ('speechSynthesis' in window) {
      logTerminal(`Speaking output: "${text}"`);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      logTerminal("Speech Synthesis API not supported in this browser.");
    }
  });

  // --- Manual Simulation Mode Logic ---
  let simBlinkActive = false;
  let simBlinkStartTime = 0;
  let simBlinkTimeout = null;
  const btnSimBlink = document.getElementById("btn-sim-blink");
  const simEyeLidUpper = document.querySelector(".sim-eye-lid-upper");
  const simEyeLidLower = document.querySelector(".sim-eye-lid-lower");
  const simEyePupil = document.querySelector(".sim-eye-pupil");

  function startSimulationMode() {
    logTerminal("Simulation Mode activated.");
    document.getElementById("val-ear").innerText = "0.350";
    document.getElementById("val-threshold").innerText = "0.220";
    document.getElementById("cal-controls-row").style.display = "none";
  }

  function stopSimulationMode() {
    logTerminal("Simulation Mode deactivated.");
  }

  // Press down -> blink closes
  btnSimBlink.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if (simBlinkActive) return;
    simBlinkActive = true;
    simBlinkStartTime = performance.now();
    btnSimBlink.classList.add("active");
    
    // Close eye vectors
    gsap.to(simEyeLidUpper, { d: "M 20 60 Q 100 60 180 60", duration: 0.08 });
    gsap.to(simEyeLidLower, { d: "M 20 60 Q 100 60 180 60", duration: 0.08 });
    gsap.to(simEyePupil, { scaleY: 0.1, duration: 0.08 });
    
    document.getElementById("val-ear").innerText = "0.042";
  });

  // Release -> blink opens
  window.addEventListener("mouseup", (e) => {
    if (!simBlinkActive) return;
    simBlinkActive = false;
    btnSimBlink.classList.remove("active");
    
    // Open eye vectors
    gsap.to(simEyeLidUpper, { d: "M 20 60 Q 100 10 180 60", duration: 0.12 });
    gsap.to(simEyeLidLower, { d: "M 20 60 Q 100 110 180 60", duration: 0.12 });
    gsap.to(simEyePupil, { scaleY: 1, duration: 0.12 });
    
    const blinkDuration = performance.now() - simBlinkStartTime;
    document.getElementById("val-ear").innerText = "0.345";
    
    processBlinkSignal(blinkDuration);
  });

  // Parse registered blinks into Morse
  function processBlinkSignal(duration) {
    let symbol = "";
    if (duration < 550) {
      symbol = "."; // Dot
      logTerminal(`Blink detected: ${duration.toFixed(0)}ms -> DOT (.)`);
    } else {
      symbol = "-"; // Dash
      logTerminal(`Blink detected: ${duration.toFixed(0)}ms -> DASH (-)`);
    }

    // Append to live buffer
    if (currentMorseBuffer === "") {
      currentMorseBuffer = symbol;
    } else {
      currentMorseBuffer += " " + symbol;
    }
    displayMorse.innerText = currentMorseBuffer;

    // Decode Morse character immediately for preview
    updateTextPreview();
    updateFlowchartHighlight(currentMorseBuffer);

    // Reset letters space timers
    clearTimeout(simBlinkTimeout);
    simBlinkTimeout = setTimeout(() => {
      // Finalize the current Morse letter after 1.2s
      finalizeMorseLetter();
    }, 1200);
  }

  function updateTextPreview() {
    if (currentMorseBuffer === "") {
      displayText.innerText = currentTextOutput || "READY";
      return;
    }
    const cleanedKey = currentMorseBuffer.replace(/\s+/g, "");
    const activeChar = MORSE_DICT[cleanedKey] || "?";
    
    const baseText = (currentTextOutput === "" || currentTextOutput === "READY") ? "" : currentTextOutput;
    displayText.innerText = baseText + (activeChar === "?" ? "" : activeChar);
  }

  // Interactive Flowchart Highlighting Logic
  function updateFlowchartHighlight(morseStr) {
    // 1. Remove active classes from all nodes and lines
    const activeNodes = document.querySelectorAll(".flowchart-node-group.flowchart-node-active");
    activeNodes.forEach(node => {
      node.classList.remove("flowchart-node-active");
      node.classList.remove("pulse-trigger");
    });

    const activeLines = document.querySelectorAll(".flowchart-line.flowchart-line-active");
    activeLines.forEach(line => line.classList.remove("flowchart-line-active"));
    
    const activeLabels = document.querySelectorAll(".flowchart-branch-label.label-active");
    activeLabels.forEach(label => label.classList.remove("label-active"));

    // If buffer is empty or "Ready", stop
    if (!morseStr || morseStr.trim() === "" || morseStr.trim() === "Ready") {
      return;
    }

    // Clean space separators (e.g. ". - ." becomes ".-.")
    const sequence = morseStr.replace(/\s+/g, "");
    
    // Highlight paths down the tree
    let currentPath = "";
    let prevNodeLetter = "root"; // start at root
    
    // Always highlight the root node
    const rootNode = document.getElementById("flowchart-node-root");
    if (rootNode) rootNode.classList.add("flowchart-node-active");

    for (let i = 0; i < sequence.length; i++) {
      const char = sequence[i]; // '.' or '-'
      currentPath += char;
      
      // Find node by data-morse attribute
      const node = document.querySelector(`.flowchart-node-group[data-morse="${currentPath}"]`);
      if (node) {
        node.classList.add("flowchart-node-active");
        
        // If this is the final node of the sequence, trigger a pulse animation
        if (i === sequence.length - 1) {
          node.classList.remove("pulse-trigger");
          void node.offsetWidth; // Force reflow
          node.classList.add("pulse-trigger");
        }

        // Get node's letter / suffix (e.g. "E", "Placeholder4") from its id
        const nodeSuffix = node.id.replace("flowchart-node-", "");
        
        // Find connection line from prevNodeLetter to nodeSuffix
        const lineId = `flowchart-line-${prevNodeLetter}-${nodeSuffix}`;
        const line = document.getElementById(lineId);
        if (line) {
          line.classList.add("flowchart-line-active");
        }
        
        prevNodeLetter = nodeSuffix;
      } else {
        break;
      }
    }
  }

  function finalizeMorseLetter() {
    if (currentMorseBuffer === "") return;
    
    const cleanedKey = currentMorseBuffer.replace(/\s+/g, "");
    const decodedChar = MORSE_DICT[cleanedKey] || "?";
    
    if (decodedChar !== "?") {
      if (currentTextOutput === "READY" || currentTextOutput === "HELLO") currentTextOutput = "";
      currentTextOutput += decodedChar;
      displayText.innerText = currentTextOutput;
      logTerminal(`Decoded letter: "${currentMorseBuffer}" -> "${decodedChar}"`);
    } else {
      logTerminal(`Decoding failed: Sequence "${currentMorseBuffer}" not mapped.`);
    }
    
    // Clear live buffer and reset flowchart highlight
    currentMorseBuffer = "";
    displayMorse.innerText = "Ready";
    updateFlowchartHighlight(currentMorseBuffer);
  }

  // --- Live Webcam Tracking Mode (MediaPipe) ---
  const btnEnableWebcam = document.getElementById("btn-enable-webcam");
  const btnStopWebcam = document.getElementById("btn-stop-webcam");
  const btnStopWebcamFloating = document.getElementById("btn-stop-webcam-floating");
  const cameraStatusLight = document.getElementById("camera-status-light");
  const cameraStatusText = document.getElementById("camera-status-text");
  
  const webcamPrompt = document.getElementById("webcam-prompt");
  const webcamVideo = document.getElementById("webcam-video");
  const webcamCanvas = document.getElementById("webcam-canvas");
  const webcamCtx = webcamCanvas.getContext("2d");
  
  let cameraInstance = null;
  let faceMeshInstance = null;
  let earThreshold = 0.25;
  let calibrationState = "idle"; // idle, open, closed
  let trackingFpsElement = document.getElementById("tracking-fps");

  // Read saved threshold
  const savedThreshold = localStorage.getItem("blink_threshold");
  if (savedThreshold) {
    earThreshold = parseFloat(savedThreshold);
    document.getElementById("val-threshold").innerText = earThreshold.toFixed(3);
  }

  btnEnableWebcam.addEventListener("click", () => {
    initializeWebcamTracking();
  });

  btnStopWebcam.addEventListener("click", () => {
    stopWebcamTracking();
  });

  if (btnStopWebcamFloating) {
    btnStopWebcamFloating.addEventListener("click", () => {
      stopWebcamTracking();
    });
  }

  function initializeWebcamTracking() {
    logTerminal("Requesting camera permissions...");
    webcamPrompt.innerHTML = "<h4>Connecting to server...</h4><p>Loading face geometry modules.</p>";
    
    faceMeshInstance = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMeshInstance.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    });

    faceMeshInstance.onResults(onFaceMeshResults);

    cameraInstance = new Camera(webcamVideo, {
      onFrame: async () => {
        if (faceMeshInstance) {
          await faceMeshInstance.send({ image: webcamVideo });
        }
      },
      width: 640,
      height: 480
    });

    cameraInstance.start()
      .then(() => {
        webcamPrompt.style.display = "none";
        document.getElementById("cal-controls-row").style.display = "flex";
        if (btnStopWebcamFloating) {
          btnStopWebcamFloating.style.display = "inline-flex";
        }
        cameraStatusLight.className = "status-indicator live";
        cameraStatusText.innerText = "CAMERA ACTIVE";
        logTerminal("Camera connected. MediaPipe mesh initialized.");
      })
      .catch((err) => {
        logTerminal(`Webcam connection failed: ${err.message}`);
        webcamPrompt.innerHTML = "<h4>Webcam Access Denied</h4><p>Please authorize camera access or switch to Simulator Mode.</p>";
      });
  }

  function stopWebcamTracking() {
    logTerminal("Terminating webcam capture stream...");
    
    // Stop MediaPipe camera loop
    if (cameraInstance) {
      cameraInstance.stop();
      cameraInstance = null;
    }
    
    // Stop all video tracks
    if (webcamVideo.srcObject) {
      const stream = webcamVideo.srcObject;
      stream.getTracks().forEach(track => track.stop());
      webcamVideo.srcObject = null;
    }

    // Reset overlay elements
    webcamCtx.clearRect(0, 0, webcamCanvas.width, webcamCanvas.height);
    if (btnStopWebcamFloating) {
      btnStopWebcamFloating.style.display = "none";
    }
    webcamPrompt.style.display = "flex";
    webcamPrompt.innerHTML = `
      <div class="prompt-icon"><i data-lucide="camera"></i></div>
      <h4>Webcam Stopped</h4>
      <p>The webcam stream has been stopped. You can initialize it again below.</p>
      <button class="btn btn-primary magnetic-btn" id="btn-enable-webcam-restart">Restart Webcam</button>
    `;
    
    // Bind click trigger to new dynamic button
    document.getElementById("btn-enable-webcam-restart").addEventListener("click", () => {
      initializeWebcamTracking();
    });

    // Re-initialize Lucide icons inside dynamic prompt
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    document.getElementById("cal-controls-row").style.display = "none";
    cameraStatusLight.className = "status-indicator stopped";
    cameraStatusText.innerText = "CAMERA STOPPED";
    trackingFpsElement.innerText = "FPS: --";
    document.getElementById("val-ear").innerText = "0.000";
    
    logTerminal("Webcam pipeline stopped. Camera hardware turned off.");
  }

  // Compute coordinate distance
  function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }

  let earHistory = [];
  let isEyesClosed = false;
  let lastBlinkTime = 0;
  let frameCount = 0;
  let lastFpsTime = performance.now();

  function onFaceMeshResults(results) {
    // Update FPS
    frameCount++;
    const now = performance.now();
    if (now - lastFpsTime >= 1000) {
      trackingFpsElement.innerText = `FPS: ${frameCount}`;
      frameCount = 0;
      lastFpsTime = now;
    }

    // Set canvas dimensions
    const width = webcamCanvas.width = webcamCanvas.clientWidth;
    const height = webcamCanvas.height = webcamCanvas.clientHeight;
    
    webcamCtx.clearRect(0, 0, width, height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];

      // Draw face landmarks mesh (subtle)
      webcamCtx.fillStyle = "rgba(0, 229, 255, 0.4)";
      landmarks.forEach(pt => {
        webcamCtx.fillRect(pt.x * width, pt.y * height, 1.5, 1.5);
      });

      // Extract left eye vertical/horizontal indices
      const l_159 = landmarks[159];
      const l_145 = landmarks[145];
      const l_33 = landmarks[33];
      const l_133 = landmarks[133];
      const leftEAR = distance(l_159, l_145) / distance(l_33, l_133);

      // Extract right eye vertical/horizontal indices
      const r_386 = landmarks[386];
      const r_374 = landmarks[374];
      const r_263 = landmarks[263];
      const r_362 = landmarks[362];
      const rightEAR = distance(r_386, r_374) / distance(r_263, r_362);

      // Average EAR
      const ear = (leftEAR + rightEAR) / 2;
      document.getElementById("val-ear").innerText = ear.toFixed(3);

      // Highlight eye keypoints on canvas
      webcamCtx.fillStyle = "#FF0055";
      [159, 145, 33, 133, 386, 374, 263, 362].forEach(idx => {
        const pt = landmarks[idx];
        webcamCtx.beginPath();
        webcamCtx.arc(pt.x * width, pt.y * height, 3, 0, Math.PI * 2);
        webcamCtx.fill();
      });

      // Handle thresholds and calibration
      if (calibrationState === "idle") {
        // Run blink detection
        if (ear < earThreshold) {
          if (!isEyesClosed) {
            isEyesClosed = true;
            lastBlinkTime = performance.now();
          }
        } else {
          if (isEyesClosed) {
            isEyesClosed = false;
            const blinkDuration = performance.now() - lastBlinkTime;
            // Ignore tiny micro-fluctuations
            if (blinkDuration > 60) {
              processBlinkSignal(blinkDuration);
            }
          }
        }
      } else {
        // Collect EAR values for calibration
        earHistory.push(ear);
      }
    }
  }

  // Calibration loop routine
  const btnCalibrate = document.getElementById("btn-calibrate");
  const txtCalStatus = document.getElementById("txt-cal-status");

  btnCalibrate.addEventListener("click", () => {
    if (calibrationState !== "idle") return;
    runCalibrationWorkflow();
  });

  function runCalibrationWorkflow() {
    logTerminal("[CALIBRATION] Commenced threshold calibration.");
    let openEyesValues = [];
    let closedEyesValues = [];

    // Stage 1: Measure Open
    calibrationState = "collect_open";
    earHistory = [];
    txtCalStatus.innerText = "Keep eyes wide open...";
    logTerminal("[CALIBRATION] Step 1: Keep eyes open. Measuring...");

    setTimeout(() => {
      openEyesValues = [...earHistory];
      const avgOpen = openEyesValues.reduce((a,b)=>a+b, 0) / openEyesValues.length;
      logTerminal(`[CALIBRATION] Open EAR calculated: ${avgOpen.toFixed(3)}`);

      // Stage 2: Measure Closed
      calibrationState = "collect_closed";
      earHistory = [];
      txtCalStatus.innerText = "Close eyes tightly...";
      logTerminal("[CALIBRATION] Step 2: Keep eyes closed. Measuring...");

      setTimeout(() => {
        closedEyesValues = [...earHistory];
        const avgClosed = closedEyesValues.reduce((a,b)=>a+b, 0) / closedEyesValues.length;
        logTerminal(`[CALIBRATION] Closed EAR calculated: ${avgClosed.toFixed(3)}`);

        // Compute custom threshold
        earThreshold = (avgOpen + avgClosed) / 2;
        // Safety guard checks
        if (isNaN(earThreshold) || earThreshold < 0.05 || earThreshold > 0.4) {
          earThreshold = 0.25;
          logTerminal("[CALIBRATION] Calibration error. Restored default threshold (0.250).");
        } else {
          localStorage.setItem("blink_threshold", earThreshold.toString());
          logTerminal(`[CALIBRATION] Complete. Calculated threshold: ${earThreshold.toFixed(3)}`);
        }

        document.getElementById("val-threshold").innerText = earThreshold.toFixed(3);
        txtCalStatus.innerText = "Calibrated";
        calibrationState = "idle";

        setTimeout(() => {
          txtCalStatus.innerText = "Ready";
        }, 2000);

      }, 3000); // 3 seconds closed

    }, 3000); // 3 seconds open
  }

  // ==========================================================================
  // BlinkMorse Intelligence Metrics & Telemetry Animations
  // ==========================================================================
  const metricsSection = document.getElementById("metrics");
  if (metricsSection) {
    ScrollTrigger.create({
      trigger: "#metrics",
      start: "top 75%",
      onEnter: () => {
        // Animate circular gauges
        const gauges = [
          { selector: "#metric-accuracy", target: 97.67 },
          { selector: "#metric-precision", target: 97.27 },
          { selector: "#metric-recall", target: 98.89 },
          { selector: "#metric-f1", target: 98.07 }
        ];

        gauges.forEach(gauge => {
          const container = document.querySelector(gauge.selector);
          const activeRing = container.querySelector(".gauge-active-ring");
          const counterSpan = container.querySelector(".counter-val");

          // Reset ring
          gsap.set(activeRing, { strokeDashoffset: 660 });

          // Animate Ring (Circumference 660)
          gsap.to(activeRing, {
            strokeDashoffset: 660 - (gauge.target / 100) * 660,
            duration: 2.2,
            ease: "power2.out"
          });

          // Animate Counter
          const tempObj = { val: 0 };
          gsap.to(tempObj, {
            val: gauge.target,
            duration: 2.2,
            ease: "power2.out",
            onUpdate: () => {
              counterSpan.innerText = tempObj.val.toFixed(2);
            },
            onComplete: () => {
              // Scale Pulse animation on completion
              gsap.timeline()
                .to(container, { scale: 1.06, duration: 0.3, ease: "power2.out" })
                .to(container, { scale: 1, duration: 0.3, ease: "power2.in" });
            }
          });
        });

        // Animate ROC-AUC horizontal progress bar
        const rocAucContainer = document.getElementById("metric-roc-auc");
        const progressFill = rocAucContainer.querySelector(".roc-auc-progress-fill");
        const progressVal = rocAucContainer.querySelector(".counter-val-raw");

        gsap.to(progressFill, {
          width: "99.91%",
          duration: 2.2,
          ease: "power2.out"
        });

        const tempObjRaw = { val: 0 };
        gsap.to(tempObjRaw, {
          val: 0.9991,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => {
            progressVal.innerText = tempObjRaw.val.toFixed(4);
          }
        });

        // Animate Dataset Insights counters
        const insightCounters = document.querySelectorAll(".insight-counter");
        insightCounters.forEach(counter => {
          const targetVal = parseFloat(counter.getAttribute("data-target"));
          const tempInsight = { val: 0 };
          gsap.to(tempInsight, {
            val: targetVal,
            duration: 2.0,
            ease: "power2.out",
            onUpdate: () => {
              counter.innerText = Math.floor(tempInsight.val);
            }
          });
        });
      }
    });
  }

  // ==========================================================================
  // Real-Time Processing counters
  // ==========================================================================
  const realTimeSection = document.getElementById("real-time");
  if (realTimeSection) {
    ScrollTrigger.create({
      trigger: "#real-time",
      start: "top 75%",
      onEnter: () => {
        const rtCounters = document.querySelectorAll(".rt-counter");
        rtCounters.forEach(counter => {
          const targetVal = parseFloat(counter.getAttribute("data-target"));
          const tempRt = { val: 0 };
          gsap.to(tempRt, {
            val: targetVal,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              counter.innerText = Math.floor(tempRt.val);
            }
          });
        });
      }
    });
  }

  // ==========================================================================
  // Technology Core Interactive Orbit Network
  // ==========================================================================
  const techCanvas = document.getElementById("tech-network-canvas");
  const techCtx = techCanvas.getContext("2d");
  const techContainer = document.querySelector(".tech-canvas-container");
  const detailsDesc = document.getElementById("tech-details-desc");

  let techWidth = techCanvas.width = techContainer.clientWidth;
  let techHeight = techCanvas.height = techContainer.clientHeight;

  window.addEventListener("resize", () => {
    techWidth = techCanvas.width = techContainer.clientWidth;
    techHeight = techCanvas.height = techContainer.clientHeight;
  });

  const coreNode = document.getElementById("node-core");
  const childNodes = document.querySelectorAll(".child-node");

  // Track hover state
  let isTechHovered = false;
  techContainer.addEventListener("mouseenter", () => isTechHovered = true);
  techContainer.addEventListener("mouseleave", () => {
    isTechHovered = false;
    detailsDesc.innerText = "Hover over any technology node to explore its role in the BlinkMorse system.";
    childNodes.forEach(node => node.classList.remove("highlighted"));
  });

  // Display details on hover
  childNodes.forEach(node => {
    node.addEventListener("mouseenter", () => {
      const desc = node.getAttribute("data-desc");
      detailsDesc.innerText = desc;
      childNodes.forEach(n => n.classList.remove("highlighted"));
      node.classList.add("highlighted");
    });
  });

  // Dynamic connection physics settings
  let targetAngle = 0;
  let currentAngle = 0;
  let nodesData = [];

  // Initialize node math placements
  childNodes.forEach((node, idx) => {
    const angle = (idx / childNodes.length) * Math.PI * 2;
    nodesData.push({
      element: node,
      baseAngle: angle,
      radiusX: 280, // Elliptical horizontal radius
      radiusY: 150, // Elliptical vertical radius
      x: 0,
      y: 0
    });
  });

  // Particle packets traveling along connections
  let dataPackets = [];

  function drawTechnologyNetwork() {
    if (!techCanvas) return;
    techCtx.clearRect(0, 0, techWidth, techHeight);

    // Center coordinates
    const cx = techWidth / 2;
    const cy = techHeight / 2;

    // Rotate core slightly based on mouse
    let localMouseOffset = { x: (mouse.x - window.innerWidth/2) * 0.05, y: (mouse.y - window.innerHeight/2) * 0.05 };

    // Move child HTML elements
    if (!isTechHovered) {
      currentAngle += 0.0015; // Slow orbit rotation
    }

    nodesData.forEach((node) => {
      const totalAngle = node.baseAngle + currentAngle;

      // Calculate 3D elliptical coordinates
      const targetX = cx + Math.cos(totalAngle) * node.radiusX;
      const targetY = cy + Math.sin(totalAngle) * node.radiusY;

      // Elastic follow
      node.x += (targetX - node.x) * 0.1;
      node.y += (targetY - node.y) * 0.1;

      // Position DOM element absolute coords
      node.element.style.left = `${node.x - node.element.clientWidth / 2}px`;
      node.element.style.top = `${node.y - node.element.clientHeight / 2}px`;

      // Render connection lines (colored by node stack category)
      techCtx.beginPath();
      techCtx.moveTo(cx + localMouseOffset.x, cy + localMouseOffset.y);

      // Draw bent quadratic curve path towards node
      const mx = (cx + node.x) / 2 + localMouseOffset.x * 0.5;
      const my = (cy + node.y) / 2 + localMouseOffset.y * 0.5;

      techCtx.quadraticCurveTo(mx, my, node.x, node.y);
      
      techCtx.strokeStyle = node.element.classList.contains("demo-node") 
        ? "rgba(0, 229, 255, 0.18)" 
        : "rgba(255, 255, 255, 0.08)";
        
      techCtx.lineWidth = 1.5;
      techCtx.stroke();

      // Periodically generate data packets
      if (Math.random() < 0.008 && !isTechHovered) {
        dataPackets.push({
          progress: 0,
          node: node,
          speed: 0.01 + Math.random() * 0.015
        });
      }
    });

    // Animate data packets traveling
    dataPackets.forEach((packet, pIdx) => {
      packet.progress += packet.speed;
      if (packet.progress >= 1) {
        dataPackets.splice(pIdx, 1);
        return;
      }

      // Bezier curve calculations matching drawing paths
      const t = packet.progress;
      const nx = packet.node.x;
      const ny = packet.node.y;

      const mx = (cx + nx) / 2 + localMouseOffset.x * 0.5;
      const my = (cy + ny) / 2 + localMouseOffset.y * 0.5;

      // Quadratic bezier equation: B(t) = (1-t)^2*P0 + 2(1-t)*t*P1 + t^2*P2
      const px = Math.pow(1 - t, 2) * (cx + localMouseOffset.x) + 2 * (1 - t) * t * mx + Math.pow(t, 2) * nx;
      const py = Math.pow(1 - t, 2) * (cy + localMouseOffset.y) + 2 * (1 - t) * t * my + Math.pow(t, 2) * ny;

      // Draw packet dot (colored by node stack category)
      techCtx.beginPath();
      techCtx.arc(px, py, 3, 0, Math.PI * 2);
      techCtx.fillStyle = packet.node.element.classList.contains("demo-node") ? "#00E5FF" : "rgba(255, 255, 255, 0.6)";
      techCtx.shadowBlur = 6;
      techCtx.shadowColor = packet.node.element.classList.contains("demo-node") ? "#00E5FF" : "rgba(255, 255, 255, 0.6)";
      techCtx.fill();
      techCtx.shadowBlur = 0;
    });

    requestAnimationFrame(drawTechnologyNetwork);
  }

  // Position core node centered
  if (coreNode) {
    coreNode.style.left = "50%";
    coreNode.style.top = "50%";
    coreNode.style.transform = "translate(-50%, -50%)";
  }

  drawTechnologyNetwork();

  // ==========================================================================
  // R&D Timeline Animation (Scroll Trigger reveal)
  // ==========================================================================
  gsap.from(".timeline-item", {
    scrollTrigger: {
      trigger: ".vertical-timeline",
      start: "top 80%",
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 0.8,
    ease: "power2.out"
  });

});
