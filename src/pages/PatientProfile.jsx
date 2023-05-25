import React, { useState } from "react";
import profile from "../assets/img/slider/patient.png";
import { FaNotesMedical } from "react-icons/fa";
import PatientSideBar from "../components/PatientSideBar";
import MyFooter from "../components/MyFooter";

import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CChart } from "@coreui/react-chartjs";

export default function PatientProfile() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const acount = searchParams.get("account");
  const [Contract, setContract] = useState(null);

  const [wEb3, setwEb3] = useState({
    provider: null,
    web3: null,
  });

  const providerChanged = (provider) => {
    provider.on("ChainChanged", (_) => window.location.reload());
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

  //get Contract
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

  ///get patient profile.
  const [Patientdate, setPatientdate] = useState([]);
  const getPatientinfo = async () => {
    const date = await Contract.methods
      .get_patient_by_address(acount)
      .call({ from: acount });
    setPatientdate(date);
  };

  getPatientinfo();

  // get Record num for patient
  const [RecordDate, setRecordDate] = useState([]);
  const [Counts, setspecialtyCounts] = useState([]);
  const specialtyCounts = [];

  const getallRecordsdates = async () => {
    try {
      const date = await Contract.methods
        .See_Record_for_Patient()
        .call({ from: acount });
      setRecordDate(date);
      for (var i = 0; i < date.length; i++) {
        const specialty = date[i].category;
        if (!specialtyCounts[specialty]) {
          specialtyCounts[specialty] = 0;
        }
        specialtyCounts[specialty]++;
        setspecialtyCounts(specialtyCounts);
      }
    } catch (e) {}
  };
  getallRecordsdates();

  /////////////////

  //Filtter

  ////////////

  return (
    <>
      <main id="main" className="main">
        <PatientSideBar
          tap1="Patient Profile"
          tap2="My Records"
          tap3="Permission & Requests"
          tap4="Log Out"
        />
        <section className="section profile container mt-4">
          <div className="row container">
            <div className="forms col-xl-7">
              <div className=" card h-100 container p-4">
                <div className=" profile-card pt-4 d-flex flex-column align-items-center">
                  <img
                    src={profile}
                    alt="Profile"
                    className="border border-2 mb-2 p-1 border-secondary border-opacity-25 shadow-5 rounded-circle"
                  />
                  <h3>{Patientdate.name}</h3>
                </div>
                <div className="row card-body text-muted ms-4 mt-5 ">
                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg "
                      >
                        Your Email:
                      </label>
                    </div>
                    <div className="col-xl-8">{Patientdate.email}</div>
                    <hr />
                  </div>
                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg "
                      >
                        Your PK:
                      </label>
                    </div>
                    <div className="col-xl-8">{Patientdate.PatientAddress}</div>
                    <hr />
                  </div>
                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg "
                      >
                        National ID:
                      </label>
                    </div>
                    <div className="col-xl-8">{Patientdate.National_id}</div>
                    <hr />
                  </div>
                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg "
                      >
                        Address:
                      </label>
                    </div>
                    <div className="col-xl-8">{Patientdate.National_Addr}</div>
                    <hr />
                  </div>
                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg "
                      >
                        Your Phone:
                      </label>
                    </div>
                    <div className="col-xl-8">{Patientdate.phone}</div>
                    <hr />
                  </div>
                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg "
                      >
                        Your Age:
                      </label>
                    </div>
                    <div className="col-xl-8">{Patientdate.age}</div>
                    <hr />
                  </div>
                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg "
                      >
                        Blood Type:
                      </label>
                    </div>
                    <div className="col-xl-8">{Patientdate.Blood_Type}</div>
                    <hr />
                  </div>
                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg "
                      >
                        Marital Status:
                      </label>
                    </div>
                    <div className="col-xl-8">{Patientdate.marital_status}</div>
                    <hr />
                  </div>
                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg "
                      >
                        Gender:
                      </label>
                    </div>
                    <div className="col-xl-8">{Patientdate.gender}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="forms col-xl-5">
              <div className="card py-5 align-items-center">
                <div className="card-body text-center fs-5  my-5 ">
                  <i className="bi bi-grid fs-3 text-dark me-3">
                    <FaNotesMedical />
                  </i>
                  {RecordDate.length} Records
                </div>
                <div className="card-body w-100 pb-5">
                  <CChart
                    type="bar"
                    data={{
                      labels: Object.keys(Counts),
                      datasets: [
                        {
                          label: "Report for your Medical Record",
                          backgroundColor: [
                            "#00ACB1",
                            "#87E4DB",
                            "#99AFC7",
                            "#CAF0C1",
                            "#F2DED7",
                          ],
                          data: Object.values(Counts),
                          barPercentage: 5,
                          barThickness: 30,
                          maxBarThickness: 30,
                          minBarLength: 2,
                        },
                      ],
                    }}
                    labels="months"
                  />
                  <br />
                  <br />
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
