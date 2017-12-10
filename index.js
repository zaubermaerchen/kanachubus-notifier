const express = require("express");
const googlehome = require("google-home-notifier");
const config = require("config").config;
const kanachu = require("./kanachu.js");

const server = express();
server.get("/:start(\\d{8})/:goal(\\d{8})", function (request, response) {
    kanachu.getNextBus(request.params.start, request.params.goal, new Date()).then(function (result) {
        const message = (result === null) ? "次のバスはありません" : "次のバスは" + result + "です";
        googlehome.device(config.googlehome.device, "ja");
        googlehome.ip(config.googlehome.ip);
        googlehome.accent('ja');
        googlehome.notify(message, function (res) {
            console.log(res);
            response.send(res);
        });
    }).catch(function (exception) {
        response.sendStatus(503);
        response.send(exception);
        console.log(exception);
    });
});
server.listen(config.port, function () {
    console.log("Listen Start");
    console.log("Endpoints:");
    console.log("    http://localhost:" + config.port + "/start_terminal_id/goal_terminal_id");
    console.log("Example:");
    console.log("    curl http://localhost:" + config.port + "/00127455/00127471");
});