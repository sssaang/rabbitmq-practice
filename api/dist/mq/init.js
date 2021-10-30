"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _amqplib = _interopRequireDefault(require("amqplib"));

require('dotenv').config();

function setup() {
  return _setup.apply(this, arguments);
}

function _setup() {
  _setup = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var connection, channel;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('setting up Rabbit MQ exchanges/queues');
            _context2.next = 3;
            return _amqplib["default"].connect(process.env.RABBIT_MQ_URL);

          case 3:
            connection = _context2.sent;
            _context2.next = 6;
            return connection.createChannel();

          case 6:
            channel = _context2.sent;
            _context2.next = 9;
            return channel.assertExchange(process.env.EXCHANGE_NAME, 'direct', {
              durable: true
            });

          case 9:
            _context2.next = 11;
            return channel.assertQueue(process.env.REQUESTS_QUEUE, {
              durable: true
            });

          case 11:
            _context2.next = 13;
            return channel.assertQueue(process.env.RESULTS_QUEUE, {
              durable: true
            });

          case 13:
            _context2.next = 15;
            return channel.bindQueue(process.env.REQUESTS_QUEUE, process.env.EXCHANGE_NAME, process.env.REQUESTS_ROUTING);

          case 15:
            _context2.next = 17;
            return channel.bindQueue(process.env.RESULTS_QUEUE, process.env.EXCHANGE_NAME, process.env.RESULTS_ROUTING);

          case 17:
            console.log('Rabbit MQ Setup DONE'); // start consuming messages

            _context2.next = 20;
            return consume({
              connection: connection,
              channel: channel
            });

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _setup.apply(this, arguments);
}

function consume(_ref) {
  var connection = _ref.connection,
      channel = _ref.channel,
      resultsChannel = _ref.resultsChannel;
  return new Promise(function (resolve, reject) {
    channel.consume(process.env.RESULTS_QUEUE, /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(msg) {
        var msgBody, data, requestId, processingResults;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // parse message
                msgBody = msg.content.toString();
                data = JSON.parse(msgBody);
                requestId = data.requestId;
                processingResults = data.processingResults; // don't send message until ack is called

                _context.next = 6;
                return channel.prefetch(1);

              case 6:
                console.log('Received a result message, requestId:', requestId, 'processingResults:', processingResults);
                _context.next = 9;
                return channel.ack(msg);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }()); // handle connection closed

    connection.on('close', function (err) {
      return reject(err);
    }); // handle errors

    connection.on('error', function (err) {
      return reject(err);
    });
  });
}

setup();