import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import MyFooter from "../components/MyFooter";
import DoctorSideBar from "../components/DoctorSideBar";
import { Link } from "react-router-dom";
import {
  BsCheckCircleFill,
  BsFillTrash3Fill,
  BsClipboard2CheckFill,
  BsQrCode,
  BsEyeFill,
} from "react-icons/bs";
import QrScanner from "qr-scanner";

import { useLocation } from "react-router-dom";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect } from "react";

export default function PatientPermission() {
  // for QR scanner
  const [fileQr, setFileQr] = useState(null);
  const [dataQr, setDateQr] = useState(null);
  const fileRef = React.useRef();

  const handleClickQR = () => {
    fileRef.current.click();
  };

  const handleChangeQR = async (e) => {
    const fileQr = e.target.files[0];
    setFileQr(fileQr);
    const result = await QrScanner.scanImage(fileQr);
    setDateQr(result);
  };

  // copy pk to clipboard

  const handleCopyClick = () => {
    navigator.clipboard.writeText(dataQr.slice(-42));
    setDateQr("Copied !");
  };

  ////

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

  ////////////////////

  const [isLoading, setIsLoading] = useState(false);

  const [Patient, setPatient] = useState({
    PatientPublickey: "",
  });

  const handleChange = (e) => {
    setPatient({ ...Patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const sendrequestAccess = async (pat) => {
        const success = await Contract.methods
          .send_request_Access(pat.PatientPublickey, acount)
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
          alert("Request sended Successfully.");
          setIsLoading(false);
        } else {
          alert("Request Not sended !!.");
          setIsLoading(false);
        }
      };
      sendrequestAccess(Patient);
    } catch (e) {
      alert("Request Not sended !!.");
      setIsLoading(false);
    }
  };

  const [Requestdate, setRequestdate] = useState([]);

  //Get all Request from doctor

  const getallRequestdates = async () => {
    const date = await Contract.methods
      .get_all_requests()
      .call({ from: acount });
    setRequestdate(date);
  };
  getallRequestdates();

  // store the status of request.
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleClick = async (doc, pat) => {
    const date = await Contract.methods.check_approve_Access(doc, pat).call({
      from: acount,
    });
    setIsButtonDisabled(date);

    if (date == false) {
      window.alert("Request not Approval!!");
    } else {
      window.location.replace(
        `/PatientRecordsForDoctor?Doctor=${acount}&Patient=${pat}`
      );
    }
  };

  // make blocktimestamp more readable.
  function convertTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  }
  const [checkk, setcheck] = useState(false);

  const check_approve = async (doc, pat) => {
    const check = await Contract.methods
      .check_approve_Access(doc, pat)
      .call({ from: acount });

    // return check;
    setcheck(check);
  };

  const buttonStyle = {
    backgroundColor: "transparent",
    color: "green",
    fontSize: "16px",
    border: "none",
    padding: "0px 25px ",
  };
  const buttonreject = {
    backgroundColor: "transparent",
    color: "red",
    fontSize: "16px",
    border: "none",
    padding: "0px 25px ",
  };

  return (
    <>
      <DoctorSideBar tap1="Doctor Profile" tap2="Make Request" tap3="Log Out" />

      <main id="main" className="main">
        <section className=" container section dashboard">
          <div className="mt-4 mb-4 container">
            <div className="forms">
              <div className="card requests">
                <div className="card-body ">
                  <h1 className="card-title ms-5">Send Request</h1>

                  <form
                    onSubmit={handleSubmit}
                    className="container justify-content-start"
                  >
                    <div className="card-body mx-5 px-5 ">
                      <div className="form-outline text-muted ">
                        <label className="form-label" htmlFor="doctorPublicKey">
                          Your public Key
                        </label>
                        <input
                          name="doctorPublickey"
                          type="text"
                          id="doctorPublicKey"
                          className=" form-control form-control-lg"
                          value={acount}
                          disabled
                        />
                      </div>

                      <div className="form-outline mt-4 text-muted row ">
                        <div className="col-xl-10">
                          <label
                            className="form-label"
                            htmlFor="patientPublicKey"
                          >
                            Patient Public Key
                          </label>
                          <input
                            name="PatientPublickey"
                            type="text"
                            id="PatientPublickey"
                            required="required"
                            minlength="42"
                            maxlength="42"
                            className=" form-control form-control-lg"
                            value={Patient.PatientPublickey}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-xl-2">
                          <label
                            className="form-label"
                            htmlFor="form3Example1cg"
                          >
                            Scan QR code
                          </label>
                          <div className="col-xl-6 d-flex justify-content-center">
                            <button
                              type="button"
                              onClick={handleClickQR}
                              className=" "
                            >
                              <i className="fs-3 px-3 bi bi-grid">
                                <BsQrCode />
                              </i>
                            </button>

                            <input
                              type="file"
                              ref={fileRef}
                              onChange={handleChangeQR}
                              accept=".png, .jpg , .jpeg"
                              className="d-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className=" mt-1 d-flex justify-content-center align-items-center">
                        {dataQr && (
                          <div className=" mt-1 d-flex justify-content-end align-items-center">
                            <p className="text-success d-flex justify-content-start">
                              {dataQr.slice(-42)}
                            </p>
                            <span
                              className="fs-3 mx-3"
                              onClick={handleCopyClick}
                              onChange={handleChangeQR}
                              style={{ cursor: "pointer" }}
                            >
                              <i className="bi bi-grid">
                                <BsClipboard2CheckFill />
                              </i>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="">
                        <div className="row">
                          <div className="col-4"></div>
                          <div className="col-8">
                            <Button
                              disabled={isLoading}
                              type="submit"
                              className="btn btn-info mt-5 ms-5 "
                            >
                              Send
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

          <div className="mt-4 mb-4 container">
            <div className="forms">
              <div className="card overflow-auto">
                <div className="card-body">
                  <h3 className="card-title">Requests That You have Made</h3>
                  <table className="table table-borderless datatable">
                    <thead>
                      <tr>
                        <th scope="col">Patient Name</th>
                        <th scope="col">Patient Public Key</th>
                        <th scope="col">Doctor Public Key</th>
                        <th scope="col">Date</th>
                        <th scope="col">See Records</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Requestdate.map((date) => {
                        if (
                          date.from_doctor_addr == acount &&
                          check_approve(
                            date.from_doctor_addr,
                            date.to_patients_addr
                          )
                        ) {
                          return (
                            <tr key={date.id}>
                              <td scope="row">{date.patient_name}</td>
                              <td scope="row">{date.to_patients_addr}</td>
                              <td>{date.from_doctor_addr}</td>

                              <td>{convertTimestamp(date.date)}</td>

                              <td>
                                <button
                                  disabled={isButtonDisabled}
                                  onClick={() =>
                                    handleClick(acount, date.to_patients_addr)
                                  }
                                  style={buttonStyle}
                                >
                                  <BsEyeFill />
                                </button>
                              </td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr key={date.id}>
                              <td scope="row">{date.patient_name}</td>
                              <td scope="row">{date.to_patients_addr}</td>
                              <td>{date.from_doctor_addr}</td>

                              <td>{convertTimestamp(date.date)}</td>

                              <td>
                                <button
                                  disabled={isButtonDisabled}
                                  onClick={() =>
                                    handleClick(acount, date.to_patients_addr)
                                  }
                                  style={buttonreject}
                                >
                                  <BsEyeFill />
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
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
