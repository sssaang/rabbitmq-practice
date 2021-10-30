// const amqp = require('amqplib')
import amqp from 'amqplib'

async function setup () {
  console.log('setting up Rabbit MQ exchanges/queues')
  let connection = await amqp.connect('amqp://localhost')

  // create a channel
  const channel = await connection.createChannel()

  // create exchange
  await channel.assertExchange('processing', 'direct', { durable: true })

  // create queues
  await channel.assertQueue('processing.requests', { durable: true })
  await channel.assertQueue('processing.results', { durable: true })

  // bind queues
  await channel.bindQueue('processing.requests', 'processing', 'request')
  await channel.bindQueue('processing.results', 'processing', 'result')

  console.log('Setup DONE')
}

setup()
