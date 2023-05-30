import React, { useState, useEffect } from "react";
import MyFooter from "../components/MyFooter";
import Web3 from "web3";
import HospitalSideBar from "../components/HospitalSideBar";
import detectEthereumProvider from "@metamask/detect-provider";
import { BsSearch } from "react-icons/bs";
import { CChart } from "@coreui/react-chartjs";

export default function AllHospitals() {
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

  //Get Account
  const [account, setAccount] = useState();
  useEffect(() => {
    const getAccount = async () => {
      const accounts = await wEb3.web3.eth.getAccounts();
      setAccount(accounts);
    };
    getAccount();
  });
  ///////////////////////////////////

  //Get doctor number at this hospital
  const [Hospitaldate, setHospitaldate] = useState([]);
  const [Hospitalname, setHospitalname] = useState([]);
  const Hospitalnames = [];
  const [searchValue, setSearchValue] = useState("");

  ///Date At TABLE for Hospitals.
  const getallHospitals = async () => {
    const date = await Contract.methods
      .get_all_hospitals()
      .call({ from: account[0] });
    setHospitaldate(date);

    for (var i = 0; i < date.length; i++) {
      Hospitalnames[i] = date[i].name;
    }
    setHospitalname(Hospitalnames);
  };

  useEffect(() => {
    getallHospitals();
  }, [Contract]);

  const filteredHospitals = Hospitaldate.filter(
    (date) =>
      date.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      date.addr.includes(searchValue)
  );

  ///////////////////

  //Get number of doctors
  const [Doctordate, setDoctordate] = useState([]);
  const [DocNUM_For_Hos, setDocNUM_For_Hos] = useState([]);
  const DoctorNUM_For_Hos = [];
  const getallDoctors = async () => {
    const doc = await Contract.methods.get_all_Doctors().call({
      from: account[0],
    });
    setDoctordate(doc);
    // for every hospital.
    for (var a = 0; a < Hospitaldate.length; a++) {
      var num = 0;
      for (var i = 0; i < doc.length; i++) {
        if (doc[i].hospital_addr == Hospitaldate[a].addr) {
          num++;
        }
      }
      DoctorNUM_For_Hos[a] = num;
      setDocNUM_For_Hos(DoctorNUM_For_Hos);
    }
  };

  getallDoctors();

  // Get patient number at this hospital

  // get all patients numder
  const [Patientdate, setPatientdate] = useState([]);
  const [PatientNUM_For_Hos, setPatientNUM_For_Hos] = useState([]);
  const Patient_NUM_For_Hos = [];
  ///Date At TABLE for Patients.
  const getallPatients = async () => {
    const pat = await Contract.methods
      .get_all_Patients()
      .call({ from: account[0] });
    setPatientdate(pat);
    // for every hospital.
    for (var a = 0; a < Hospitaldate.length; a++) {
      var num = 0;
      for (var i = 0; i < pat.length; i++) {
        if (pat[i].hospital_addr == Hospitaldate[a].addr) {
          num++;
        }
      }
      Patient_NUM_For_Hos[a] = num;
      setPatientNUM_For_Hos(Patient_NUM_For_Hos);
    }
  };

  getallPatients();
  // -----------

  //////////////////////////////////////////////////
  const options = {
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  ////////////////////////////////////////////////

  return (
    <>
      <main id="main" className="main">
        <HospitalSideBar
          tap1="Hospital Profile"
          tap2="Add Patient"
          tap4="See All Hospitals"
          tap3="Log Out"
        />
        <section className="section container p-4 mt-4 forms ">
          <div className="mt-4 mb-4">
            <div className="forms mx-3">
              <div className="card ">
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
                            placeholder="Search for hospital "
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
                    <table className="table table-borderless datatable m-0">
                      <thead>
                        <tr>
                          <th scope="col">Hospital Name</th>
                          <th scope="col">Public Key</th>
                          <th scope="col">Address</th>
                          <th scope="col">Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Hospitaldate.map((date) => {
                          return (
                            <tr>
                              <th scope="row">{date.name}</th>
                              <td>{date.addr}</td>
                              <td>{date.place}</td>
                              <td>{date.phone}</td>
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
        <div className="forms px-5 ">
          <div className="card p-5">
            <div className=" m-4 pb-5">
              <CChart
                type="bar"
                options={options}
                data={{
                  labels: Hospitalname,
                  datasets: [
                    {
                      label: "Doctors",
                      backgroundColor: "#7fe4ed",
                      borderColor: "rgba(220, 220, 220, 1)",
                      pointBackgroundColor: "rgba(220, 220, 220, 1)",
                      pointBorderColor: "#fff",
                      data: DocNUM_For_Hos,
                      barPercentage: 5,
                      barThickness: 50,
                      maxBarThickness: 50,
                      minBarLength: 2,
                    },
                    {
                      label: "Patients",
                      backgroundColor: "#c17bf6",
                      borderColor: "rgba(151, 187, 205, 1)",
                      pointBackgroundColor: "rgba(151, 187, 205, 1)",
                      pointBorderColor: "#fff",
                      data: PatientNUM_For_Hos,
                      barPercentage: 5,
                      barThickness: 50,
                      maxBarThickness: 50,
                      minBarLength: 2,
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
      </main>
      <MyFooter />
    </>
  );
}
