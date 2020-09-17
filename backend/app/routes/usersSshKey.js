module.exports = function (app) {
    const controller = app.controllers.usersSshKey;
    app.route("/sshkey")
        .get(controller.getUsersSshKey)
        .post(controller.createUserSshKey)
    app.route("/sshkey/:id")
        .get(controller.getUserSshKey)
        .put(controller.updateUserSshKey)
        .delete(controller.deleteUserSshKey)
}