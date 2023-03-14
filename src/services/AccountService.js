import AuthService from "./AuthService";
import ApiService from './ApiService';

const getAllAccounts = () => {
    return ApiService.get('/accounts');
}

const getAccountById = (id) => {
    return ApiService.get('/accounts/' + id);
}

const createAccount = (login, email, password) => {
    return  AuthService.signUp(login, email, password);
}

const updateAccount = (id, account) => { //update method update
    return ApiService.put('/accounts/' + id, account);
}

const deleteAccount = (id) => {
    return ApiService.delete('/accounts/' + id);
}

const AccountService = {
    getAllAccounts,
    getAccountById,
    createAccount,
    updateAccount,
    deleteAccount
}

export default AccountService