import './App.css';
import {BrowserRouter as Router, Route, Routes }from 'react-router-dom'
import React, { useEffect } from "react";

import AuthService from './services/AuthService';
import EventBus from "./common/EventBus";

import FooterComponent from './components/FooterComponent';
import HeaderComponent from './components/HeaderComponent';
import HomeComponent from './components/HomeComponent';
import ListAccountComponent from './components/ListAccountComponent';
import CreateAccountComponent from './components/CreateAccountComponent';
import ListClientComponent from './components/ListClientComponent';
import CreateClientComponent from './components/CreateClientComponent';
import ListEmployeeComponent from './components/ListEmployeeComponent';
import CreateEmployeeComponent from './components/CreateEmployeeComponent';
import PriceComponent from './components/PriceComponent';
import SignInComponent from './components/SignInComponent';
import SignUpComponent from './components/SignUpComponent';


function App() {

  useEffect(() => {

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };

  }, []);

  const logOut = () => {
    AuthService.logOut();
  };

  return (
    <div>
      <Router>
          <HeaderComponent/>
          <div className="container">
            <Routes> 
              <Route path="/sign-in" element={<SignInComponent/>} />
              <Route path="/sign-up" element={<SignUpComponent/>} />
              <Route path="/home" element={<HomeComponent/>} />
              <Route path="/accounts" element={<ListAccountComponent/>} />
              <Route path="/add-account" element={<CreateAccountComponent/>} />
              <Route path="/edit-account/:id" element={<CreateAccountComponent/>} />
              <Route path="/clients" element={<ListClientComponent/>} />
              <Route path="/add-client" element={<CreateClientComponent/>} />
              <Route path="/edit-client/:id" element={<CreateClientComponent/>} />
              <Route path="/employees" element={<ListEmployeeComponent/>} />
              <Route path="/add-employee" element={<CreateEmployeeComponent/>} />
              <Route path="/prices" element={<PriceComponent/>} />
              <Route path="/edit-price/:id" element={<PriceComponent/>} />
            </Routes>
          </div>
          <FooterComponent/>
      </Router>
    </div>
  );
}

export default App;
