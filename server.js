const mysql = require('mysql2')
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const bddConnexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'rplace'
})

bddConnexion.connect((err) => {
    if (err){
        console.error('Erreur de connexion à la bdd');
        return;
    }
    console.log('Connexion BDD ok');
});

app.use(express.static(__dirname));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('colorPixel', (data) => {
    const query = `INSERT INTO pixels (x, y, color) VALUES (${data.x}, ${data.y}, '${data.color}') ON DUPLICATE KEY UPDATE color ='${data.color}'`;
    bddConnexion.query(query, (err, results) =>{
        if (err) throw err;
        console.log('Pixel colorié dans la BDD');
        io.emit('updatePixel', data);
    })   
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});


app.get('/getPixels', (req, res) => {
    const query = 'SELECT * FROM pixels';
    bddConnexion.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});