let Sequelize = require('sequelize');
module.exports = function (app) {
	
	let Users = app.sequelize.define('users', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		customers_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'customers',
                key: 'id'
            }
        },
		name: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		user: {
			type: Sequelize.STRING(255),
			allowNull: false
        },
        password: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		level: {
			type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users_level',
                key: 'id'
            }
		},
		created_date: {
			type: Sequelize.DATE,
			allowNull: false
		}
	}, {
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		freezeTableName: true,
		tableName: 'users'
	});

	return Users;
};
