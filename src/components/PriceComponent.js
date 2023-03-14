import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import PriceService from '../services/PriceService';
import AuthService from '../services/AuthService';
import TokenService from "../services/TokenService";
import { useFormik } from 'formik';
import * as Yup from 'yup';


const PriceComponent = () => {

    const navigate = useNavigate();
    const ownerId = TokenService.getCurrentAccount().id;
    const [isUpdate, setIsUpdate] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const formik = useFormik({
        initialValues: {
            id: 0,
            painting: 0,
            preparingAluminum: 0,
            preparingPlastic: 0,
            preparingIron: 0,
            soldering: 0,
            disassembling: 0,
            straightening: 0
        },
        validationSchema: Yup.object({
            painting: Yup.number().min(0, 'Must be positive number'),
            preparingAluminum: Yup.number().min(0, 'Must be positive number'),
            preparingPlastic: Yup.number().min(0, 'Must be positive number'),
            preparingIron: Yup.number().min(0, 'Must be positive number'),
            soldering: Yup.number().min(0, 'Must be positive number'),
            disassembling: Yup.number().min(0, 'Must be positive number'),
            straightening: Yup.number().min(0, 'Must be positive number')
        }),
        onSubmit: values => {
            createOrUpdatePrice(values.id, values.painting, values.preparingAluminum, values.preparingPlastic, values.preparingIron,
                                values.soldering, values.disassembling, values.straightening);
        },
      });

      useEffect(() => {
        PriceService.getPriceByAccountId(ownerId).then((res) => {
            if (Object.keys(res.data).length !== 0) {
                formik.setFieldValue('id', res.data.id);
                formik.setFieldValue('painting', res.data.painting);
                formik.setFieldValue('preparingAluminum', res.data.preparingAluminum);
                formik.setFieldValue('preparingPlastic', res.data.preparingPlastic);
                formik.setFieldValue('preparingIron', res.data.preparingIron);
                formik.setFieldValue('soldering', res.data.soldering);
                formik.setFieldValue('disassembling', res.data.disassembling);
                formik.setFieldValue('straightening', res.data.straightening);
            }
        }).catch((error) => {
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        })
      }, [])

      const createOrUpdatePrice = (id, painting, preparingAluminum, preparingPlastic,
                                    preparingIron, soldering, disassembling, straightening) => {
        if(id !== 0){
            PriceService.updatePrice(id, painting, preparingAluminum, preparingPlastic,
                preparingIron, soldering, disassembling, straightening)
            .then(() => setIsUpdate(false), setIsSuccess(true))
            .catch((error) => {
                console.log(error);
                AuthService.ifRefreshTokenExpired(error, navigate);
            })
        } else {
            PriceService.createPrice(painting, preparingAluminum, preparingPlastic,
                preparingIron, soldering, disassembling, straightening, ownerId)
            .then(() => setIsUpdate(false), setIsSuccess(true))
            .catch((error) => {
                console.log(error);
                AuthService.ifRefreshTokenExpired(error, navigate);
            })
        }
        
      }

      const buttons = () => {
        if(isUpdate){
            return <div>
                        <button className='btn btn-success mr-2' type="submit" onClick={(e) => createOrUpdatePrice(e)}> Submit </button>
                        <button className='btn btn-danger' type="button" onClick={() => setIsUpdate(false)}> Cancel </button>
                    </div>
        } else {
            return <button className='btn btn-info' type='button' onClick={() => setIsUpdate(true)}> Update prices </button>
        }
      }

      const successfulyChanged = () => {
        if(isSuccess) {
            return <div className="alert alert-success mt-2" > Prices were successfuly changed!</div>
        }
      }

    return (
        <div>
        <br /><br />
        <div>
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                <h2 className='text-center'> Price List </h2>
                    <div className='card-body'>
                        <form onSubmit={formik.handleSubmit}>
                            {
                                successfulyChanged()
                            }
                            <table className="table table-sm">
                                <tbody>
                                    <tr>
                                        <td>
                                            <label className='form-label'> Painting price : </label>
                                            <input 
                                                type='text' 
                                                placeholder='Enter painting price' 
                                                name='painting' 
                                                className='form-control'
                                                disabled={!isUpdate}
                                                value={formik.values.painting}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.painting && formik.errors.painting ? (
                                                <div className="alert alert-danger mt-2" >{formik.errors.painting}</div>
                                            ) : null}
                                        </td>
                                        <td>
                                            <br/><br/>
                                            /m2
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label className='form-label'> Preparing aluminum price : </label>
                                            <input 
                                                type='text' 
                                                placeholder='Enter preparing aluminum price' 
                                                name='preparingAluminum' 
                                                className='form-control'
                                                disabled={!isUpdate}
                                                value={formik.values.preparingAluminum}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.preparingAluminum && formik.errors.preparingAluminum ? (
                                                <div className="alert alert-danger mt-2" >{formik.errors.preparingAluminum}</div>
                                            ) : null}
                                        </td>
                                        <td>
                                            <br/><br/>
                                            /m2
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label className='form-label'> Preparing plastic price : </label>
                                            <input 
                                                type='text' 
                                                placeholder='Enter preparing plastic price' 
                                                name='preparingPlastic' 
                                                className='form-control'
                                                disabled={!isUpdate}
                                                value={formik.values.preparingPlastic}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.preparingPlastic && formik.errors.preparingPlastic ? (
                                                <div className="alert alert-danger mt-2" >{formik.errors.preparingPlastic}</div>
                                            ) : null}
                                        </td>
                                        <td>
                                            <br/><br/>
                                            /m2
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                        <label className='form-label'> Preparing iron price : </label>
                                        <input 
                                            type='text' 
                                            placeholder='Enter preparing iron price' 
                                            name='preparingIron' 
                                            className='form-control'
                                            disabled={!isUpdate}
                                            value={formik.values.preparingIron}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.preparingIron && formik.errors.preparingIron ? (
                                            <div className="alert alert-danger mt-2" >{formik.errors.preparingIron}</div>
                                        ) : null}
                                        </td>
                                        <td>
                                            <br/><br/>
                                            /m2
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label className='form-label'> Soldering price : </label>
                                            <input 
                                                type='text' 
                                                placeholder='Enter Soldering price' 
                                                name='soldering' 
                                                className='form-control'
                                                disabled={!isUpdate}
                                                value={formik.values.soldering}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.soldering && formik.errors.soldering ? (
                                                <div className="alert alert-danger mt-2" >{formik.errors.soldering}</div>
                                            ) : null}
                                        </td>
                                        <td>
                                            <br/><br/>
                                            /hour
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label className='form-label'> Disassembling price : </label>
                                            <input 
                                                type='text' 
                                                placeholder='Enter Disassembling price' 
                                                name='disassembling' 
                                                className='form-control'
                                                disabled={!isUpdate}
                                                value={formik.values.disassembling}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.disassembling && formik.errors.disassembling ? (
                                                <div className="alert alert-danger" >{formik.errors.disassembling}</div>
                                            ) : null}
                                        </td>
                                        <td>
                                            <br/><br/>
                                            /hour
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label className='form-label'> Straightening price : </label>
                                            <input 
                                                type='text' 
                                                placeholder='Enter Straightening price' 
                                                name='straightening' 
                                                className='form-control'
                                                disabled={!isUpdate}
                                                value={formik.values.straightening}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.straightening && formik.errors.straightening ? (
                                                <div className="alert alert-danger" >{formik.errors.straightening}</div>
                                            ) : null}
                                        </td>
                                        <td>
                                            <br/><br/>
                                            /hour
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                {
                                    buttons()
                                }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default PriceComponent;