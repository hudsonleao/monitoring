import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = $API_URL;
const httpClient = fetchUtils.fetchJson;

let user = localStorage.getItem('username');
let secret = localStorage.getItem('secret');


export default {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
        };

        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'GET',
            headers: new Headers({ 'user': user, 'secret': secret }),
        }).then(({ json }) => ({
            data: json,
            total: parseInt(json.length),
        }));
    },

    getOne: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'GET',
            headers: new Headers({ 'user': user, 'secret': secret }),
        }).then(({ json }) => ({
            data: json,
        }));
    },

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'GET',
            headers: new Headers({ 'user': user, 'secret': secret }),
        }).then(({ headers, json }) => ({
            data: json,
        }));
    },

    getManyReference: (resource, params) => {
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
            headers: new Headers({ 'user': user, 'secret': secret }),
        }).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    update: async (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
            headers: new Headers({ 'user': user, 'secret': secret }),
        }).catch((error) => {
            let erro;
            if (error.status === 406) {
                erro = "Url or ip is registered."
            } else if (error.status === 401) {
                erro = "User invalid"
            }
            throw erro;
        }).then(({ json }) => ({ data: json })),

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    create: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
            headers: new Headers({ 'user': user, 'secret': secret }),
        }).catch((error) => {
            let erro;
            if (error.status === 406) {
                erro = "Url or ip is registered."
            } else if (error.status === 401) {
                erro = "User invalid"
            }
            throw erro;
        }).then(({ json }) => ({
            data: { ...params.data, id: json.id },
        }))
    },

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
            headers: new Headers({ 'user': user, 'secret': secret }),
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource, params) => {

        return httpClient(`${apiUrl}/${resource}`, {
            method: 'DELETE',
            body: JSON.stringify({ id: params.ids }),
            headers: new Headers({ 'user': user, 'secret': secret }),
        }).then(({ json }) => ({ data: json }));
    }
};
