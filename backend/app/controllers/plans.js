const auth = require('./auth');
module.exports = function (app) {
    let controller = {};
    const Plans = app.models.plans;
    const Auth = new auth(app);

    /**
     * getPlans
     * @param {Object} req
     * @param {Object} res
     * @method GET
     * @route /plans
     */
    controller.getPlans = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let plans = await Plans.findAll();
                res.status(200).json(plans)
            } else {
                res.status(500).json("error: fail get plans")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
* getPlans
* @param {Object} req
* @param {Object} res
* @method GET
* @route /plans/:id
*/
    controller.getPlan = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let plans = await Plans.findAll({
                    where: {
                        id: req.params.id
                    }
                });
                res.status(200).json(plans[0])
            } else {
                res.status(500).json("error: fail get plans")
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json(error)
        }
    }

    /**
 * addPlan
 * @param {Object} req
 * @param {Object} res
 * @method POST
 * @route /plan
 */
    controller.addPlan = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let planExist = await Plans.findOne({
                    where: {
                        name: req.body.name,
                    }
                });

                if (planExist) {
                    let msg = `The plan are already registered!!! ID: ${planExist.dataValues.id}`
                    res.status(406).json(msg)

                } else {
                    let save = await Plans.create({
                        name: req.body.name,
                        description: req.body.description,
                        users_limit: req.body.users_limit,
                        applications_limit: req.body.applications_limit,
                        servers_limit: req.body.servers_limit
                    });
                    if (save) {
                        let values = []
                        values.push({
                            id: save.dataValues.id,
                            name: req.body.name,
                            description: req.body.description,
                            users_limit: req.body.users_limit,
                            applications_limit: req.body.applications_limit,
                            servers_limit: req.body.servers_limit
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
     * updatePlan
     * @param {Object} req
     * @param {Object} res
     * @method PUT
     * @route /plans/:id
     */
    controller.updatePlan = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            let msg;
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let planExist = await Plans.findOne({
                    where: {
                        name: req.body.name
                    }
                });
                if (planExist && planExist.dataValues.id !== req.body.id) {
                    msg = `The plan are already registered!!! ID: ${planExist.dataValues.id}`
                    return res.status(406).json(msg)

                } else {
                    let save = await Plans.update({
                        name: req.body.name,
                        description: req.body.description,
                        users_limit: req.body.users_limit,
                        applications_limit: req.body.applications_limit,
                        servers_limit: req.body.servers_limit
                    }, {
                        where: {
                            id: req.body.id
                        }
                    });
                    if (save) {
                        let values = []
                        values.push({
                            id: req.body.id,
                            name: req.body.name,
                            description: req.body.description,
                            users_limit: req.body.users_limit,
                            applications_limit: req.body.applications_limit,
                            servers_limit: req.body.servers_limit
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
    * deletePlan
    * @param {Object} req
    * @param {Object} res
    * @method DELETE
    * @route /plans/:id
    */
    controller.deletePlan = async (req, res) => {
        try {
            const userValid = await Auth.validaUser(req);
            if (userValid) {
                if (userValid.level !== 3) {
                    return res.status(401).json({
                        "message": "User cannot access this record"
                    });
                }
                let plan = await Plans.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                if (plan) {
                    plan = plan.dataValues;
                    let appDelete = await Plans.destroy({
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
     * deletePlans
     * @param {Object} req
     * @param {Object} res
     * @method DELETE
     * @route /plans
     */
    controller.deletePlans = async (req, res) => {
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
                    await Plans.destroy({
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
}