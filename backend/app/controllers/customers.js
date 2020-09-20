const auth = require('./auth');
module.exports = function (app) {
    let controller = {};
    const Customers = app.models.customers;
    const Plans = app.models.plans;
    const Auth = new auth(app);

    /**
     * getCustomers
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /customers
     */
    controller.getCustomers = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let customers = await Customers.findAll();
                for (let i = 0; i < customers.length; i++) {
                    let element = customers[i];
                    let plan = await Plans.findOne({
                        attributes: ['name'],

                        where: {
                            id: element.plans_id
                        }
                    });
                    element.plans_id = plan.name;
                }
                return res.status(200).json(customers)
            } else {
                return res.status(500).json("error: fail get customers")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
    * getCustomers
    * @param {Object} req
    * @param {Object} res
    * @method GET
    * @route /customers/:id
    */
    controller.getCustomer = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let customers = await Customers.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                return res.status(200).json(customers)
            } else {
                return res.status(500).json("error: fail get applications")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
         * addCustomers
         * @param {Object} req
         * @param {Object} res
         * @method POST
         * @route /customers
         */
    controller.addCustomers = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            let msg = "";

            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let email = req.body.email;

                let emailExist = await Customers.findOne({
                    where: {
                        email: email
                    }
                })
                if (emailExist) {
                    msg = `The email are already registered!!! ID: ${emailExist.dataValues.id}`
                    return res.status(406).json(msg)
                } else {
                    let save = await Customers.create({
                        plans_id: req.body.plans_id,
                        name: req.body.name,
                        email: req.body.email,
                        address: req.body.address,
                        city: req.body.city,
                        phone_number: req.body.phone_number,
                        document: req.body.document,
                    });
                    if (save) {
                        let values = []
                        values.push({
                            id: save.dataValues.id,
                            plans_id: req.body.plans_id,
                            name: req.body.name,
                            email: req.body.email,
                            address: req.body.address,
                            city: req.body.city,
                            phone_number: req.body.phone_number,
                            document: req.body.document,
                        });
                        return res.status(200).json(values);
                    }
                }
            } else {
                return res.status(401).json("error: user invalid");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
     * updateCustomer
     * @param {Object} req
     * @param {Object} res
     * @method PUT
     * @route /customers/:id
     */
    controller.updateCustomer = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let data = req.body;
                let save = await Customers.update({
                    plans_id: data.plans_id,
                    name: data.name,
                    address: data.address,
                    city: data.phone_number,
                    document: data.document
                }, {
                    where: {
                        id: data.id
                    }
                });
                if (save) {
                    let values = []
                    values.push({
                        id: data.id,
                        plans_id: data.plans_id,
                        name: data.name,
                        address: data.address,
                        city: data.phone_number,
                        document: data.document
                    });
                    return res.status(200).json(values);
                }
            } else {
                return res.status(401).json("error: user invalid");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
* deleteCustomer
* @param {Object} req
* @param {Object} res
* @method DELETE
* @route /customers/:id
*/
    controller.deleteCustomer = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let plan = await Customers.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (plan) {
                    plan = plan.dataValues;
                    let appDelete = await Customers.destroy({
                        where: {
                            id: req.params.id
                        }
                    });
                    if (appDelete) {
                        return res.status(200).json(plan);
                    } else {
                        return res.status(500).json("error: it was not possible to delete the data.");
                    }

                } else {
                    return res.status(500).json("error: record does not exist");
                }
            } else {
                return res.status(401).json("error: user invalid");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
 * deleteCustomers
 * @param {Object} req
 * @param {Object} res
 * @method DELETE
 * @route /plans
 */
    controller.deleteCustomers = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let ids = req.body.id
                for (let i = 0; i < ids.length; i++) {
                    await Customers.destroy({
                        where: {
                            id: ids[i]
                        }
                    });
                }
                return res.status(200).json(ids);
            } else {
                return res.status(401).json("error: user invalid");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    return controller;
};