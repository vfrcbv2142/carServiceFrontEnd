import ApiService from './ApiService';

const getAllNotesByOrderId = (id) => {
    return ApiService.get('/notes?orderId=' + id);
}

const createNote = (text, orderId) => {
    return ApiService.post('/notes', {text, orderId});
}

const updateNote = (id, text, orderId) => { 
    return ApiService.put('/notes/' + id, {id, text, orderId});
}

const deleteNote = (id) => {
    return ApiService.delete('/notes/' + id);
}

const NoteService = {
    getAllNotesByOrderId,
    createNote,
    updateNote,
    deleteNote
}

export default NoteService