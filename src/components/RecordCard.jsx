import React from "react";
import { BsEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function RecordCard() {
  return (
    <>
      <div className=" col-xxl-4 col-md-4">
        <div className="card info-card customers-card">
          <div className="position-relative">
            <h5 className="card-title fs-6 text-center border-bottom rounded-top bg-secondary  bg-opacity-25">
              Record Name
            </h5>
            <div className="text-secondary card-body border-bottom d-flex overflow-hidden p-3">
              Record info <br /> Lorem ipsum dolor sit, amet consectetur
              adipisicing elit.
            </div>
            <div className="row">
              <div className="col-4">
                <Link to="/previewRecord">
                  <i className="bi fs-4  pe-2 ps-2 border fs-5 ms-3 mt-1 rounded-5 text-muted shadow-5 bi-grid">
                    <BsEyeFill />
                  </i>
                </Link>
              </div>
              <div className="col-8">
                <div className="card-date text-secondary position-relative text-opacity-50 bottom-0 end-0  ">
                  <span className="position-absolute pe-3 end-0">
                    {" "}
                    {Date().toLocaleString().slice(4, 23)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
