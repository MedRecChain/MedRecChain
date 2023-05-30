import { React, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import MyNav from "../components/MyNav";
import MyFooter from "../components/MyFooter.jsx";
import bg from "../assets/img/slider/bg.webp";
import { Link, useLocation } from "react-router-dom";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";

const Home = () => {
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
////////////////////////////////////////////////////////////
  ///get Number of all Hospitals at system.
  const [Hospitaldate, setHospitaldate] = useState([]);
  const getallhospitals = async () => {
    const date = await Contract.methods
      .get_all_hospitals()
      .call({ from: acount });
    
    setHospitaldate(date);
  };
  getallhospitals();


///get Number of all Doctors at system.(By Lenght)
  const [Doctordate, setDoctordate] = useState([]);
  const getallDoctors = async () => {
    const doc = await Contract.methods.get_all_Doctors().call({
      from: acount,
    });
    setDoctordate(doc);
  
  };
  getallDoctors();

///get Number of all Patient at system.(By Lenght)
  const [Patientdate, setPatientdate] = useState([]);
  const getallPatients = async () => {
    const pat = await Contract.methods
      .get_all_Patients()
      .call({ from: acount });
    setPatientdate(pat);
  
  };
  getallPatients();

////////////////////////////////////////////////////////////
  return (
    <>
      <nav>
        <MyNav />
      </nav>
      <div
        className="row"
        style={{
          backgroundImage: "linear-gradient( #a4edfc, #bdcfd4)",
          height: "80vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="col-xl-7">
          <div className="container m-5 p-5">
            <h2
              style={{
                color: "#444",
                textAlign: "left",
                fontSize: "35px",
                fontWeight: "600",
                textTransform: "uppercase",
                marginLeft: "50px",
                marginTop: "10px",
              }}
            >
              Your Health Is Our Top Priority.
            </h2>
            <p
              style={{
                fontSize: "15px",
                textAlign: "left",
                marginTop: "20px",
                marginLeft: "50px",
              }}
            >
              Make Your Medical Record MoreSecure.
              <br /> Be the main controller of your medical record.
            </p>
            <div
              className="homeBtn "
              style={{
                textAlign: "center",
                margin: " 20px 50px",
                fontSize: "20px",
              }}
            >
              <Link className="btn bg-light my-5 fs-5 d-block" to="/dashboard">
                Get Start >
              </Link>
            </div>
          </div>
        </div>
        <div
          className="col-xl-5"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundRepeat: "no-repeat",
            marginTop: "25px",
            backgroundSize: "540px 510px",
          }}
        ></div>
      </div>
      <section id="why-us" className="why-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 d-flex align-items-stretch">
              <div className="content">
                <h3>Why Choose MedRecChain?</h3>
                <p className="text-light">
                  Blockchain technology has a great potential for improving
                  efficiency, security and privacy of Electronic Health Records
                  sharing systems. However, existing solutions relying on a
                  centralized database are susceptible to traditional security
                  problems such as Denial of Service (DoS) attacks and a single
                  point of failure. In addition,past solutions exposed users to
                  privacy linking attacks and did not tackle performance and
                  scalability challenges.
                </p>
                <div className="text-center">
                  <Link to="/about" className="more-btn">
                    Learn More >
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-8 d-flex align-items-stretch">
              <div className="icon-boxes d-flex flex-column justify-content-center">
                <div className="row">
                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box mt-4 mt-xl-0">
                      <Icon
                        icon="fluent:cube-link-20-filled"
                        color="#0dcaf0"
                        width="40"
                        height="40"
                        style={{ marginBottom: "30px" }}
                      />
                      <h4>Based on Blockchain</h4>
                      <p>
                        The entire system of MedRecChain is based on blockchain
                        technology, making it practically secure.
                      </p>
                    </div>
                  </div>
                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box mt-4 mt-xl-0">
                      <Icon
                        icon="fluent:receipt-bag-24-regular"
                        color="#0dcaf0"
                        width="40"
                        height="40"
                        style={{ marginBottom: "30px" }}
                      />
                      <h4>Smart Contracts</h4>
                      <p>
                        MedRecChain is a smart contract-based organization,
                        making it transparent to the public.
                      </p>
                    </div>
                  </div>
                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box mt-4 mt-xl-0">
                      <Icon
                        icon="bx:bx-images"
                        color="#0dcaf0"
                        width="40"
                        height="40"
                        style={{ marginBottom: "30px" }}
                      />
                      <h4>IPFS Storage</h4>
                      <p>
                        All the media is stored on InterPlanetary File System
                        (IPFS) network, making it completely safe and private.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="counts" className="counts">
        <div className="container">
          <div className="row justify-content-center">
            <Link
              className="col-lg-3 col-md-6 mt-5 mt-md-0"
            >
              <div className="count-box">
                <div className="icons">
                  <Icon
                    icon="fa-regular:hospital"
                    color="white"
                    width="24"
                    height="24"
                  />
                </div>
                <span>{Hospitaldate.length}</span>
                <p>Registerd Hospitals</p>
              </div>
            </Link>

            <Link
              className="col-lg-3 col-md-6 mt-5 mt-lg-0"
            >
              <div className="count-box">
                <div className="icons">
                  <Icon
                    icon="healthicons:doctor-male"
                    color="white"
                    width="24"
                    height="24"
                  />
                </div>
                <span>{Doctordate.length}</span>
                <p>Registered Doctors</p>
              </div>
            </Link>

            <Link
              className="col-lg-3 col-md-6 mt-5 mt-lg-0"
            >
              <div className="count-box">
                <div className="icons">
                  <Icon
                    icon="mdi:patient"
                    color="white"
                    width="24"
                    height="24"
                  />
                </div>
                <span>{Patientdate.length}</span>
                <p>Registered Patients</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <MyFooter />
      <script src="../assets/js/main.js"></script>
    </>
  );
};

export default Home;
