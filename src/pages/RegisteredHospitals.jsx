import React, { useState, useEffect } from "react";
import AdminSideBar from "../components/AdminSideBar";
import MyFooter from "../components/MyFooter";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { BsSearch } from "react-icons/bs";

export default function RegisteredHospitals(props) {
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
  ///////////////////////////////////

  //Get doctor number at this hospital
  const [Hospitaldate, setHospitaldate] = useState([]);
  const [Patientdate, setPatientdate] = useState(0);
  const [Doctordat, setDoctordat] = useState(0);
  const getallDoctors = async () => {
    var total = 0;
    try {
      const date = await Contract.methods
        .get_all_Doctors()
        .call({ from: acount });
      for (var i = 0; i < date.length; i++) {
        if (date[i] && date[i].hospital_addr == acount[0]) {
          total = total + 1;
        }
      }
      setDoctordat(total);
    } catch (e) {
      console.log(e);
    }
  };
  getallDoctors();

  // Get patient number at this hospital

  const getallPatients = async () => {
    var Tot = 0;
    try {
      const date = await Contract.methods
        .get_all_Patients()
        .call({ from: acount });
      for (var a = 0; a < date.length; a++) {
        if (date[a] && date[a].hospital_addr === acount[0]) {
          Tot = Tot + 1;
        }
        setPatientdate(Tot);
      }
    } catch (e) {
      console.log(e);
    }
  };

  getallPatients();

  //////////////////////////////////////////////////

  const [searchValue, setSearchValue] = useState("");

  ///Date At TABLE for Hospitals.
  const getallHospitals = async () => {
    const date = await Contract.methods
      .get_all_hospitals()
      .call({ from: acount });
    setHospitaldate(date);
  };

  useEffect(() => {
    getallHospitals();
  }, [Contract]);

  const filteredHospitals = Hospitaldate.filter(
    (date) =>
      date.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      date.addr.includes(searchValue)
  );
  ////////////////////////////////////////////////

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
          <div className="mt-4 mb-4">
            <div className="forms mx-3">
              <div className="card overflow-auto">
                <div className="card-body">
                  <div className="row d-flex align-items-center">
                    <div className="col-xl-4">
                      <h1 className="card-title my-3">Registered Hospitals</h1>
                    </div>
                    <div className="col-xl-8">
                      <div className="d-flex">
                        <div className="input-group w-50">
                          <input
                            type="text"
                            placeholder="Search for hospital by name or PK"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="form-control"
                          />
                          <span className="input-group-text">
                            <BsSearch />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {filteredHospitals.length > 0 ? (
                    <table className="table table-borderless datatable">
                      <thead>
                        <tr>
                          <th scope="col">Hospital Name</th>
                          <th scope="col">Public Key</th>
                          <th scope="col">Address</th>
                          <th scope="col">Phone</th>
                          <th scope="col">Doctors</th>
                          <th scope="col">Patients</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHospitals.map((date) => {
                          return (
                            <tr>
                              <th scope="row">{date.name}</th>
                              <td>{date.addr}</td>
                              <td>{date.place}</td>
                              <td>{date.phone}</td>
                              <td>{Doctordat}</td>
                              <td>{Patientdate.length}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-danger fs-5">
                      There isn't match result..!
                    </p>
                  )}
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
