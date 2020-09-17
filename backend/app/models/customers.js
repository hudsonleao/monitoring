let Sequelize = require('sequelize');
module.exports = function (app) {
	
	let Customers = app.sequelize.define('customers', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
        },
        plans_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'plans',
                key: 'id'
            }
        },
		name: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		email: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		address: {
			type: Sequelize.STRING(255),
			allowNull: false
        },
        city: {
			type: Sequelize.STRING(500),
			allowNull: false
        },
        phone_number: {
			type: Sequelize.STRING(255),
			allowNull: false
        },
        document: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
	}, {

		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		freezeTableName: true,
		tableName: 'customers'
	});

	return Customers;
};
