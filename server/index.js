
const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const app = express();

  // socket.io
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
    });
  });

  app.all('*', (req, res) => {
    return nextHandler(req, res)
  })

  const PORT = process.env.SERVER_PORT || 3000;

  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
