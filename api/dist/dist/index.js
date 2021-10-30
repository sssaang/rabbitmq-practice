"use strict";

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

require("./mq/init");

var _rabbitmqService = _interopRequireDefault(require("./services/rabbitmq-service"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var mqService = new _rabbitmqService["default"]('amqp://localhost');
var app = (0, _express["default"])();
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"].json());
app.post('/api/v1/processData', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, requestId, data;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(req.body);
            _req$body = req.body, requestId = _req$body.requestId, data = _req$body.data;

            if (!(!requestId || !data)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", res.status(400).send('invalid input'));

          case 4:
            console.log('Published a request message, requestId:', requestId);
            _context.next = 7;
            return mqService.publish({
              routingKey: process.env.REQUESTS_ROUTING,
              exchangeName: process.env.EXCHANGE_NAME,
              data: data,
              requestId: requestId
            });

          case 7:
            res.status(200).send({
              response: {
                msg: 'success'
              }
            });

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var PORT = 4000;

var server = _http["default"].createServer(app);

server.listen(PORT, 'localhost', function (err) {
  if (err) {
    console.error(err);
  } else {
    console.info('Listening on port %s.', PORT);
  }
});