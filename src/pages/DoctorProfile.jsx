import React, { useState } from "react";
import profile from "../assets/img/slider/doc.png";
import MyFooter from "../components/MyFooter";
import DoctorSideBar from "../components/DoctorSideBar";

import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';


export default function DoctorProfile() {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const acount = searchParams.get('account');
  const [Contract, setContract] = useState(null);


  const [wEb3, setwEb3] = useState({
    provider: null,
    web3: null,
  })

  const providerChanged = (provider) => { provider.on("ChainChanged", _ => window.location.reload()); };
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

  ///get doctor account.
  const [Docdate, setDocdate] = useState([]);
  const getdoctorinfo = async () => {
    const date = await Contract.methods.get_doctor_by_address(acount).call({ from: acount });
    setDocdate(date);
  }

  getdoctorinfo();


  ////////////////////////


  return (
    <>
      <main id="main" className="main">
        <DoctorSideBar tap1="Doctor Profile" tap2="Make Request" tap3="Log Out" />

        <section className="section forms container mt-4">
          <div className="row p-5">
            <div className="forms">
              <div className="card w-75 mx-auto align-center h-100">
                <div className="container  p-4">
                  <div className=" p-1">
                    <img
                      src={profile}
                      alt="Profile"
                      height={100}
                      width={100}
                      className="rounded-circle border border-3 mx-auto d-block p-2" />
                  </div>
                  <div className="mx-auto p-3 align-center">
                    <h3 className="card-title text-center mb-5">Doctor Information</h3>

                    <div className="card-body  text-muted opacity-75 ">
                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg ">
                            Doctor Name:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Docdate.name}
                        </div>
                        <hr />
                      </div>

                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg">
                            Hospital Name:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Docdate.hospital_name}
                        </div>
                        <hr />
                      </div>

                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg">
                            Doctor Phone:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Docdate.phone}
                        </div>
                        <hr />
                      </div>

                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg">
                            Email Address:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Docdate.email}
                        </div>
                        <hr />
                      </div>

                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg">
                            Doctor Age:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Docdate.age}
                        </div>
                        <hr />
                      </div>

                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg">
                            Email Address:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Docdate.email}
                        </div>
                        <hr />
                      </div>

                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg">
                            Doctor Address:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Docdate.place}
                        </div>
                        <hr />
                      </div>

                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg">
                            Medical Specialty:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Docdate.Medical_specialty}
                        </div>
                        <hr />
                      </div>

                      <div className="form-outline row mb-2">
                        <div className="col-xl-3">
                          <label className="text-dark fs-5" htmlFor="form3Example1cg">
                            Doctor Public Key:
                          </label>
                        </div>
                        <div className="col-xl-9">
                          {Docdate.docAddress}
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
      <script src="assets/js/main.js"></script>
    </>
  );
}
