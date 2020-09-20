let Sequelize = require('sequelize');
module.exports = function (app) {
	
	let UsersSshKey = app.sequelize.define('users_ssh_key', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		name: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
        users_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
		ssh_key: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		key_name: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		expiration_date: {
			type: Sequelize.DATE,
			allowNull: false
		}
	}, {
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		freezeTableName: true,
		tableName: 'users_ssh_key'
	});

	return UsersSshKey;
};
