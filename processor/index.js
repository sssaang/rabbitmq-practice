const amqp = require('amqplib')
require('dotenv').config()

const listenForMessages = async () => {
  // connect to Rabbit MQ
  let connection = await amqp.connect(process.env.RABBIT_MQ_URL)

  // create a channel and prefetch 1 message at a time
  let channel = await connection.createChannel()
  await channel.prefetch(1)

  // create a second channel to send back the results
  let resultsChannel = await connection.createConfirmChannel()

  // start consuming messages
  await consume({ connection, channel, resultsChannel })
}

// utility function to publish messages to a channel
const publishToChannel = (channel, { routingKey, exchangeName, data }) => {
  return new Promise((resolve, reject) => {
    channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(data), 'utf-8'),
      { persistent: true },
      function (err, ok) {
        if (err) {
          return reject(err)
        }

        resolve()
      }
    )
  })
}

// consume messages from RabbitMQ
function consume ({ connection, channel, resultsChannel }) {
  return new Promise((resolve, reject) => {
    channel.consume(process.env.REQUESTS_QUEUE, async msg => {
      // parse message
      let msgBody = msg.content.toString()
      let requestData = JSON.parse(msgBody)
      let requestId = requestData.requestId
      let data = requestData.data
      console.log('Received a request message, requestId:', requestId)

      // process data
      let processingResults = await processMessage(data)

      // publish results to channel
      await publishToChannel(resultsChannel, {
        exchangeName: process.env.EXCHANGE_NAME,
        routingKey: process.env.RESULTS_ROUTING,
        data: { requestId, processingResults }
      })
      console.log('Published results for requestId:', requestId)

      // acknowledge message as processed successfully
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

// simulate data processing that takes 5 seconds
const processMessage = data => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(data) + '-processed')
    }, 5000)
  })
}

listenForMessages()
