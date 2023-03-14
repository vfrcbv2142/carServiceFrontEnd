import ApiService from './ApiService';

const getAllClientsByAccountId = (id) => {
    return ApiService.get('/clients?accountId=' + id);
}

const getClientById = (id) => {
    return ApiService.get('/clients/' + id);
}

const createClient = (firstName, lastName, phoneNumber, email, accountId) => {
    return ApiService.post('/clients', {firstName, lastName, phoneNumber, email, accountId});
}

const updateClient = (id, firstName, lastName, phoneNumber, email, ordersIds) => {
    return ApiService.put('/clients/' + id, {id, firstName, lastName, phoneNumber, email, ordersIds});
}

const deleteClient = (id) => {
    return ApiService.delete('/clients/' + id);
}

const ClientService = {
    getAllClientsByAccountId,
    getClientById,
    createClient,
    updateClient,
    deleteClient
}

export default ClientService