import React from "react";
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";
const MyFooter = () => {
  return (
    <div className="" id="footer">
      <div className=" copy-right">
        <div className="icons-container">
          <a href="https://github.com/MedRecChain" target="_blank" rel="noreferrer">
            <Icon icon="akar-icons:github-fill" color="#000000" />
          </a>
        </div>
        <div className=" text-center small py-3">
          © Copyright
          <Link to="/home" className="fs-6 fw-bold text-info ms-1">
            MedRecChain
          </Link>
          . All Rights Reserved
        </div>

      </div>
    </div>
  );
};
export default MyFooter;
