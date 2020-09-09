module.exports = function (app) {
    const controller = app.controllers.users;
    app.route("/users")
        .get(controller.getUsers)
        .post(controller.addUser);
}