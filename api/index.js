import express from 'express'
import http from 'http'
// const amqp = require('amqplib')
import './mq/init'
// import RabbitMQService from './services/rabbitmq-service'

// const mqService = new RabbitMQService('amqp://localhost')
const app = express()

app.post('/api/v1/processData', async (req, res) => {})

const PORT = 3000
const server = http.createServer(app)
server.listen(PORT, 'localhost', err => {
  if (err) {
    console.error(err)
  } else {
    console.info('Listening on port %s.', PORT)
  }
})
