
    function tokenJWT(username) {
        let url;
        if(window.location.host.indexOf("localhost") !== -1){
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
          }
        }
        xhttp.send();
        return true;
      }
  
      function getLevelSecret(username) {
        let url;
        if(window.location.host.indexOf("localhost") !== -1){
            url = "http://localhost:8065/login/google"
        } else {
            url = "https://service.monitoramos.com.br/login/google"
        }
  
        let token = localStorage.getItem('token')
        token = token  
        let tokenGoogle = localStorage.getItem('token_google')
  
        let xhttp = new XMLHttpRequest();
  
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
        xhttp.setRequestHeader('username', username);
        xhttp.setRequestHeader('token_google', tokenGoogle);
  
        xhttp.onreadystatechange = function () {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = xhttp.responseText
            response = JSON.parse(response)
            localStorage.setItem('secret', response.secret);
            localStorage.setItem('permission', response.permission);
            window.location.href = `${window.location.origin}/#/`
          }
        }
        xhttp.send();
        return true;
      }
  
      async function onSignIn(googleUser) {
  
        let profile = googleUser.getBasicProfile();
  
        let id_token = googleUser.getAuthResponse().id_token;
  
        localStorage.setItem('image', profile.getImageUrl());
        localStorage.setItem('token_google', id_token);
        localStorage.setItem('id', profile.getId());
        localStorage.setItem('username', profile.getEmail());
  
        let username = profile.getEmail()
  
        await tokenJWT(username);
  
       await getLevelSecret(username)
  
      }

      function signOut() {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {

            
        });
    }