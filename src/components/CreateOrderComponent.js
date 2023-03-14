import React, {useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Select from 'react-select'
import AuthService from '../services/AuthService';
import TokenService from "../services/TokenService";
import EmployeeService from '../services/EmployeeService';
import ClientService from '../services/ClientService';
import OrderService from '../services/OrderService';
import { useFormik } from 'formik';
import * as Yup from 'yup';


const CreateOrderComponent = () => {

    const navigate = useNavigate()

    const ownerId = TokenService.getCurrentAccount().id

    const [clients, setClients] = useState([]);
    const [employees, setEmployees] = useState([]);

    const formik = useFormik({
        initialValues: {
          name: '',
          orderClient: {},
          orderEmployees: []
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required').max(255, 'Too many leters'),
            orderClient: Yup.object().test(
                'empty-check',
                'Required',
                (obj) => 'value' in obj
            )
        }),
        onSubmit: values => {
            let currentDate = new Date();
            let formatedDate = currentDate.getFullYear()+"-"
                +((currentDate.getMonth()+1) < 10 ? ('0'+(currentDate.getMonth()+1)) : (currentDate.getMonth()+1))
                +'-'+((currentDate.getDate()+1) < 10 ? ('0'+(currentDate.getDate()+1)) : (currentDate.getDate()+1))+'T'
                +(currentDate.getHours() < 10 ? ('0'+currentDate.getHours()) : currentDate.getHours())
                +':'+(currentDate.getMinutes() < 10 ? ('0'+currentDate.getMinutes()) : currentDate.getMinutes())
                +':'+(currentDate.getSeconds() < 10 ? ('0'+currentDate.getSeconds()) : currentDate.getSeconds())
                +'.00';

            const employeesIds = values.orderEmployees.map(employee => employee.value);

            createOrder(values.name, values.orderClient.value, employeesIds, formatedDate, ownerId);
        },
      });


    const createOrder = (name, clientId, employeesIds, creationDate, ownerId) => {
        OrderService.createOrder(name, ownerId, clientId, creationDate, employeesIds, [], []).then((res) => {
            navigate('/orders/' + res.data.id);
        }).catch(error =>{
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        });
    }

    useEffect(() =>{
        ClientService.getAllClientsByAccountId(ownerId).then((res) => {
            if (Object.keys(res.data).length === 0) {
                setClients([]);
            } else {
                setClients(res.data._embedded.clients);
            }
        }).catch(error =>{
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        })

        EmployeeService.getAllEmployeesByAccountId(ownerId).then((res) => {
            if (Object.keys(res.data).length === 0) {
                setEmployees([]);
            } else {
                setEmployees(res.data._embedded.employees);
            }
        }).catch(error =>{
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        })
    }, [])

    const clientOptions = () => {
        let options = [];
        clients.forEach(client => options.push({value: client.id, label: client.firstName + ' ' + client.lastName}));
        return options;
    }

    const employeesOptions = () => {
        let options = [];
        employees.forEach(employee => options.push({value: employee.id, label: employee.firstName + ' ' + employee.lastName}));
        return options;
    }

    return (
        <div>
        <br /><br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                <h2 className='text-center'> Add Order </h2>
                    <div className='card-body'>
                        <form onSubmit={formik.handleSubmit}>

                            <div className='form-group mb-2'>
                                <label className='form-label'> Order Name : </label>
                                <input 
                                    type='text' 
                                    placeholder='Enter order name' 
                                    name='name' 
                                    className='form-control'
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.name && formik.errors.name ? (
                                <div className="alert alert-danger" >{formik.errors.name}</div>
                                ) : null}

                            <div className='form-group mb-2'>
                                <label className='form-label'> Client : </label>
                                <Select
                                    name='client'
                                    className="basic-single"
                                    onChange={(e) => formik.setFieldValue('orderClient', e)}
                                    options={clientOptions()}
                                    defaultValue={formik.values.orderClient.label}
                                />
                            </div>
                            {formik.touched.orderClient && formik.errors.orderClient ? (
                                <div className="alert alert-danger" >{formik.errors.orderClient}</div>
                                ) : null}

                            <div className='form-group mb-2'>
                                <label className='form-label'> Employees : </label>
                                <Select
                                    isMulti
                                    name="employees"
                                    className="basic-multi-select"
                                    onChange={(e) => formik.setFieldValue('orderEmployees', e)}
                                    options={employeesOptions()}
                                    defaultValue={formik.values.employees}
                                />
                            </div>

                            <button className='btn btn-success' type="submit"> Submit </button>
                            <Link to='/orders' className='btn btn-danger ml-2'> Cancel </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderComponent;