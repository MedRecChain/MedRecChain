import React from "react";
import { Link } from "react-router-dom";
import MyFooter from "../components/MyFooter";
export default function ErrorPage() {
  return (
    <>
      <div class="container">
        <section class="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <h1>404</h1>
          <h3>The page you are looking for doesn't exist.</h3>
          <Link className="btn" to="/home">
            Back to home
          </Link>
        </section>
      </div>

      <MyFooter />
    </>
  );
}
