import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import AuthService from '../services/AuthService';
import TokenService from '../services/TokenService';


const HeaderComponent =  () => {
    const [currentAccount, setCurrentAccount] = useState(undefined);

    useEffect(() => {
        const account = TokenService.getCurrentAccount();

        if (account) {
        setCurrentAccount(account);
        }
    }, []);

    return (
        <div>
            <header>
                <nav className="navbar navbar-expand navbar-dark bg-dark text-white">
                <Link to={"/"} className="navbar-brand">
                    blankerDog
                </Link>
                <div className="navbar-nav mr-auto">
                <li className="nav-item">
                    <Link to={"/home"} className="nav-link">
                        Home
                    </Link>
                </li>
                </div>

                {currentAccount ? (
                <div className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to={"/profile"} className="nav-link">
                            {currentAccount.username}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <a href="/sign-in" className="nav-link" onClick={AuthService.logOut}>
                            Log Out
                        </a>
                    </li>
                </div>
                ) : (
                <div className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to={"/sign-in"} className="nav-link">
                            Sing In
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to={"/sign-up"} className="nav-link">
                            Sign Up
                        </Link>
                    </li>
                </div>
                )}
                </nav>
            </header>
        </div>
    )
}

export default HeaderComponent;