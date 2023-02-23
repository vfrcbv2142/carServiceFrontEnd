import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AuthService from '../services/AuthService';
import ClientService from '../services/ClientService';
import TokenService from "../services/TokenService";



const ListClientComponent = () => {

    const [clients, setClients] = useState([])
    const ownerId = TokenService.getCurrentAccount().id
    const navigate = useNavigate()

    useEffect(() => {
        getAllClients(ownerId);
    }, [])

    const getAllClients = (AccountId) => {
        ClientService.getAllClientsByAccountId(AccountId).then((res) => {
            if (Object.keys(res.data).length === 0) {
                setClients([]);
            } else {
                setClients(res.data._embedded.clients);
            }
        }).catch((error) => {
            console.log(error);
            AuthService.refreshTokenIfExpired(error, navigate);
        })
    }

    const deleteClient = (id) => {
        ClientService.deleteClient(id).then(() => {
            getAllClients(ownerId);
        }).catch((error) => {
            console.log(error);
            AuthService.refreshTokenIfExpired(error, navigate);
        })
    }

    return (
        <div className='container'>
            <h2 className='text-center'>Clients List</h2>
            <Link to='/add-client' className='btn btn-primary mb-2'> Add Client</Link>
            <table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th className='col-2'>First Name</th>
                        <th className='col-2'>Last Name</th>
                        <th className='col-2'>Phone Number</th>
                        <th className='col-2'>Email</th>
                        <th className='col-2'>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        clients.map(
                            client =>
                            <tr key= {client.id}>
                                <td>{client.firstName}</td>
                                <td>{client.lastName}</td>
                                <td>{client.phoneNumber}</td>
                                <td>{client.email}</td>
                                <td>
                                    <Link className='btn btn-info' to={'/edit-client/' + client.id}> Update </Link>
                                    <button className='btn btn-danger ml-2' onClick={() => deleteClient(client.id)}> Delete </button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ListClientComponent;