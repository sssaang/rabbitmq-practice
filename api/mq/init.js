// const amqp = require('amqplib')
import amqp from 'amqplib'

async function setup () {
  console.log('setting up Rabbit MQ exchanges/queues')
  let connection = await amqp.connect(this.url)

  // create a channel
  this.channel = await connection.createChannel()

  // create exchange
  await this.channel.assertExchange('processing', 'direct', { durable: true })

  // create queues
  await this.channel.assertQueue('processing.requests', { durable: true })
  await this.channel.assertQueue('processing.results', { durable: true })

  // bind queues
  await this.channel.bindQueue('processing.requests', 'processing', 'request')
  await this.channel.bindQueue('processing.results', 'processing', 'result')

  console.log('Setup DONE')
}

setup()
