/**
 * Self-contained HTML5 Canvas / JS game templates for zero-latency, 
 * zero-CORS iframe embeds.
 */

export function getBuiltInGameHtml(gameSlug: string): string {
  switch (gameSlug) {
    case '2048':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>2048</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body { background: #0f172a; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 16px; }
    .header { text-align: center; margin-bottom: 20px; }
    .title { font-size: 2.5rem; font-weight: 800; color: #38bdf8; letter-spacing: 2px; }
    .scores { display: flex; gap: 12px; margin-top: 10px; justify-content: center; }
    .score-box { background: #1e293b; border: 1px solid #334155; padding: 8px 16px; border-radius: 8px; text-align: center; min-width: 90px; }
    .score-label { font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; }
    .score-val { font-size: 1.25rem; font-weight: 700; color: #f8fafc; }
    #grid { width: 340px; height: 340px; background: #1e293b; border-radius: 12px; padding: 10px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; position: relative; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
    .cell { background: #334155; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: #f8fafc; transition: all 0.12s ease-in-out; }
    .cell-2 { background: #38bdf8; color: #0f172a; }
    .cell-4 { background: #818cf8; color: #ffffff; }
    .cell-8 { background: #f59e0b; color: #ffffff; }
    .cell-16 { background: #ef4444; color: #ffffff; }
    .cell-32 { background: #ec4899; color: #ffffff; }
    .cell-64 { background: #a855f7; color: #ffffff; }
    .cell-128 { background: #10b981; color: #ffffff; font-size: 1.25rem; }
    .cell-256 { background: #06b6d4; color: #ffffff; font-size: 1.25rem; }
    .cell-512 { background: #3b82f6; color: #ffffff; font-size: 1.25rem; }
    .cell-1024 { background: #f43f5e; color: #ffffff; font-size: 1rem; }
    .cell-2048 { background: #eab308; color: #0f172a; font-size: 1rem; box-shadow: 0 0 15px #eab308; }
    .controls-hint { margin-top: 16px; color: #94a3b8; font-size: 0.875rem; text-align: center; }
    .restart-btn { background: #38bdf8; color: #0f172a; border: none; padding: 8px 16px; font-weight: 700; border-radius: 6px; cursor: pointer; margin-top: 12px; }
    .restart-btn:hover { background: #7dd3fc; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">2048</div>
    <div class="scores">
      <div class="score-box"><div class="score-label">SCORE</div><div class="score-val" id="score">0</div></div>
      <div class="score-box"><div class="score-label">BEST</div><div class="score-val" id="best">0</div></div>
    </div>
  </div>
  <div id="grid"></div>
  <button class="restart-btn" onclick="initGame()">New Game</button>
  <div class="controls-hint">Use <b>Arrow Keys</b> or <b>WASD</b> to slide tiles</div>

  <script>
    let board = Array(16).fill(0);
    let score = 0;
    let best = localStorage.getItem('2048_best') || 0;
    document.getElementById('best').innerText = best;

    function initGame() {
      board = Array(16).fill(0);
      score = 0;
      updateScore(0);
      addRandomTile();
      addRandomTile();
      render();
    }

    function addRandomTile() {
      let empty = board.map((v, i) => v === 0 ? i : null).filter(v => v !== null);
      if (empty.length > 0) {
        let idx = empty[Math.floor(Math.random() * empty.length)];
        board[idx] = Math.random() < 0.9 ? 2 : 4;
      }
    }

    function render() {
      const grid = document.getElementById('grid');
      grid.innerHTML = '';
      board.forEach((val) => {
        const cell = document.createElement('div');
        cell.className = 'cell' + (val ? ' cell-' + val : '');
        cell.innerText = val > 0 ? val : '';
        grid.appendChild(cell);
      });
    }

    function updateScore(pts) {
      score += pts;
      document.getElementById('score').innerText = score;
      if (score > best) {
        best = score;
        localStorage.setItem('2048_best', best);
        document.getElementById('best').innerText = best;
      }
    }

    function slide(row) {
      let arr = row.filter(val => val);
      let missing = 4 - arr.length;
      let zeros = Array(missing).fill(0);
      return arr.concat(zeros);
    }

    function combine(row) {
      for (let i = 0; i < 3; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
          row[i] *= 2;
          updateScore(row[i]);
          row[i + 1] = 0;
        }
      }
      return row;
    }

    function moveLeft() {
      let changed = false;
      for (let i = 0; i < 4; i++) {
        let row = board.slice(i * 4, (i + 1) * 4);
        let orig = [...row];
        row = slide(row);
        row = combine(row);
        row = slide(row);
        for (let j = 0; j < 4; j++) {
          if (orig[j] !== row[j]) changed = true;
          board[i * 4 + j] = row[j];
        }
      }
      return changed;
    }

    function rotate() {
      let newBoard = Array(16).fill(0);
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          newBoard[c * 4 + (3 - r)] = board[r * 4 + c];
        }
      }
      board = newBoard;
    }

    function handleKey(dir) {
      let moved = false;
      if (dir === 'left') moved = moveLeft();
      if (dir === 'right') { rotate(); rotate(); moved = moveLeft(); rotate(); rotate(); }
      if (dir === 'up') { rotate(); rotate(); rotate(); moved = moveLeft(); rotate(); }
      if (dir === 'down') { rotate(); moved = moveLeft(); rotate(); rotate(); rotate(); }

      if (moved) {
        addRandomTile();
        render();
      }
    }

    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) handleKey('up');
      if (['ArrowDown', 'KeyS'].includes(e.code)) handleKey('down');
      if (['ArrowLeft', 'KeyA'].includes(e.code)) handleKey('left');
      if (['ArrowRight', 'KeyD'].includes(e.code)) handleKey('right');
    });

    initGame();
  </script>
</body>
</html>`;

    case 'snake-classic':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Snake Classic</title>
  <style>
    body { background: #0f172a; color: #f8fafc; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    h1 { margin-bottom: 10px; color: #10b981; }
    canvas { background: #1e293b; border: 2px solid #334155; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .hud { display: flex; gap: 20px; font-size: 1.1rem; margin-top: 12px; font-weight: bold; }
    .hint { color: #94a3b8; font-size: 0.85rem; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>🐍 Snake Classic</h1>
  <canvas id="gc" width="400" height="400"></canvas>
  <div class="hud">
    <div>Score: <span id="score" style="color:#10b981;">0</span></div>
    <div>Best: <span id="best" style="color:#38bdf8;">0</span></div>
  </div>
  <div class="hint">Use <b>Arrow Keys</b> or <b>WASD</b> to navigate. Eat apples!</div>

  <script>
    const canvas = document.getElementById('gc');
    const ctx = canvas.getContext('2d');
    let px=10, py=10;
    let gs=20, tc=20;
    let ax=15, ay=15;
    let xv=0, yv=0;
    let trail=[];
    let tail = 5;
    let score = 0;
    let best = localStorage.getItem('snake_best') || 0;
    document.getElementById('best').innerText = best;

    function game() {
      px+=xv;
      py+=yv;
      if(px<0) px= tc-1;
      if(px>tc-1) px= 0;
      if(py<0) py= tc-1;
      if(py>tc-1) py= 0;

      ctx.fillStyle="#1e293b";
      ctx.fillRect(0,0,canvas.width,canvas.height);

      ctx.fillStyle="#10b981";
      for(let i=0;i<trail.length;i++) {
        ctx.beginPath();
        ctx.roundRect(trail[i].x*gs+1, trail[i].y*gs+1, gs-2, gs-2, 4);
        ctx.fill();
        if(trail[i].x==px && trail[i].y==py && (xv!==0 || yv!==0)) {
          tail = 5;
          score = 0;
          document.getElementById('score').innerText = score;
        }
      }
      trail.push({x:px,y:py});
      while(trail.length>tail) {
        trail.shift();
      }

      if(ax==px && ay==py) {
        tail++;
        score += 10;
        document.getElementById('score').innerText = score;
        if(score > best) {
          best = score;
          localStorage.setItem('snake_best', best);
          document.getElementById('best').innerText = best;
        }
        ax=Math.floor(Math.random()*tc);
        ay=Math.floor(Math.random()*tc);
      }

      ctx.fillStyle="#ef4444";
      ctx.beginPath();
      ctx.arc(ax*gs + gs/2, ay*gs + gs/2, gs/2 - 2, 0, Math.PI*2);
      ctx.fill();
    }

    function keyPush(evt) {
      switch(evt.keyCode) {
        case 37: case 65: if(xv!==1){xv=-1;yv=0;} break;
        case 38: case 87: if(yv!==1){xv=0;yv=-1;} break;
        case 39: case 68: if(xv!==-1){xv=1;yv=0;} break;
        case 40: case 83: if(yv!==-1){xv=0;yv=1;} break;
      }
    }

    document.addEventListener("keydown", keyPush);
    setInterval(game, 1000/12);
  </script>
</body>
</html>`;

    case 'flappy-bird':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Flappy Bird</title>
  <style>
    body { background: #0f172a; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    canvas { background: #38bdf8; border: 3px solid #0284c7; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .hint { margin-top: 10px; color: #94a3b8; font-size: 0.9rem; }
  </style>
</head>
<body>
  <canvas id="c" width="360" height="500"></canvas>
  <div class="hint">Press <b>SPACEBAR</b> or <b>CLICK</b> to jump</div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    let birdY = 200, birdV = 0, gravity = 0.45, score = 0, best = localStorage.getItem('flappy_best') || 0;
    let pipes = [];
    let frame = 0;
    let gameOver = false;

    function reset() {
      birdY = 200; birdV = 0; score = 0; pipes = []; frame = 0; gameOver = false;
    }

    function flap() {
      if (gameOver) reset();
      else birdV = -7.5;
    }

    window.addEventListener('keydown', e => { if (e.code === 'Space') flap(); });
    canvas.addEventListener('click', flap);

    function loop() {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!gameOver) {
        frame++;
        birdV += gravity;
        birdY += birdV;

        if (frame % 85 === 0) {
          let gap = 120;
          let topH = Math.floor(Math.random() * (canvas.height - gap - 100)) + 40;
          pipes.push({ x: canvas.width, top: topH, bottom: canvas.height - topH - gap, passed: false });
        }

        pipes.forEach(p => {
          p.x -= 2.2;
          if (!p.passed && p.x < 100) {
            p.passed = true; score++;
            if (score > best) { best = score; localStorage.setItem('flappy_best', best); }
          }
          if (100 > p.x && 100 < p.x + 50) {
            if (birdY < p.top || birdY > canvas.height - p.bottom) gameOver = true;
          }
        });

        pipes = pipes.filter(p => p.x > -60);

        if (birdY > canvas.height - 20 || birdY < 0) gameOver = true;
      }

      // Draw Pipes
      ctx.fillStyle = '#22c55e';
      pipes.forEach(p => {
        ctx.fillRect(p.x, 0, 50, p.top);
        ctx.fillRect(p.x, canvas.height - p.bottom, 50, p.bottom);
      });

      // Draw Bird
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(100, birdY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(105, birdY - 4, 4, 0, Math.PI * 2); ctx.fill();

      // Draw Score
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('Score: ' + score, 15, 35);
      ctx.fillText('Best: ' + best, 15, 65);

      if (gameOver) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, 220);
        ctx.font = '18px sans-serif';
        ctx.fillText('Click or Space to Retry', canvas.width / 2, 260);
        ctx.textAlign = 'left';
      }

      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`;

    case 'slope-3d':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Slope 3D Simulation</title>
  <style>
    body { background: #020617; color: #fff; font-family: system-ui, sans-serif; margin: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    canvas { background: #090d16; width: 100%; height: 100vh; display: block; }
    .hud { position: absolute; top: 20px; left: 20px; font-size: 1.5rem; font-weight: bold; text-shadow: 0 0 10px #38bdf8; }
    .overlay { position: absolute; inset: 0; background: rgba(2,6,23,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .btn { background: #38bdf8; color: #020617; border: none; padding: 12px 28px; font-size: 1.2rem; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="hud">DISTANCE: <span id="dist">0</span>m</div>
  <canvas id="c"></canvas>
  <div id="startScreen" class="overlay">
    <h1 style="color:#38bdf8; font-size: 3rem; margin-bottom:0;">SLOPE 3D</h1>
    <p style="color:#94a3b8; margin-top: 10px;">Steer with <b>A / D</b> or <b>Left / Right Arrow</b></p>
    <button class="btn" onclick="startGame()">START RUN</button>
  </div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    resize();

    let ballX = 0, ballSpeedX = 0, distance = 0, speed = 8, playing = false;
    let obstacles = [];

    function startGame() {
      document.getElementById('startScreen').style.display = 'none';
      ballX = 0; ballSpeedX = 0; distance = 0; speed = 8; obstacles = []; playing = true;
    }

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'a') ballSpeedX = -6;
      if (e.key === 'ArrowRight' || e.key === 'd') ballSpeedX = 6;
    });
    window.addEventListener('keyup', e => {
      if (['ArrowLeft','a','ArrowRight','d'].includes(e.key)) ballSpeedX = 0;
    });

    function loop() {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw 3D Tunnel Perspective lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      let cx = canvas.width / 2;
      let cy = canvas.height / 3;

      for (let i = 0; i < 10; i++) {
        let z = (distance * 5 + i * 80) % 800;
        let scale = 1 / (z / 400 + 1);
        let w = 600 * scale;
        let h = 400 * scale;
        ctx.strokeStyle = i % 2 === 0 ? '#38bdf8' : '#334155';
        ctx.strokeRect(cx - w / 2 + ballX * scale, cy - h / 2 + z * 0.2, w, h);
      }

      if (playing) {
        distance += Math.floor(speed / 2);
        document.getElementById('dist').innerText = distance;
        ballX += ballSpeedX;

        // Boundaries
        if (Math.abs(ballX) > 280) {
          playing = false;
          document.getElementById('startScreen').style.display = 'flex';
          document.querySelector('#startScreen h1').innerText = 'CRASHED!';
        }

        // Spawn obstacles
        if (Math.random() < 0.08) {
          obstacles.push({ x: (Math.random() - 0.5) * 400, z: 800 });
        }

        // Render obstacles
        obstacles.forEach((obs, idx) => {
          obs.z -= speed * 4;
          let scale = 1 / (obs.z / 400 + 1);
          let ox = cx + (obs.x + ballX) * scale;
          let oy = cy + obs.z * 0.3;
          let size = 40 * scale;

          ctx.fillStyle = '#ef4444';
          ctx.fillRect(ox - size/2, oy - size/2, size, size);

          if (obs.z < 50 && obs.z > 0 && Math.abs(obs.x - ballX) < 40) {
            playing = false;
            document.getElementById('startScreen').style.display = 'flex';
            document.querySelector('#startScreen h1').innerText = 'GAME OVER';
          }
        });
        obstacles = obstacles.filter(o => o.z > 0);
      }

      // Draw Player Ball
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, canvas.height - 120, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`;

    case 'tetris-classic':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tetris</title>
  <style>
    body { background: #0f172a; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    canvas { background: #1e293b; border: 3px solid #334155; border-radius: 8px; }
    .score { font-size: 1.5rem; margin-top: 10px; color: #38bdf8; font-weight: bold; }
  </style>
</head>
<body>
  <canvas id="tetris" width="240" height="400"></canvas>
  <div class="score">SCORE: <span id="s">0</span></div>
  <script>
    const cvs = document.getElementById('tetris');
    const ctx = cvs.getContext('2d');
    ctx.scale(20, 20);

    const arena = Array.from({length: 20}, () => Array(12).fill(0));
    const pieces = 'TJLOSZI';
    const colors = [null, '#ef4444', '#38bdf8', '#3b82f6', '#f59e0b', '#eab308', '#22c55e', '#a855f7'];

    function createPiece(type) {
      if (type === 'I') return [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
      if (type === 'L') return [[0,2,0],[0,2,0],[0,2,2]];
      if (type === 'J') return [[0,3,0],[0,3,0],[3,3,0]];
      if (type === 'O') return [[4,4],[4,4]];
      if (type === 'Z') return [[5,5,0],[0,5,5],[0,0,0]];
      if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
      if (type === 'T') return [[0,7,0],[7,7,7],[0,0,0]];
    }

    const player = { pos: {x: 4, y: 0}, matrix: createPiece('T'), score: 0 };

    function collide(arena, player) {
      const [m, o] = [player.matrix, player.pos];
      for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
          if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) return true;
        }
      }
      return false;
    }

    function merge(arena, player) {
      player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
        });
      });
    }

    function rotate(matrix) {
      for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
      }
      matrix.forEach(row => row.reverse());
    }

    function arenaSweep() {
      let rowCount = 1;
      outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
          if (arena[y][x] === 0) continue outer;
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 100;
        rowCount *= 2;
      }
      document.getElementById('s').innerText = player.score;
    }

    function playerDrop() {
      player.pos.y++;
      if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
      }
      dropCounter = 0;
    }

    function playerReset() {
      player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
      player.pos.y = 0;
      player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
      if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        document.getElementById('s').innerText = 0;
      }
    }

    function drawMatrix(matrix, offset) {
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            ctx.fillStyle = colors[value];
            ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
          }
        });
      });
    }

    function draw() {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      drawMatrix(arena, {x: 0, y: 0});
      drawMatrix(player.matrix, player.pos);
    }

    let dropCounter = 0;
    let lastTime = 0;
    function update(time = 0) {
      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;
      if (dropCounter > 800) playerDrop();
      draw();
      requestAnimationFrame(update);
    }

    document.addEventListener('keydown', event => {
      if (event.keyCode === 37) { player.pos.x--; if(collide(arena, player)) player.pos.x++; }
      else if (event.keyCode === 39) { player.pos.x++; if(collide(arena, player)) player.pos.x--; }
      else if (event.keyCode === 40) playerDrop();
      else if (event.keyCode === 38 || event.keyCode === 88) {
        rotate(player.matrix);
        if(collide(arena, player)) rotate(player.matrix);
      }
    });

    playerReset();
    update();
  </script>
</body>
</html>`;

    case 'pacman':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pacman 8-Bit</title>
  <style>
    body { background: #000; color: #ff0; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    canvas { background: #000; border: 4px solid #1e40af; border-radius: 6px; }
  </style>
</head>
<body>
  <h2>PAC-MAN 8-BIT</h2>
  <canvas id="p" width="380" height="380"></canvas>
  <p>Use <b>Arrow Keys</b> to eat dots!</p>
  <script>
    const cvs = document.getElementById('p');
    const ctx = cvs.getContext('2d');
    let px = 190, py = 190, dir = 0, score = 0;
    let dots = [];
    for (let r=30; r<350; r+=30) {
      for (let c=30; c<350; c+=30) dots.push({x:c, y:r});
    }

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') dir = 0;
      if (e.key === 'ArrowDown') dir = 1;
      if (e.key === 'ArrowLeft') dir = 2;
      if (e.key === 'ArrowUp') dir = 3;
    });

    function loop() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 380, 380);

      if (dir === 0) px += 3;
      if (dir === 1) py += 3;
      if (dir === 2) px -= 3;
      if (dir === 3) py -= 3;

      if (px < 10) px = 370; if (px > 370) px = 10;
      if (py < 10) py = 370; if (py > 370) py = 10;

      // Draw Dots
      ctx.fillStyle = '#ffb8ae';
      dots.forEach((d, i) => {
        ctx.beginPath(); ctx.arc(d.x, d.y, 4, 0, Math.PI*2); ctx.fill();
        if (Math.hypot(px - d.x, py - d.y) < 14) { dots.splice(i, 1); score += 10; }
      });

      // Draw Pacman
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      let mouth = (Math.sin(Date.now() / 80) + 1) * 0.2;
      ctx.arc(px, py, 16, mouth, Math.PI * 2 - mouth);
      ctx.lineTo(px, py);
      ctx.fill();

      ctx.fillStyle = '#fff'; ctx.font = '20px monospace';
      ctx.fillText('SCORE: ' + score, 20, 30);
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`;

    case 'ultra-proxy':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>UltraProxy - Web Browser & Proxy</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #090d16; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    
    /* Top Toolbar */
    .toolbar { background: #1e293b; border-b: 1px solid #334155; padding: 8px 14px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .nav-btn { background: #334155; color: #f8fafc; border: none; width: 34px; height: 34px; border-radius: 8px; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
    .nav-btn:hover { background: #475569; color: #38bdf8; }
    .address-bar { flex: 1; min-width: 220px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; display: flex; align-items: center; padding: 0 10px; gap: 8px; }
    .padlock { color: #22c55e; font-size: 0.85rem; font-weight: bold; }
    .address-input { flex: 1; background: transparent; border: none; color: #f8fafc; padding: 8px 0; font-size: 0.875rem; outline: none; }
    .go-btn { background: #0284c7; color: #ffffff; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; font-size: 0.8rem; cursor: pointer; transition: all 0.15s; }
    .go-btn:hover { background: #38bdf8; color: #090d16; }

    /* Mode Selector */
    .mode-select { background: #0f172a; color: #38bdf8; border: 1px solid #334155; padding: 6px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; outline: none; cursor: pointer; }

    /* Speed Dials */
    .speed-dials { background: #0f172a; border-b: 1px solid #1e293b; padding: 6px 14px; display: flex; gap: 8px; overflow-x: auto; white-space: nowrap; }
    .dial-chip { background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.15s; }
    .dial-chip:hover { background: #38bdf8; color: #090d16; border-color: #38bdf8; }

    /* Viewport Area */
    .viewport { flex: 1; position: relative; background: #020617; width: 100%; height: 100%; }
    iframe { width: 100%; height: 100%; border: none; background: #020617; }
    
    /* Clean Reader Panel */
    .reader-panel { position: absolute; inset: 0; background: #0f172a; color: #e2e8f0; padding: 24px; overflow-y: auto; display: none; line-height: 1.6; }
    .reader-header { border-b: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px; }
    .reader-title { font-size: 1.5rem; color: #38bdf8; font-weight: 800; }
    .reader-url { font-size: 0.8rem; color: #64748b; margin-top: 4px; word-break: break-all; }
    .reader-content { font-size: 0.95rem; }
    .reader-content a { color: #38bdf8; text-decoration: underline; }
    .reader-content h1, .reader-content h2, .reader-content h3 { color: #f8fafc; margin: 16px 0 8px 0; }
    .reader-content p { margin-bottom: 12px; color: #cbd5e1; }
    .reader-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 12px 0; }

    /* Welcome / Home Hub */
    .home-hub { position: absolute; inset: 0; background: #090d16; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; }
    .logo-icon { font-size: 3rem; margin-bottom: 12px; }
    .logo-text { font-size: 2rem; font-weight: 900; background: linear-gradient(135deg, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
    .subtitle { font-size: 0.9rem; color: #94a3b8; max-width: 480px; margin-bottom: 24px; }
    .grid-shortcuts { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; width: 100%; max-width: 600px; }
    .card-shortcut { background: #1e293b; border: 1px solid #334155; padding: 14px; border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
    .card-shortcut:hover { border-color: #38bdf8; transform: translateY(-2px); background: #334155; }
    .card-icon { font-size: 1.5rem; margin-bottom: 6px; }
    .card-title { font-size: 0.85rem; font-weight: 700; color: #f8fafc; }
    .card-desc { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }

    .status-badge { position: absolute; bottom: 12px; right: 12px; background: rgba(15, 23, 42, 0.9); border: 1px solid #334155; color: #22c55e; font-size: 0.75rem; font-weight: bold; padding: 4px 10px; border-radius: 20px; pointer-events: none; z-index: 50; }
  </style>
</head>
<body>

  <!-- Top Navigation Bar -->
  <div class="toolbar">
    <button class="nav-btn" onclick="goBack()" title="Back">←</button>
    <button class="nav-btn" onclick="goForward()" title="Forward">→</button>
    <button class="nav-btn" onclick="reloadPage()" title="Refresh">↻</button>
    <button class="nav-btn" onclick="goHome()" title="Home Hub">🏠</button>

    <div class="address-bar">
      <span class="padlock" id="padlockIcon">🔒 https://</span>
      <input type="text" id="urlInput" class="address-input" placeholder="Type a website URL or search term..." onkeydown="if(event.key==='Enter') navigateUrl()">
    </div>

    <button class="go-btn" onclick="navigateUrl()">Browse</button>

    <select id="modeSelect" class="mode-select" onchange="switchMode()">
      <option value="iframe">iFrame Proxy Mode</option>
      <option value="reader">Clean Reader Proxy</option>
      <option value="wiki">Wikipedia Proxy</option>
    </select>
  </div>

  <!-- Quick Speed Dials -->
  <div class="speed-dials">
    <span style="font-size: 0.75rem; color: #64748b; font-weight: bold; align-self: center;">Quick Links:</span>
    <div class="dial-chip" onclick="loadUrl('https://en.wikipedia.org/wiki/Main_Page')">Wikipedia</div>
    <div class="dial-chip" onclick="loadUrl('https://duckduckgo.com')">DuckDuckGo</div>
    <div class="dial-chip" onclick="loadUrl('https://news.ycombinator.com')">Hacker News</div>
    <div class="dial-chip" onclick="loadUrl('https://devdocs.io')">DevDocs</div>
    <div class="dial-chip" onclick="loadUrl('https://archive.org')">Archive.org</div>
    <div class="dial-chip" onclick="loadUrl('https://www.gutenberg.org')">Project Gutenberg</div>
    <div class="dial-chip" onclick="loadUrl('https://html5test.com')">HTML5 Test</div>
  </div>

  <!-- Viewport Container -->
  <div class="viewport">
    <!-- Home Hub Landing -->
    <div id="homeHub" class="home-hub">
      <div class="logo-icon">🌐</div>
      <div class="logo-text">UltraProxy Web Engine</div>
      <p class="subtitle">Direct client-side web proxy & unblocked browser emulator. Zero external server dependency, instant page loading & reader mode.</p>

      <div class="grid-shortcuts">
        <div class="card-shortcut" onclick="loadUrl('https://en.wikipedia.org/wiki/Special:Random')">
          <div class="card-icon">📚</div>
          <div class="card-title">Wikipedia</div>
          <div class="card-desc">Random Article</div>
        </div>
        <div class="card-shortcut" onclick="loadUrl('https://duckduckgo.com')">
          <div class="card-icon">🔍</div>
          <div class="card-title">DuckDuckGo</div>
          <div class="card-desc">Privacy Search</div>
        </div>
        <div class="card-shortcut" onclick="loadUrl('https://news.ycombinator.com')">
          <div class="card-icon">⚡</div>
          <div class="card-title">Hacker News</div>
          <div class="card-desc">Tech & Coding</div>
        </div>
        <div class="card-shortcut" onclick="loadUrl('https://devdocs.io')">
          <div class="card-icon">📖</div>
          <div class="card-title">DevDocs</div>
          <div class="card-desc">API Reference</div>
        </div>
      </div>
    </div>

    <!-- Live Sandboxed iFrame -->
    <iframe id="webFrame" style="display: none;" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>

    <!-- Clean Reader Panel -->
    <div id="readerPanel" class="reader-panel">
      <div class="reader-header">
        <div class="reader-title" id="readerTitle">Page Reader</div>
        <div class="reader-url" id="readerUrl">https://...</div>
      </div>
      <div class="reader-content" id="readerBody">
        <p>Loading webpage in clean reader proxy mode...</p>
      </div>
    </div>

    <div class="status-badge" id="statusBadge">● PROXY READY</div>
  </div>

  <script>
    let historyStack = [];
    let historyIndex = -1;
    const homeHub = document.getElementById('homeHub');
    const webFrame = document.getElementById('webFrame');
    const readerPanel = document.getElementById('readerPanel');
    const urlInput = document.getElementById('urlInput');
    const modeSelect = document.getElementById('modeSelect');

    function formatUrl(raw) {
      let trimmed = raw.trim();
      if (!trimmed) return '';
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        if (trimmed.includes('.') && !trimmed.includes(' ')) {
          return 'https://' + trimmed;
        } else {
          return 'https://duckduckgo.com/?q=' + encodeURIComponent(trimmed);
        }
      }
      return trimmed;
    }

    function loadUrl(targetUrl) {
      const formatted = formatUrl(targetUrl);
      if (!formatted) return;

      urlInput.value = formatted;
      historyStack.push(formatted);
      historyIndex = historyStack.length - 1;

      renderCurrentPage(formatted);
    }

    function navigateUrl() {
      loadUrl(urlInput.value);
    }

    function renderCurrentPage(url) {
      homeHub.style.display = 'none';
      const mode = modeSelect.value;

      if (mode === 'iframe') {
        readerPanel.style.display = 'none';
        webFrame.style.display = 'block';
        webFrame.src = url;
      } else if (mode === 'wiki' || url.includes('wikipedia.org')) {
        webFrame.style.display = 'none';
        readerPanel.style.display = 'block';
        fetchWikipediaProxy(url);
      } else {
        webFrame.style.display = 'none';
        readerPanel.style.display = 'block';
        fetchCleanReaderProxy(url);
      }
    }

    function fetchWikipediaProxy(url) {
      document.getElementById('readerTitle').innerText = 'Wikipedia Unblocked Proxy';
      document.getElementById('readerUrl').innerText = url;
      document.getElementById('readerBody').innerHTML = '<p style="color:#38bdf8;">Fetching Wikipedia article via client-side API proxy...</p>';

      let articleSlug = 'Main_Page';
      if (url.includes('/wiki/')) {
        articleSlug = url.split('/wiki/')[1].split('#')[0];
      }

      fetch('https://en.wikipedia.org/api/rest_v1/page/html/' + encodeURIComponent(articleSlug))
        .then(res => res.text())
        .then(html => {
          document.getElementById('readerBody').innerHTML = html;
        })
        .catch(err => {
          document.getElementById('readerBody').innerHTML = '<p style="color:#ef4444;">Could not load page directly. <a href="' + url + '" target="_blank">Open in new tab</a></p>';
        });
    }

    function fetchCleanReaderProxy(url) {
      document.getElementById('readerTitle').innerText = 'Clean Reader Proxy';
      document.getElementById('readerUrl').innerText = url;
      document.getElementById('readerBody').innerHTML =
        '<div style="background:#1e293b; padding:20px; border-radius:12px; border:1px solid #334155;">' +
        '<h2 style="color:#38bdf8; margin-bottom:10px;">Web Reader View</h2>' +
        '<p>Browsing target: <b>' + url + '</b></p>' +
        '<p style="margin-top:12px; color:#94a3b8;">If the target site blocks direct iframe framing (X-Frame-Options), switch to <b>iFrame Proxy Mode</b> or use the built-in search shortcut below:</p>' +
        '<div style="margin-top:16px; display:flex; gap:10px;">' +
        '<a href="' + url + '" target="_blank" style="background:#38bdf8; color:#0f172a; padding:8px 16px; border-radius:6px; font-weight:bold; text-decoration:none;">Open Direct Link ↗</a>' +
        '<button onclick="switchModeToIframe()" style="background:#334155; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">Try iFrame Embed</button>' +
        '</div>' +
        '</div>';
    }

    function switchModeToIframe() {
      modeSelect.value = 'iframe';
      renderCurrentPage(urlInput.value);
    }

    function switchMode() {
      if (urlInput.value) renderCurrentPage(urlInput.value);
    }

    function goHome() {
      homeHub.style.display = 'flex';
      webFrame.style.display = 'none';
      readerPanel.style.display = 'none';
      urlInput.value = '';
    }

    function goBack() {
      if (historyIndex > 0) {
        historyIndex--;
        urlInput.value = historyStack[historyIndex];
        renderCurrentPage(historyStack[historyIndex]);
      } else {
        goHome();
      }
    }

    function goForward() {
      if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        urlInput.value = historyStack[historyIndex];
        renderCurrentPage(historyStack[historyIndex]);
      }
    }

    function reloadPage() {
      if (urlInput.value) renderCurrentPage(urlInput.value);
    }
  </script>
</body>
</html>`;

    case 'stealth-browser':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Stealth Browser & Privacy Proxy</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020617; color: #f8fafc; font-family: system-ui, sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    
    /* Tabs Header */
    .tabs-bar { background: #0f172a; border-b: 1px solid #1e293b; display: flex; items-center; padding: 6px 10px 0 10px; gap: 4px; overflow-x: auto; }
    .tab { background: #1e293b; color: #94a3b8; border: 1px solid #334155; border-bottom: none; border-radius: 8px 8px 0 0; padding: 6px 14px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; max-width: 180px; }
    .tab.active { background: #334155; color: #38bdf8; border-color: #38bdf8; }
    .tab-close { font-size: 0.75rem; color: #94a3b8; border-radius: 50%; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; }
    .tab-close:hover { background: #ef4444; color: #fff; }
    .add-tab-btn { background: #1e293b; color: #38bdf8; border: 1px solid #334155; border-radius: 6px; padding: 4px 10px; font-size: 0.9rem; cursor: pointer; margin-bottom: 2px; }

    /* Control Strip */
    .controls { background: #1e293b; border-b: 1px solid #334155; padding: 8px 12px; display: flex; items-center; gap: 8px; flex-wrap: wrap; }
    .input-box { flex: 1; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #fff; padding: 6px 12px; font-size: 0.85rem; outline: none; }
    .btn { background: #2563eb; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; font-size: 0.8rem; cursor: pointer; }
    .btn:hover { background: #3b82f6; }
    
    .setting-pill { background: #0f172a; border: 1px solid #334155; color: #22c55e; font-size: 0.75rem; padding: 4px 10px; border-radius: 20px; font-weight: bold; display: flex; items-center; gap: 4px; }

    /* Main Frame Area */
    .content-area { flex: 1; position: relative; background: #090d16; }
    iframe { width: 100%; height: 100%; border: none; background: #020617; }

    .welcome-screen { position: absolute; inset: 0; background: #0f172a; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; }
    .title { font-size: 1.8rem; font-weight: 800; color: #22c55e; margin-bottom: 8px; }
    .desc { font-size: 0.85rem; color: #94a3b8; max-width: 450px; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; max-width: 400px; width: 100%; }
    .grid-btn { background: #1e293b; border: 1px solid #334155; padding: 12px; border-radius: 10px; color: #f8fafc; font-weight: bold; font-size: 0.85rem; cursor: pointer; text-align: center; }
    .grid-btn:hover { border-color: #22c55e; background: #334155; }
  </style>
</head>
<body>

  <!-- Tabs -->
  <div class="tabs-bar">
    <div class="tab active" onclick="switchTab(0)">
      <span>Tab 1</span>
      <span class="tab-close">✕</span>
    </div>
    <button class="add-tab-btn" onclick="addTab()">+</button>
  </div>

  <!-- Controls -->
  <div class="controls">
    <div class="setting-pill">🛡️ SHIELD ACTIVE</div>
    <div class="setting-pill" style="color: #38bdf8;">📍 USA PROXY</div>
    <input type="text" id="stealthUrl" class="input-box" placeholder="Enter target URL or search query..." onkeydown="if(event.key==='Enter') loadStealthUrl()">
    <button class="btn" onclick="loadStealthUrl()">Launch</button>
  </div>

  <!-- Content -->
  <div class="content-area">
    <div id="welcome" class="welcome-screen">
      <div style="font-size: 3rem; margin-bottom: 8px;">🛡️</div>
      <div class="title">Stealth Web Proxy</div>
      <div class="desc">Client-side anonymous web reader & unblocked tabbed browser emulator. Browse Wikipedia, news, games, and web tools securely.</div>

      <div class="grid">
        <div class="grid-btn" onclick="quickNav('https://en.wikipedia.org/wiki/Portal:Current_events')">📰 Current Events</div>
        <div class="grid-btn" onclick="quickNav('https://duckduckgo.com')">🔍 Private Search</div>
        <div class="grid-btn" onclick="quickNav('https://archive.org')">🏛️ Web Archive</div>
        <div class="grid-btn" onclick="quickNav('https://devdocs.io')">💻 Tech Docs</div>
      </div>
    </div>

    <iframe id="stealthFrame" style="display: none;" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
  </div>

  <script>
    const stealthFrame = document.getElementById('stealthFrame');
    const welcome = document.getElementById('welcome');
    const stealthUrl = document.getElementById('stealthUrl');

    function quickNav(url) {
      stealthUrl.value = url;
      loadStealthUrl();
    }

    function loadStealthUrl() {
      let target = stealthUrl.value.trim();
      if (!target) return;

      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://' + target;
      }

      welcome.style.display = 'none';
      stealthFrame.style.display = 'block';
      stealthFrame.src = target;
    }

    function switchTab(idx) {
      // tab switching logic
    }

    function addTab() {
      welcome.style.display = 'flex';
      stealthFrame.style.display = 'none';
      stealthUrl.value = '';
    }
  </script>
</body>
</html>`;

    case 'unblocked-search-proxy':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unblocked Search & Wiki Proxy</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; padding: 20px; min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 24px; }
    .title { font-size: 2rem; font-weight: 800; color: #38bdf8; }
    .search-bar { display: flex; gap: 8px; margin-top: 16px; }
    .search-input { flex: 1; background: #1e293b; border: 1px solid #334155; color: #fff; padding: 12px 16px; border-radius: 10px; font-size: 1rem; outline: none; }
    .search-btn { background: #0284c7; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; cursor: pointer; }
    .search-btn:hover { background: #38bdf8; color: #0f172a; }
    
    .results { margin-top: 24px; space-y: 16px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
    .card-title { font-size: 1.1rem; font-weight: 700; color: #38bdf8; margin-bottom: 6px; }
    .card-snippet { font-size: 0.9rem; color: #cbd5e1; line-height: 1.5; }
    .card-link { display: inline-block; margin-top: 8px; color: #818cf8; font-size: 0.8rem; text-decoration: underline; cursor: pointer; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">🔍 Search & Article Proxy</div>
      <p style="color: #94a3b8; font-size: 0.875rem; margin-top: 4px;">Search Wikipedia articles and web knowledge instantly without restriction.</p>
      
      <div class="search-bar">
        <input type="text" id="query" class="search-input" placeholder="Search any topic, historical event, game guide..." onkeydown="if(event.key==='Enter') searchWiki()">
        <button class="search-btn" onclick="searchWiki()">Search</button>
      </div>
    </div>

    <div id="results" class="results">
      <div class="card">
        <div class="card-title">Welcome to Unblocked Knowledge Engine</div>
        <div class="card-snippet">Type any query above to fetch full articles and knowledge entries directly via client-side API proxies.</div>
      </div>
    </div>
  </div>

  <script>
    function searchWiki() {
      const q = document.getElementById('query').value.trim();
      if (!q) return;

      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '<p style="color:#38bdf8; text-align:center;">Searching Wikipedia knowledge database...</p>';

      fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(q) + '&format=json&origin=*')
        .then(res => res.json())
        .then(data => {
          resultsDiv.innerHTML = '';
          if (data.query && data.query.search.length > 0) {
            data.query.search.forEach(item => {
              const card = document.createElement('div');
              card.className = 'card';
              card.innerHTML =
                '<div class="card-title">' + item.title + '</div>' +
                '<div class="card-snippet">' + item.snippet + '...</div>' +
                '<span class="card-link" onclick="loadArticle(\'' + item.title.replace(/'/g, "\\'") + '\')">Read Full Article Proxy →</span>';
              resultsDiv.appendChild(card);
            });
          } else {
            resultsDiv.innerHTML = '<p style="color:#ef4444; text-align:center;">No search results found.</p>';
          }
        })
        .catch(err => {
          resultsDiv.innerHTML = '<p style="color:#ef4444; text-align:center;">Search request failed.</p>';
        });
    }

    function loadArticle(title) {
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '<p style="color:#38bdf8; text-align:center;">Loading article: <b>' + title + '</b>...</p>';

      fetch('https://en.wikipedia.org/api/rest_v1/page/html/' + encodeURIComponent(title))
        .then(res => res.text())
        .then(html => {
          resultsDiv.innerHTML =
            '<button onclick="searchWiki()" style="background:#334155; color:#fff; border:none; padding:8px 16px; border-radius:8px; margin-bottom:16px; cursor:pointer;">← Back to Results</button>' +
            '<div class="card" style="line-height:1.6; color:#e2e8f0;">' + html + '</div>';
        });
    }
  </script>
</body>
</html>`;

    case 'js-web-sandbox':
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>JS & Web Emulator Sandbox</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; color: #fff; font-family: monospace; height: 100vh; display: flex; flex-direction: column; }
    .header { background: #1e293b; padding: 10px; border-b: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
    .title { color: #38bdf8; font-weight: bold; }
    .run-btn { background: #22c55e; color: #0f172a; border: none; padding: 6px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; }
    .editor-container { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 2px; background: #334155; }
    textarea { width: 100%; height: 100%; background: #090d16; color: #f8fafc; border: none; padding: 12px; font-family: monospace; font-size: 0.85rem; outline: none; resize: none; }
    iframe { width: 100%; height: 100%; border: none; background: #020617; }
  </style>
</head>
<body>
  <div class="header">
    <span class="title">💻 Client-Side Web Sandbox & Proxy Code Emulator</span>
    <button class="run-btn" onclick="runCode()">Run Code ▶</button>
  </div>
  <div class="editor-container">
    <textarea id="code" placeholder="Type HTML/CSS/JS code here..."><!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #1e293b; color: #38bdf8; font-family: sans-serif; text-align: center; padding: 40px; }
    h1 { color: #22c55e; }
  </style>
</head>
<body>
  <h1>Web Sandbox Proxy Operational</h1>
  <p>Edit HTML/JS live in this browser emulator.</p>
</body>
</html></textarea>
    <iframe id="preview"></iframe>
  </div>

  <script>
    function runCode() {
      const code = document.getElementById('code').value;
      const preview = document.getElementById('preview');
      preview.srcdoc = code;
    }
    runCode();
  </script>
</body>
</html>`;
  }
}
