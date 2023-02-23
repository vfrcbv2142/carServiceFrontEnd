import React, {useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthService from '../services/AuthService';
import TokenService from "../services/TokenService";
import EmployeeService from '../services/EmployeeService';
import { useFormik } from 'formik';
import * as Yup from 'yup';


const CreateEmployeeComponent = () => {

    const navigate = useNavigate()

    const {id} = useParams();

    const ownerId = TokenService.getCurrentAccount().id

    const formik = useFormik({
        initialValues: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          position: '',
          ordersIds: []
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address'),
            position: Yup.string().required('Required')
        }),
        onSubmit: values => {
            createOrUpdateEmployee(values.firstName, values.lastName, values.phoneNumber, values.email, values.position, 
                values.ordersIds, ownerId);
        },
      });


    const createOrUpdateEmployee = (firstName, lastName, phoneNumber, email, position, ordersIds, ownerId) => {

        if(id){
            EmployeeService.updateEmployee(id, firstName, lastName, phoneNumber, email, position, ordersIds).then(() =>{
                navigate('/employees');
            }).catch(error => {
                console.log(error);
                AuthService.refreshTokenIfExpired(error, navigate);
            })
        }else{
            EmployeeService.createEmployee(firstName, lastName, phoneNumber, email, position, ownerId).then(() => {
                navigate('/employees');
            }).catch(error =>{
                console.log(error);
                AuthService.refreshTokenIfExpired(error, navigate);
            });
        }
    }

    useEffect(() =>{
        if(id){
            EmployeeService.getEmployeeById(id).then((res) => {
                formik.setFieldValue('firstName', res.data.firstName);
                formik.setFieldValue('lastName', res.data.lastName);
                formik.setFieldValue('phoneNumber', res.data.phoneNumber);
                formik.setFieldValue('email', res.data.email);
                formik.setFieldValue('position', res.data.position);
                formik.setFieldValue('ordersIds', res.data.ordersIds);
            }).catch(error =>{
                console.log(error);
                AuthService.refreshTokenIfExpired(error, navigate);
            })
        }
    }, [])

    const title = () => {
        if (id) {
            return <h2 className='text-center'> Update Employee </h2>
        }else{
            return <h2 className='text-center'> Add Employee </h2>
        }
    }

    return (
        <div>
        <br /><br />
        <div className='container'>
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    {
                        title()
                    }
                    <div className='card-body'>
                        <form onSubmit={formik.handleSubmit}>

                            <div className='form-group mb-2'>
                                <label className='form-label'> First Name : </label>
                                <input 
                                    type='text' 
                                    placeholder='Enter first name' 
                                    name='firstName' 
                                    className='form-control'
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.firstName && formik.errors.firstName ? (
                                <div className="alert alert-danger" >{formik.errors.firstName}</div>
                                ) : null}

                            <div className='form-group mb-2'>
                                <label className='form-label'> Last Name : </label>
                                <input 
                                    type='text' 
                                    placeholder='Enter last name' 
                                    name='lastName' 
                                    className='form-control'
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'> Phone Number : </label>
                                <input 
                                    type='text' 
                                    placeholder='Enter phone number' 
                                    name='phoneNumber' 
                                    className='form-control'
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'> Email : </label>
                                <input 
                                    type='email' 
                                    placeholder='Enter email' 
                                    name='email' 
                                    className='form-control'
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            {formik.errors.email ? <div className="alert alert-danger" >{formik.errors.email}</div> : null}

                            <div className='form-group mb-2'>
                                <label className='form-label'> Position : </label>
                                <input 
                                    type='text' 
                                    placeholder='Enter position' 
                                    name='position' 
                                    className='form-control'
                                    value={formik.values.position}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.position && formik.errors.position ? (
                                <div className="alert alert-danger" >{formik.errors.position}</div>
                                ) : null}

                            <button className='btn btn-success' type="submit"> Submit </button>
                            <Link to='/clients' className='btn btn-danger ml-2'> Cancel </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default CreateEmployeeComponent;