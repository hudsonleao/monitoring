module.exports = function (app) {
    const controller = app.controllers.servers;
    app.route("/servers")
        .get(controller.getServers)
        .post(controller.createServer)
        .delete(controller.deleteServers)
    app.route("/servers/:id")
        .get(controller.getServer)
        .put(controller.updateServer)
        .delete(controller.deleteServer)
}