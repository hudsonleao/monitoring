module.exports = function (app) {
    const controller = app.controllers.plans;
    app.route("/plans")
        .get(controller.getPlans)
        .post(controller.addPlan)
        .delete(controller.deletePlans)
    app.route("/plans/:id")
        .get(controller.getPlan)
        .put(controller.updatePlan)
        .delete(controller.deletePlan)
}