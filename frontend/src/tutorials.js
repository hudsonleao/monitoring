import React, { Component } from "react";
import CreationBot from './tutorials/creation_of_the_telegram_bot_step_by_step.pdf';
import GetPrivate from './tutorials/get_chat_id_private_message.pdf';
import GetGroup from './tutorials/get_chat_id_group.pdf';
import AddTokenAndChatId from './tutorials/add_telegram_token_and_chat_id.pdf';
import CreateKeySSh from './tutorials/how_to_create_the_ssh_key_and_insert_it_on_the_server.pdf'
import 'bootstrap/dist/css/bootstrap.css'

class App extends Component {
    render() {
        return (
            <div className="app">
                <div class="container">
                    <h1>Tutorials</h1>
                    <br />
                    <h3>Telegram</h3>
                    <li><a href={CreationBot}> Creation of the Telegram bot step by step</a></li>
                    <li><a href={GetPrivate}> Get chat id private message</a></li>
                    <li><a href={GetGroup}> Get chat id group</a></li><br />

                    <h3>Monitoring</h3>
                    <li><a href={AddTokenAndChatId}> Add Telegram token bot and chat id</a></li>
                    <li><a href={CreateKeySSh}> How to create the ssh key and insert it on the server</a></li><br />
                </div>
            </div>
        );
    }
}

export default App;