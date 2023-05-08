import React from "react";
import AdminSideBar from "../components/AdminSideBar";
import MyFooter from "../components/MyFooter";
import { FaBed, FaHospitalAlt, FaStethoscope } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { useEffect, useState } from "react";


export default function Admin() {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const acount = searchParams.get('account');
  const [Contract, setContract] = useState(null);


  const [wEb3, setwEb3] = useState({
    provider: null,
    web3: null,
  })

  const providerChanged = (provider) => { provider.on("chainChanged", _ => window.location.reload()); }


  //get WEB3
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        providerChanged(provider);
        setwEb3({
          provider,
          web3: new Web3(provider)
        })
      }
    }
    loadProvider();
  }, []);

  //get Contract
  useEffect(() => {

    const loadcontract = async () => {
      const contractfile = await fetch('/contracts/MedRecChain.json');
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

    }

    loadcontract();

  }, [wEb3]);

  ///get Number of all Hospitals at system. (By Lenght)
  const [Hospitaldate, setHospitaldate] = useState([]);
  const getallhospitals = async () => {
    const date = await Contract.methods.get_all_hospitals().call({ from: acount });
    setHospitaldate(date);
  }

  getallhospitals();

  ///get Number of all Doctors at system.(By Lenght)

  const [Doctordate, setDoctordate] = useState([]);
  const getallDoctors = async () => {
    const date = await Contract.methods.get_all_Doctors().call({ from: acount });
    setDoctordate(date);
  }

  getallDoctors();

  ///get Number of all records at system.

  const [Recorddate, setRecorddate] = useState();
  const getallrecord = async () => {
    const date = await Contract.methods.get_record_number().call({ from: acount });
    setRecorddate(date);
  }

  getallrecord();


  return (
    <>
      <main id="main" className="main">
        <AdminSideBar
          tap1=" Hospitals"
          tap2="Doctors"
          tap3="Home"
          tap4="Log Out"
        />

        <section className="py-5 px-5 bg-info-light position-relative overflow-hidden">
          <div className="container px-5 position-relative">
            <div className=" mb-5 mx-auto text-center">
              <h2 className="mb-5 px-5">Admin Dashboard</h2>
            </div>
            <div className="row container">
              <div className=" container col-12 col-lg-4 mb-5 mb-lg-0">
                <div className="mw-md mx-auto py-4 px-4 bg-white rounded-4 text-center shadow-lg">
                  <div
                    className="d-flex mb-3 mx-auto align-items-center justify-content-center bg-info rounded-pill"
                    style={{ width: "70px", height: " 70px" }}
                  >
                    <i className="bi bi-grid fs-2 text-gray">
                      <FaHospitalAlt />
                    </i>
                  </div>
                  <h4 className="fs-2 card-title">{Hospitaldate.length}</h4>
                  <h6 className="fs-6 text-muted">Hospitals</h6>

                </div>
              </div>
              <div className=" container col-12 col-lg-4 mb-5 mb-lg-0">
                <div className="mw-md mx-auto py-4 px-4 bg-white rounded-4 text-center shadow-lg">
                  <div
                    className="d-flex mb-3 mx-auto align-items-center justify-content-center bg-info rounded-pill"
                    style={{ width: "70px", height: " 70px" }}
                  >
                    <i className="bi bi-grid fs-2 text-gray">
                      <FaStethoscope />
                    </i>
                  </div>
                  <h4 className="fs-2 card-title">{Doctordate.length}</h4>
                  <h6 className="fs-6 text-muted"> Doctors</h6>
                </div>
              </div>


              <div className=" container col-12 col-lg-4 mb-5 mb-lg-0">
                <div className="mw-md mx-auto py-4 px-4 bg-white rounded-4 text-center shadow-lg">
                  <div
                    className="d-flex mb-3 mx-auto align-items-center justify-content-center bg-info rounded-pill"
                    style={{ width: "70px", height: " 70px" }}
                  >
                    <i className="bi bi-grid fs-2 text-gray">
                      <FaHospitalAlt />
                    </i>
                  </div>
                  <h4 className="fs-2 card-title">{Recorddate}</h4>
                  <h6 className="fs-6 text-muted">Patient Record</h6>

                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="side-footer"><MyFooter /></div>
      <script src="../assets/js/main.js"></script>
    </>
  );
}
