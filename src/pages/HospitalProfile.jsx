import React, { useState } from "react";
import hospitalProfile from "../assets/img/slider/hospital.jpg";
import MyFooter from "../components/MyFooter";
import HospitalSideBar from "../components/HospitalSideBar";

import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';

export default function HospitalProfile() {


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const acount = searchParams.get('account');
  const [Contract, setContract] = useState(null);


  const [wEb3, setwEb3] = useState({
    provider: null,
    web3: null,
  })

  const providerChanged = (provider) => { provider.on("chainChanged", _ => window.location.reload()); };
  const accountsChanged= (provider)=>{provider.on("accountsChanged", _=> window.location.replace("/"));};


  //get WEB3
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        providerChanged(provider);
        accountsChanged(provider);
        setwEb3({
          provider,
          web3: new Web3(provider)
        })
      }
    }
    loadProvider();
  }, []);

  //get Contract
  useEffect(() => {

    const loadcontract = async () => {
      const contractfile = await fetch('/contracts/MedRecChain.json');
      const convert = await contractfile.json();
      const networkid = await wEb3.web3.eth.net.getId();
      const networkDate = convert.networks[networkid];
      if (networkDate) {

        const abi = convert.abi;
        const address = convert.networks[networkid].address;
        const contract = await new wEb3.web3.eth.Contract(abi, address);

        setContract(contract);
      } else {
        window.alert("only ganache");
        window.location.reload();
        console.log(networkid);
      }

    }

    loadcontract();

  }, [wEb3]);

  ///get hospital profile.
  const [Hospitaldate, setHospitaldate] = useState([]);
  const getallhospitals = async () => {
    const date = await Contract.methods.get_hospita_by_address(acount).call({ from: acount });

    setHospitaldate(date);
  }

  getallhospitals();

  ////////////////

  return (
    <>
      <main id="main" className="main">
        <HospitalSideBar tap1="Hospital Profile" tap2="Add Patient" tap3="Log Out" />
        <section className="section forms container mt-4">
          <div className="row p-5">
            <div className="forms">
              <div className="card w-75 mx-auto align-center h-100">
                <div className="container  p-4">
                  <div className=" p-1">
                    <img
                      src={hospitalProfile}
                      alt="Profile"
                      height={100}
                      width={100}
                      className="rounded-circle border border-3 mx-auto d-block p-2"/>
                  </div>
                  <div className="mx-auto p-3 align-center">
                    <h3 className="card-title text-center mb-5">Hospital Information</h3>

                    <div className="card-body  text-muted opacity-75 ">
                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg ">
                            Hospital Name:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Hospitaldate.name}
                        </div>
                        <hr />
                      </div>

                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg">
                            Hospital Address:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Hospitaldate.place}
                        </div>
                        <hr />
                      </div>

                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg">
                            Hospital Phone:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Hospitaldate.phone}
                        </div>
                        <hr />
                      </div>

                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg">
                            Hospital Public Key:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Hospitaldate.addr}
                        </div>
                        <hr />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="side-footer"><MyFooter /></div>
    </>
  );
}
