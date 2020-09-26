import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLogin } from 'react-admin';
import { MuiThemeProvider } from '@material-ui/core/styles';
import './LoginPage.css'
import 'bootstrap/dist/css/bootstrap.css'
import './fontawesome/css/all.min.css'
class LoginPage extends Component {

    submit = async (e) => {
        e.preventDefault();
        const target = e.target;
        let username = target.username.value
        let password = target.password.value
        //const credentials = { username, password };

        //this.props.userLogin(credentials);

        let token = localStorage.getItem('token')

        if (!token) {
            let url;
            if (window.location.host.indexOf("localhost") !== -1) {
                url = "http://localhost:8065/jwt"
            } else {
                url = "https://service.monitoramos.com.br/jwt"
            }

            let xhttp = new XMLHttpRequest();

            xhttp.open("GET", url, true);
            xhttp.setRequestHeader('token', '@f3fg4ieWEFwfI3R3@4REFFSFEG$%dfsdf');
            xhttp.setRequestHeader('username', username);

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    token = xhttp.responseText
                    token = JSON.parse(token)
                    token = token.token
                    localStorage.setItem('token', token);
                }
            }
            xhttp.send();
        }
            
            if (!token) {
                token = localStorage.getItem('token')
                
            }
            console.log(token)
            let url;
            if (window.location.host.indexOf("localhost") !== -1) {
                url = "http://localhost:8065/login"
            } else {
                url = "https://service.monitoramos.com.br/login"
            }
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
            let body = {
                "user": username,
                "password": password
            }

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    let response = xhttp.responseText
                    response = JSON.parse(response)
                    localStorage.setItem('username', username);
                    localStorage.setItem('secret', response.secret);
                    localStorage.setItem('permission', response.permission);
                    window.location.href = `${window.location.origin}/#/`
                } else {
                    let message = xhttp.responseText
                    message = JSON.parse(message)
                    if (message.message !== "exist") {
                        return alert(message.message);
                    }
                }
            }
            xhttp.send(JSON.stringify(body));
        }
        signup = (e) => {
            e.preventDefault();
            const target = e.target;
            let name = target.name.value
            let username = target.useremail.value
            let password = target.userpass.value
            let passwordrepeat = target.userrepeatpass.value

            if (password !== passwordrepeat) {
                return alert("Passwords entered are different!");
            }

            let url;
            if (window.location.host.indexOf("localhost") !== -1) {
                url = "http://localhost:8065/register"
            } else {
                url = "https://service.monitoramos.com.br/register"
            }


            let token = localStorage.getItem('token')

            if (!token) {
                let url;
                if (window.location.host.indexOf("localhost") !== -1) {
                    url = "http://localhost:8065/jwt"
                } else {
                    url = "https://service.monitoramos.com.br/jwt"
                }

                let xhttp = new XMLHttpRequest();
                let token;

                xhttp.open("GET", url, true);
                xhttp.setRequestHeader('token', '@f3fg4ieWEFwfI3R3@4REFFSFEG$%dfsdf');
                xhttp.setRequestHeader('username', username);

                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        token = xhttp.responseText
                        token = JSON.parse(token)
                        localStorage.setItem('token', token.token);
                    } else {
                        let message = xhttp.responseText
                        message = JSON.parse(message)
                        return alert(message.message);
                    }
                }
                xhttp.send();
            }
            if (!token) {
                token = localStorage.getItem('token')
            }

            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", url, true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
            let body = {
                "name": name,
                "username": username,
                "password": password
            }

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    return alert("User successfully registered!");
                } else {
                    let message = xhttp.responseText
                    message = JSON.parse(message)
                    return alert(message.message);
                }
            }
            xhttp.send(JSON.stringify(body));

        }

        forgotPass = (e) => {
            e.preventDefault();
            const target = e.target;
            let username = target.username.value
            let password = target.password.value
            const credentials = { username, password };

            this.props.userLogin(credentials);
        }

        render() {
            return (
                <MuiThemeProvider theme={this.props.theme}>
                    <div id="logreg-forms">
                        <form onSubmit={this.submit}>
                            <h1 class="h3 mb-3 font-weight-normal text-center"> Sign in</h1>
                            {window.innerWidth > 500 ? <div id="buttonGoogle" class="g-signin2" data-width="380" data-height="35" data-longtitle="true" data-onsuccess="onSignIn" /> : <div id="buttonGoogle" class="g-signin2" data-width="270" data-longtitle="true" data-onsuccess="onSignIn" />}
                            <p class="text-center"> OR  </p>
                            <input type="email" id="username" name="username" class="form-control" placeholder="Email address" required="" autofocus="" />
                            <input type="password" id="password" name="password" class="form-control" placeholder="Password" required="" />
                            <button class="btn btn-success btn-block" type="submit"><i class="fas fa-sign-in-alt"></i> Sign in</button>
                            <a href="/" id="forgot_pswd">Forgot password?</a>
                            <hr />
                            <a href="/" class="btn btn-primary btn-block" id="btn-signup"><i class="fas fa-user-plus"></i> Sign up New Account</a>
                        </form>
                        <form onSubmit={this.forgotPass} class="form-reset">
                            <input type="email" id="resetEmail" class="form-control" placeholder="Email address" required="" autofocus="" />
                            <button class="btn btn-primary btn-block" type="submit">Reset Password</button>
                            <a href="/" id="cancel_reset"><i class="fas fa-angle-left"></i> Back</a>
                        </form>
                        <form onSubmit={this.signup} class="form-signup">
                            <input type="text" id="name" class="form-control" placeholder="Full name" required="" autofocus="" />
                            <input type="email" id="useremail" class="form-control" placeholder="Email address" required autofocus="" />
                            <input type="password" id="userpass" class="form-control" placeholder="Password" required autofocus="" />
                            <input type="password" id="userrepeatpass" class="form-control" placeholder="Repeat Password" required autofocus="" />

                            <button class="btn btn-primary btn-block" type="submit"><i class="fas fa-user-plus"></i> Sign Up</button>
                            <a href="/" id="cancel_signup"><i class="fas fa-angle-left"></i> Back</a>
                        </form>
                    </div>
                </MuiThemeProvider>
            );
        }
    };

    export default connect(undefined, { userLogin })(LoginPage);