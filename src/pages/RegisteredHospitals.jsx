import React, { useState, useEffect, useCallback } from "react";
import MyFooter from "../components/MyFooter";
import Web3 from "web3";
import HospitalSideBar from "../components/HospitalSideBar";
import detectEthereumProvider from "@metamask/detect-provider";
import { BsSearch } from "react-icons/bs";

export default function RegisteredHospitals(props) {
  const [Contract, setContract] = useState(null);
  const [wEb3, setwEb3] = useState({
    provider: null,
    web3: null,
  });
  const [account, setAccount] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [hospitalNames, setHospitalNames] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorNumbers, setDoctorNumbers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientNumbers, setPatientNumbers] = useState([]);
  const [searchValue, setSearchValue] = useState("");


  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        provider.on("chainChanged", (_) => window.location.reload());
        provider.on("accountsChanged", (_) => window.location.replace("/"));
        setwEb3({
          provider,
          web3: new Web3(provider),
        });
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const loadContract = async () => {
      const contractFile = await fetch("/contracts/MedRecChain.json");
      const convert = await contractFile.json();
      const networkId = await wEb3.web3.eth.net.getId();
      const networkData = convert.networks[networkId];
      if (networkData) {
        const abi = convert.abi;
        const address = networkData.address;
        const contract = new wEb3.web3.eth.Contract(abi, address);
        setContract(contract);
      } else {
        window.alert("Only Ganache network is supported.");
        window.location.reload();
        console.log(networkId);
      }
    };

    if (wEb3.web3) {
      loadContract();
    }
  }, [wEb3]);

  useEffect(() => {
    const getAccount = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      }
    };

    if (!account) {
      getAccount();
    }
  }, [account]);

  const getHospitals = useCallback(async () => {
    if (!account || !Contract) return;
    const hospitalData = await Contract.methods
      .get_all_hospitals()
      .call({ from: account });
    setHospitals(hospitalData);
    const names = hospitalData.map((h) => h.name);
    setHospitalNames(names);
  }, [account, Contract]);

  useEffect(() => {
    getHospitals();
  }, [getHospitals]);

  const getDoctors = useCallback(async () => {
    if (!account || !Contract) return;
    const doctorData = await Contract.methods
      .get_all_Doctors()
      .call({ from: account });
    setDoctors(doctorData);
    const numbers = hospitals.map((h) => {
      return doctorData.filter((d) => d.hospital_addr === h.addr).length;
    });
    setDoctorNumbers(numbers);
  }, [account, Contract, hospitals]);

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);

  const getPatients = useCallback(async () => {
    if (!account || !Contract) return;
    const patientData = await Contract.methods
      .get_all_Patients()
      .call({ from: account });
    setPatients(patientData);
    const numbers = hospitals.map((h) => {
      return patientData.filter((p) => p.hospital_addr === h.addr).length;
    });
    setPatientNumbers(numbers);
  }, [account, Contract, hospitals]);

  useEffect(() => {
    getPatients();
  }, [getPatients]);

  const filteredHospitals = hospitals.filter(
    (hosp) =>
      hosp.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      hosp.addr.includes(searchValue)
  );

  return (
    <>
      <main >
        <section className="section container p-4 mt-4 forms ">
          <div className="mt-4 mb-4">
            <div className="forms mx-3">
              <div className="card">
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
                    <table className="table table-borderless datatable m-0">
                      <thead>
                        <tr>
                          <th scope="col">Hospital Name</th>
                          <th scope="col">Public Key</th>
                          <th scope="col">Address</th>
                          <th scope="col">Phone</th>
                          <th scope="col">Number of Doctors</th>
                          <th scope="col">Number of Patients</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHospitals.map((hosp) => (
                          <tr key={hosp.addr}>
                            <th scope="row">{hosp.name}</th>
                            <td>{hosp.addr}</td>
                            <td>{hosp.place}</td>
                            <td>{hosp.phone}</td>
                            <td>
                              {doctorNumbers[hospitalNames.indexOf(hosp.name)] || 0}
                            </td>
                            <td>
                              {patientNumbers[hospitalNames.indexOf(hosp.name)] || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-danger fs-5">
                      There is no matching result.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MyFooter />
    </>
  );
}
