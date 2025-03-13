// const NodeTermy = require("./utils/nodePty");
const NodeTermy = require("./utils/nodeTermy");

(async () => {
  // setTimeout(() => {
  //   NodeTermy.start("which ls");
  //   NodeTermy.start("ls");
  // }, 10e3);
  // setTimeout(async () => {
  //   const pid = NodeTermy.getPid();
  //   console.log(pid);
  //   console.log(await NodeTermy.kill(pid));
  // }, 5e3);
  // NodeTermy.on("info", console.log);
  // NodeTermy.on("error", console.error);
})();

module.exports = (io) => {
  io.use(verifySocket);

  io.on("connection", (client) => {
    // const { user: whom } = client.handshake.user;
    // const room = `user:${md5(whom)}`;

    // client.join(room);
    // io.to(room).emit("welcome", { message: `Welcome ${whom}, you are now connected!` });
    // console.log("Online", online.size, JSON.stringify([...online]));

    client.on("disconnect", () => {
      //   console.log("Online", online.size, JSON.stringify([...online]));
    });

    client.on("vpsTerm:cmd", (data) => {
      NodeTermy.start(data);
    });
    client.on("vpsTerm:kill", (data) => {
      NodeTermy.kill(data);
    });

    NodeTermy.on("data", function (data) {
      client.emit("vpsTerm:data", data);
    });
    NodeTermy.on("info", function (data) {
      client.emit("vpsTerm:info", data);
    });
    NodeTermy.on("error", function (error) {
      client.emit("vpsTerm:error", error);
    });
  });
};

async function verifySocket(socket, next) {
  try {
    // socket.handshake.user = await verifySession(socket.handshake.auth.token);
    next();
  } catch (err) {
    next(err);
  }
}
