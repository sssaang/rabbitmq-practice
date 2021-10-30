const express = require('express')
const app = express()
const http = require('http')
// const amqp = require('amqplib')
import RabbitMQService from './services/rabbitmq-service'

const mqService = new RabbitMQService('amqp://localhost')

app.post('/api/v1/processData', async (req, res) => {})

mqService.setup().then(() => {
  // Start the server
  const PORT = 3000
  const server = http.createServer(app)
  server.listen(PORT, 'localhost', err => {
    if (err) {
      console.error(err)
    } else {
      console.info('Listening on port %s.', PORT)
    }
  })
})
