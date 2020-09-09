module.exports = function (app) {
    const controller = app.controllers.customers;
    app.route("/customers")
        .get(controller.getCustomers)
    app.route("/customers/:id")
        .get(controller.getCustomer)
}