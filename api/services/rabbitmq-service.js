import amqp from 'amqplib'

class RabbitMQService {
  constructor (url) {
    this.url = url
  }

  async setup () {}

  async publish ({ routingKey, exchangeName, data, requestId }) {
    const connection = await amqp.connect(this.url)
    const channel = await connection.createConfirmChannel()

    channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(
        JSON.stringify({
          data,
          requestId
        }),
        'utf-8'
      ),
      { persistent: true },
      (err, ok) => {
        if (err) {
          throw err
        }
        console.log(`message from ${requestId} published`, data, ok)
      }
    )
  }
}

export default RabbitMQService
