import React, { useState } from "react";
import MyFooter from "../components/MyFooter";
import MyNav from "../components/MyNav";
import aboutImg from "../assets/img/slider/about1.jpg";
import img1 from "../assets/img/slider/img1.jpg";
import img2 from "../assets/img/slider/img2.jpg";
import img3 from "../assets/img/slider/img3.jpg";
const About = () => {
  return (
    <>
      <MyNav />

      <main>
        <section className=" py-5">
          <div className="py-3">
            <div className="">
              <div className=" mx-auto w-75 my-5 bg-opacity-10">
                <div className="">
                  <div className="row">
                    <img
                      src={aboutImg}
                      alt="aboutImg"
                      className="col-xl-6"
                    />
                    <div className="col-xl-5 p-4 pt-5">
                      <h1 className=" my-4">How can we help you?</h1>
                      <p className="">
                        We seek to put the patients in control of their medical
                        data, giving them the power to share the single, most
                        comprehensive version of their record, with every
                        organisation in their medical network securely.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="about" className="about">
            <div className="bg-danger bg-opacity-50 p-5 text-center">
              <h1>The Problem</h1>
              <p>
                An electronic health record is defined as an electronic version
                of a medical history of the patient as kept by the health care
                provider. But it consists of some major security and privacy
                flaws.
              </p>
            </div>
            <div className="container-fluid prob">
              <div className="row mx-auto w-75">
                <div className="icon-boxes d-flex flex-column align-items-stretch justify-content-center py-1 px-lg-5">
                  <div className="icon-box">
                    <div className="icon">
                      {" "}
                      1
                      {/* <Icon icon="dashicons:database-remove" className="pro-sol" /> */}
                    </div>
                    <h4 className="title">Potential Cybersecurity Issues</h4>
                    <p className="description">
                      The data of the patients lies on a centralized database,
                      which are prone to Denial of Service (DoS) attacks and
                      single point of failure
                    </p>
                  </div>
                  <div className="icon-box">
                    <div className="icon">
                      {" "}
                      2
                      {/* <Icon icon="ri:git-repository-private-fill" className="pro-sol" /> */}
                    </div>
                    <h4 className="title">Privacy of Patients</h4>
                    <p className="description">
                      If the database ever gets hacked. The data of the Patients
                      can get leaked into the world which is unethical.
                      Centralized systems are vulnerable to privacy attacks as
                      well.
                    </p>
                  </div>
                  <div className="icon-box">
                    <div className="icon">
                      {" "}
                      3
                      {/* <Icon icon="bpmn:data-output" className="pro-sol" /> */}
                    </div>
                    <h4 className="title">Inaccurate Data</h4>
                    <p className="description">
                      If an EMR is not updated immediately, as soon as new
                      information is known, such as after test results come in,
                      anyone viewing that EMR could receive incorrect. This
                      could lead to errors in diagnosis and treatment.
                    </p>
                  </div>
                  <div className="icon-box">
                    <div className="icon">
                      4{" "}
                      {/* <Icon icon="emojione-monotone:money-mouth-face" className="pro-sol" /> */}
                    </div>
                    <h4 className="title">Time and Money</h4>
                    <p className="description">
                      It also takes time to demo EHR products and negotiate with
                      EHR system vendors to choose and implement the right
                      system for your practice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="about">
            <div className="bg-success bg-opacity-50 p-5 mt-5 text-center">
              <h1>Our Solutions</h1>
              <p>
                MedRecChain provides a decentralized easy to use Electronic
                Medical Record system(EMR). It is a free web application
                providing a feature rich as well as interactive UI making it
                easy to use.
              </p>
            </div>
            <div className="container-fluid sol">
              <div className="row mx-auto w-75">
                <div className="icon-boxes d-flex flex-column align-items-stretch justify-content-center py-1 px-lg-5">
                  <div className="icon-box">
                    <div className="icon">
                      {" "}
                      1
                      {/* <Icon icon="dashicons:database-remove" className="pro-sol" /> */}
                    </div>
                    <h4 className="title">Minimal Security Risks</h4>
                    <p className="description">
                      As previously mentioned. We use Ethereum Network for our
                      computation making it very safe and secure. There cannot
                      be a single point of failure.
                    </p>
                  </div>
                  <div className="icon-box">
                    <div className="icon">
                      {" "}
                      2
                      {/* <Icon icon="ri:git-repository-private-fill" className="pro-sol" /> */}
                    </div>
                    <h4 className="title">Complete Privacy</h4>
                    <p className="description">
                      The application used IPFS technology for storage of
                      patient's data. Every patient can control who can access
                      their data. Only registerd Organizations and verified
                      Medical Institute can access your data.
                    </p>
                  </div>
                  <div className="icon-box">
                    <div className="icon">
                      {" "}
                      3
                      {/* <Icon icon="bpmn:data-output" className="pro-sol" /> */}
                    </div>
                    <h4 className="title">Verifies Admins</h4>
                    <p className="description">
                      For a Medical Institute to participate in this shared
                      system, it need to be verified by one of the admins. Same
                      goes for the Organizations. They require proper medical
                      and identity license to be succesfully registerd.
                    </p>
                  </div>
                  <div className="icon-box">
                    <div className="icon">
                      4{" "}
                      {/* <Icon icon="emojione-monotone:money-mouth-face" className="pro-sol" /> */}
                    </div>
                    <h4 className="title">Non Profit</h4>
                    <p className="description">
                      MedRecChain is a free to use, non profit system. One does
                      not need to buy this software. It is available for
                      everyone. There are some public open feautes which can be
                      accessed by anyone, be it admin, owner or someone visiting
                      the website for he first time. All that is required is a
                      crypto wallet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="my-5">
            <div className="text-center py-5 px-3 bg-info bg-opacity-50">
              <h1 className="">Our Community</h1>
              <p className="my-4 w-75 text-center mx-auto text-muted">
                Welcome to the future of healthcare! Our medical health record
                platform, powered by blockchain, ethereum, and other
                state-of-the-art technologies, is changing the way medical
                information is stored and shared.
              </p>
            </div>
            <div className="features m-5">
              <div className="mx-5 forms row d-flex justify-content-evenly">
                <div className="col-xl-4 w-25 card requests px-4 py-3">
                  <img
                    src={img1}
                    alt="aboutImg"
                    className="rounded-top"
                    height="200px"
                  />
                  <h4 className="fw-bold py-4">Collaboration</h4>
                  <p className="pb-3">
                    Our team of blockchain, ethereum, and web development work
                    together to build a user-friendly and secure website for
                    medical health record.{" "}
                  </p>
                </div>
                <div className="col-xl-4 w-25 card requests px-4 py-3">
                  <img
                    src={img2}
                    alt="aboutImg"
                    className="rounded-top"
                    height="200px"
                  />
                  <h4 className="fw-bold py-4">Security</h4>
                  <p className="pb-3">
                    Using blockchain technology and encryption, our website
                    ensures secure and private storage and sharing of medical
                    health records.
                  </p>
                </div>
                <div className="col-xl-4 w-25 card requests px-4 py-3">
                  <img
                    src={img3}
                    alt="aboutImg"
                    className="rounded-top"
                    height="200px"
                  />
                  <h4 className="fw-bold py-4">Communication</h4>
                  <p className="pb-3">
                    Our website provides seamless communication between
                    healthcare providers and patients, enhancing the quality of
                    care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MyFooter />
    </>
  );
};

export default About;
