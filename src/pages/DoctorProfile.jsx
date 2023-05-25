import React, { useState } from "react";
import profile from "../assets/img/slider/doc.png";
import MyFooter from "../components/MyFooter";
import DoctorSideBar from "../components/DoctorSideBar";

import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CChart } from "@coreui/react-chartjs";

export default function DoctorProfile() {
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

  ///get doctor account.
  const [Docdate, setDocdate] = useState([]);
  const getdoctorinfo = async () => {
    const date = await Contract.methods
      .get_doctor_by_address(acount)
      .call({ from: acount });
    setDocdate(date);
  };

  getdoctorinfo();

  //Get all Request from doctor
  const [Requestdate, setRequestdate] = useState([]);
  const [aprove, setaprove] = useState(0);
  const [pending, setpending] = useState(0);
  var a = 0;
  var p = 0;

  const getallRequestdates = async () => {
    const date = await Contract.methods
      .get_all_requests()
      .call({ from: acount });
    setRequestdate(date);
    for (var i = 0; i < date.length; i++) {
      const check = await Contract.methods
        .check_approve_Access(
          date[i].from_doctor_addr,
          date[i].to_patients_addr
        )
        .call({
          from: acount,
        });
      if (check) {
        a = a + 1;
      } else {
        p = p + 1;
      }
    }
    setaprove(a);
    setpending(p);
  };

  getallRequestdates();

  ////////////////////////

  return (
    <>
      <main id="main" className="main">
        <DoctorSideBar
          tap1="Doctor Profile"
          tap2="Make Request"
          tap3="Log Out"
        />

        <section className="section container p-4 mt-4">
          <div className="row d-flex align-items-stretch">
            <div className="forms col-xl-7">
              <div className="card container p-5">
                <div className=" p-1">
                  <img
                    src={profile}
                    alt="Profile"
                    height={100}
                    width={100}
                    className="rounded-circle border border-3 mx-auto d-block p-2"
                  />
                </div>
                <h3 className="card-title text-center mb-5">
                  {Docdate.name}
                </h3>
                <div className="card-body  text-muted opacity-75 ">

                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg"
                      >
                        Doctor PK:
                      </label>
                    </div>
                    <div className="col-xl-8">{Docdate.docAddress}</div>
                    <hr />
                  </div>

                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg"
                      >
                        Medical Specialty:
                      </label>
                    </div>
                    <div className="col-xl-8">{Docdate.Medical_specialty}</div>
                    <hr />
                  </div>

                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg"
                      >
                        Hospital PK:
                      </label>
                    </div>
                    <div className="col-xl-8">{Docdate.hospital_addr}</div>
                    <hr />
                  </div>

                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg"
                      >
                        Doctor Phone:
                      </label>
                    </div>
                    <div className="col-xl-8">{Docdate.phone}</div>
                    <hr />
                  </div>

                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg"
                      >
                        Email Address:
                      </label>
                    </div>
                    <div className="col-xl-8">{Docdate.email}</div>
                    <hr />
                  </div>

                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg"
                      >
                        Doctor Age:
                      </label>
                    </div>
                    <div className="col-xl-8">{Docdate.age}</div>
                    <hr />
                  </div>

                  <div className="form-outline row mb-2">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg"
                      >
                        Email:
                      </label>
                    </div>
                    <div className="col-xl-8">{Docdate.email}</div>
                    <hr />
                  </div>

                  <div className="form-outline row mb-0">
                    <div className="col-xl-4">
                      <label
                        className="text-dark fs-5"
                        htmlFor="form3Example1cg"
                      >
                        Doctor Address:
                      </label>
                    </div>
                    <div className="col-xl-8">{Docdate.place}</div>
                  </div>

                </div>
              </div>
            </div>

            <div className="forms col-xl-5">
              <div className="card py-5">
                <div className="card-body m-4 pb-5">
                  <CChart
                  className="mt-4"
                    type="polarArea"
                    data={{
                      labels: [
                        "All Requests",
                        "Approved Request",
                        "Pennding Request",
                      ],
                      datasets: [
                        {
                          data: [Requestdate.length, aprove, pending],

                          backgroundColor: ["#FF6384", "#4BC0C0", "#FFCE56"],
                        },
                      ],
                    }}
                  />
                  <br /><br />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="side-footer">
        <MyFooter />
      </div>
      <script src="assets/js/main.js"></script>
    </>
  );
}
