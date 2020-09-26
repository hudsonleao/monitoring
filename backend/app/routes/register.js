module.exports = function (app) {
    const controller = app.controllers.register;
    app.route("/register")
        .post(controller.register)
}