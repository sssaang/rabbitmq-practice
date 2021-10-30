"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var amqp = require('amqplib');

require('dotenv').config();

var listenForMessages = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var connection, channel, resultsChannel;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return amqp.connect(process.env.RABBIT_MQ_URL);

          case 2:
            connection = _context.sent;
            _context.next = 5;
            return connection.createChannel();

          case 5:
            channel = _context.sent;
            _context.next = 8;
            return channel.prefetch(1);

          case 8:
            _context.next = 10;
            return connection.createConfirmChannel();

          case 10:
            resultsChannel = _context.sent;
            _context.next = 13;
            return consume({
              connection: connection,
              channel: channel,
              resultsChannel: resultsChannel
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function listenForMessages() {
    return _ref.apply(this, arguments);
  };
}(); // utility function to publish messages to a channel


var publishToChannel = function publishToChannel(channel, _ref2) {
  var routingKey = _ref2.routingKey,
      exchangeName = _ref2.exchangeName,
      data = _ref2.data;
  return new Promise(function (resolve, reject) {
    channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(data), 'utf-8'), {
      persistent: true
    }, function (err, ok) {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}; // consume messages from RabbitMQ


function consume(_ref3) {
  var connection = _ref3.connection,
      channel = _ref3.channel,
      resultsChannel = _ref3.resultsChannel;
  return new Promise(function (resolve, reject) {
    channel.consume(process.env.REQUESTS_QUEUE, /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(msg) {
        var msgBody, requestData, requestId, data, processingResults;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // parse message
                msgBody = msg.content.toString();
                requestData = JSON.parse(msgBody);
                requestId = requestData.requestId;
                data = requestData.data;
                console.log('Received a request message, requestId:', requestId); // process data

                _context2.next = 7;
                return processMessage(data);

              case 7:
                processingResults = _context2.sent;
                _context2.next = 10;
                return publishToChannel(resultsChannel, {
                  exchangeName: process.env.EXCHANGE_NAME,
                  routingKey: process.env.RESULTS_ROUTING,
                  data: {
                    requestId: requestId,
                    processingResults: processingResults
                  }
                });

              case 10:
                console.log('Published results for requestId:', requestId); // acknowledge message as processed successfully

                _context2.next = 13;
                return channel.ack(msg);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref4.apply(this, arguments);
      };
    }()); // handle connection closed

    connection.on('close', function (err) {
      return reject(err);
    }); // handle errors

    connection.on('error', function (err) {
      return reject(err);
    });
  });
} // simulate data processing that takes 5 seconds


var processMessage = function processMessage(data) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(JSON.stringify(data) + '-processed');
    }, 5000);
  });
};

listenForMessages();