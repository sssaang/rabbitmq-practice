import amqp from 'amqplib'
require('dotenv').config()

async function setup () {
  console.log('setting up Rabbit MQ exchanges/queues')
  let connection = await amqp.connect(process.env.RABBIT_MQ_URL)

  // create a channel
  const channel = await connection.createChannel()

  // create exchange
  await channel.assertExchange(process.env.EXCHANGE_NAME, 'direct', {
    durable: true
  })

  // create queues
  await channel.assertQueue(process.env.REQUESTS_QUEUE, { durable: true })
  await channel.assertQueue(process.env.RESULTS_QUEUE, { durable: true })

  // bind queues
  await channel.bindQueue(
    process.env.REQUESTS_QUEUE,
    process.env.EXCHANGE_NAME,
    process.env.REQUESTS_ROUTING
  )
  await channel.bindQueue(
    process.env.RESULTS_QUEUE,
    process.env.EXCHANGE_NAME,
    process.env.RESULTS_ROUTING
  )

  console.log('Rabbit MQ Setup DONE')

  // start consuming messages
  await consume({ connection, channel })
}

function consume ({ connection, channel, resultsChannel }) {
  return new Promise((resolve, reject) => {
    channel.consume(process.env.RESULTS_QUEUE, async msg => {
      // parse message
      let msgBody = msg.content.toString()
      let data = JSON.parse(msgBody)
      let requestId = data.requestId
      let processingResults = data.processingResults

      // don't send message until ack is called
      await channel.prefetch(1)
      console.log(
        'Received a result message, requestId:',
        requestId,
        'processingResults:',
        processingResults
      )

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
