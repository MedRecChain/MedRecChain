import React, { useState } from "react";
import { Button } from "react-bootstrap";
import AdminSideBar from "../components/AdminSideBar";
import MyFooter from "../components/MyFooter";

import { useLocation } from "react-router-dom";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect } from "react";
import { BsClipboard2CheckFill, BsQrCode } from "react-icons/bs";
import QrScanner from "qr-scanner";

export default function AddDoctor() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const acount = searchParams.get("account");
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
      } else {
        window.alert("only ganache");
        window.location.reload();
        console.log(networkid);
      }
    };

    loadcontract();
  }, [wEb3]);

  //////////////////////////////////////////////////

  const [isLoading, setIsLoading] = useState(false);

  const [doctor, setDoctor] = useState({
    doctorName: "",
    hospitalName: "",
    hospitalAddress: "",
    doctorPhone: "",
    doctorEmail: "",
    age: "",
    doctorAddress: "",
    medicalSpecialty: "",
    doctorPk: "",
  });

  const [removedoc, setremovedoc] = useState({
    docpk: "",
  });

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };
  const handleChangeforemove = (e) => {
    setremovedoc({ ...removedoc, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const addDoctor = async (doc) => {
        const hospitalAddress = getHospitalAddress(doc.hospitalName);
        const success = await Contract.methods
          .addDoctor(
            doc.doctorName,
            doc.hospitalName,
            hospitalAddress,
            doc.doctorPhone,
            doc.doctorEmail,
            doc.age,
            doc.doctorAddress,
            doc.medicalSpecialty,
            doc.doctorPk
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
          alert("Doctor Added Successfully.");
          setIsLoading(false);
        } else {
          alert("Doctor Not Added !!.");
          setIsLoading(false);
        }
      };

      addDoctor(doctor);
    } catch (e) {
      setIsLoading(false);
      alert("Doctor Not Added !!.");
    }
  };

  const removeDoct = (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const remove = async (doc) => {
        const success = await Contract.methods.removeDoctor(doc.docpk).send(
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
          alert("Doctor Removed Successfully.");
          setIsLoading(false);
        } else {
          alert("Hospital  Not Removed !!.");
          setIsLoading(false);
        }
      };
      remove(removedoc);
    } catch (e) {
      alert("Hospital Not Removed !!.");
      setIsLoading(false);
    }
  };

  const [Doctordate, setDoctordate] = useState([]);

  ///Date At TABLE for Doctors.
  const getallDoctors = async () => {
    const date = await Contract.methods
      .get_all_Doctors()
      .call({ from: acount });
    setDoctordate(date);
  };

  getallDoctors();

  const [Hospitaldate, setHospitaldate] = useState([]);

  ///Date At TABLE for Hospital.
  const getallhospitals = async () => {
    const date = await Contract.methods
      .get_all_hospitals()
      .call({ from: acount });
    setHospitaldate(date);
  };

  getallhospitals();
  // ///////////////////////////////////////
  const handleHospitalChange = (event) => {
    setDoctor({
      ...doctor,
      hospitalName: event.target.value,
    });
  };

  const getHospitalAddress = (hospitalName) => {
    const selectedHospital = Hospitaldate.find(
      (date) => date.name === hospitalName
    );
    return selectedHospital ? selectedHospital.addr : "N/A";
  };

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

  //////////////////////////
  return (
    <>
      <main id="main" className="main">
        <AdminSideBar
          tap1=" Hospitals"
          tap2="Doctors"
          tap3="Home"
          tap4="Log Out"
        />

        <section className="section container mt-4">
          <div className=" container">
            <div className="forms">
              <div className="card">
                <div className="container p-4">
                  <h3 className="card-title">Add Doctor</h3>

                  <form onSubmit={handleSubmit} className="container">
                    <div className="card-body row  text-muted opacity-75 ">
                      <div className="col-xl-6">
                        <div className="form-outline mb-2">
                          <label className="" htmlhtmlFor="form3Example1cg">
                            Doctor Name
                          </label>
                          <input
                            name="doctorName"
                            type="text"
                            id="form3Example1cg"
                            required="required"
                            className=" form-control form-control-lg"
                            value={doctor.doctorName}
                            onChange={handleChange}
                          />
                          <div className="form-outline mb-2">
                            <label className="" htmlFor="form3Example1cg">
                              Medical Specialty
                            </label>
                            <input
                              name="medicalSpecialty"
                              type="text"
                              required="required"
                              id="form3Example1cg"
                              className=" form-control form-control-lg"
                              value={doctor.medicalSpecialty}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="form-outline mb-2">
                            <label className="" htmlFor="form3Example1cg">
                              Hospital Name
                            </label>
                            <select
                              name="hospitalName"
                              className="d-block w-100 opacity-50 form-control-lg"
                              id="hospitalName"
                              required="required"
                              value={doctor.hospitalName}
                              onChange={handleHospitalChange} // Update the handleChange function to handle hospital selection
                            >
                              <option value=""></option>
                              {Hospitaldate.map((date) => {
                                return (
                                  <option value={date.name}>{date.name}</option>
                                );
                              })}
                            </select>
                          </div>

                          <div className="form-outline mb-2">
                            <label className="" htmlFor="form3Example1cg">
                              Hospital Address
                            </label>
                            <input
                              type="text"
                              name="hospitalAddress"
                              className="d-block w-100 opacity-50 form-control-lg"
                              id="hospitalAddress"
                              required="required"
                              value={getHospitalAddress(doctor.hospitalName)}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="row d-flex align-items-center">
                            <div className="col-xl-9">
                              <label className="" htmlFor="form3Example1cg">
                                Doctor Public key
                              </label>
                              <input
                                name="doctorPk"
                                type="text"
                                required="required"
                                minlength="42"
                                maxlength="42"
                                id="form3Example1cg"
                                className=" form-control form-control-lg"
                                value={doctor.doctorPk}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-xl-3">
                              <label
                                className="form-label"
                                htmlFor="form3Example1cg"
                              >
                                Scan QR code
                              </label>
                              <div className="col-xl-8 d-flex justify-content-center">
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
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-outline mb-2">
                          <label className="" htmlFor="form3Example1cg">
                            Doctor Phone
                          </label>
                          <input
                            name="doctorPhone"
                            type="tel"
                            required="required"
                            id="form3Example1cg"
                            className=" form-control form-control-lg"
                            value={doctor.doctorPhone}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-outline mb-2">
                          <label className="" htmlFor="form3Example1cg">
                            Email Address
                          </label>
                          <input
                            name="doctorEmail"
                            type="text"
                            required="required"
                            id="form3Example1cg"
                            className=" form-control form-control-lg"
                            value={doctor.doctorEmail}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-outline mb-2">
                          <label className="" htmlFor="form3Example1cg">
                            Doctor Address
                          </label>
                          <input
                            name="doctorAddress"
                            type="text"
                            required="required"
                            id="form3Example1cg"
                            className=" form-control form-control-lg"
                            value={doctor.doctorAddress}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-outline mb-2">
                          <label className="" htmlFor="form3Example1cg">
                            Age
                          </label>
                          <input
                            name="age"
                            type="text"
                            required="required"
                            id="form3Example1cg"
                            className=" form-control form-control-lg"
                            value={doctor.age}
                            onChange={handleChange}
                          />
                        </div>
                        <Button
                          disabled={isLoading}
                          type="submit"
                          className="btn-info p-2 pe-5 ps-5 mt-3 mx-auto d-block "
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="forms">
              <div className="card">
                <div className="container p-5">
                  <h3 className="card-title">Remove Doctor</h3>

                  <form onSubmit={removeDoct} className="container">
                    <div className="card-body  text-muted ">
                      <div className="form-outline mb-2">
                        <label className="" htmlFor="doctorPublickey">
                          Doctor pk
                        </label>
                        <input
                          name="docpk"
                          type="text"
                          id="doctorp"
                          required="required"
                          minlength="42"
                          maxlength="42"
                          className=" form-control form-control-lg"
                          value={removedoc.docpk}
                          onChange={handleChangeforemove}
                        />
                      </div>
                      <Button
                        disabled={isLoading}
                        type="remove"
                        className="btn-danger p-2 pe-5 ps-5 mt-5 mx-auto d-block "
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
