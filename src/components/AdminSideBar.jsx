import React from "react";
import logo from "../assets/img/logo/Symbol.png";
import { Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { FaHospitalAlt, FaSignOutAlt, FaStethoscope , FaArchive } from "react-icons/fa";
import { BsQuestionCircleFill } from "react-icons/bs";

import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { useEffect, useState } from "react";

export default function AdminSideBar(props) {

 
  const [wEb3,setwEb3]= useState({
    provider:null,
    web3:null,
  })

  const providerChanged= (provider)=>{provider.on("chainChange", _=> window.location.reload());}

 
//get WEB3
  useEffect( ()=>{
   const loadProvider = async () =>{
    const provider= await detectEthereumProvider();
    if(provider)
    {
     providerChanged(provider);
     setwEb3({
      provider,
        web3: new Web3(provider)
     })     
    }
  }
   loadProvider();
  },[]);

const [account, setAccount] = useState();

 // get account
    useEffect(()=>{
  
    const getAccount = async()=>{

    const accounts = await wEb3.web3.eth.getAccounts();
    setAccount(accounts);
   // console.log(accounts);
    
     
  }
    getAccount();

    });

  return (
    <>
      <aside id="sidebar" className="sidebar">
        <div className="border-bottom rounded-bottom shadow-5 mb-5">
          <Navbar.Brand className="logo mb-4 ">
            <Link to="/home">
              <img
                src={logo}
                alt="Logo"
                style={{ height: "50px", marginRight: "5px" }}
              />
            </Link>
            <span className="text-dark">MedRecChain</span>
          </Navbar.Brand>
        </div>
        
        <ul className="sidebar-nav mt-4 " id="sidebar-nav">

        <li className="nav-item">
            <NavLink className="nav-link " to = {`/Admin?account=${account}`}>
              <i className="bi bi-grid">
                <FaArchive/> 
              </i>
              <span>{props.tap3}</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link " to = {`/addHospital?account=${account}`}>
              <i className="bi bi-grid">
                <FaHospitalAlt />
              </i>
              <span>{props.tap1}</span>
            </NavLink>
          </li>
          

          <li className="nav-item">
            <NavLink className="nav-link" to={`/addDoctor?account=${account}`}>
              <i className="bi bi-grid">
                <FaStethoscope />
              </i>
              <span>{props.tap2}</span>
            </NavLink>
          </li>

          <li className="nav-item mt-4">
            <NavLink className="nav-link" to="/">
              <i className="bi bi-grid">
                <FaSignOutAlt />
              </i>
              <span>{props.tap4}</span>
            </NavLink>
          </li>

        </ul>
      </aside>
    </>
  );
}
