import RabbitMQService from './services/rabbitmq-service'
const express = require('express')
const app = express()
const http = require('http')
const amqp = require('amqplib')

app.post('/api/v1/processData', async (req, res) => {})

RabbitMQService.setup().then(() => {
  // Start the server
  const PORT = 3000
  server = http.createServer(app)
  server.listen(PORT, 'localhost', err => {
    if (err) {
      console.error(err)
    } else {
      console.info('Listening on port %s.', PORT)
    }
  })
})
