import React from 'react';
import { GrUserWorker, GrUser, GrTask } from 'react-icons/gr';
import { VscGraph, VscTag } from 'react-icons/vsc';
import { Link, useNavigate } from "react-router-dom";



const HomeComponent = () => {

    const navigate = useNavigate()

    return (
        <div>
           <div className="row gx-lg-5">
                    <div className="col-lg-6 col-xxl-4">
                        <Link className="card-menu" to={"/orders"}>
                            <div className="card bg-light border-0 h-90">
                                <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                                    <h2 className="fs-1 fw-bold">Orders</h2>
                                    <GrTask className="icon-menu mt-2"/>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-lg-6 col-xxl-4">
                        <Link className="card-menu" to={"/clients"}>
                            <div className="card bg-light border-0 h-90">
                                <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                                    <h2 className="fs-1 fw-bold">Clients</h2>
                                    <GrUser className="icon-menu mt-2"/>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-lg-6 col-xxl-4">
                        <Link className="card-menu" to={"/employees"}>
                            <div className="card bg-light border-0 h-90">
                                <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                                    <h2 className="fs-1 fw-bold">Employees</h2>
                                    <GrUserWorker className="icon-menu mt-2"/>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-lg-6 col-xxl-4">
                        <Link className="card-menu" to={"/prices"}>
                            <div className="card bg-light border-0 h-90">
                                <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                                    <h2 className="fs-1 fw-bold">Prices</h2>
                                    <VscTag className="icon-menu mt-2"/>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-lg-6 col-xxl-4">
                        <Link className="card-menu" to={"/statistics"}>
                            <div className="card bg-light border-0 h-90">
                                <div className="card-body text-center p-4 p-lg-5 pt-0 pt-lg-0">
                                    <h2 className="fs-1 fw-bold">Statistics</h2>
                                    <VscGraph className="icon-menu mt-2"/>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div> 
        </div>
    );
};

export default HomeComponent;