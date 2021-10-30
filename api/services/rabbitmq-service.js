const amqp = require('amqplib')

class RabbitMQService {
  constructor (url) {
    this.url = url
    this.channel = null
  }

  async setup () {
    console.log('setting up Rabbit MQ exchanges/queues')
    let connection = await amqp.connect(messageQueueConnectionString)

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

  async publish (channel, { routingKey, exchangeName, data }) {
    await channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(data), 'utf-8'),
      { persistent: true },
      (err, ok) => {
        if (err) {
          throw err
        }
        console.log('message published', ok)
      }
    )
  }
}

export default RabbitMQService
