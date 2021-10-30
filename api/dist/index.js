"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

require("./mq/init");

var _rabbitmqService = _interopRequireDefault(require("./services/rabbitmq-service"));

var mqService = new _rabbitmqService["default"]('amqp://localhost');
var app = (0, _express["default"])();
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"].json());
app.post('/api/v1/processData', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$body, requestId, data;

    return _regenerator["default"].wrap(function _callee$(_context) {
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