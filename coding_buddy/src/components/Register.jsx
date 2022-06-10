import React from "react";
// import {Outlet} from "react-router-dom";
const { io } = require("socket.io-client");
const socket = io.connect("http://localhost:5000", {
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttemps: 10,
  transports: ["websocket"],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
}); // same domain

export default function Register() {
  return (
    <>
      {/* <form id="form_registration"> */}
        <form action="/login" method="GET" id="form_registration">
        EMAIL :{" "}
        <input
          name="email"
          id="register_email"
          rows="1"
          placeholder="EMAIL"
          typeof="email"
        ></input>
        <br />
        NAME :{" "}
        <input
          name="name"
          id="register_name"
          rows="1"
          placeholder="NAME"
          typeof="text"
        ></input>
        <br />
        PASSWORD :{" "}
        <input
          name="password"
          id="register_password"
          rows="1"
          placeholder="PASSWORD"
          type="password"
        ></input>
        <br />
        CONFIRM PASSWORD :{" "}
        <input
          name="password_confirmation"
          id="register_password_confirmation"
          rows="1"
          placeholder="PASSWORD_CONFIRMATION"
          type="password"
        ></input>
        <br />
        PROGRAMMING LANGUAGES :
        <ul>
          <input type="checkbox" id="html" value="HTML" />
          <label>HTML</label>
          <br />
          <input type="checkbox" id="css" value="CSS" />
          <label>CSS</label>
          <br />
          <input type="checkbox" id="javascript" value="JavaScript" />
          <label>JavaScript</label>
          <br />
          <input type="checkbox" id="react" value="react" />
          <label>React</label>
          <br />
          <input type="checkbox" id="ruby" value="ruby" />
          <label>Ruby</label>
          <br />
        </ul>
        <br />
        <button
          type="submit"
          onClick={() => {
            const formValues = document.querySelectorAll(
              "#form_registration input" // get all input tags in form tag
            );
            const userData = []
            const selectedLanguages = []
            for (let i = 0; i < formValues.length; i ++) {
              if (i > 3) { // programming languages
                // if checked 
                if (formValues[i].checked)
                  selectedLanguages.push(formValues[i].value)
              } else { // user data
                // console.log(formValues[i].value)
                userData.push(formValues[i].value)
              }  
            }
            // password check
            if (userData[2] !== userData[3]) {
              // if password and confirmation are not matched, alert and return
              alert('mismatched password')
              return
            } else {
              // if all good, pass all datas to server
              console.log('userData', userData)
              console.log('languages', selectedLanguages)
              socket.emit("REGISTERED", {userData, selectedLanguages});
            }
          }}
        >
          Register
        </button>
      </form>
      {/* <Outlet /> */}
    </>
  );
}
