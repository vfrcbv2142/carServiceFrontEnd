import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AuthService from '../services/AuthService';
import OrderService from '../services/OrderService';
import TokenService from "../services/TokenService";



const ListOrderComponent = () => {

    const [orders, setOrders] = useState([])
    const ownerId = TokenService.getCurrentAccount().id
    const navigate = useNavigate()

    useEffect(() => {
        getAllOrders(ownerId);
    }, [])

    const getAllOrders = (AccountId) => {
        OrderService.getAllOrdersByAccountId(AccountId).then((res) => {
            if (Object.keys(res.data).length === 0) {
                setOrders([]);
            } else {
                setOrders(res.data._embedded.orders);
            }
        }).catch((error) => {
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        })
    }

    const deleteOrder = (id) => {
        OrderService.deleteOrder(id).then(() => {
            getAllOrders(ownerId);
        }).catch((error) => {
            console.log(error);
            AuthService.ifRefreshTokenExpired(error, navigate);
        })
    }

    const totalPrice = (order) => {
        let result = 0;
        order.items.map(item => result = result + Object.values(item.itemPrice).reduce((a, b) => a + b, 0))
        return result;
      }

    return (
        <div className='container'>
            <h2 className='text-center'>Orders List</h2>
            <Link to='/add-order' className='btn btn-primary mb-2'> Add Order</Link>
            <div className='table-responsive'>
                <table className='table table-sm table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th className='col-3'>Order Name</th>
                            <th className='col-2'>Client Name</th>
                            <th className='col-2'>Creation Date</th>
                            <th className='col-1'>Total Price</th>
                            <th className='col-2'>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            orders.map(
                                order =>
                                <tr key= {order.id}>
                                    <td>
                                        <Link style={{textDecoration: "none"}} to={'/orders/' + order.id}>{order.name}</Link>
                                    </td>
                                    <td>{order.client.firstName + ' ' + order.client.lastName}</td>
                                    <td>{order.creationDate}</td>
                                    <td>{totalPrice(order)}</td>
                                    <td>
                                        <Link className='btn btn-info mr-2' to={'/edit-order/' + order.id}> Update </Link>
                                        <button className='btn btn-danger' onClick={() => deleteOrder(order.id)}> Delete </button>
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

export default ListOrderComponent;