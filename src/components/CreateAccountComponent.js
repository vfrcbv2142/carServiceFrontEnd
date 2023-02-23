import React, {useEffect, useState} from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthService from '../services/AuthService';
import AccountService from '../services/AccountService';


const CreateAccountComponent = () => {
    
    const navigate = useNavigate();
    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {id} = useParams();

    const createOrUpdateAccount = (e) => {
        e.preventDefault();

        if(id){
            AccountService.updateAccount(id, email, password).then(() =>{ //update method update
                navigate('/accounts')
            }).catch(error => {
                console.log(error);
                AuthService.refreshTokenIfExpired(error, navigate);
            })
        }else{
            AccountService.createAccount(login, email, password).then(() => {
                navigate('/accounts')
            }).catch(error =>{
                console.log(error);
                AuthService.refreshTokenIfExpired(error, navigate);
            });
        }
    }

    useEffect(() =>{
        if(id) {
            AccountService.getAccountById(id).then((res) => {
                setLogin(res.data.login)
                setEmail(res.data.email)
            }).catch((error) => {
                console.log(error);
                AuthService.refreshTokenIfExpired(error, navigate);
            })
        } else {
            
        }
    }, [])

    const title = () => {
        if (id) {
            return <h2 className='text-center'> Update Account </h2>
        }else{
            return <h2 className='text-center'> Create Account </h2>
        }
    }

    const loginForm = () => {
        if (id) {
            return <div className='form-group mb-2'>
                        <label className='form-label'> Login : </label>
                        <input 
                            type='text' 
                            placeholder='Enter login' 
                            name='login' 
                            readonly="readonly"
                            className='form-control'
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>
        }else{
            return <div className='form-group mb-2'>
                        <label className='form-label'> Login : </label>
                        <input 
                            type='text' 
                            placeholder='Enter login' 
                            name='login' 
                            className='form-control'
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>
        }
    }

    const passwordForm = () => {
        if (id) {
            
        }else{
            return <div className='form-group mb-2'>
                        <label className='form-label'> Password : </label>
                        <input 
                            type='password' 
                            placeholder='Enter password' 
                            name='password' 
                            className='form-control'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
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
                            <form>

                                {
                                    loginForm()
                                }

                                <div className='form-group mb-2'>
                                    <label className='form-label'> Email : </label>
                                    <input 
                                        type='email' 
                                        placeholder='Enter email' 
                                        name='email' 
                                        className='form-control'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {
                                    passwordForm()
                                }

                                <button className='btn btn-success' onClick={(e) => createOrUpdateAccount(e)}> Submit </button>
                                <Link to='/accounts' className='btn btn-danger ml-2'> Cancel </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateAccountComponent;
