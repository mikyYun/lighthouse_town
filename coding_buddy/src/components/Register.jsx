import React from "react";
import { registrationChecker } from "./helper/RegistrationChecker";
import DrawCanvas from "./three/three-scene";
const { io } = require("socket.io-client");
const socket = io.connect("http://localhost.8000", {
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
    <div className="div_relative">
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
        AVATAR :
        <ul>
          <input type="checkbox" id="man" value="M" />
          <label>M</label>
          <br />
          <input type="checkbox" id="woman" value="W" />
          <label>W</label>
          <br />
        </ul>
        <br />
        <button
          type="submit"
          onClick={(e) => {
            const formValues = document.querySelectorAll(
              "#form_registration input" // get all input tags in form tag
            );
            console.log(formValues);
            // get all data to check, and pass to the server then go to login page
            // get return true from server
            // socket.emit("LOGIN", "REGITSRATION casdfals")
            registrationChecker(formValues, e);
          }}
        >
          Register
        </button>
        이미지 마우스로 화면전환 가능
      </form>
      <div className="div_canvas">
        <DrawCanvas />
      </div>
      {/* <Outlet /> */}
    </div>
  );
}
