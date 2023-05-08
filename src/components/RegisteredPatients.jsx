import React from "react";

export default function RegisteredPatients() {
  return (
    <div className="mt-4 mb-4">
      <div className="forms">
        <div className="card overflow-auto">
          <div className="card-body">
            <h1 className="card-title">Registered Patients</h1>
            <table className="table table-borderless datatable">
              <thead>
                <tr>
                  <th scope="col">Hospital Name</th>
                  <th scope="col">Public Key</th>
                  <th scope="col">Date</th>
                  <th scope="col">Phone</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Hospital1</th>
                  <td>0x044587B247f46</td>
                  <td>{Date().toLocaleString().slice(0, 23)}</td>
                  <td>+2736847638</td>
                </tr>



                
                {/* <tr>
                  <th scope="row">Hospital1</th>
                  <td>0x044587B247f46</td>
                  <td>{Date().toLocaleString().slice(0, 23)}</td>
                  <td>+2736847638</td>
                </tr>
                <tr>
                  <th scope="row">Hospital1</th>
                  <td>0x044587B247f46</td>
                  <td>{Date().toLocaleString().slice(0, 23)}</td>
                  <td>+2736847638</td>
                </tr>
                <tr>
                  <th scope="row">Hospital1</th>
                  <td>0x044587B247f46</td>
                  <td>{Date().toLocaleString().slice(0, 23)}</td>
                  <td>+2736847638</td>
                </tr>
                <tr>
                  <th scope="row">Hospital1</th>
                  <td>0x044587B247f46</td>
                  <td>{Date().toLocaleString().slice(0, 23)}</td>
                  <td>+2736847638</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
