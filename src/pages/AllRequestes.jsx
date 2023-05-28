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
  BsSearch,
} from "react-icons/bs";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect } from "react";

export default function AllRequestes() {
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

  //get acount
  const [account, setAccount] = useState();

  const getAccount = async () => {
    const accounts = await wEb3.web3.eth.getAccounts();
    setAccount(accounts);
  };
  useEffect(() => {
    getAccount();
  }, [wEb3]);
  //////////////////////////////////
  const [Requestdate, setRequestdate] = useState([]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  //Get all Request from doctor

  const getallRequestdates = async () => {
    const date = await Contract.methods
      .get_all_requests()
      .call({ from: acount });
    setRequestdate(date);
  };

  getallRequestdates();

  // store the status of request.

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

  //////////////////// Search Box //////////////////

  const [searchValue, setSearchValue] = useState("");

  ////////////////////////////////////////////////

  return (
    <>
      <main >
        <section className=" container section dashboard">
          <div className="mt-4 mb-4 container">
            <div className="row">
              <div className="col-xl-12">
                <div className="forms">
                  <div className="card overflow-auto">
                    <div className="card-body">
                      <div className="row d-flex align-items-center">
                        <div className="col-xl-4">
                          <h3 className="card-title">
                            Requests That You have Made
                          </h3>
                        </div>
                        <div className="col-xl-7">
                          <div className="input-group w-100">
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
                          {Requestdate.map((date) => {
                            if (
                              date.from_doctor_addr == account &&
                              check_approve(
                                date.from_doctor_addr,
                                date.to_patients_addr
                              )
                            ) {
                              return (
                                <tr key={date.id}>
                                  <td scope="row">{date.patient_name}</td>
                                  <td scope="row">{date.to_patients_addr}</td>

                                  <td>{convertTimestamp(date.date)}</td>

                                  <td>
                                    <button
                                      disabled={isButtonDisabled}
                                      onClick={() =>
                                        handleClick(
                                          acount,
                                          date.to_patients_addr
                                        )
                                      }
                                      style={buttonStyle}
                                    >
                                      <BsEyeFill />
                                    </button>
                                  </td>
                                </tr>
                              );
                            } else if (date.from_doctor_addr == account) {
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
                                        handleClick(
                                          acount,
                                          date.to_patients_addr
                                        )
                                      }
                                      style={buttonreject}
                                    >
                                      <BsEyeFill />
                                    </button>
                                  </td>
                                </tr>
                              );
                            }
                          }).filter(
                            (date) =>
                              date !== undefined &&
                              (date.props.children[0].props.children
                                .toLowerCase()
                                .includes(searchValue.toLowerCase()) ||
                                date.props.children[1].props.children.includes(
                                  searchValue
                                ))
                          )}
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
      <div className="side-footer">
        <MyFooter />
      </div>
    </>
  );
}
