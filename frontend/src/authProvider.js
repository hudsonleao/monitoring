import axios from 'axios';

let apiUrl;
if (process.env.NODE_ENV === "development") {
    apiUrl = "http://localhost:8065"
} else {
    apiUrl = "https://service.monitoramos.com.br"
}

export default {
    // called when the user attempts to log in
    login: async ({ username, password }) => {

        const { data } = await axios.get(`${apiUrl}/jwt`, {
            headers: { 'token': '@f3fg4ieWEFwfI3R3@4REFFSFEG$%dfsdf' }
        });
        localStorage.setItem('token', data.token);

        let params = {
            user: username,
            password: password,
        }
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
        }

        const consulta = await axios.post(`${apiUrl}/login`, params, {
            headers: headers
        });
        let secret = consulta.data.secret


        if (consulta.status === 200) {
            localStorage.setItem('username', username);
            localStorage.setItem('secret', secret);


        }
    },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem('username');
        localStorage.removeItem('secret');
        localStorage.removeItem('token')
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }) => {
        if(status === 406){
            return Promise.resolve();
        }
        if (status === 401 || status === 403) {
            localStorage.removeItem('username');
            localStorage.removeItem('secret');
            localStorage.removeItem('token')
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem('username') && localStorage.getItem('token') && localStorage.getItem('secret')
            ? Promise.resolve()
            : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),
};
