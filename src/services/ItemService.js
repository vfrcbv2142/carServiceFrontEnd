import ApiService from './ApiService';

const getAllItemsByOrderId = (id) => {
    return ApiService.get('/items?orderId=' + id);
}

const createItem = (name, itemPrice) => { 
    return ApiService.post('/items', {name, itemPrice});
}

const updateItem = (id, name, itemPrice) => { 
    return ApiService.put('/items/' + id, {id, name, itemPrice});
}

const deleteItem = (id) => {
    return ApiService.delete('/items/' + id);
}

const NoteService = {
    getAllItemsByOrderId,
    createItem,
    updateItem,
    deleteItem
}

export default NoteService