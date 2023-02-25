import ApiService from './ApiService';

const getAllOrdersByAccountId = (id) => {
    return ApiService.get('/orders?accountId=' + id);
}

const getOrderById = (id) => {
    return ApiService.get('/orders/' + id);
}

const createOrder = (name, accountId, clientId, creationDate, employeesIds, itemsIds, notesIds) => {
    return ApiService.post('/orders', {name, accountId, clientId, creationDate, employeesIds, itemsIds, notesIds});
}

const updateOrder = (id, name, clientId, creationDate, employeesIds, itemsIds, notesIds) => { 
    return ApiService.put('/orders/' + id, {id, name, clientId, creationDate, employeesIds, itemsIds, notesIds});
}

const deleteOrder = (id) => {
    return ApiService.delete('/orders/' + id);
}

const OrderService = {
    getAllOrdersByAccountId,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
}

export default OrderService