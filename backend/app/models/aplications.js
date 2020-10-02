let Sequelize = require('sequelize');

module.exports = function (app) {
	
	let Applications = app.sequelize.define('applications', {
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
		users_telegram_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'users_telegram',
                key: 'id'
            }
		},
		triggers_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'triggers',
                key: 'id'
            }
		},
		servers_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'servers',
                key: 'id'
            }
        },
		protocol: {
			type: Sequelize.STRING(5),
			allowNull: false
		},
		url_or_ip: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		port: {
			type: Sequelize.STRING(6),
			allowNull: true
		},
		correct_request_status: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		check_interval: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		queue_status: {
			type: Sequelize.STRING(1),
			allowNull: false
		},
		last_status: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		last_check: {
			type: Sequelize.DATE,
			allowNull: true
		},
		next_check: {
			type: Sequelize.DATE,
			allowNull: true
		},
		attempts_limit: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		attempts_error: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		attempts_success: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		created_date: {
			type: Sequelize.DATE,
			allowNull: true
		},
		update_date: {
			type: Sequelize.DATE,
			allowNull: true
		}
	}, {

		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		freezeTableName: true,
		tableName: 'applications'
	});

	return Applications;
};
