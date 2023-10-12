const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const pixelSize = 5;
const colorPicker = document.getElementById('colorPicker');

const socket = io.connect('http://localhost:3000');

function drawGrid() {
  for (let x = 0; x < canvas.width; x += pixelSize) {
    for (let y = 0; y < canvas.height; y += pixelSize) {
      ctx.strokeRect(x, y, pixelSize, pixelSize);
    }
  }
}

function colorPixel(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const pixelX = Math.floor(mouseX / pixelSize) * pixelSize;
  const pixelY = Math.floor(mouseY / pixelSize) * pixelSize;

  ctx.fillStyle = colorPicker.value;
  ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
  
  const pixelData = {
    x: pixelX,
    y: pixelY,
    color: colorPicker.value
  };

  socket.emit('colorPixel', pixelData);
}


function getSavedPixels() {
    console.log('test');
    fetch('http://localhost:3000/getPixels')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((pixel) => {
                ctx.fillStyle = pixel.color;
                ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
            });
        })
        .catch((error) => console.error('Erreur lors de la récupération de la BDD :', error));
}

drawGrid();
getSavedPixels();

canvas.addEventListener('mousedown', (event) => {
  colorPixel(event);
  canvas.addEventListener('mousemove', colorPixel);
});

canvas.addEventListener('mouseup', () => {
  canvas.removeEventListener('mousemove', colorPixel);
});

socket.on('updatePixel', (data) => {
    ctx.fillStyle = data.color;
    ctx.fillRect(data.x, data.y, pixelSize, pixelSize);
});