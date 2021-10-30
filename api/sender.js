const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (connError, connection) => {
  if (connError) {
    throw connError
  }

  connection.createChannel((channelError, channel) => {
    if (channelError) {
      throw channelError
    }

    const QUEUE = 'test_queue'
    channel.assertQueue(QUEUE)

    channel.sendToQueue(QUEUE, Buffer.from('hello from sender'))
    console.log('message sent', QUEUE)
  })
})
