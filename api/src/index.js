import express from 'express'
import http from 'http'
import './mq/init'
import RabbitMQService from './services/rabbitmq-service'

const mqService = new RabbitMQService(process.env.RABBIT_MQ_URL)
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/api/v1/processData', async (req, res) => {
  console.log(req.body)
  const { requestId, data } = req.body
  if (!requestId || !data) {
    return res.status(400).send('invalid input')
  }

  console.log('Published a request message, requestId:', requestId)
  await mqService.publish({
    routingKey: process.env.REQUESTS_ROUTING,
    exchangeName: process.env.EXCHANGE_NAME,
    data,
    requestId
  })

  res.status(200).send({
    response: {
      msg: 'success'
    }
  })
})
const PORT = 4000

app.listen(PORT, () => {
  console.info('Listening on port %s.', PORT)
})
