import React, { useState, useEffect } from "react";
import MyFooter from "../components/MyFooter";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { BsSearch } from "react-icons/bs";

export default function RegisteredPatients(props) {
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

  //////////////////// Search Box //////////////////

  const [searchValue, setSearchValue] = useState("");

  const [Patientdate, setPatientdate] = useState([]);

  ///Date At TABLE for Patients.
  const getallPatients = async () => {
    const date = await Contract.methods
      .get_all_Patients()
      .call({ from: acount });
    setPatientdate(date);
  };

  useEffect(() => {
    getallPatients();
  }, [Contract]);

  const filteredPatients = Patientdate.filter(
    (date) =>
      date.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      date.PatientAddress.includes(searchValue)
  );
  ////////////////////////////////////////////////

  return (
    <>
      <main>
        <section className="section container p-4 mt-4">
          <div className="mt-4 mb-4">
            <div className="forms mx-3">
              <div className="card overflow-auto">
                <div className="card-body">
                  <div className="row d-flex align-items-center">
                    <div className="col-xl-4">
                      <h1 className="card-title my-3">Registered Patients</h1>
                    </div>
                    <div className="col-xl-8">
                      <div className="d-flex">
                        <div className="input-group w-50">
                          <input
                            type="text"
                            placeholder="Search for patient by name or PK"
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
                  {filteredPatients.length > 0 ? (
                    <table className="table table-borderless datatable">
                      <thead>
                        <tr>
                          <th scope="col">Patient Name</th>
                          <th scope="col">Public Key</th>
                          <th scope="col">Hospital Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPatients.map((date) => {
                          return (
                            <tr key={date.PatientAddress}>
                              <th scope="row">{date.name}</th>
                              <td>{date.PatientAddress}</td>
                              <td>{date.hospital_addr}</td>
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
      <div>
        <MyFooter />
      </div>
    </>
  );
}
