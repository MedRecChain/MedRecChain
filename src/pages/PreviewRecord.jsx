import React, { useState } from "react";
import record from "../assets/img/slider/img3.jpg";
import MyFooter from "../components/MyFooter";
import { Link } from "react-router-dom";

export default function PreviewRecord() {
  const [record, setRecord] = useState({
    category: "X-ray",
    recordName: "Heart Disease",
    date: "04/1/2023",
    patientPublickey: "0x0976178rc348nckqqqqqyue",
    doctorPublickey: "0x0976neb78rc348nckqqqqqyue",
    
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(record);
  };

  return (
    <>
      <main className="main mb-5">
        <section className="section dashboard">
          <div className="my-5 mx-auto w-75">
            <div className="forms">
              <div className="card requests bg-secondary bg-opacity-10">
                <div className="card-body ">
                  <div className="row">
                    <div className="col-7">
                      <h1 className="card-title">
                        Record Information ( Category )
                      </h1>
                    </div>
                    {/* <div className="col-4">
                      <Link
                        to="/addRecord"
                        className="rounded-5 mx-5 card text-center shadow my-2 py-3 text-muted bg-info"
                      ><b>
                          + Add New Record</b>
                      </Link>
                    </div> */}
                  </div>

                  <form onSubmit={handleSubmit} className="container">
                    <div className="row">
                      <div className="col-xl-6">
                        <div className="card-body text-muted opacity-75">
                          <div className="form-outline mb-4">
                            <label className="" htmlFor="category">
                              Category
                            </label>
                            <input
                              name="category"
                              type="text"
                              id="category"
                              className="form-control form-control-lg"
                              value={record.category}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label className="" htmlFor="recordName">
                              Record Name
                            </label>
                            <input
                              name="recordName"
                              type="text"
                              id="recordName"
                              className="form-control form-control-lg"
                              value={record.recordName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label className="" htmlFor="date">
                              Date
                            </label>
                            <input
                              name="date"
                              type="date"
                              id="date"
                              className="form-control form-control-lg"
                              value={record.date}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label className="" htmlFor="patientPublicKey">
                              Patient Public Key
                            </label>
                            <input
                              name="patientPublicKey"
                              type="text"
                              id="patientPublicKey"
                              className="form-control form-control-lg"
                              value={record.patientPublicKey}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label className="" htmlFor="doctorPublicKey">
                              Doctor Public Key
                            </label>
                            <input
                              name="doctorPublicKey"
                              type="text"
                              id="doctorPublicKey"
                              className="form-control form-control-lg"
                              value={record.doctorPublicKey}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="section dashboard">
                          <div className="fs-6 text-muted ms-4 mt-3 container">
                            <div className="forms ">
                              <label className="" htmlFor="doctorPublicKey">
                                Record Data
                              </label>

                              <div
                                className=" card"
                                id=" file"
                                style={{
                                  height: "350px",
                                  width: "300px",
                                }}
                              >
                                <img src={record} alt="recordData" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
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
