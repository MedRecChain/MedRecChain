import React, { useState } from "react";
import { Button } from "react-bootstrap";
import AdminSideBar from "../components/AdminSideBar";
import MyFooter from "../components/MyFooter";

import { useLocation } from "react-router-dom";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect } from "react";

export default function AddHospital() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const acount = searchParams.get("account");

  const [wEb3, setwEb3] = useState({
    provider: null,
    web3: null,
  });

  const providerChanged = (provider) => {
    provider.on("chainChanged", (_) => window.location.reload());
  };
  const accountsChanged = (provider) => {
    provider.on("accountsChanged", (_) => window.location.replace("/"));
  };

  //get WEB3
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        providerChanged(provider);
        accountsChanged(provider);
        setwEb3({
          provider,
          web3: new Web3(provider),
        });
      }
    };
    loadProvider();
  }, []);

  const [Contract, setContract] = useState(null);

  ///// get Contract
  useEffect(() => {
    const loadcontract = async () => {
      const contractfile = await fetch("/contracts/MedRecChain.json");
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
    };

    loadcontract();
  }, [wEb3]);

  /////////////////////////////////////////////////////////////
  const [isLoading, setIsLoading] = useState(false);

  const [hospital, setHospital] = useState({
    hospitalName: "",
    hospitalPublickey: "",
    hospitalAddress: "",
    hospitalPhone: "",
  });

  const [removedhospital, setremovedhospital] = useState({
    hospitalpublickey: "",
  });

  const handleChange = (e) => {
    setHospital({ ...hospital, [e.target.name]: e.target.value });
  };

  const handleChangefoRemove = (e) => {
    setremovedhospital({ ...removedhospital, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      /// Connect To AddHospital Function At Contract
      const addhospital = async (hos) => {
        const success = await Contract.methods
          .addhospital(
            hos.hospitalName,
            hos.hospitalPublickey,
            hos.hospitalAddress,
            hos.hospitalPhone
          )
          .send(
            {
              from: acount,
            },
            function (error) {
              if (error) {
                console.log(error);
                setIsLoading(false);
              }
            }
          );
        if (success) {
          alert("Hospital Added Successfully.");
          setIsLoading(false);
        } else {
          alert("Hospital  Not Added !!.");
          setIsLoading(false);
        }
      };
      addhospital(hospital);
    } catch (e) {
      alert(" Invalid Inputs! Try again.");
    }
  };

  const removeHospital = (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      /// Connect To RemoveHospital Function At Contract
      const removehospital = async (hos) => {
        const success = await Contract.methods
          .removehospital(hos.hospitalpublickey)
          .send(
            {
              from: acount,
            },
            function (error) {
              if (error) {
                console.log(error);
                setIsLoading(false);
              }
            }
          );
        if (success) {
          alert("Hospital removed Successfully.");
          setIsLoading(false);
        } else {
          alert("Hospital  Not Removed !!.");
          setIsLoading(false);
        }
      };
      removehospital(removedhospital);
    } catch (e) {
      alert("Hospital  Not Removed !!.");
    }
  };

  const [Hospitaldate, setHospitaldate] = useState([]);

  ///Date At TABLE for Hospital.
  const getallhospitals = async () => {
    const date = await Contract.methods
      .get_all_hospitals()
      .call({ from: acount });
    setHospitaldate(date);
  };

  getallhospitals();

  return (
    <>
      <main id="main" className="main">
        <AdminSideBar
          tap1=" Hospitals"
          tap2="Doctors"
          tap3="Home"
          tap4="Log Out"
        />

        <section className="section container p-4 mt-4">
          <div className="row ">
            <div className="forms col-xl-6">
              <div className="card">
                <div className="container p-4">
                  <h3 className="card-title">Add Hospital</h3>

                  <form onSubmit={handleSubmit} className="container">
                    <div className="card-body  text-muted opacity-75 ">
                      <div className="form-outline mb-2">
                        <label className="" htmlFor="hospitalName">
                          Hospital Name
                        </label>
                        <input
                          name="hospitalName"
                          type="text"
                          id="hospitalName"
                          required="required"
                          className=" form-control form-control-lg"
                          value={hospital.hospitalName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-outline mb-2">
                        <label className="" htmlFor="hospitalPublickey">
                          Hospital Pk
                        </label>
                        <input
                          name="hospitalPublickey"
                          type="text"
                          id="hospitalPublickey"
                          required="required"
                          minlength="42"
                          maxlength="42"
                          className=" form-control form-control-lg"
                          value={hospital.hospitalPublickey}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-outline mb-2">
                        <label className="" htmlFor="hospitalAddress">
                          Hospital Address
                        </label>
                        <input
                          name="hospitalAddress"
                          type="text"
                          required="required"
                          id="hospitalAddress"
                          className=" form-control form-control-lg"
                          value={hospital.hospitalAddress}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-outline mb-2">
                        <label className="" htmlFor="hospitalPhone">
                          Hospital Phone
                        </label>
                        <input
                          name="hospitalPhone"
                          type="tel"
                          required="required"
                          id="hospitalPhone"
                          className=" form-control form-control-lg"
                          value={hospital.hospitalPhone}
                          onChange={handleChange}
                        />
                      </div>

                      <Button
                        disabled={isLoading}
                        type="submit"
                        className="width-75 btn-info p-2 pe-5 ps-5 align-center m-auto mt-5  mx-auto d-block"
                      >
                        Add
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="forms col-xl-6 ">
              <div className="card pb-5">
                <div className="container p-4">
                  <h3 className="card-title">Remove Hospital</h3>

                  <form onSubmit={removeHospital} className="container">
                    <div className="card-body  text-muted opacity-75 ">
                      <br />
                      <div className="form-outline mb-5 mt-5">
                        <label className="pt-1" htmlFor="hospitalPublicKey">
                          Hospital Public key
                        </label>
                        <input
                          name="hospitalpublickey"
                          type="text"
                          id="hospitalpublickey"
                          required="required"
                          minlength="42"
                          maxlength="42"
                          className=" form-control form-control-lg"
                          value={removedhospital.hospitalpublickey}
                          onChange={handleChangefoRemove}
                        />
                      </div>
                      <br />
                      <br />
                      <br />

                      <Button
                        disabled={isLoading}
                        type="remove"
                        className="btn-danger my-4  p-2 pe-5 ps-5 mx-auto d-block "
                      >
                        Remove
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="side-footer">
        <MyFooter />
      </div>
    </>
  );
}
