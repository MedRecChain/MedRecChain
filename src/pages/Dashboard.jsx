import React from "react";
import MyNav from "../components/MyNav";
import MyFooter from "../components/MyFooter.jsx";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

import Web3 from "web3";
import MetaMaskOnboarding from "@metamask/onboarding";
import detectEthereumProvider from "@metamask/detect-provider";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [web3Api, setweb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef();

  //IF the chain of blockchain change, it reload the page.
  const providerChanged = (provider) => {
    provider.on("chainChanged", (_) => window.location.reload());
  };

  //get WEB3

  useEffect(() => {
    const loadProvider = async () => {
      //get the provider from browser.
      const provider = await detectEthereumProvider();
      if (provider) {
        providerChanged(provider);

        // From the Provider, We get web3 object from it.
        setweb3Api({
          provider,
          web3: new Web3(provider),
        });
      }
    };
    loadProvider();
  }, []);

  //get contract.
  const [Contract, setContract] = useState(null);

  useEffect(() => {
    const loadcontract = async () => {
      //Get the deployment contract
      const contractfile = await fetch("/contracts/MedRecChain.json");
      //Fromat json file
      const convert = await contractfile.json();
      //get from web3, get the chain network id that current running.
      const networkid = await web3Api.web3.eth.net.getId();
      //from contract, get the chain network data where the contract is stored on .
      const networkDate = convert.networks[networkid];
      // true when the networkid is "ganache id" (where the contract stored) so networkDate is store ganache network data from contract.
      if (networkDate) {
        //get abi object from contract
        const abi = convert.abi;
        //get addrees of contract
        const address = convert.networks[networkid].address;
        //create object of contract at web3
        const contract = await new web3Api.web3.eth.Contract(abi, address);
        setweb3Api({
          contract,
        });
        setContract(contract);

        // when the networkDate is undefiend, because networkid is not "ganache id"
      } else {
        window.alert("only ganache");
        window.location.reload();
        console.log(networkid);
      }
    };

    loadcontract();
  }, [web3Api.web3]);

  const [personnum, setPersonnum] = useState(null);

  /// log From Contract
  const loadCont = async () => {
    const num = await Contract.methods.logg().call({ from: accounts[0] });
    setPersonnum(num);
  };

  loadCont();

  //********************************************************************** */

  ///////////// Connect ToMetaMask//////////////

  //check if MetaMask is installed. if Not, it asks to install it.
  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  // when account om MetaMask is changed, it updata the account variable using useState.
  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setAccounts(accounts);
        setDisabled(true);
        onboarding.current.stopOnboarding();
      } else {
        setDisabled(false);
      }
    }
  }, [accounts]);

  //if MetaMask not conect to website, it open metamask extention to make the connection and sign up with account.
  React.useEffect(() => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
      window.ethereum.on("accountsChanged", handleNewAccounts);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleNewAccounts);
      };
    }
  }, []);

  //********************************************************************** */

  const onClick = (role) => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts) => setAccounts(newAccounts));
    } else {
      onboarding.current.startOnboarding();
    }

    //Baseg on instructure of Log function at contract.
    if (personnum) {
      if (personnum == role && personnum == 1 && role == 1 && accounts[0]) {
        window.location.replace(`/Admin?account=${accounts[0]}`);
      } else if (
        personnum == role &&
        personnum == 2 &&
        role == 2 &&
        accounts[0]
      ) {
        window.location.replace(`/hospitalProfile?account=${accounts[0]}`);
      } else if (
        personnum == role &&
        personnum == 3 &&
        role == 3 &&
        accounts[0]
      ) {
        window.location.replace(`/DoctorProfile?account=${accounts[0]}`);
      } else if (
        personnum == role &&
        personnum == 4 &&
        role == 4 &&
        accounts[0]
      ) {
        window.location.replace(`/PatientProfile?account=${accounts[0]}`);
      }
      // if there is not account connected to website, it send request from meta to make a connection.
      else if (accounts[0] == "undefined" || accounts.length == 0) {
        window.alert("Connect To MetaMask!!!");
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((newAccounts) => setAccounts(newAccounts));
      }
      // if account is not signed up in the system or try to choose different role.
      else {
        window.alert("Not Your Role!");
      }
    }
  };

  return (
    <>
      <nav>
        <MyNav />
      </nav>
      <main>
        <div className="text-center py-2 px-5 mx-5">
          <span className=" mt-5  mx-auto text-center">
            <h2 className="mb-1 p-2 border-2 border-info border-bottom ">
              Dashboards
            </h2>
          </span>
          <div className="entity row forms d-flex justify-content-evenly">
            <Link
              rel="stylesheet"
              disabled={isDisabled}
              onClick={() => onClick(1)}
              className="col-xl-5 icon-box card requests p-4 py-5 bg-opacity-50 "
            >
              <div className="icon">
                <Icon icon="eos-icons:admin" className="i" />
              </div>
              <h4 className="">Super Admin</h4>
              <p className="">
                Super Admin manages and adds hospitals, and doctors to the
                network.{" "}
              </p>
            </Link>

            <Link
              rel="stylesheet"
              disabled={isDisabled}
              onClick={() => onClick(2)}
              className="col-xl-5 icon-box card requests p-4 py-5 bg-opacity-50 "
            >
              <div className="icon">
                <Icon icon="healthicons:hospital-outline" className="i" />
              </div>
              <h4 className="">Hospitals</h4>
              <p className="">
                Each hospital has its own doctors that can be added to the
                network.{" "}
              </p>
            </Link>

            <Link
              rel="stylesheet"
              disabled={isDisabled}
              onClick={() => onClick(3)}
              className="col-xl-5 icon-box card requests p-4 py-5 bg-opacity-50 "
            >
              <div className="icon">
                <Icon icon="healthicons:doctor-male" className="i" />
              </div>
              <h4 className="">Doctors</h4>
              <p className="">
                Doctors can request to add records to patient medical record,
                view their records and modify them.{" "}
              </p>
            </Link>

            <Link
              rel="stylesheet"
              disabled={isDisabled}
              onClick={() => onClick(4)}
              className="col-xl-5 icon-box card requests p-4 py-5 bg-opacity-50 "
            >
              <div className="icon">
                <Icon icon="mdi:patient" className="i" />
              </div>
              <h4 className="">Patients</h4>
              <p className="">
                Patient has all control on his medical record, can accept or
                reject doctor requests, or give permissions to access his
                record.{" "}
              </p>
            </Link>
          </div>
        </div>
      </main>

      <MyFooter />

      <script src="../assets/js/main.js"></script>
    </>
  );
};
export default Dashboard;
