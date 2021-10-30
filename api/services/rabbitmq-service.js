import amqp from 'amqplib'

class RabbitMQService {
  constructor (url) {
    this.url = url
    this.channel = null
  }

  async setup () {}

  async publish ({ routingKey, exchangeName, data }) {
    const connection = await amqp.connect(this.url)
    const channel = await connection.createConfirmChannel()

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
