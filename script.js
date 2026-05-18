document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // Navbar Mobile 下拉菜单交互
  // =========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      // 切换 active 类，触发 CSS 里的动画
      navMenu.classList.toggle('active');
    });

    // 点击菜单里的任何一个链接后，自动收起菜单
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // =========================================
  // 1. Case Studies 无限循环轮播逻辑
  // =========================================
  const cards = document.querySelectorAll('.project-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-arrow');
  const nextBtn = document.querySelector('.next-arrow');
  
  let currentCardIndex = 0;

  // 核心切换卡片功能
  function showCard(index) {
    // 清除所有的 active 状态
    cards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // 计算真实的索引（实现无限循环：3 的下一个变 0，0 的上一个变 2）
    currentCardIndex = (index + cards.length) % cards.length;

    // 给对应的卡片和圆点加上 active 状态
    cards[currentCardIndex].classList.add('active');
    dots[currentCardIndex].classList.add('active');
  }

  // 点击左右箭头
  if (nextBtn) {
    nextBtn.addEventListener('click', () => showCard(currentCardIndex + 1));
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => showCard(currentCardIndex - 1));
  }

  // 点击小圆点直接跳转
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showCard(index));
  });

  // =========================================
  // 2. 🌟 ASCII Lily Canvas 动画逻辑
  // =========================================
  const container = document.querySelector('.hero-visual');
  const canvas = document.getElementById('asciiCanvas');
  
  // 仅在拥有 .hero-visual 和 canvas 的页面执行（防止在其他页面报错）
  if (container && canvas) {
      const ctx = canvas.getContext('2d');
      const oCanvas = document.createElement('canvas');
      const oCtx = oCanvas.getContext('2d', { willReadFrequently: true });
      
      let width, height, cols, rows;
      let mouse = { x: -1000, y: -1000 };
      let lastMoveTime = 0; 
      
      const GRID_SIZE = 4; // 极致高密度网格
      const ASCII_CHARS = "WMB8&Xx++;::,..    "; 
      const COLOR_FLOWER = { r: 10, g: 10, b: 10 };  
      const COLOR_CYAN = { r: 0, g: 200, b: 255 };
      const COLOR_MAGENTA = { r: 255, g: 0, b: 150 };
      const HOVER_RADIUS = 160; 

      function initAscii() {
          window.addEventListener('resize', handleResize);
          
          // 监听容器内的鼠标移动，并计算相对坐标
          container.addEventListener('mousemove', (e) => {
              const rect = canvas.getBoundingClientRect();
              mouse.x = e.clientX - rect.left;
              mouse.y = e.clientY - rect.top;
              lastMoveTime = Date.now(); 
          });
          
          container.addEventListener('touchmove', (e) => {
              const rect = canvas.getBoundingClientRect();
              mouse.x = e.touches[0].clientX - rect.left;
              mouse.y = e.touches[0].clientY - rect.top;
              lastMoveTime = Date.now(); 
          });

          handleResize();
          animateAscii();
      }

      function handleResize() {
          // 动态读取容器的宽高，防止溢出
          width = Math.max(1, container.clientWidth);
          height = Math.max(1, container.clientHeight);
          
          const dpr = window.devicePixelRatio || 1;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          ctx.scale(dpr, dpr);
          
          cols = Math.max(1, Math.ceil(width / GRID_SIZE));
          rows = Math.max(1, Math.ceil(height / GRID_SIZE));
          oCanvas.width = cols;
          oCanvas.height = rows;
      }

      function renderOrganicLilyToData(time) {
          oCtx.fillStyle = '#000000';
          oCtx.fillRect(0, 0, cols, rows);

          oCtx.save();
          oCtx.scale(1 / GRID_SIZE, 1 / GRID_SIZE);

          const minDim = Math.min(width, height);
          let allPolygons = [];

          const nearScale = minDim * 0.45; 
          let nearX = width * 0.35;
          let nearY = height * 0.65;
          let nearRoll = 0.8; 
          allPolygons.push(...createFlower3D(nearX, nearY, nearScale, nearRoll, 1.0, 0.2, time, 0, 4));
          drawStem(oCtx, width * 0.1, height + 100, nearX, nearY, minDim * 0.012, nearRoll);

          const farScale = minDim * 0.18; 
          let farX = width * 0.75;
          let farY = height * 0.35;
          let farRoll = -0.5; 
          allPolygons.push(...createFlower3D(farX, farY, farScale, farRoll, 0.8, -0.3, time, 1, 3));
          drawStem(oCtx, width * 0.85, height + 100, farX, farY, minDim * 0.006, farRoll);

          allPolygons.sort((a, b) => a.z - b.z);

          for (let poly of allPolygons) {
              if (poly.type === 'petal') {
                  let gradL = oCtx.createLinearGradient(poly.vBaseC.x, poly.vBaseC.y, poly.vTipC.x, poly.vTipC.y);
                  let shadow = poly.pLayer * 15;
                  gradL.addColorStop(0, 'rgba(10, 10, 10, 1)');
                  gradL.addColorStop(0.5, `rgba(${Math.max(0, 50 - shadow)}, ${Math.max(0, 50 - shadow)}, ${Math.max(0, 50 - shadow)}, 1)`);
                  gradL.addColorStop(1, 'rgba(140, 140, 140, 1)');
                  
                  oCtx.fillStyle = gradL;
                  oCtx.beginPath();
                  poly.leftHalf.forEach((v, i) => i === 0 ? oCtx.moveTo(v.x, v.y) : oCtx.lineTo(v.x, v.y));
                  oCtx.fill();

                  let gradR = oCtx.createLinearGradient(poly.vBaseC.x, poly.vBaseC.y, poly.vTipC.x, poly.vTipC.y);
                  gradR.addColorStop(0, 'rgba(30, 30, 30, 1)');
                  gradR.addColorStop(0.5, `rgba(${Math.max(0, 160 - shadow)}, ${Math.max(0, 160 - shadow)}, ${Math.max(0, 160 - shadow)}, 1)`);
                  gradR.addColorStop(1, 'rgba(255, 255, 255, 1)');
                  
                  oCtx.fillStyle = gradR;
                  oCtx.beginPath();
                  poly.rightHalf.forEach((v, i) => i === 0 ? oCtx.moveTo(v.x, v.y) : oCtx.lineTo(v.x, v.y));
                  oCtx.fill();

                  oCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                  oCtx.lineWidth = poly.len * 0.015;
                  oCtx.beginPath();
                  oCtx.moveTo(poly.vBaseC.x, poly.vBaseC.y);
                  oCtx.lineTo(poly.vTipC.x, poly.vTipC.y);
                  oCtx.stroke();

                  oCtx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
                  oCtx.lineWidth = poly.len * 0.01;
                  oCtx.beginPath();
                  poly.outline.forEach((v, i) => i === 0 ? oCtx.moveTo(v.x, v.y) : oCtx.lineTo(v.x, v.y));
                  oCtx.stroke();

              } else if (poly.type === 'stamen') {
                  oCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                  oCtx.lineWidth = poly.size * 0.015;
                  oCtx.beginPath();
                  oCtx.moveTo(poly.vBase.x, poly.vBase.y);
                  oCtx.lineTo(poly.vTip.x, poly.vTip.y);
                  oCtx.stroke();

                  oCtx.fillStyle = 'rgba(255, 255, 255, 1)';
                  oCtx.beginPath();
                  poly.diamond.forEach((v, i) => i === 0 ? oCtx.moveTo(v.x, v.y) : oCtx.lineTo(v.x, v.y));
                  oCtx.closePath();
                  oCtx.fill();
              } else if (poly.type === 'centerHole') {
                  oCtx.fillStyle = 'rgba(5, 5, 5, 1)';
                  oCtx.beginPath();
                  poly.hexagon.forEach((v, i) => i === 0 ? oCtx.moveTo(v.x, v.y) : oCtx.lineTo(v.x, v.y));
                  oCtx.closePath();
                  oCtx.fill();
              }
          }

          oCtx.restore();
          return oCtx.getImageData(0, 0, cols, rows).data;
      }

      function createFlower3D(cx, cy, baseSize, roll, pitch, yaw, time, phase, layerCount) {
          let polygons = [];
          const breathe = Math.sin(time * 1.5 + phase) * 0.08;

          for (let pLayer = 1; pLayer <= layerCount; pLayer++) {
              let layerScale = 1 - (pLayer - 1) * 0.22;
              let len = baseSize * layerScale;
              let wid = len * 0.28;
              let petalCount = 8;
              let layerOffset = (pLayer % 2 === 0) ? (Math.PI / petalCount) : 0;
              let dynamicOpen = pLayer * breathe;

              let phi = 0.15 + (pLayer / layerCount) * 0.8;

              for (let i = 0; i < petalCount; i++) {
                  let theta = (Math.PI * 2 / petalCount) * i + layerOffset + dynamicOpen;

                  let baseW = wid * 0.2;
                  let foldW = wid * 0.9;
                  let tipW = wid * 0.7;
                  let foldY = len * 0.6;
                  let tipY = len;
                  let tipCY = len * 0.92;

                  let proj = (px, py) => {
                      let bend = -0.3; 
                      let t = py / len;
                      let curPhi = phi + t * bend;

                      let lx = px;
                      let ly = -py * Math.cos(curPhi); 
                      let lz = py * Math.sin(curPhi);

                      let dx = lx * Math.cos(theta) - ly * Math.sin(theta);
                      let dy = lx * Math.sin(theta) + ly * Math.cos(theta);
                      let dz = lz;

                      let py_p = dy * Math.cos(pitch) - dz * Math.sin(pitch);
                      let pz_p = dy * Math.sin(pitch) + dz * Math.cos(pitch);
                      let px_y = dx * Math.cos(yaw) + pz_p * Math.sin(yaw);
                      let pz_y = -dx * Math.sin(yaw) + pz_p * Math.cos(yaw);

                      let sx = px_y * Math.cos(roll) - py_p * Math.sin(roll);
                      let sy = px_y * Math.sin(roll) + py_p * Math.cos(roll);

                      return { x: cx + sx, y: cy + sy, z: pz_y };
                  };

                  let vBaseC = proj(0, 0);
                  let vBaseL = proj(-baseW, 0);
                  let vBaseR = proj(baseW, 0);
                  let vFoldL = proj(-foldW, foldY);
                  let vFoldR = proj(foldW, foldY);
                  let vTipL = proj(-tipW, tipY);
                  let vTipR = proj(tipW, tipY);
                  let vTipC = proj(0, tipCY);

                  let zAvg = (vTipC.z + vFoldL.z + vFoldR.z) / 3;

                  polygons.push({
                      type: 'petal', z: zAvg, pLayer, len,
                      vBaseC, vTipC,
                      leftHalf: [vBaseC, vBaseL, vFoldL, vTipL, vTipC],
                      rightHalf: [vBaseC, vTipC, vTipR, vFoldR, vBaseR],
                      outline: [vBaseL, vFoldL, vTipL, vTipR, vFoldR, vBaseR]
                  });
              }
          }

          for (let i = 0; i < 6; i++) {
              let theta = (Math.PI * 2 / 6) * i + time * 0.5;
              let phi = 1.3; 
              let len = baseSize * 0.55;

              let proj = (px, py) => {
                  let lx = px, ly = -py * Math.cos(phi), lz = py * Math.sin(phi);
                  let dx = lx * Math.cos(theta) - ly * Math.sin(theta);
                  let dy = lx * Math.sin(theta) + ly * Math.cos(theta);
                  let dz = lz;
                  let py_p = dy * Math.cos(pitch) - dz * Math.sin(pitch);
                  let pz_p = dy * Math.sin(pitch) + dz * Math.cos(pitch);
                  let px_y = dx * Math.cos(yaw) + pz_p * Math.sin(yaw);
                  let pz_y = -dx * Math.sin(yaw) + pz_p * Math.cos(yaw);
                  let sx = px_y * Math.cos(roll) - py_p * Math.sin(roll);
                  let sy = px_y * Math.sin(roll) + py_p * Math.cos(roll);
                  return { x: cx + sx, y: cy + sy, z: pz_y };
              };

              let vBase = proj(0, 0);
              let vTip = proj(0, len);
              let dSize = baseSize * 0.02;
              polygons.push({
                  type: 'stamen', z: vTip.z + 10, size: baseSize,
                  vBase, vTip,
                  diamond: [proj(-dSize, len), proj(0, len + dSize), proj(dSize, len), proj(0, len - dSize)]
              });
          }

          let projHole = (px, py) => {
              let lx = px, ly = -py, lz = 0; 
              let dx = lx, dy = ly, dz = lz;
              let py_p = dy * Math.cos(pitch) - dz * Math.sin(pitch);
              let pz_p = dy * Math.sin(pitch) + dz * Math.cos(pitch);
              let px_y = dx * Math.cos(yaw) + pz_p * Math.sin(yaw);
              let pz_y = -dx * Math.sin(yaw) + pz_p * Math.cos(yaw);
              let sx = px_y * Math.cos(roll) - py_p * Math.sin(roll);
              let sy = px_y * Math.sin(roll) + py_p * Math.cos(roll);
              return { x: cx + sx, y: cy + sy, z: pz_y };
          };

          let hex = [];
          for (let i=0; i<6; i++) {
              let a = (Math.PI / 3) * i;
              let px = Math.cos(a) * baseSize * 0.15;
              let py = Math.sin(a) * baseSize * 0.15;
              hex.push(projHole(px, py));
          }
          polygons.push({ type: 'centerHole', z: -999, hexagon: hex });

          return polygons;
      }

      function drawStem(ctx, x1, y1, x2, y2, thickness, flowerRoll) {
          let bx = -Math.sin(flowerRoll);
          let by = Math.cos(flowerRoll);
          let dist = Math.hypot(x2 - x1, y2 - y1);
          
          let midX = x2 + bx * dist * 0.25;
          let midY = y2 + by * dist * 0.25;

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; 
          ctx.lineWidth = thickness;
          ctx.lineJoin = 'bevel'; 
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(midX, midY); 
          ctx.lineTo(x2, y2); 
          ctx.stroke();
      }

      function animateAscii() {
          requestAnimationFrame(animateAscii);
          const now = Date.now();
          const time = now * 0.001;
          
          const timeSinceMove = now - lastMoveTime;
          let activeRadius = 0;
          if (timeSinceMove < 100) {
              activeRadius = HOVER_RADIUS;
          } else if (timeSinceMove < 1200) {
              const progress = (timeSinceMove - 100) / 1100;
              activeRadius = HOVER_RADIUS * Math.max(0, 1 - Math.pow(progress, 2)); 
          }

          const imgData = renderOrganicLilyToData(time);

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);

          ctx.font = `bold ${GRID_SIZE + 1}px 'Courier New', monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          ctx.globalCompositeOperation = 'source-over';

          for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                  const idx = (r * cols + c) * 4;
                  let baseBrightness = imgData[idx + 1]; 

                  if (baseBrightness > 5) { 
                      
                      const noise = (Math.random() - 0.5) * 15; 
                      let finalBrightness = Math.max(0, Math.min(255, baseBrightness + noise));

                      const charIndex = Math.floor((finalBrightness / 255) * (ASCII_CHARS.length - 1));
                      let char = ASCII_CHARS[charIndex];
                      if (char === ' ') continue; 
                      
                      let cellX = c * GRID_SIZE + GRID_SIZE/2;
                      let cellY = r * GRID_SIZE + GRID_SIZE/2;

                      let isGlitchHover = false;
                      let rgbOffset = 1.5; 
                      let horizontalTear = 0;

                      if (activeRadius > 0) {
                          const dist = Math.hypot(cellX - mouse.x, cellY - mouse.y);
                          if (dist < activeRadius) {
                              let distRatio = dist / activeRadius; 
                              let hash = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
                              let staticNoise = hash - Math.floor(hash);
                              let dynamicWave = (Math.sin(c * 0.1 - time * 5) + Math.cos(r * 0.1 + time * 5)) * 0.15;
                              
                              if (staticNoise + dynamicWave < 1 - distRatio) {
                                  isGlitchHover = true;
                              }
                          }
                      }

                      if (isGlitchHover) {
                          rgbOffset = 4 + Math.random() * 6; 
                          if (Math.random() < 0.15) {
                              horizontalTear = (Math.random() - 0.5) * 20;
                          }
                          if (Math.random() > 0.6) {
                              const glitchData = "01>\\/X+";
                              char = glitchData[Math.floor(Math.random() * glitchData.length)];
                          }
                      }

                      cellX += horizontalTear;

                      if (isGlitchHover) {
                          ctx.fillStyle = `rgb(${COLOR_CYAN.r}, ${COLOR_CYAN.g}, ${COLOR_CYAN.b})`;
                          ctx.fillText(char, cellX - rgbOffset, cellY);
                          
                          ctx.fillStyle = `rgb(${COLOR_MAGENTA.r}, ${COLOR_MAGENTA.g}, ${COLOR_MAGENTA.b})`;
                          ctx.fillText(char, cellX + rgbOffset, cellY);
                      } else {
                          ctx.fillStyle = `rgb(${COLOR_FLOWER.r}, ${COLOR_FLOWER.g}, ${COLOR_FLOWER.b})`;
                          ctx.fillText(char, cellX, cellY);
                      }
                  }
              }
          }
      }

      // 启动 ASCII 动画
      initAscii();
  }
});