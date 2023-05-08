import React from "react";
import MyNav from "../components/MyNav";
import { Button, Form } from "react-bootstrap";
import MyFooter from "../components/MyFooter";

const ContactUs = () => {
  return (
    <>
      <MyNav />
      <main className="container p-4 row mb-3 align-center mx-auto">
        <div className=" m-3  mx-auto text-center">
          <span className=" my-3 mx-auto text-center">
            <h2 className="mb-4 p-2 border-2 border-info border-bottom ">Get Connected</h2>
          </span>
        </div>
        <div className="forms col-xl-6 mx-auto">
          <div className="card">
            <div className="py-3">

              <Form className="align-center mx-auto">
                <Form.Group
                  className="mb-3 mt-5 mx-auto col-xl-8"
                  controlId="formBasicEmail"
                >
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group
                  className="mb-3 mx-auto col-8"
                  controlId="formBasicPassword"
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>


                <Form.Group
                  className="mb-3 mx-auto col-8"
                  controlId="formBasicPassword"
                >
                  <Form.Label>Your Message</Form.Label>
                  <textarea id="w3review" name="w3review" rows="3" cols="34">
                  </textarea>

                </Form.Group>
                <Form.Group className="my-5 mx-auto col-4 ">
                  <Button variant="info" type="submit">
                    Send
                  </Button>
                </Form.Group>
              </Form>
            </div>
          </div>
        </div>
      </main>
      <MyFooter />
    </>
  );
};

export default ContactUs;
