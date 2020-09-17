module.exports = function (app) {
    const controller = app.controllers.usersLevel;
    app.route("/userslevel")
        .get(controller.getUsersLevel)
    app.route("/userslevel/:id")
        .get(controller.getUserLevel)
}