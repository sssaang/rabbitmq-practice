"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _amqplib = _interopRequireDefault(require("amqplib"));

var RabbitMQService = /*#__PURE__*/function () {
  function RabbitMQService(url) {
    (0, _classCallCheck2["default"])(this, RabbitMQService);
    this.url = url;
  }

  (0, _createClass2["default"])(RabbitMQService, [{
    key: "setup",
    value: function () {
      var _setup = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function setup() {
        return _setup.apply(this, arguments);
      }

      return setup;
    }()
  }, {
    key: "publish",
    value: function () {
      var _publish = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref) {
        var routingKey, exchangeName, data, requestId, connection, channel;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                routingKey = _ref.routingKey, exchangeName = _ref.exchangeName, data = _ref.data, requestId = _ref.requestId;
                _context2.next = 3;
                return _amqplib["default"].connect(this.url);

              case 3:
                connection = _context2.sent;
                _context2.next = 6;
                return connection.createConfirmChannel();

              case 6:
                channel = _context2.sent;
                channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify({
                  data: data,
                  requestId: requestId
                }), 'utf-8'), {
                  persistent: true
                }, function (err, ok) {
                  if (err) {
                    throw err;
                  }

                  console.log("message from ".concat(requestId, " published"), data, ok);
                });

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function publish(_x) {
        return _publish.apply(this, arguments);
      }

      return publish;
    }()
  }]);
  return RabbitMQService;
}();

var _default = RabbitMQService;
exports["default"] = _default;