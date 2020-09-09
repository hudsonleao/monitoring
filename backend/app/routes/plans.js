module.exports = function (app) {
    const controller = app.controllers.plans;
    app.route("/plans")
        .get(controller.getPlans)
    app.route("/plans/:id")
        .get(controller.getPlan)
}