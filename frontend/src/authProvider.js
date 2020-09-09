import axios from 'axios';

let apiUrl = process.env.API_URL;

export default {
    // called when the user attempts to log in
    login: async ({ username, password }) => {

        const { data } = await axios.get(`${apiUrl}/jwt`);
        localStorage.setItem('token', data.token);

        let params = {
            user: username,
            password: password,
        }
        const headers = {
            'Content-Type': 'application/json',
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
