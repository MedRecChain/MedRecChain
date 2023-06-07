import React from "react";
import { Nav, Button } from "react-bootstrap";
import PatientSideBar from "../components/PatientSideBar";
import MyFooter from "../components/MyFooter";
import { BsEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";

import { useLocation } from "react-router-dom";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";

export default function PatientRecords() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const acount = searchParams.get("account");

  const [wEb3, setwEb3] = useState({
    provider: null,
    web3: null,
  });

  const providerChanged = (provider) => {
    provider.on("chainChange", (_) => window.location.reload());
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

  /////////////////

  //See_Record_for_Patient

  const [RecordDate, setRecordDate] = useState([]);
  const getallRecorddates = async () => {
    try {
      const date = await Contract.methods
        .See_Record_for_Patient()
        .call({ from: acount });
      setRecordDate(date);
    } catch (e) {}
  };

  getallRecorddates();

  
  function convertTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  }

  /////////////////////

  const color = {
    backgroundColor: "white",
    color: " #61dafb",
  };

  //FILTER CATRGORY
  const [activeCategory, setActiveCategory] = useState("all");

  const handleSelect = (selectedKey) => {
    setActiveCategory(selectedKey);
  };

  const filteredCategoryItems =
    activeCategory === "all"
      ? RecordDate
      : RecordDate.filter((item) => item.category === activeCategory);

  const [showButton, setShowButton] = useState(false);

  const handleMouseOver = () => {
    setShowButton(true);
  };

  const handleMouseLeave = () => {
    setShowButton(false);
  };

  ///////// view record /////////

  const gotofile = (acount, Patient, cid) => {
    window.location.replace(
      `/PreviewRecordForPatient?Patient=${Patient}&CID=${cid}`
    );
  };

  const GoToFile = (doctorAddr, patientAddr, hexIpfs) => {
    gotofile(doctorAddr, patientAddr, hexIpfs);
  };
  //////////////////

  return (
    <>
      <PatientSideBar
        tap1="Patient Profile"
        tap2="My Records"
        tap3="Permission & Requests"
        tap4="Log Out"
      />

      <main id="main" className="main">
        <div className="container">
          <nav className="my-5">
            <Nav
              className="fw-semibold  text-info justify-content-center"
              variant="pills"
              style={color}
              defaultActiveKey="all"
              onSelect={handleSelect}
            >
              <Nav.Item>
                <Nav.Link eventKey="all">All</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Medical Test">Medical tests</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="X-Ray">X-Rays</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Drugs">Drugs</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Dr. Consultation">
                  Dr. Consultation
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </nav>
        </div>
        <section className="section record dashboard">
          <div className="px-5 py-4 container">
            <div className="row container">
              {filteredCategoryItems.length === 0 ? (
                <h5 className=" text-center small py-3">
                  This patient does not yet have medical records!!
                </h5>
              ) : (
                filteredCategoryItems.map((date) => {
                  return (
                    <>
                      <div className=" recordCard col-xxl-4 col-md-4">
                        <div
                          className="card info-card customers-card"
                          onMouseOver={handleMouseOver}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="position-relative">
                            <h5 className="card-title fs-6 text-center border-bottom rounded-top bg-secondary  bg-opacity-25">
                              Category: {date.category}
                            </h5>
                            <div className="text-secondary card-body border-bottom d-flex overflow-hidden p-3">
                              Record Name/Description: {date.rec_name}
                              <br />
                              From Dr(PK): {date.doctor_addr}
                            </div>

                            <div className="pb-5">
                              <div className="card-date text-secondary position-relative text-opacity-50 bottom-0 end-0  ">
                                <span className="position-absolute pe-3 end-0">
                                {date.Created_at}
                                </span>
                              </div>
                            </div>

                            {showButton && (
                              <Button
                                className="card-button"
                                onClick={() =>
                                  GoToFile(
                                    date.doctor_addr,
                                    date.patient_addr,
                                    date.hex_ipfs
                                  )
                                }
                              >
                                <i className="bi fs-1 pe-2 ps-2  fs-5 ms-3 rounded-5 shadow-5 bi-grid">
                                  <BsEyeFill />
                                </i>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </main>
      <div className="side-footer">
        <MyFooter />
      </div>
      <script src="../assets/js/main.js"></script>
    </>
  );
}
