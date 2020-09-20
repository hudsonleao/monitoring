module.exports = function (app) {
    const controller = app.controllers.usersTelegram;
    app.route("/telegram")
        .get(controller.getUsersTelegram)
        .post(controller.createUserTelegram)
        .delete(controller.deleteUsersTelegram)
    app.route("/telegram/:id")
        .get(controller.getUserTelegram)
        .put(controller.updateUserTelegram)
        .delete(controller.deleteUserTelegram)
}