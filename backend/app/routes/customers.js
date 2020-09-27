module.exports = function (app) {
    const controller = app.controllers.customers;
    app.route("/customers")
        .get(controller.getCustomers)
        .delete(controller.deleteCustomers)
        .post(controller.createCustomers)
    app.route("/customers/:id")
        .get(controller.getCustomer)
        .put(controller.updateCustomer)
        .delete(controller.deleteCustomer)

}