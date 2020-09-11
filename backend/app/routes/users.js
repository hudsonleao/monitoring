module.exports = function (app) {
    const controller = app.controllers.users;
    app.route("/users")
        .get(controller.getUsers)
        .post(controller.addUser)
        //.delete(controller.deleteUsers)
    app.route("/users/:id")
        .get(controller.getUser)
        .put(controller.updateUser)
        //.delete(controller.deleteUser)
}