import React, { useState, useEffect } from "react";
import { BsEyeFill, BsSearch } from "react-icons/bs";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useLocation } from "react-router-dom";

import MyFooter from "../components/MyFooter";

export default function AllRequests() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [account, setAccount] = useState(null);
  const [Contract, setContract] = useState(null);
  const [wEb3, setwEb3] = useState({
    provider: null,
    web3: null,
  });
  const [Requestdate, setRequestdate] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [approvalStatus, setApprovalStatus] = useState({});
  const [isApproved, setIsApproved] = useState(false);

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
        const address = convert.networks[networkId].address;
        const contract = new wEb3.web3.eth.Contract(abi, address);
        setContract(contract);
      } else {
        window.alert("Only Ganache network is supported.");
        window.location.reload();
      }
    };
    loadContract();
  }, [wEb3]);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await wEb3.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    if (wEb3.web3) {
      getAccount();
    }
  }, [wEb3]);

  useEffect(() => {
    const getAllRequestDates = async () => {
      if (!Contract || !account) return;
      const dates = await Contract.methods
        .get_all_requests()
        .call({ from: account });
      setRequestdate(dates);
    };
    getAllRequestDates();
  }, [Contract, account]);

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      if (!Contract || !account || Requestdate.length === 0) return;
      const status = {};
      for (const date of Requestdate) {
        const isApproved = await checkApprove(
          date.from_doctor_addr,
          date.to_patients_addr
        );
        status[date.id] = isApproved;
      }
      setApprovalStatus(status);
    };
    fetchApprovalStatus();
  }, [Contract, account, Requestdate]);

  const handleClick = async (doc, pat) => {
    if (!Contract || !account) return;

    const isApproved = await Contract.methods
      .check_approve_Access(doc, pat)
      .call({ from: account });

    if (!isApproved) {
      window.alert("Request not approved!");
      setIsApproved(false);
      return;
    }

    window.location.replace(
      `/PatientRecordsForDoctor?Doctor=${account}&Patient=${pat}`
    );
  };

  const convertTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const checkApprove = async (doc, pat) => {
    if (!Contract || !account) return false;
    const check = await Contract.methods
      .check_approve_Access(doc, pat)
      .call({ from: account });
    return check;
  };

  const buttonStyle = {
    background: "transparent",
    fontSize: "16px",
    border: "none",
    padding: "0px 25px",
  };

  // Sort the Requestdate array in descending order based on the date
  const sortedRequestdate = [...Requestdate].sort((a, b) => b.date - a.date);

  return (
    <>
      <main>
        <section className="container section dashboard">
          <div className="mt-4 mb-4 container">
            <div className="row">
              <div className="col-xl-12">
                <div className="forms">
                  <div className="card overflow-auto">
                    <div className="card-body">
                      <div className="row d-flex align-items-center mb-4">
                        <div className="col-xl-4">
                          <h3 className="card-title">
                            Requests That You Have Made
                          </h3>
                        </div>
                        <div className="col-xl-8">
                          <div className="input-group w-50">
                            <input
                              type="text"
                              placeholder="Search for patient by name or PK"
                              value={searchValue}
                              onChange={(e) =>
                                setSearchValue(e.target.value)
                              }
                              className="form-control"
                            />
                            <span className="input-group-text">
                              <BsSearch />
                            </span>
                          </div>
                        </div>
                      </div>

                      <table className="table table-borderless datatable m-0">
                        <thead>
                          <tr>
                            <th scope="col">Patient Name</th>
                            <th scope="col">Patient Public Key</th>
                            <th scope="col">Date</th>
                            <th scope="col">See Records</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedRequestdate
                            .filter(
                              (date) => date.from_doctor_addr === account
                            )
                            .filter(
                              (date) =>
                                date.patient_name
                                  .toLowerCase()
                                  .includes(searchValue.toLowerCase()) ||
                                date.to_patients_addr.includes(searchValue)
                            )
                            .map((date) => {
                              const isApproved = approvalStatus[date.id];

                              return (
                                <tr key={date.id}>
                                  <td scope="row">{date.patient_name}</td>
                                  <td scope="row">{date.to_patients_addr}</td>
                                  <td>{convertTimestamp(date.date)}</td>
                                  <td>
                                    {isApproved ? (
                                      <button
                                        disabled={!isApproved}
                                        onClick={() =>
                                          handleClick(
                                            account,
                                            date.to_patients_addr
                                          )
                                        }
                                        style={{
                                          ...buttonStyle,
                                          color: "green",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <BsEyeFill />
                                      </button>
                                    ) : (
                                      <button
                                        disabled={isApproved}
                                        onClick={() =>
                                          handleClick(
                                            account,
                                            date.to_patients_addr
                                          )
                                        }
                                        style={{
                                          ...buttonStyle,
                                          color: "Red",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <BsEyeFill />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
