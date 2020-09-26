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
            headers: {
                'token': '@f3fg4ieWEFwfI3R3@4REFFSFEG$%dfsdf',
                'username': username
            }
        });
        localStorage.setItem('token', data.token);

        let params = {
            user: username,
            password: password,
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

        const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`
    }

        const consulta = await axios.post(`${apiUrl}/login`, params, {
        headers: headers
    });
    let secret = consulta.data.secret
        let permission = consulta.data.permission

        if(consulta.status === 200) {
    localStorage.setItem('username', username);
    localStorage.setItem('secret', secret);
    localStorage.setItem('permission', permission);

}
    },
// called when the user clicks on the logout button
logout: async () => {
    localStorage.clear();
    sessionStorage.clear();

    return Promise.resolve();
},
    // called when the API returns an error
    checkError: ({ status }) => {
        if (status === 406) {
            return Promise.resolve();
        }
        if (status === 401 || status === 403) {
            localStorage.removeItem('username');
            localStorage.removeItem('secret');
            localStorage.removeItem('token')
            localStorage.removeItem('permission');
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
            getPermissions: () => {
                const role = localStorage.getItem('permission');
                return role ? Promise.resolve(role) : Promise.reject();
            }
};
