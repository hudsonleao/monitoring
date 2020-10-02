import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

let apiUrl;
if (process.env.NODE_ENV === "development") {
    apiUrl = "http://localhost:8065"
} else {
    apiUrl = "https://api.monitoramos.com.br"
}
const httpClient = fetchUtils.fetchJson;

export default {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };

        let user = localStorage.getItem('username');
        let secret = localStorage.getItem('secret');
        let token = localStorage.getItem('token');

        let header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user': user,
            'secret': secret
        }

        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'GET',
            headers: new Headers(header),
        }).catch((error) => {
            let erro = error.message
            throw erro;
        }).then(({ json }) => ({
            data: json,
            total: parseInt(json.length),
        }));
    },

    getOne: (resource, params) => {
        let user = localStorage.getItem('username');
        let secret = localStorage.getItem('secret');
        let token = localStorage.getItem('token');

        let header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user': user,
            'secret': secret
        }
        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'GET',
            headers: new Headers(header),
        }).catch((error) => {
            let erro = error.message
            throw erro;
        }).then(({ json }) => ({
            data: json,
        }));
    },

    getMany: (resource, params) => {
        let user = localStorage.getItem('username');
        let secret = localStorage.getItem('secret');
        let token = localStorage.getItem('token');

        let header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user': user,
            'secret': secret
        }
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'GET',
            headers: new Headers(header),
        }).catch((error) => {
            let erro = error.message
            throw erro;
        }).then(({ json }) => ({
            data: json,
        }));
    },

    getManyReference: (resource, params) => {
        let user = localStorage.getItem('username');
        let secret = localStorage.getItem('secret');
        let token = localStorage.getItem('token');

        let header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user': user,
            'secret': secret
        }
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };

        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'GET',
            headers: new Headers(header),
        }).catch((error) => {
            let erro = error.message
            throw erro;
        }).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    update: async (resource, params) => {
        let user = localStorage.getItem('username');
        let secret = localStorage.getItem('secret');
        let token = localStorage.getItem('token');

        let header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user': user,
            'secret': secret
        }
        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
            headers: new Headers(header),
        }).catch((error) => {
            let erro = error.message
            throw erro;
        }).then(({ json }) => ({ data: json }))
    },
    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).catch((error) => {
            let erro = error.message
            throw erro;
        }).then(({ json }) => ({ data: json }));
    },

    create: (resource, params) => {
        let user = localStorage.getItem('username');
        let secret = localStorage.getItem('secret');
        let token = localStorage.getItem('token');

        let header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user': user,
            'secret': secret
        }
        return httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
            headers: new Headers(header),
        }).catch((error) => {
            let erro = error.message
            throw erro;
        }).then(({ json }) => ({data: json }))
    },

    delete: (resource, params) =>{
        let user = localStorage.getItem('username');
        let secret = localStorage.getItem('secret');
        let token = localStorage.getItem('token');

        let header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user': user,
            'secret': secret
        }
        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
            headers: new Headers(header),
        }).catch((error) => {
            let erro = error.message
            throw erro;
        }).then(({ json }) => ({ data: json }))
    },
    deleteMany: (resource, params) => {
        let user = localStorage.getItem('username');
        let secret = localStorage.getItem('secret');
        let token = localStorage.getItem('token');

        let header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'user': user,
            'secret': secret
        }
        return httpClient(`${apiUrl}/${resource}`, {
            method: 'DELETE',
            body: JSON.stringify({ id: params.ids }),
            headers: new Headers(header),
        }).catch((error) => {
            let erro = error.message
            throw erro;
        }).then(({ json }) => ({ data: json }));
    }
};
