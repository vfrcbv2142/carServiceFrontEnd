import ApiService from './ApiService';

const getAllEmployeesByAccountId = (id) => {
    return ApiService.get('/employees?accountId=' + id);
}

const getEmployeeById = (id) => {
    return ApiService.get('/employees/' + id);
}

const createEmployee = (firstName, lastName, phoneNumber, email, position, accountId) => {
    return ApiService.post('/employees', {firstName, lastName, phoneNumber, email, position, accountId});
}

const updateEmployee = (id, firstName, lastName, phoneNumber, email, position, ordersIds) => {
    return ApiService.put('/employees/' + id, {id, firstName, lastName, phoneNumber, email, position, ordersIds});
}

const deleteEmployee = (id) => {
    return ApiService.delete('/employees/' + id);
}

const EmployeeService = {
    getAllEmployeesByAccountId,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
}

export default EmployeeService