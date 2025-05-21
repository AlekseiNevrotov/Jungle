const rows = 10;
const cols = 10;
let mazeData = generateRandomMaze();
let playerPosition = { x: 0, y: 0 };
const mazeContainer = document.getElementById('maze');
const playerDiv = document.createElement('div');
playerDiv.classList.add('player');
mazeContainer.appendChild(playerDiv);
function generateRandomMaze() {
  const maze = [];
  for (let y = 0; y < rows; y++) {
    maze[y] = [];
    for (let x = 0; x < cols; x++) {
      maze[y][x] = Math.random() > 0.3 ? 0 : 1;
    }
  }
  maze[0][0] = 0;
  maze[rows - 1][cols - 1] = 2;
  if (!isPathAvailable(maze)) {
    return generateRandomMaze();
  }
  return maze;
}
function isPathAvailable(maze) {
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [{ x: 0, y: 0 }];
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
  ];
  visited[0][0] = true;
  while (queue.length > 0) {
    const { x, y } = queue.shift();
    if (x === cols - 1 && y === rows - 1) {
      return true;
    }
    for (const { dx, dy } of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < cols &&
        ny < rows &&
        maze[ny][nx] !== 1 &&
        !visited[ny][nx]
      ) {
        visited[ny][nx] = true;
        queue.push({ x: nx, y: ny });
      }
    }
  }
  return false;
}
function renderMaze() {
  mazeContainer.innerHTML = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (mazeData[y][x] === 1) cell.classList.add('wall');
      else if (mazeData[y][x] === 2) cell.classList.add('goal');
      mazeContainer.appendChild(cell);
    }
  }
  mazeContainer.appendChild(playerDiv);
  updatePlayerPosition();
}
function updatePlayerPosition() {
  playerDiv.style.left = playerPosition.x * 30 + 'px';
  playerDiv.style.top = playerPosition.y * 30 + 'px';
}
function generateNewMaze() {
  mazeData = generateRandomMaze();
  playerPosition = { x: 0, y: 0 };
  renderMaze();
}
function movePlayer(direction) {
  let newX = playerPosition.x;
  let newY = playerPosition.y;
  if (
    direction === 'up' &&
    playerPosition.y > 0 &&
    mazeData[playerPosition.y - 1][playerPosition.x] !== 1
  ) {
    newY -= 1;
  } else if (
    direction === 'down' &&
    playerPosition.y < rows - 1 &&
    mazeData[playerPosition.y + 1][playerPosition.x] !== 1
  ) {
    newY += 1;
  } else if (
    direction === 'left' &&
    playerPosition.x > 0 &&
    mazeData[playerPosition.y][playerPosition.x - 1] !== 1
  ) {
    newX -= 1;
  } else if (
    direction === 'right' &&
    playerPosition.x < cols - 1 &&
    mazeData[playerPosition.y][playerPosition.x + 1] !== 1
  ) {
    newX += 1;
  }
  if (mazeData[newY][newX] === 2) {
    alert('Поздравляем! Вы в Jungle!');
  }
  playerPosition = { x: newX, y: newY };
  updatePlayerPosition();
}
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') movePlayer('up');
  else if (event.key === 'ArrowDown') movePlayer('down');
  else if (event.key === 'ArrowLeft') movePlayer('left');
  else if (event.key === 'ArrowRight') movePlayer('right');
});
let touchStartX = 0;
let touchStartY = 0;
window.addEventListener('touchstart', (event) => {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});
window.addEventListener('touchend', (event) => {
  const touch = event.changedTouches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) movePlayer('right');
    else movePlayer('left');
  } else {
    if (diffY > 0) movePlayer('down');
    else movePlayer('up');
  }
});
const refreshBtn = document.getElementById('refreshBtn');
let touchTimeout;
function removeTouchHover() {
  clearTimeout(touchTimeout);
  refreshBtn.classList.remove('touch-hover');
}
refreshBtn.addEventListener('touchstart', () => {
  refreshBtn.classList.add('touch-hover');
  clearTimeout(touchTimeout);
  touchTimeout = setTimeout(() => {
    refreshBtn.classList.remove('touch-hover');
  }, 1200);
});
refreshBtn.addEventListener('touchend', (event) => {
  event.preventDefault();
  removeTouchHover();
  generateNewMaze();
});
refreshBtn.addEventListener('touchcancel', removeTouchHover);
refreshBtn.addEventListener('touchmove', removeTouchHover);
refreshBtn.addEventListener('click', generateNewMaze);
renderMaze();