import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AuthService from '../services/AuthService';
import AccountService from '../services/AccountService';


const ListAccountComponent = () => {

    const navigate = useNavigate()
    const [accounts, setAccounts] = useState([])

    useEffect(() => {
        getAllAccounts();
    }, [])

    const getAllAccounts = () => {
        AccountService.getAllAccounts().then((res) => {
            if (Object.keys(res.data).length === 0) {
                setAccounts(res.data._embedded.accounts);
            } else {
                setAccounts([]);
            }
        }).catch((error) => {
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        })
    }

    const deleteAccount = (id) => {
        AccountService.deleteAccount(id).then(() => {
            getAllAccounts();
        }).catch((error) => {
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        })
    }

    return (
        <div className='container'>
            <h2 className='text-center'>Accounts List</h2>
            <Link to='/add-account' className='btn btn-primary mb-2'> Create Account</Link>
            <div className='table-responsive'>
                <table className='table table-sm table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th className='col-1'>Account Id</th>
                            <th className='col-3'>Account Login</th>
                            <th className='col-4'>Account Email</th>
                            <th className='col-2'>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            accounts.map(
                                account =>
                                <tr key= {account.id}>
                                    <td>{account.id}</td>
                                    <td>{account.login}</td>
                                    <td>{account.email}</td>
                                    <td>
                                        <Link className='btn btn-info mr-2' to={'/edit-account/' + account.id}> Update </Link>
                                        <button className='btn btn-danger' onClick={() => deleteAccount(account.id)}> Delete </button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListAccountComponent;