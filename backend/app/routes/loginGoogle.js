module.exports = function (app) {
    const controller = app.controllers.loginGoogle;
    app.route("/login/google")
        .get(controller.loginGoogle)
}