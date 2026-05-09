/* ─────────────────────────────────────────
   STARS
───────────────────────────────────────── */
(function(){
  const c = document.getElementById('stars-canvas');
  const ctx = c.getContext('2d');
  let stars = [];

  function resize(){ c.width = innerWidth; c.height = innerHeight; makeStars(); }

  function makeStars(){
    stars = Array.from({length:180}, ()=>({
      x: Math.random()*c.width,
      y: Math.random()*c.height,
      r: Math.random()*1.4+.3,
      a: Math.random(),
      speed: Math.random()*.008+.003
    }));
  }

  function drawStars(){
    ctx.clearRect(0,0,c.width,c.height);
    stars.forEach(s=>{
      s.a += s.speed;
      ctx.globalAlpha = Math.abs(Math.sin(s.a));
      ctx.fillStyle = '#fce4ec';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resize);
  resize();
  drawStars();
})();

/* ─────────────────────────────────────────
   PETALS
───────────────────────────────────────── */
(function(){
  const colors = ['#f4a7b9','#e8728a','#f7bfcc','#d4a5d8','#f9c74f'];
  for(let i=0;i<28;i++){
    const el = document.createElement('div');
    el.className = 'petal';
    el.style.cssText = `
      left:${Math.random()*100}vw;
      width:${8+Math.random()*10}px;
      height:${10+Math.random()*14}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      opacity:${.5+Math.random()*.4};
      animation-duration:${6+Math.random()*8}s;
      animation-delay:${-Math.random()*10}s;
    `;
    document.body.appendChild(el);
  }
})();

/* ─────────────────────────────────────────
   BALLOONS
───────────────────────────────────────── */
(function(){
  const configs = [
    {color:'#f4a7b9', accent:'#e8728a'},
    {color:'#d4a5d8', accent:'#9c4dcc'},
    {color:'#f9c74f', accent:'#f48c06'},
    {color:'#90cdf4', accent:'#3182ce'},
    {color:'#fce4ec', accent:'#e8728a'},
  ];

  function makeBalloon(){
    const cfg = configs[Math.floor(Math.random()*configs.length)];
    const size = 50 + Math.random()*40;
    const el = document.createElement('div');
    el.className = 'balloon';
    el.style.cssText = `
      left:${5+Math.random()*90}vw;
      animation-duration:${9+Math.random()*8}s;
      animation-delay:${-Math.random()*12}s;
    `;
    el.innerHTML = `
      <svg width="${size}" height="${size*1.4}" viewBox="0 0 60 84" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="32" rx="28" ry="30" fill="${cfg.color}"/>
        <ellipse cx="22" cy="20" rx="7" ry="9" fill="white" opacity=".35"/>
        <polygon points="28,62 32,62 30,72" fill="${cfg.accent}"/>
        <path d="M30 72 Q35 78 30 84 Q25 78 30 72" fill="${cfg.accent}" stroke="${cfg.accent}" stroke-width="1"/>
      </svg>`;
    document.body.appendChild(el);
    setTimeout(()=>{ el.remove(); makeBalloon(); }, (9+Math.random()*8)*1000);
  }

  for(let i=0;i<12;i++) setTimeout(makeBalloon, i*700);
})();

/* ─────────────────────────────────────────
   FIREWORKS
───────────────────────────────────────── */
(function(){
  const c = document.getElementById('fw-canvas');
  const ctx = c.getContext('2d');
  let particles = [];

  function resize(){ c.width = innerWidth; c.height = innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  function explode(x, y){
    const hue = Math.random()*360;
    for(let i=0;i<80;i++){
      const angle = (i/80)*Math.PI*2;
      const speed = 1.5+Math.random()*4.5;
      particles.push({
        x, y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        alpha: 1,
        color: `hsl(${hue+Math.random()*40},90%,70%)`,
        r: 2+Math.random()*2.5,
        decay: .013+Math.random()*.012
      });
    }
  }

  function loop(){
    ctx.clearRect(0,0,c.width,c.height);
    particles.forEach(p=>{
      p.x  += p.vx; p.y  += p.vy;
      p.vy += .07;
      p.vx *= .97; p.vy *= .97;
      p.alpha -= p.decay;
      ctx.globalAlpha = Math.max(p.alpha,0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter(p=>p.alpha>0);
    requestAnimationFrame(loop);
  }
  loop();

  // Auto-fire
  function autoFire(){
    const x = 100+Math.random()*(innerWidth-200);
    const y = 60+Math.random()*(innerHeight*.5);
    explode(x, y);
    // sometimes double
    if(Math.random()>.6){
      setTimeout(()=>explode(x+Math.random()*80-40, y+Math.random()*60-30), 180);
    }
    setTimeout(autoFire, 1400+Math.random()*2000);
  }
  autoFire();
  // Burst on click
  document.addEventListener('click', e=>{
    if(!e.target.closest('#envelope') && !e.target.closest('.letter-paper')){
      explode(e.clientX, e.clientY);
    }
  });
})();

/* ─────────────────────────────────────────
   ENVELOPE OPEN / LETTER MODAL
───────────────────────────────────────── */
(function(){
  const env   = document.getElementById('envelope');
  const modal = document.getElementById('letterModal');
  const close = document.getElementById('closeModal');

  env.addEventListener('click', ()=>{
    env.classList.toggle('open');
    // small delay then show modal
    setTimeout(()=>{ modal.classList.add('active'); }, 700);
    spawnHearts(env);
  });

  close.addEventListener('click', ()=>{
    modal.classList.remove('active');
    env.classList.remove('open');
  });

  modal.addEventListener('click', e=>{
    if(e.target === modal){ modal.classList.remove('active'); env.classList.remove('open'); }
  });
})();

/* ─────────────────────────────────────────
   FLOATING HEARTS on click
───────────────────────────────────────── */
function spawnHearts(origin){
  const rect = origin.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top  + rect.height/2;
  const glyphs = ['💗','💕','🌸','💖','✨','🌷'];
  for(let i=0;i<10;i++){
    const h = document.createElement('div');
    h.className = 'float-heart';
    h.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    h.style.left = (cx + (Math.random()-0.5)*120)+'px';
    h.style.top  = cy+'px';
    h.style.animationDelay = (Math.random()*.4)+'s';
    document.body.appendChild(h);
    setTimeout(()=>h.remove(), 3200);
  }
}

/* Random heart burst on body click anywhere */
document.addEventListener('click', e=>{
  if(e.target.closest('#envelope') || e.target.closest('.letter-paper') || e.target.closest('#closeModal')) return;
  const glyphs = ['💗','💕','🌸','💖','✨'];
  for(let i=0;i<4;i++){
    const h = document.createElement('div');
    h.className = 'float-heart';
    h.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    h.style.left = (e.clientX + (Math.random()-0.5)*60)+'px';
    h.style.top  = e.clientY+'px';
    h.style.animationDelay = (i*.07)+'s';
    document.body.appendChild(h);
    setTimeout(()=>h.remove(), 3000);
  }
});
