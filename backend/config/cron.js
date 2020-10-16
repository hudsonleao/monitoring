const fetch = require('node-fetch');
const { exec } = require('child_process');
const CronJob = require('cron').CronJob;
const Sequelize = require('sequelize');

module.exports = function (app) {
    let _self = {}
    const Applications = app.models.aplications;
    const Servers = app.models.servers;
    const Triggers = app.models.triggers;
    const Users = app.models.users;
    const UsersSshKey = app.models.usersSshKey;
    const UsersTelegram = app.models.usersTelegram;


    const sendMessageTelegram = async (bot, chatId, message, application) => {
        const { name, protocol, url_or_ip, port, correct_request_status } = application
        message = message.replace("$ApplicationName", name);
        message = message.replace("$Protocol", protocol);
        message = message.replace("$URLOrIP", url_or_ip);
        message = message.replace("$Port", port);
        message = message.replace("$CorrectRequestStatus", correct_request_status);

        message = encodeURIComponent(message)

        try {
            fetch(`https://api.telegram.org/bot${bot}/sendMessage?chat_id=${chatId}&text=${message}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return true;
        } catch (error) {
            console.log(`Error sendMessageTelegram: ${error}`)
        }
    };

    const executeCommandServerRemote = async (dirKeySsh, portServer, serverUser, ipServer, command) => {
        try {
            console.log(`ssh -i ${dirKeySsh} -p ${portServer} ${serverUser}@${ipServer} "${command}"`)
            exec(`ssh -i ${dirKeySsh} -p ${portServer} ${serverUser}@${ipServer} "${command}"`);
        } catch (error) {
            console.log(`Error executeCommandServerRemote: ${error}`)
        }

    };

    const getList = async () => {
        try {
            const query = `SELECT *
            FROM applications
            WHERE next_check <= CURRENT_TIMESTAMP()
            AND 
            queue_status = "A"`;
            const list = await app.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
            if (list.length > 0) {
                return list
            } else {
                return []
            }

        } catch (error) {
            console.log(`Error getList: ${error}`);
            return []
        }
    }

    const getTriggers = async (id) => {
        try {
            let trigger = await Triggers.findOne({
                where: {
                    id: id
                }
            });
            if (trigger) {
                return trigger
            } else {
                return false
            }

        } catch (error) {
            console.log(`Error getTriggers: ${error}`)
            return false
        }
    };

    const getUsersSshKey = async (id) => {
        try {
            let sshKey = await UsersSshKey.findOne({
                where: {
                    id: id
                }
            });
            if (sshKey) {
                return sshKey
            } else {
                return false
            }

        } catch (error) {
            console.log(`Error getUsersSshKey: ${error}`)
            return false
        }
    };


    const getServers = async (id) => {
        try {
            let server = await Servers.findOne({
                where: {
                    id: id
                }
            });
            if (server) {
                return server
            } else {
                return false
            }
        } catch (error) {
            console.log(`Error getServers: ${error}`);
            return false
        }
    };

    const getUsers = async (id) => {
        try {
            let user = await Users.findOne({
                where: {
                    id: id
                }
            });
            if (user) {
                return user
            } else {
                return false
            }
        } catch (error) {
            console.log(`Error getUsers: ${error}`);
            return false
        }
    };

    const getKeyExpirate = async () => {
        try {
            const query = `SELECT *
            FROM users_ssh_key
            WHERE expiration_date <= CURRENT_TIMESTAMP()`;
            const list = await app.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
            if (list.length > 0) {
                return list
            } else {
                return []
            }

        } catch (error) {
            console.log(`Error getList: ${error}`);
            return []
        }
    }


    const checkstatus = async () => {
        try {
            let list = await getList();
            if (list.length > 0) {

                for (let i = 0; i < list.length; i++) {
                    const application = list[i];
                    let { id,
                        users_id,
                        users_telegram_id,
                        triggers_id,
                        servers_id,
                        protocol,
                        url_or_ip,
                        port,
                        correct_request_status,
                        last_status,
                        check_interval,
                        attempts_limit,
                        attempts_error,
                        attempts_success,
                    } = application;

                    await Applications.update({
                        queue_status: 'P',
                        next_check: parseInt(new Date().getTime()) + parseInt(check_interval)
                    }, {
                        where: {
                            id: id
                        }
                    });

                    if (url_or_ip && port) {
                        fetch(`${protocol}://${url_or_ip}:${port}`)
                            .then(async (response) => {
                                if (response) {
                                    if (response.status === (correct_request_status ? correct_request_status : 200)) {
                                        //Is answering

                                        if (last_status == 'error') {
                                            attempts_success = parseInt(attempts_success) + parseInt(1)
                                            await Applications.update({
                                                queue_status: 'A',
                                                attempts_error: 0,
                                                attempts_success: attempts_success
                                            }, {
                                                where: {
                                                    id: id
                                                }
                                            });

                                            if (attempts_success >= attempts_limit) {
                                                await Applications.update({
                                                    last_check: new Date(),
                                                    next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                                    last_status: 'success'
                                                }, {
                                                    where: {
                                                        id: id
                                                    }
                                                });
                                                if (users_telegram_id) {
                                                    let telegram = await UsersTelegram.findOne({
                                                        where: {
                                                            id: users_telegram_id
                                                        }
                                                    });
                                                    if (telegram) {
                                                        const { bot_id, telegram_chat_id, message_success } = telegram;
                                                        await sendMessageTelegram(bot_id, telegram_chat_id, message_success, application);
                                                    }
                                                }

                                            }
                                            return;
                                        } else {
                                            await Applications.update({
                                                queue_status: 'A',
                                                last_check: new Date(),
                                                next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                                last_status: 'success',
                                                attempts_error: 0,
                                                attempts_success: 0,
                                            }, {
                                                where: {
                                                    id: id
                                                }
                                            });
                                            return;
                                        }
                                        //status incorrect
                                    } else {
                                        if (last_status == 'success') {
                                            attempts_error = parseInt(attempts_error) + parseInt(1)
                                            await Applications.update({
                                                queue_status: 'A',
                                                attempts_success: 0,
                                                attempts_error: attempts_error
                                            }, {
                                                where: {
                                                    id: id
                                                }
                                            });

                                            if (attempts_error >= attempts_limit) {
                                                await Applications.update({
                                                    last_check: new Date(),
                                                    next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                                    last_status: 'error'
                                                }, {
                                                    where: {
                                                        id: id
                                                    }
                                                });
                                                if (users_telegram_id) {
                                                    let telegram = await UsersTelegram.findOne({
                                                        where: {
                                                            id: users_telegram_id
                                                        }
                                                    });
                                                    if (telegram) {
                                                        const { bot_id, telegram_chat_id, message_error } = telegram;
                                                        await sendMessageTelegram(bot_id, telegram_chat_id, message_error, application);
                                                    }
                                                }
                                                if (triggers_id) {
                                                    let trigger = await getTriggers(triggers_id);
                                                    if (trigger) {
                                                        let { command } = trigger;

                                                        let server = await getServers(servers_id)
                                                        if (server) {
                                                            let portServer = server.server_ssh_port;
                                                            let dirKeySsh;
                                                            let serverUser = server.server_user;
                                                            let ipServer = server.server_ip
                                                            if (server.ssh_key_id) {
                                                                let sshkey = await getUsersSshKey(server.ssh_key_id);

                                                                let user = await getUsers(users_id)
                                                                if (user) {
                                                                    if (sshkey) {
                                                                        dirKeySsh = `../keys_ssh/${user.user}/${sshkey.key_name}`
                                                                    }
                                                                    executeCommandServerRemote(dirKeySsh, portServer, serverUser, ipServer, command)
                                                                }
                                                            }
                                                        }

                                                    }
                                                }
                                            }
                                            return;
                                        } else {
                                            await Applications.update({
                                                queue_status: 'A',
                                                last_check: new Date(),
                                                next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                                last_status: 'error',
                                                attempts_error: 0,
                                                attempts_success: 0,
                                            }, {
                                                where: {
                                                    id: id
                                                }
                                            });
                                            return;
                                        }
                                    }

                                    //Is not answering    
                                } else {
                                    if (last_status == 'success') {
                                        attempts_error = parseInt(attempts_error) + parseInt(1)
                                        await Applications.update({
                                            queue_status: 'A',
                                            attempts_success: 0,
                                            attempts_error: attempts_error
                                        }, {
                                            where: {
                                                id: id
                                            }
                                        });

                                        if (attempts_error >= attempts_limit) {
                                            await Applications.update({
                                                last_check: new Date(),
                                                next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                                last_status: 'error'
                                            }, {
                                                where: {
                                                    id: id
                                                }
                                            });
                                            if (users_telegram_id) {
                                                let telegram = await UsersTelegram.findOne({
                                                    where: {
                                                        id: users_telegram_id
                                                    }
                                                });
                                                if (telegram) {
                                                    const { bot_id, telegram_chat_id, message_error } = telegram;
                                                    await sendMessageTelegram(bot_id, telegram_chat_id, message_error, application);
                                                }
                                            }
                                            if (triggers_id) {
                                                let trigger = await getTriggers(triggers_id);
                                                if (trigger) {
                                                    let { command } = trigger;

                                                    let server = await getServers(servers_id)
                                                    if (server) {
                                                        let portServer = server.server_ssh_port;
                                                        let dirKeySsh;
                                                        let serverUser = server.server_user;
                                                        let ipServer = server.server_ip
                                                        if (server.ssh_key_id) {
                                                            let sshkey = await getUsersSshKey(server.ssh_key_id);

                                                            let user = await getUsers(users_id)
                                                            if (user) {
                                                                if (sshkey) {
                                                                    dirKeySsh = `../keys_ssh/${user.user}/${sshkey.key_name}`
                                                                }
                                                                executeCommandServerRemote(dirKeySsh, portServer, serverUser, ipServer, command)
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        return;
                                    } else {
                                        await Applications.update({
                                            queue_status: 'A',
                                            last_check: new Date(),
                                            next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                            last_status: 'error',
                                            attempts_error: 0,
                                            attempts_success: 0,
                                        }, {
                                            where: {
                                                id: id
                                            }
                                        });
                                        return;
                                    }
                                }
                            })
                            // Is not answering
                            .catch(async (erro) => {
                                console.log(erro.message)
                                if (last_status == 'success') {
                                    attempts_error = parseInt(attempts_error) + parseInt(1)
                                    await Applications.update({
                                        queue_status: 'A',
                                        attempts_success: 0,
                                        attempts_error: attempts_error
                                    }, {
                                        where: {
                                            id: id
                                        }
                                    });

                                    if (attempts_error >= attempts_limit) {
                                        await Applications.update({
                                            last_check: new Date(),
                                            next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                            last_status: 'error'
                                        }, {
                                            where: {
                                                id: id
                                            }
                                        });
                                        if (users_telegram_id) {
                                            let telegram = await UsersTelegram.findOne({
                                                where: {
                                                    id: users_telegram_id
                                                }
                                            });
                                            if (telegram) {
                                                const { bot_id, telegram_chat_id, message_error } = telegram;
                                                await sendMessageTelegram(bot_id, telegram_chat_id, message_error, application);
                                            }
                                        }
                                        if (triggers_id) {
                                            let trigger = await getTriggers(triggers_id);
                                            if (trigger) {
                                                let { command } = trigger;

                                                let server = await getServers(servers_id)
                                                if (server) {
                                                    let portServer = server.server_ssh_port;
                                                    let dirKeySsh;
                                                    let serverUser = server.server_user;
                                                    let ipServer = server.server_ip
                                                    if (server.ssh_key_id) {
                                                        let sshkey = await getUsersSshKey(server.ssh_key_id);

                                                        let user = await getUsers(users_id)
                                                        if (user) {
                                                            if (sshkey) {
                                                                dirKeySsh = `../keys_ssh/${user.user}/${sshkey.key_name}`
                                                            }
                                                            executeCommandServerRemote(dirKeySsh, portServer, serverUser, ipServer, command)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    return;
                                } else {
                                    await Applications.update({
                                        queue_status: 'A',
                                        last_check: new Date(),
                                        next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                        last_status: 'error',
                                        attempts_error: 0,
                                        attempts_success: 0,
                                    }, {
                                        where: {
                                            id: id
                                        }
                                    });
                                    return;
                                }
                            })

                    } else {
                        fetch(`${protocol}://${url_or_ip}`)
                            .then(async (response) => {
                                if (response) {
                                    if (response.status === (correct_request_status ? correct_request_status : 200)) {
                                        //Is answering

                                        if (last_status == 'error') {
                                            attempts_success = parseInt(attempts_success) + parseInt(1)
                                            await Applications.update({
                                                queue_status: 'A',
                                                attempts_error: 0,
                                                attempts_success: attempts_success
                                            }, {
                                                where: {
                                                    id: id
                                                }
                                            });

                                            if (attempts_success >= attempts_limit) {
                                                await Applications.update({
                                                    last_check: new Date(),
                                                    next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                                    last_status: 'success'
                                                }, {
                                                    where: {
                                                        id: id
                                                    }
                                                });
                                                if (users_telegram_id) {
                                                    let telegram = await UsersTelegram.findOne({
                                                        where: {
                                                            id: users_telegram_id
                                                        }
                                                    });
                                                    if (telegram) {
                                                        const { bot_id, telegram_chat_id, message_success } = telegram;
                                                        await sendMessageTelegram(bot_id, telegram_chat_id, message_success, application);
                                                    }
                                                }
                                            }
                                            return;
                                        } else {
                                            await Applications.update({
                                                queue_status: 'A',
                                                last_check: new Date(),
                                                next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                                last_status: 'success',
                                                attempts_error: 0,
                                                attempts_success: 0,
                                            }, {
                                                where: {
                                                    id: id
                                                }
                                            });
                                            return;
                                        }
                                        // Status incorrect
                                    } else {
                                        if (last_status == 'success') {
                                            attempts_error = parseInt(attempts_error) + parseInt(1)
                                            await Applications.update({
                                                queue_status: 'A',
                                                attempts_success: 0,
                                                attempts_error: attempts_error
                                            }, {
                                                where: {
                                                    id: id
                                                }
                                            });

                                            if (attempts_error >= attempts_limit) {
                                                await Applications.update({
                                                    last_check: new Date(),
                                                    next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                                    last_status: 'error'
                                                }, {
                                                    where: {
                                                        id: id
                                                    }
                                                });
                                                if (users_telegram_id) {
                                                    let telegram = await UsersTelegram.findOne({
                                                        where: {
                                                            id: users_telegram_id
                                                        }
                                                    });
                                                    if (telegram) {
                                                        const { bot_id, telegram_chat_id, message_error } = telegram;
                                                        await sendMessageTelegram(bot_id, telegram_chat_id, message_error, application);
                                                    }
                                                }
                                                if (triggers_id) {
                                                    let trigger = await getTriggers(triggers_id);
                                                    if (trigger) {
                                                        let { command } = trigger;

                                                        let server = await getServers(servers_id)
                                                        if (server) {
                                                            let portServer = server.server_ssh_port;
                                                            let dirKeySsh;
                                                            let serverUser = server.server_user;
                                                            let ipServer = server.server_ip
                                                            if (server.ssh_key_id) {
                                                                let sshkey = await getUsersSshKey(server.ssh_key_id);

                                                                let user = await getUsers(users_id)
                                                                if (user) {
                                                                    if (sshkey) {
                                                                        dirKeySsh = `../keys_ssh/${user.user}/${sshkey.key_name}`
                                                                    }
                                                                    executeCommandServerRemote(dirKeySsh, portServer, serverUser, ipServer, command)
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            return;
                                        } else {
                                            await Applications.update({
                                                queue_status: 'A',
                                                last_check: new Date(),
                                                next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                                last_status: 'error',
                                                attempts_error: 0,
                                                attempts_success: 0,
                                            }, {
                                                where: {
                                                    id: id
                                                }
                                            });
                                            return;
                                        }
                                    }
                                } else {
                                    // Is not answering
                                    if (last_status == 'success') {
                                        attempts_error = parseInt(attempts_error) + parseInt(1)
                                        await Applications.update({
                                            queue_status: 'A',
                                            attempts_success: 0,
                                            attempts_error: attempts_error
                                        }, {
                                            where: {
                                                id: id
                                            }
                                        });

                                        if (attempts_error >= attempts_limit) {
                                            await Applications.update({
                                                last_check: new Date(),
                                                next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                                last_status: 'error'
                                            }, {
                                                where: {
                                                    id: id
                                                }
                                            });
                                            if (users_telegram_id) {
                                                let telegram = await UsersTelegram.findOne({
                                                    where: {
                                                        id: users_telegram_id
                                                    }
                                                });
                                                if (telegram) {
                                                    const { bot_id, telegram_chat_id, message_error } = telegram;
                                                    await sendMessageTelegram(bot_id, telegram_chat_id, message_error, application);
                                                }
                                            }
                                            if (triggers_id) {
                                                let trigger = await getTriggers(triggers_id);
                                                if (trigger) {
                                                    let { command } = trigger;

                                                    let server = await getServers(servers_id)
                                                    if (server) {
                                                        let portServer = server.server_ssh_port;
                                                        let dirKeySsh;
                                                        let serverUser = server.server_user;
                                                        let ipServer = server.server_ip
                                                        if (server.ssh_key_id) {
                                                            let sshkey = await getUsersSshKey(server.ssh_key_id);

                                                            let user = await getUsers(users_id)
                                                            if (user) {
                                                                if (sshkey) {
                                                                    dirKeySsh = `../keys_ssh/${user.user}/${sshkey.key_name}`
                                                                }
                                                                executeCommandServerRemote(dirKeySsh, portServer, serverUser, ipServer, command)
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        return;
                                    } else {
                                        await Applications.update({
                                            queue_status: 'A',
                                            last_check: new Date(),
                                            next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                            last_status: 'error',
                                            attempts_error: 0,
                                            attempts_success: 0,
                                        }, {
                                            where: {
                                                id: id
                                            }
                                        });
                                        return;
                                    }
                                }
                            })
                            // Is not answering
                            .catch(async (erro) => {
                                console.log(erro.message)
                                if (last_status == 'success') {
                                    attempts_error = parseInt(attempts_error) + parseInt(1)
                                    await Applications.update({
                                        queue_status: 'A',
                                        attempts_success: 0,
                                        attempts_error: attempts_error
                                    }, {
                                        where: {
                                            id: id
                                        }
                                    });

                                    if (attempts_error >= attempts_limit) {
                                        await Applications.update({
                                            last_check: new Date(),
                                            next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                            last_status: 'error'
                                        }, {
                                            where: {
                                                id: id
                                            }
                                        });
                                        if (users_telegram_id) {
                                            let telegram = await UsersTelegram.findOne({
                                                where: {
                                                    id: users_telegram_id
                                                }
                                            });
                                            if (telegram) {
                                                const { bot_id, telegram_chat_id, message_error } = telegram;
                                                await sendMessageTelegram(bot_id, telegram_chat_id, message_error, application);
                                            }
                                        }
                                        if (triggers_id) {
                                            let trigger = await getTriggers(triggers_id);
                                            if (trigger) {
                                                let { command } = trigger;

                                                let server = await getServers(servers_id)
                                                if (server) {
                                                    let portServer = server.server_ssh_port;
                                                    let dirKeySsh;
                                                    let serverUser = server.server_user;
                                                    let ipServer = server.server_ip
                                                    if (server.ssh_key_id) {
                                                        let sshkey = await getUsersSshKey(server.ssh_key_id);

                                                        let user = await getUsers(users_id)
                                                        if (user) {
                                                            if (sshkey) {
                                                                dirKeySsh = `../keys_ssh/${user.user}/${sshkey.key_name}`
                                                            }
                                                            executeCommandServerRemote(dirKeySsh, portServer, serverUser, ipServer, command)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    return;
                                } else {
                                    await Applications.update({
                                        queue_status: 'A',
                                        last_check: new Date(),
                                        next_check: parseInt(new Date().getTime()) + parseInt(check_interval),
                                        last_status: 'error',
                                        attempts_error: 0,
                                        attempts_success: 0,
                                    }, {
                                        where: {
                                            id: id
                                        }
                                    });
                                    return;
                                }
                            })

                    }
                }
            }
        } catch (error) {
            console.log(`Error checkstatus: ${error}`)
            return;
        }
    }

    const keySShExpirate = async () => {
        try {
            let keys = await getKeyExpirate();

            if (keys.length > 0) {
                for (let i = 0; i < keys.length; i++) {
                    await UsersSshKey.destroy({
                        where: {
                            id: keys[i].id
                        }
                    });
                }
            }

        } catch (error) {
            console.log(`Error keySShExpirate: ${error}`)
            return;
        }
    }


    _self.start = () => {
        new CronJob('* * * * * *', async () => {
            await checkstatus();
        }, null, true, 'America/Sao_Paulo');

        new CronJob('00 * * * * *', async () => {
            await keySShExpirate();
        }, null, true, 'America/Sao_Paulo');
    }

    return _self;
}