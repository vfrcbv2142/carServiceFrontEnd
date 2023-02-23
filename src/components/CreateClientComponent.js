import React, {useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthService from '../services/AuthService';
import TokenService from "../services/TokenService";
import ClientService from '../services/ClientService';
import { useFormik } from 'formik';
import * as Yup from 'yup';


const CreateClientComponent = () => {

    const navigate = useNavigate()

    const {id} = useParams();

    const ownerId = TokenService.getCurrentAccount().id

    const formik = useFormik({
        initialValues: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          ordersIds: []
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address'),
        }),
        onSubmit: values => {
            createOrUpdateClient(values.firstName, values.lastName, values.phoneNumber, values.email, values.ordersIds, ownerId);
        },
      });


    const createOrUpdateClient = (firstName, lastName, phoneNumber, email, ordersIds, ownerId) => {

        if(id){
            ClientService.updateClient(id, firstName, lastName, phoneNumber, email, ordersIds).then(() =>{
                navigate('/clients');
            }).catch(error => {
                console.log(error);
                AuthService.refreshTokenIfExpired(error, navigate);
            })
        }else{
            ClientService.createClient(firstName, lastName, phoneNumber, email, ownerId).then(() => {
                navigate('/clients');
            }).catch(error =>{
                console.log(error);
                AuthService.refreshTokenIfExpired(error, navigate);
            });
        }
    }

    useEffect(() =>{
        if(id){
            ClientService.getClientById(id).then((res) => {
                formik.setFieldValue('firstName', res.data.firstName);
                formik.setFieldValue('lastName', res.data.lastName);
                formik.setFieldValue('phoneNumber', res.data.phoneNumber);
                formik.setFieldValue('email', res.data.email);
                formik.setFieldValue('ordersIds', res.data.ordersIds);
            }).catch(error =>{
                console.log(error);
                AuthService.refreshTokenIfExpired(error, navigate);
            })
        }
    }, [])

    const title = () => {
        if (id) {
            return <h2 className='text-center'> Update Client </h2>
        }else{
            return <h2 className='text-center'> Add Client </h2>
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

export default CreateClientComponent;