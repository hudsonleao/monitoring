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
			allowNull: true
        },
        city: {
			type: Sequelize.STRING(500),
			allowNull: true
        },
        phone_number: {
			type: Sequelize.STRING(255),
			allowNull: true
        },
        document: {
			type: Sequelize.STRING(255),
			allowNull: true
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
