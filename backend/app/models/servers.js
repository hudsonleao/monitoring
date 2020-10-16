let Sequelize = require('sequelize');
module.exports = function (app) {
	
	let Servers = app.sequelize.define('servers', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
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
		name: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		server_user: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		server_ip: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		server_ssh_port: {
			type: Sequelize.STRING(6),
			defaultValue: 22,
			allowNull: false
        },
        ssh_key_id: {
			type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'users_ssh_key',
                key: 'id'
            }
		},
	}, {

		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		freezeTableName: true,
		tableName: 'servers'
	});

	return Servers;
};
