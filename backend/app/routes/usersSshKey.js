module.exports = function (app) {
    const controller = app.controllers.usersSshKey;
    app.route("/ssh_key")
        .get(controller.getUsersSshKey)
        .post(controller.createUserSshKey)
        .delete(controller.deleteUsersSshKey)
    app.route("/ssh_key/:id")
        .get(controller.getUserSshKey)
        .put(controller.updateUserSshKey)
        .delete(controller.deleteUserSshKey)
}