import React, {useEffect, useState } from 'react';
import { useNavigate, useParams  } from "react-router-dom";
import AuthService from '../services/AuthService';
import TokenService from "../services/TokenService";
import EmployeeService from '../services/EmployeeService';
import ClientService from '../services/ClientService';
import OrderService from '../services/OrderService';
import ItemService from '../services/ItemService';
import PriceService from '../services/PriceService';
import { useFormik } from "formik";
import * as Yup from 'yup';
import Select from 'react-select'
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
// import { makeStyles } from "@material-ui/core/styles";


const UpdateViewOrderComponent = () => {

    const navigate = useNavigate()

    const ownerId = TokenService.getCurrentAccount().id

    const {id} = useParams()

    const [isUpdateOrder, setIsUpdateOrder] = useState(false)
    const [isUpdateItem, setIsUpdateItem] = useState(false)
    const [items, setItems] = useState([])
    const [notes, setNotes] = useState([])
    const [clients, setClients] = useState([])
    const [employees, setEmployees] = useState([])
    const [orderPriceList, setOrderPriceList] = useState([])
    const [accountPriceList, setAccountPriceList] = useState({})
    const [itemErrorText, setItemErrorText] = useState('')

    const formik = useFormik({
        initialValues: {
          name: '',
          orderClient: {value: 0, label: ''},
          orderEmployees: [],
          orderItemsIds: [],
          orderNotesIds: [],
          creationDate: ''
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
            setIsUpdateOrder(false);

            const employeesIds = values.orderEmployees.map(employee => employee.value);
            const itemsIds = items.map(item => item.id);
            const notesIds = notes.map(note => note.id);

            updateOrder(values.name, values.orderClient.value, employeesIds, itemsIds, notesIds, values.creationDate);
        },
      });

    const updateOrder = (name, clientId, employeesIds, itemsIds, notesIds, creationDate) => {
        OrderService.updateOrder(id, name, clientId, creationDate, employeesIds, itemsIds, notesIds).then(() => {
            
        }).catch(error =>{
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        });
    }

    const formikItem = useFormik({
        initialValues: {
                name: '',
                orderId: id,
                painting: 0,
                preparingAluminum: 0,
                preparingPlastic: 0,
                preparingIron: 0,
                soldering: 0,
                disassembling: 0,
                straightening: 0,
                paintingCheck: false,
                preparingAluminumCheck: false,
                preparingPlasticCheck: false,
                preparingIronCheck: false,
                solderingCheck: false,
                disassemblingCheck: false,
                straighteningCheck: false
        },
        validationSchema: Yup.object({
                    name: Yup.string().required('Required'),
                    painting: Yup.number().typeError("Must be a number").min(0, 'Must be positive number'),
                    preparingAluminum: Yup.number().typeError("Must be a number").min(0, 'Must be positive number'),
                    preparingPlastic: Yup.number().typeError("Must be a number").min(0, 'Must be positive number'),
                    preparingIron: Yup.number().typeError("Must be a number").min(0, 'Must be positive number'),
                    soldering: Yup.number().typeError("Must be a number").min(0, 'Must be positive number'),
                    disassembling: Yup.number().typeError("Must be a number").min(0, 'Must be positive number'),
                    straightening: Yup.number().typeError("Must be a number").min(0, 'Must be positive number')
        }),
        onSubmit: values => {
            createNewItem(values.name, values.orderId, values.painting, values.preparingAluminum, values.preparingPlastic,
                values.preparingIron, values.soldering, values.disassembling, values.straightening, );
            handleResetForCreateNewItem();
        }
    })

    const createNewItem = (name, orderId, painting, preparingAluminum, preparingPlastic, preparingIron,
        soldering, disassembling, straightening) => {
            const itemPrice = {
                ...((painting !== 0 && painting !== '') && {painting: painting}),
                ...((preparingAluminum !== 0 && preparingAluminum !== '') && {preparingAluminum: preparingAluminum}),
                ...((preparingPlastic !== 0 && preparingPlastic !== '') && {preparingPlastic: preparingPlastic}),
                ...((preparingIron !== 0 && preparingIron !== '') && {preparingIron: preparingIron}),
                ...((soldering !== 0 && soldering !== '') && {soldering: soldering}),
                ...((disassembling !== 0 && disassembling !== '') && {disassembling: disassembling}),
                ...((straightening !== 0 && straightening !== '') && {straightening: straightening})
            }
            ItemService.createItem(name, orderId, itemPrice).then((res) => {
                const newItems = JSON.parse(JSON.stringify(items));
                newItems.push(res.data);
                console.log("price")
                console.log(accountPriceList)
                setItems(newItems);
                setOrderPriceList(createOrderPriceList(newItems, accountPriceList));
            }).catch(error =>{
                console.log(error);
                AuthService.ifRefreshTokenExpired(error, navigate);
            })
    }

    useEffect(() =>{
        // window.onbeforeunload = () => {
        //     console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        // }
        

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

        OrderService.getOrderById(id).then((res) => {
            if (Object.keys(res.data).length === 0) {

            } else {
                formik.setFieldValue('name', res.data.name);
                formik.setFieldValue('orderClient', { value: res.data.client.id, 
                    label: res.data.client.firstName + ' ' + res.data.client.lastName });
                formik.setFieldValue('orderEmployees', employeesOptions(res.data.employees));
                formik.setFieldValue('creationDate', res.data.creationDate);
            }
        }).catch(error =>{
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        })

        PriceService.getPriceByAccountId(ownerId).then((priceRes) => {
            if (Object.keys(priceRes.data).length === 0) {
                
            } else {
                setAccountPriceList(priceRes.data);
                ItemService.getAllItemsByOrderId(id).then((res) => {
                    if (Object.keys(res.data).length === 0) {
                       setItems([]);
                       setOrderPriceList(createOrderPriceList([], priceRes.data));
                    } else {
                        setItems(res.data._embedded.items);
                        setOrderPriceList(createOrderPriceList(res.data._embedded.items, priceRes.data));
                    }
                }).catch(error =>{
                    console.log(error);
                    AuthService.ifRefreshTokenExpired(error, navigate);
                })
            }
        }).catch(priceError =>{
            console.log(priceError);
            AuthService.ifRefreshTokenExpired(priceError, navigate);
        })

    }, [])

    const orderTitle = () => {
        if(isUpdateOrder){
            return <h4 className='text-center'> Update Order </h4>
        } else {
            return 
        }
    }

    const createOrderPriceList = (orderItems, priceList) => {
        const newOrderPriceList = [];
        newOrderPriceList.push({ label: 'Preparing Aluminum Price', value: 
            orderItems.reduce((total, item) => total + (item.itemPrice?.preparingAluminum || 0), 0)
            * priceList.preparingAluminum });

        newOrderPriceList.push({ label: 'Preparing Plastic Price', value: 
            orderItems.reduce((total, item) => total + (item.itemPrice?.preparingPlastic || 0), 0)
            * priceList.preparingPlastic });

        newOrderPriceList.push({ label: 'Preparing Iron Price', value: 
            orderItems.reduce((total, item) => total + (item.itemPrice?.preparingIron || 0), 0)
            * priceList.preparingIron });

        newOrderPriceList.push({ label: 'Painting Price', value: 
            orderItems.reduce((total, item) => total + (item.itemPrice?.painting || 0), 0)
            * priceList.painting });

        newOrderPriceList.push({ label: 'Disassembling/Assembling Price', value: 
            orderItems.reduce((total, item) => total + (item.itemPrice?.disassembling || 0), 0)
            * priceList.disassembling });

        newOrderPriceList.push({ label: 'Straightening Price', value: 
            orderItems.reduce((total, item) => total + (item.itemPrice?.straightening || 0), 0)
            * priceList.straightening });

        newOrderPriceList.push({ label: 'Soldering Price', value: 
            orderItems.reduce((total, item) => total + (item.itemPrice?.soldering || 0), 0)
            * priceList.soldering });

        newOrderPriceList.push({label: 'Total Price', value: 
            newOrderPriceList.reduce((total, price) => total + price.value, 0)});

        return newOrderPriceList;
    }

    const itemTitle = (name) => {
        if(isUpdateItem){
            return <h4 className='text-center'> Update Item </h4>
        } else {
            return <h4 className='text-center'> {name} </h4>
        }
    }

    const clientOptions = () => {
        let options = [];
        clients.forEach(client => options.push({value: client.id, label: client.firstName + ' ' + client.lastName}));
        return options;
    }

    const employeesOptions = (employeesList) => {
        let options = [];
        employeesList.forEach(employee => options.push({value: employee.id, label: employee.firstName + ' ' + employee.lastName}));
        return options;
    }

    const orderButtonsAndPrice = () => {
        if(isUpdateOrder){
            return <div>
                        <button className='btn btn-success' type="submit"> Submit </button>
                        <button className='btn btn-danger ml-2' type="button" onClick={() => setIsUpdateOrder(false)}> Cancel </button>
                    </div>
        } else {
            return  <div>
                        <table className='table table-sm'>
                            <tbody>
                                {
                                    orderPriceList.map(
                                        (price, index) => 
                                        <tr key={index}>
                                            <td>
                                                {price.label} : 
                                            </td>
                                            <td>
                                                {price.value}
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <button className='btn btn-info' type="button" onClick={() => {setIsUpdateOrder(true)}}> Update order </button>
                    </div>
        }
    }

    const handleChangeForItem = (value, index, key, nestedKey) => {
        if (key !== 'name') {
            (value < 0 || isNaN(value)) ? (setItemErrorText('Must be positive number')) : (setItemErrorText(''))
        }
        const newItems = JSON.parse(JSON.stringify(items));
        if (nestedKey){
            newItems[index][key][nestedKey] = value;
        } else{
            newItems[index][key] = value;
        }
        setItems(newItems);
    }

    const updateItem = (index) => {
        const newItems = JSON.parse(JSON.stringify(items));
        const item = items[index];
        ItemService.updateItem(item.id, item.name, item.itemPrice).then((res) => {
            delete (res.data)._links
            newItems.splice(index, 1, res.data);
            setItems(newItems);
            setOrderPriceList(createOrderPriceList(newItems, accountPriceList));
            setIsUpdateItem(false);
        }).catch(error =>{
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        })
    }

    const deleteItem = (itemId, index) => {
        ItemService.deleteItem(itemId).then((res) => {
            const newItems = JSON.parse(JSON.stringify(items));
            newItems.splice(index, 1);
            setItems(newItems);
            setOrderPriceList(createOrderPriceList(newItems, accountPriceList));
        }).catch(error =>{
            AuthService.ifRefreshTokenExpired(error, navigate);
        })
    }

    const handleResetForCreateNewItem = () => {
            formikItem.setFieldValue('name', '');
            formikItem.setFieldValue('painting', 0);
            formikItem.setFieldValue('preparingAluminum', 0);
            formikItem.setFieldValue('preparingPlastic', 0);
            formikItem.setFieldValue('preparingIron', 0);
            formikItem.setFieldValue('soldering', 0);
            formikItem.setFieldValue('disassembling', 0);
            formikItem.setFieldValue('straightening', 0);
            formikItem.setFieldValue('paintingCheck', false);
            formikItem.setFieldValue('preparingAluminumCheck', false);
            formikItem.setFieldValue('preparingPlasticCheck', false);
            formikItem.setFieldValue('preparingIronCheck', false);
            formikItem.setFieldValue('solderingCheck', false);
            formikItem.setFieldValue('disassemblingCheck', false);
            formikItem.setFieldValue('straighteningCheck', false);
    }

    return (
        <div>
            <div className="card-columns">
                {/* ------------------------ order view/update form ----------------------- */}
                <div className='card p-3'>
                    {
                        orderTitle()
                    }
                    <div className='card-body'>
                        <form onSubmit={formik.handleSubmit}>

                            <div className='form-group mb-2'>
                                <label className='form-label'> Order Name : </label>
                                <input 
                                    type='text' 
                                    placeholder='Enter order name' 
                                    name='name' 
                                    className='form-control'
                                    disabled={!isUpdateOrder}
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
                                    isDisabled={!isUpdateOrder}
                                    onChange={(e) => formik.setFieldValue('orderClient', e)}
                                    options={clientOptions()}
                                    value={formik.values.orderClient}
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
                                    isDisabled={!isUpdateOrder}
                                    onChange={(e) => formik.setFieldValue('orderEmployees', e)}
                                    options={employeesOptions(employees)}
                                    value={formik.values.orderEmployees}
                                />
                            </div>
                            {
                                orderButtonsAndPrice()
                            }
                        </form>
                    </div>
                </div>
                {/* ---------------------------- List of items forms ----------------------------- */}
                {items.map(
                    (item, index) => <div className="card p-3" key={item.id}>
                                {
                                    itemTitle(item.name)
                                }
                                <div className="card-body">
                                    <Box
                                        component="form"
                                        sx={{
                                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                                        }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        {isUpdateItem ? (
                                            <TextField
                                                disabled={!isUpdateItem}
                                                className='w-100'
                                                variant="outlined"
                                                label="Name"
                                                multiline
                                                name='Name'
                                                value={item.name}
                                                required
                                                // helperText={
                                                //     touchedFirstName && errorFirstName
                                                //     ? errorFirstName
                                                //     : ""
                                                // }
                                                // error={Boolean(touchedFirstName && errorFirstName)}
                                                onChange={(e) => {handleChangeForItem(e.target.value, index, 'name')}}
                                                // onBlur={handleBlur}
                                            />
                                        ) : null}
                                        {item.itemPrice.painting || isUpdateItem ? (
                                            <TextField
                                                disabled={!isUpdateItem}
                                                className='w-100'
                                                variant="outlined"
                                                label="Painting    /m2"
                                                name='Painting'
                                                value={item.itemPrice.painting}
                                                // helperText={itemErrorText ? itemErrorText : ""}
                                                helperText={itemErrorText}
                                                error={Boolean(itemErrorText)}
                                                onChange={(e) => {handleChangeForItem(e.target.value, index, 'itemPrice', 'painting')}}
                                                // onBlur={handleBlur}
                                            />
                                        ) : null}
                                        {item.itemPrice.preparingAluminum || isUpdateItem ? (
                                            <TextField
                                                disabled={!isUpdateItem}
                                                className='w-100'
                                                variant="outlined"
                                                label="Preparing Aluminum    /m2"
                                                name='Preparing Aluminum'
                                                value={item.itemPrice.preparingAluminum}
                                                helperText={itemErrorText}
                                                error={Boolean(itemErrorText)}
                                                onChange={(e) => {handleChangeForItem(e.target.value, index, 'itemPrice', 'preparingAluminum')}}
                                                // onBlur={handleBlur}
                                            /> 
                                        ) : null}
                                        {item.itemPrice.preparingPlastic || isUpdateItem ? (
                                            <TextField
                                                disabled={!isUpdateItem}
                                                className='w-100'
                                                variant="outlined"
                                                label="Preparing Plastic    /m2"
                                                name='preparingPlastic'
                                                value={item.itemPrice.preparingPlastic}
                                                helperText={itemErrorText}
                                                error={Boolean(itemErrorText)}
                                                onChange={(e) => {handleChangeForItem(e.target.value, index, 'itemPrice', 'preparingPlastic')}}
                                                // onBlur={handleBlur}
                                            /> 
                                        ) : null}
                                        {item.itemPrice.preparingIron || isUpdateItem ? (
                                            <TextField
                                                disabled={!isUpdateItem}
                                                className='w-100'
                                                variant="outlined"
                                                label="Preparing Iron    /m2"
                                                name='preparingIron'
                                                value={item.itemPrice.preparingIron}
                                                helperText={itemErrorText}
                                                error={Boolean(itemErrorText)}
                                                onChange={(e) => {handleChangeForItem(e.target.value, index, 'itemPrice', 'preparingIron')}}
                                                // onBlur={handleBlur}
                                            /> 
                                        ) : null}
                                        {item.itemPrice.soldering || isUpdateItem ? (
                                            <TextField
                                                disabled={!isUpdateItem}
                                                className='w-100'
                                                variant="outlined"
                                                label="Soldering    /m"
                                                name='soldering'
                                                value={item.itemPrice.soldering}
                                                helperText={itemErrorText}
                                                error={Boolean(itemErrorText)}
                                                onChange={(e) => {handleChangeForItem(e.target.value, index, 'itemPrice', 'soldering')}}
                                                // onBlur={handleBlur}
                                            /> 
                                        ) : null}
                                        {item.itemPrice.disassembling || isUpdateItem ? (
                                            <TextField
                                                disabled={!isUpdateItem}
                                                className='w-100'
                                                variant="outlined"
                                                label="Disassembling/Assembling /hour"
                                                name='disassembling'
                                                value={item.itemPrice.disassembling}
                                                helperText={itemErrorText}
                                                error={Boolean(itemErrorText)}
                                                onChange={(e) => {handleChangeForItem(e.target.value, index, 'itemPrice', 'disassembling')}}
                                                // onBlur={handleBlur}
                                            /> 
                                        ) : null}
                                        {item.itemPrice.straightening || isUpdateItem ? (
                                            <TextField
                                                disabled={!isUpdateItem}
                                                className='w-100'
                                                variant="outlined"
                                                label="Straightening    /hour"
                                                name='straightening' 
                                                value={item.itemPrice.straightening}
                                                helperText={itemErrorText}
                                                error={Boolean(itemErrorText)}
                                                onChange={(e) => {handleChangeForItem(e.target.value, index, 'itemPrice', 'straightening')}}
                                                // onBlur={handleBlur}
                                            /> 
                                        ) : null}
                                        {
                                            isUpdateItem 
                                            ?   <div>
                                                    <button className='btn btn-success' type="submit" onClick={(e) => {e.preventDefault(); updateItem(index)}}> Submit </button>
                                                    <button className='btn btn-danger ml-2' type="button" onClick={(e) => {e.preventDefault(); setIsUpdateItem(false)}}> Cancel </button>
                                                </div>
                                            :   <div>
                                                    <button className='btn btn-info ml-2' type="button" onClick={(e) => {e.preventDefault(); setIsUpdateItem(true)}}> Update item </button>
                                                    <button className='btn btn-danger ml-2' onClick={(e) => {e.preventDefault(); deleteItem(item.id, index)}}> Delete item </button>
                                                </div>
                                        }
                                    </Box>
                                </div>
                            </div>
                )}
                {/* ------------------------ create new item form ---------------------------- */}
                <div className="card p-3">
                    <h4 className="card-title text-center">
                        Create New Item
                    </h4>
                    <div className="card-body">
                        <form onSubmit={formikItem.handleSubmit}>
                            <TextField
                                className='w-100'
                                variant="outlined"
                                label="Name"
                                required
                                multiline
                                name="name"
                                value={formikItem.values.name}
                                onChange={formikItem.handleChange}
                                onBlur={formikItem.handleBlur}
                                error={formikItem.touched.name && Boolean(formikItem.errors.name)}
                                helperText={formikItem.touched.name && formikItem.errors.name}
                            />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.paintingCheck}
                                    onChange={(e) => {formikItem.setFieldValue('paintingCheck', e.target.checked)}}
                                    name="painting" style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox"  label="Painting"/>
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.preparingAluminumCheck}
                                    onChange={(e) => {formikItem.setFieldValue('preparingAluminumCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Preparing Aluminum" />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.preparingPlasticCheck}
                                    onChange={(e) => {formikItem.setFieldValue('preparingPlasticCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Preparing Plastic" />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.preparingIronCheck}
                                    onChange={(e) => {formikItem.setFieldValue('preparingIronCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Preparing Iron" />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.solderingCheck}
                                    onChange={(e) => {formikItem.setFieldValue('solderingCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Soldering" />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.disassemblingCheck}
                                    onChange={(e) => {formikItem.setFieldValue('disassemblingCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Disassembling/Assembling" />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.straighteningCheck}
                                    onChange={(e) => {formikItem.setFieldValue('straighteningCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Straightening" />


                            {formikItem.values.paintingCheck ? (
                                <TextField
                                    className='w-100 mt-2 mb-1'
                                    variant="outlined"
                                    label="Painting"
                                    name='painting'
                                    value={formikItem.values.painting}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.painting && Boolean(formikItem.errors.painting)}
                                    helperText={formikItem.touched.painting && formikItem.errors.painting}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m2</InputAdornment>,
                                      }}
                                />
                            ) : null}
                            {formikItem.values.preparingAluminumCheck ? (
                                <TextField
                                    className='w-100 mt-2 mb-1'
                                    variant="outlined"
                                    label="Preparing Aluminum"
                                    name='preparingAluminum'
                                    value={formikItem.values.preparingAluminum}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.preparingAluminum && Boolean(formikItem.errors.preparingAluminum)}
                                    helperText={formikItem.touched.preparingAluminum && formikItem.errors.preparingAluminum}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m2</InputAdornment>,
                                      }}
                                /> 
                            ) : null}
                            {formikItem.values.preparingPlasticCheck ? (
                                <TextField
                                    className='w-100 mt-2 mb-1'
                                    variant="outlined"
                                    label="Preparing Plastic"
                                    name='preparingPlastic'
                                    value={formikItem.values.preparingPlastic}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.preparingPlastic && Boolean(formikItem.errors.preparingPlastic)}
                                    helperText={formikItem.touched.preparingPlastic && formikItem.errors.preparingPlastic}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m2</InputAdornment>,
                                      }}
                                /> 
                            ) : null}
                            {formikItem.values.preparingIronCheck ? (
                                <TextField
                                    className='w-100 mt-2 mb-1'
                                    variant="outlined"
                                    label="Preparing Iron"
                                    name='preparingIron'
                                    value={formikItem.values.preparingIron}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.preparingIron && Boolean(formikItem.errors.preparingIron)}
                                    helperText={formikItem.touched.preparingIron && formikItem.errors.preparingIron}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">m2</InputAdornment>,
                                      }}
                                /> 
                            ) : null}
                            {formikItem.values.solderingCheck ? (
                                <TextField
                                    className='w-100 mt-2 mb-1'
                                    variant="outlined"
                                    label="Soldering"
                                    name='soldering'
                                    value={formikItem.values.soldering}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.soldering && Boolean(formikItem.errors.soldering)}
                                    helperText={formikItem.touched.soldering && formikItem.errors.soldering}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                                      }}
                                /> 
                            ) : null}
                            {formikItem.values.disassemblingCheck ? (
                                <TextField
                                    className='w-100 mt-2 mb-1'
                                    variant="outlined"
                                    label="Disassembling"
                                    name='disassembling'
                                    value={formikItem.values.disassembling}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.disassembling && Boolean(formikItem.errors.disassembling)}
                                    helperText={formikItem.touched.disassembling && formikItem.errors.disassembling}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                                      }}
                                /> 
                            ) : null}
                            {formikItem.values.straighteningCheck ? (
                                <TextField
                                    className='w-100 mt-2 mb-1'
                                    variant="outlined"
                                    label="Straightening"
                                    name='straightening' 
                                    value={formikItem.values.straightening}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.straightening && Boolean(formikItem.errors.straightening)}
                                    helperText={formikItem.touched.straightening && formikItem.errors.straightening}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                                      }}
                                /> 
                            ) : null}
                            <br/>
                            <button className='btn btn-success mt-1' type="submit"> Submit </button>
                            <button className='btn btn-danger ml-2 mt-1' type="button" onClick={(e) => {e.preventDefault(); handleResetForCreateNewItem()}}> Reset </button>
                        </form>
                    </div>
                </div>
            </div>
            {/* <div className="card-columns">
                <div className="card p-3">
                    <h4 className="card-title text-center">
                        Create New Item
                        {/* <button className='btn btn-success' type="submit" onClick={() => createNewItem('')}> Create New Item </button> 
                    </h4>
                    <div className="card-body">
                        <form onSubmit={formikItem.handleSubmit}>
                            <TextField
                                className='w-100'
                                variant="outlined"
                                label="Name"
                                multiline
                                name="name"
                                value={formikItem.values.name}
                                onChange={formikItem.handleChange}
                                onBlur={formikItem.handleBlur}
                                error={formikItem.touched.name && Boolean(formikItem.errors.name)}
                                helperText={formikItem.touched.name && formikItem.errors.name}
                            />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.paintingCheck}
                                    onChange={(e) => {formikItem.setFieldValue('paintingCheck', e.target.checked)}}
                                    name="painting" style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox"  label="Painting"/>
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.preparingAluminumCheck}
                                    onChange={(e) => {formikItem.setFieldValue('preparingAluminumCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Preparing Aluminum" />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.preparingPlasticCheck}
                                    onChange={(e) => {formikItem.setFieldValue('preparingPlasticCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Preparing Plastic" />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.preparingIronCheck}
                                    onChange={(e) => {formikItem.setFieldValue('preparingIronCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Preparing Iron" />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.solderingCheck}
                                    onChange={(e) => {formikItem.setFieldValue('solderingCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Soldering" />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.disassemblingCheck}
                                    onChange={(e) => {formikItem.setFieldValue('disassemblingCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Disassembling/Assembling" />
                            <FormControlLabel control={
                                <Checkbox checked={formikItem.values.straighteningCheck}
                                    onChange={(e) => {formikItem.setFieldValue('straighteningCheck', e.target.checked)}}
                                    style={{paddingTop: '0', paddingBottom: '0'}}/>}
                                className="checkbox" label="Straightening" />


                            {formikItem.values.paintingCheck ? (
                                <TextField
                                    className='w-100'
                                    variant="outlined"
                                    label="Painting    /m2"
                                    name='painting'
                                    value={formikItem.values.painting}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.painting && Boolean(formikItem.errors.painting)}
                                    helperText={formikItem.touched.painting && formikItem.errors.painting}
                                />
                            ) : null}
                            {formikItem.values.preparingAluminumCheck ? (
                                <TextField
                                    className='w-100'
                                    variant="outlined"
                                    label="Preparing Aluminum    /m2"
                                    name='preparingAluminum'
                                    value={formikItem.values.preparingAluminum}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.preparingAluminum && Boolean(formikItem.errors.preparingAluminum)}
                                    helperText={formikItem.touched.preparingAluminum && formikItem.errors.preparingAluminum}
                                /> 
                            ) : null}
                            {formikItem.values.preparingPlasticCheck ? (
                                <TextField
                                    className='w-100'
                                    variant="outlined"
                                    label="Preparing Plastic    /m2"
                                    name='preparingPlastic'
                                    value={formikItem.values.preparingPlastic}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.preparingPlastic && Boolean(formikItem.errors.preparingPlastic)}
                                    helperText={formikItem.touched.preparingPlastic && formikItem.errors.preparingPlastic}
                                /> 
                            ) : null}
                            {formikItem.values.preparingIronCheck ? (
                                <TextField
                                    className='w-100'
                                    variant="outlined"
                                    label="Preparing Iron    /m2"
                                    name='preparingIron'
                                    value={formikItem.values.preparingIron}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.preparingIron && Boolean(formikItem.errors.preparingIron)}
                                    helperText={formikItem.touched.preparingIron && formikItem.errors.preparingIron}
                                /> 
                            ) : null}
                            {formikItem.values.solderingCheck ? (
                                <TextField
                                    className='w-100'
                                    variant="outlined"
                                    label="Soldering    /m"
                                    name='soldering'
                                    value={formikItem.values.soldering}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.soldering && Boolean(formikItem.errors.soldering)}
                                    helperText={formikItem.touched.soldering && formikItem.errors.soldering}
                                /> 
                            ) : null}
                            {formikItem.values.disassemblingCheck ? (
                                <TextField
                                    className='w-100'
                                    variant="outlined"
                                    label="Disassembling /hour"
                                    name='disassembling'
                                    value={formikItem.values.disassembling}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.disassembling && Boolean(formikItem.errors.disassembling)}
                                    helperText={formikItem.touched.disassembling && formikItem.errors.disassembling}
                                /> 
                            ) : null}
                            {formikItem.values.straighteningCheck ? (
                                <TextField
                                    className='w-100'
                                    variant="outlined"
                                    label="Straightening    /hour"
                                    name='straightening' 
                                    value={formikItem.values.straightening}
                                    onChange={formikItem.handleChange}
                                    onBlur={formikItem.handleBlur}
                                    error={formikItem.touched.straightening && Boolean(formikItem.errors.straightening)}
                                    helperText={formikItem.touched.straightening && formikItem.errors.straightening}
                                /> 
                            ) : null}
                            <button className='btn btn-success' type="submit"> Submit </button>
                        </form>
                    </div>
                </div> */}
                { /*
                <div className="card p-3">
                    <blockquote className="blockquote mb-0 card-body">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                    <footer className="blockquote-footer">
                        <small className="text-muted">
                        Someone famous in <cite title="Source Title">Source Title</cite>
                        </small>
                    </footer>
                    </blockquote>
                </div>
                <div className="card">
                    <h4> КАРТИНКА2</h4>
                    <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                    </div>
                </div>
                <div className="card bg-primary text-white text-center p-3">
                    <blockquote className="blockquote mb-0">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
                    <footer className="blockquote-footer">
                        <small>
                        Someone famous in <cite title="Source Title">Source Title</cite>
                        </small>
                    </footer>
                    </blockquote>
                </div>
                <div className="card text-center">
                    <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                    </div>
                </div>
                <div className="card">
                    <h4> КАРТИНКА3</h4>
                </div>
                <div className="card p-3 text-right">
                    <blockquote className="blockquote mb-0">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                    <footer className="blockquote-footer">
                        <small className="text-muted">
                        Someone famous in <cite title="Source Title">Source Title</cite>
                        </small>
                    </footer>
                    </blockquote>
                </div>
                <div className="card">
                    <div className="card-body">
                    <h5 className="card-title">order name</h5>
                    <p className="card-text">text text text</p>
                    </div>
                </div> */}


            {/* </div> */}
        </div>
    );
};

export default UpdateViewOrderComponent;