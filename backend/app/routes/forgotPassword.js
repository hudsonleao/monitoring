module.exports = function (app) {
    const controller = app.controllers.forgotPassword;
    app.route("/forgot-password")
        .post(controller.forgotPassword);

}