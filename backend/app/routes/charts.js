module.exports = function (app) {
    const controller = app.controllers.charts;
    app.route("/chart/users")
        .get(controller.getUsers);

}

