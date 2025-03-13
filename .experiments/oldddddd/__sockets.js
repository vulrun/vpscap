const NodeTermy = require("./utils/nodeTermy");
const WebSocket = require("ws");
let wss;

module.exports = {
  wss,
  attach: initSockets,
  start: startSockets,
};

function initSockets(server) {
  wss = new WebSocket.Server({ port: 60023, __verifyClient: authenticate });
  console.log(`web-sockets started`);
}

function startSockets() {
  const interval = setInterval(() => {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 30e3);

  wss.on("close", function () {
    clearInterval(interval);
  });

  wss.on("connection", (ws) => {
    ws.isAlive = true;
    ws.on("pong", heartbeat);

    ws.on("message", (payload) => {
      payload = JSON.parse(payload);

      switch (true) {
        case payload?.type === "command":
          NodeTermy.start(payload?.data);
          break;

        case payload?.type === "kill":
          NodeTermy.kill(payload?.data);
          break;

        default:
          break;
      }
    });

    NodeTermy.on("info", function (data) {
      sendSocket(ws, null, data);
    });
    NodeTermy.on("error", function (error) {
      console.log("🚀 ~ error:", error);
      sendSocket(ws, error);
    });
  });
}

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

function sendSocket(ws, error, data) {
  ws.send(
    JSON.stringify({
      error: error || null,
      data: data || null,
    })
  );
}

function authenticate(info, cb) {
  const token = info.req.url.split("?token=")[1];

  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return cb(false, 401, "Unauthorized");
      } else {
        // You can access user information from `decoded`
        return cb(true);
      }
    });
  } else {
    return cb(false, 401, "Unauthorized");
  }
}
