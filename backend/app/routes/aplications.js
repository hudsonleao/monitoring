module.exports = function (app) {
    const controller = app.controllers.aplications;
    app.route("/applications")
        .get(controller.getApplications)
        .delete(controller.deleteApplications)
        .post(controller.addApplication)
    app.route("/applications/:id")
        .get(controller.getApplication)
        .put(controller.updateApplication)
        .delete(controller.deleteApplication)
}