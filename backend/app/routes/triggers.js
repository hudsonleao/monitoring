module.exports = function (app) {
    const controller = app.controllers.triggers;
    app.route("/triggers")
        .get(controller.getTriggers)
        .post(controller.createTrigger)
        .delete(controller.deleteTriggers)
    app.route("/triggers/:id")
        .get(controller.getTrigger)
        .put(controller.updateTrigger)
        .delete(controller.deleteTrigger)
}