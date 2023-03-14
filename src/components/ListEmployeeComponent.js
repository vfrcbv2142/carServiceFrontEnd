import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AuthService from '../services/AuthService';
import EmployeeService from '../services/EmployeeService';
import TokenService from "../services/TokenService";



const ListEmployeeComponent = () => {

    const [employees, setEmployees] = useState([])
    const ownerId = TokenService.getCurrentAccount().id
    const navigate = useNavigate()

    useEffect(() => {
        getAllEmployees(ownerId);
    }, [])

    const getAllEmployees = (AccountId) => {
        EmployeeService.getAllEmployeesByAccountId(AccountId).then((res) => {
            if (Object.keys(res.data).length === 0) {
                setEmployees([]);
            } else {
                setEmployees(res.data._embedded.employees);
            }
        }).catch((error) => {
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        })
    }

    const deleteEmployee = (id) => {
        EmployeeService.deleteEmployee(id).then(() => {
            getAllEmployees(ownerId);
        }).catch((error) => {
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        })
    }

    return (
        <div>
            <h2 className='text-center'>Employees List</h2>
            <Link to='/add-employee' className='btn btn-primary mb-2'> Add Employee</Link>
            <div className='table-responsive'>
                <table className='table table-sm table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th className='col-2'>First Name</th>
                            <th className='col-2'>Last Name</th>
                            <th className='col-2'>Phone Number</th>
                            <th className='col-2'>Email</th>
                            <th className='col-2'>Position</th>
                            <th className='col-2'>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            employees.map(
                                employee =>
                                <tr key= {employee.id}>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{employee.phoneNumber}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.position}</td>
                                    <td>
                                        <Link className='btn btn-info mr-2' to={'/edit-employee/' + employee.id}> Update </Link>
                                        <button className='btn btn-danger' onClick={() => deleteEmployee(employee.id)}> Delete </button>
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

export default ListEmployeeComponent;