import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userLogin } from 'react-admin';
import { MuiThemeProvider } from '@material-ui/core/styles';
import './LoginPage.css'
import 'bootstrap/dist/css/bootstrap.css'
import './fontawesome/css/all.min.css'

class LoginPage extends Component {

    submit = (e) => {
        e.preventDefault();
        const target = e.target;
        let username = target.username.value
        let password = target.password.value
        const credentials = { username, password };

        // Dispatch the userLogin action (injected by connect)
        this.props.userLogin(credentials);
    }

    render() {
        return (
            <MuiThemeProvider theme={this.props.theme}>
                <div id="logreg-forms">
                    <form onSubmit={this.submit}>
                        <h1 class="h3 mb-3 font-weight-normal text-center"> Sign in</h1>
                        {window.innerWidth > 500 ? <div id="buttonGoogle" class="g-signin2" data-width="380" data-height="35" data-longtitle="true" data-onsuccess="onSignIn" /> : <div id="buttonGoogle" class="g-signin2" data-width="270" data-longtitle="true" data-onsuccess="onSignIn"/>}
                        <p class="text-center"> OR  </p>
                        <input type="email" id="username" name="username" class="form-control" placeholder="Email address" required="" autofocus="" />
                        <input type="password" id="password" name="password" class="form-control" placeholder="Password" required="" />
                        <button class="btn btn-success btn-block" type="submit"><i class="fas fa-sign-in-alt"></i> Sign in</button>
                        <a href="test3" id="forgot_pswd">Forgot password?</a>
                        <hr />
                        <button class="btn btn-primary btn-block" type="button" id="btn-signup"><i class="fas fa-user-plus"></i> Sign up New Account</button>
                    </form>
                </div>
            </MuiThemeProvider>
        );
    }
};

export default connect(undefined, { userLogin })(LoginPage);