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

  console.log('Rabbit MQ Setup DONE')

  await channel.prefetch(1)

  // start consuming messages
  await consume({ connection, channel })
}

function consume ({ connection, channel, resultsChannel }) {
  return new Promise((resolve, reject) => {
    channel.consume('processing.results', async function (msg) {
      // parse message
      let msgBody = msg.content.toString()
      let data = JSON.parse(msgBody)
      let requestId = data.requestId
      let processingResults = data.processingResults
      console.log(
        'Received a result message, requestId:',
        requestId,
        'processingResults:',
        processingResults
      )

      // acknowledge message as received
      await channel.ack(msg)
    })

    // handle connection closed
    connection.on('close', err => {
      return reject(err)
    })

    // handle errors
    connection.on('error', err => {
      return reject(err)
    })
  })
}

setup()
