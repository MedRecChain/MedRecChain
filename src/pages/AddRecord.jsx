import React, { useState } from "react";
import AddRecordSideBar from "../components/AddRecordSideBar";
import recordData from "../assets/img/slider/record.png";
import MyFooter from "../components/MyFooter";
import { FaCamera } from "react-icons/fa";
import { Button } from "react-bootstrap";

import { create } from "ipfs-http-client";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect } from "react";

export default function AddRecord() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const Patient = searchParams.get("Patient");
  const acount = searchParams.get("Doctor");

  const [Contract, setContract] = useState(null);

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

        // console.log(contract.methods);
      } else {
        window.alert("only ganache");
        window.location.reload();
        console.log(networkid);
      }
    };

    loadcontract();
  }, [wEb3]);

  /////////////////

  const [isLoading, setIsLoading] = useState(false);

  const [record, setRecord] = useState({
    patientName: "",
    recordName: "",
    date: "",
    notes: "",
    category: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file == null) {
      alert("Please add Record Data.");
    } else {
      try {
        setIsLoading(true);
        // connect to local ipfs node
        const node = create("http://localhost:5002/api/v0");
        //add the file at ipfs. then it retrieve it's data (it Contains CID, path, .....)
        const date = await node.add(file);

        const success = await Contract.methods
          .addRecord(
            record.category,
            record.patientName,
            record.recordName,
            record.date,
            Patient,
            acount,
            date.path,
            record.notes
          )
          .send(
            {
              from: acount,
            },
            function (error) {
              if (error) {
                setIsLoading(false);
              }
            }
          );
        if (success) {
          alert("Record Added Successfully.");
          setIsLoading(false);
        } else {
          alert("Record Not Added !!.");
          setIsLoading(false);
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <main className="section container ">
        <div className="mt-4 mb-4 container">
          <div className="forms">
            <div className="card requests container">
              <div className="card-body">
                <h1 className="card-title">Record Information</h1>

                <form onSubmit={handleSubmit} className="container">
                  <div className="row">
                    <div className="col-xl-7 ms-5">
                      <div className="card-body text-muted opacity-75">
                        <div className="form-outline mb-4">
                          <label className="" htmlFor="category">
                            Category
                          </label>
                          <select
                            name="category"
                            className="d-block w-100 opacity-50 form-control-lg"
                            id="maritalStatus"
                            required="required"
                            value={record.category}
                            onChange={handleChange}
                          >
                            <option value=""></option>
                            <option value="Medical Test">Medical Test</option>
                            <option value="X-Ray">X-Ray</option>
                            <option value="Drugs">Drugs</option>
                            <option value="Dr. Consultation">
                              Dr. Consultation
                            </option>
                          </select>
                        </div>
                        <div className="form-outline mb-4">
                          <label className="" htmlFor="recordName">
                            Record Name / Description
                          </label>
                          <input
                            name="recordName"
                            type="text"
                            id="recordName"
                            required="required"
                            className="form-control form-control-lg"
                            value={record.recordName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <label className="" htmlFor="notes">
                            Notes for Patient
                          </label>
                          <textarea
                            name="notes"
                            id="notes"
                            required="required"
                            className="form-control form-control-lg"
                            style={{
                              width: "100%",
                              height: "100px", 
                              overflow: "auto", 
                            }}
                            value={record.notes}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-outline mb-4">
                          <label className="" htmlFor="date">
                            Date
                          </label>
                          <input
                            name="date"
                            type="date"
                            id="date"
                            required="required"
                            className="form-control form-control-lg"
                            value={record.date}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-outline mb-4">
                          <label className="" htmlFor="patientPublicKey">
                            Patient Public Key
                          </label>
                          <input
                            name="patientPublicKey"
                            type="text"
                            id="patientPublicKey"
                            className="form-control form-control-lg"
                            value={Patient}
                            disabled
                          />
                        </div>

                        <div className="form-outline mb-4">
                          <label className="" htmlFor="doctorPublicKey">
                            Doctor Public Key
                          </label>
                          <input
                            name="doctorPublicKey"
                            type="text"
                            id="doctorPublicKey"
                            className="form-control form-control-lg"
                            value={acount}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="section ms-5 dashboard">
                        <div className="fs-6 text-muted ms-4 mt-3 container">
                          <div className="forms ">
                            <label className="" htmlFor="doctorPublicKey">
                              Add Record Data
                            </label>

                            <div
                              className=" card"
                              id=" file"
                              style={{
                                height: "330px",
                                width: "250px",
                              }}
                            >
                              <img src={recordData} alt="" />
                              <label className="fileBtn" htmlFor="upload">
                                <input
                                  id="upload"
                                  type="file"
                                  name="recordData"
                                  onChange={handleFileUpload}
                                />
                                <i className="fs-3 ">
                                  <FaCamera />
                                </i>
                              </label>
                            </div>
                          </div>
                          <Button
                            disabled={isLoading}
                            type="submit"
                            className=" btn-info m-5 pe-5 ps-5 ms-5"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MyFooter />
      <script src="../assets/js/main.js"></script>
    </>
  );
}
