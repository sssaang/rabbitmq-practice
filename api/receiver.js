const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (connError, connection) => {
  if (connError) {
    throw connError
  }

  connection.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError
    }

    //look for test_queue if not exists create one
    const QUEUE = 'test_queue'
    channel.assertQueue(QUEUE)

    // consumes messages with ack
    channel.consume(
      QUEUE,
      msg => {
        console.log('message consumed', msg)
      },
      {
        noAck: true
      }
    )
  })
})
