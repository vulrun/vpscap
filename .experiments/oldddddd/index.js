"use strict";
require("dotenv").config();

const http = require("node:http");
const express = require("express");
const app = express();
const ejs = require("ejs");
const logger = require("morgan");
const sockets = require("./__sockets");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const responses = require("jstub/middlewares/responses");
const appRoutes = require("./src/routes");
const { base64Encode } = require("jstub/functions");
const io = require("socket.io")({ allowEIO3: true });

// Admin Panel Setup
app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");
app.set("view options", { rmWhitespace: false });
app.set("layout", "_admin");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.use(expressLayouts);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(cookieParser(process.env.SECRET_KEY));
app.use(responses, renderResp);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(`${__dirname}/public`));
app.use(appRoutes);

// app.use((req, res, next) => res.openPage("/debug", "404, Not Found"));

app.use((err, req, res, next) => {
  console.error(err);
  // return res.openPage("/debug", err?.message || err || "SOMETHING_WENT_WRONG");
  res.send(err);
});

const httpServer = http.createServer(app).listen(process.env.PORT, () => console.log("listening on", process.env.PORT));
io.attach(httpServer);
require("./sockets")(io);

function renderResp(req, res, next) {
  res.openPage = (path, err, okk) => {
    const hash = JSON.stringify({
      error: err || "",
      success: okk || "",
    });

    path = (path || "").replace(/(^\/|\/\/+|\/$)/g, "");
    return res.redirect("/" + path + "#" + base64Encode(hash));
  };

  // modify res.render
  const orgRender = res.render;
  res.render = (view, { layout, ...props }, cb) => {
    props = props || {};
    props.pageTitle = props?.pageTitle || "";

    res.render = orgRender;
    return res.render(view, { layout, props }, cb);
  };

  next();
}
