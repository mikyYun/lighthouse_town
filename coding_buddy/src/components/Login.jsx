import { useState } from "react";
import Cookies from "universal-cookie";
import { loginHandler } from "./helper/registrationChecker";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";


export default function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const cookies = new Cookies();

  return (
    <>
      <Navbar />
      <form id="form_login" action="/game" method="GET"  runat="server"  onSubmit={(e) => e.preventDefault()}>
      {/* onSubmit={(e) => e.preventDefault()} */}
        <input
          // name="email"
          id="register_email"
          rows="1"
          placeholder="EMAIL"
          type="email"
          value={userEmail}
          onChange={(e) => {
            console.log(e.target.value);
            setUserEmail(e.target.value);
          }}
        ></input>
        <br />
        PASSWORD :{" "}
        <input
          // name="password"
          id="register_password"
          rows="1"
          placeholder="PASSWORD"
          type="password"
          value={userPassword}
          onChange={(e) => {
            console.log(e.target.value);
            setUserPassword(e.target.value);
          }}
        ></input>
        <br />
          <button
            type="submit"
            onClick={(e) => {
              console.log("CLICKED");
              const userDataForCookies = loginHandler({
                userEmail,
                userPassword,
              });
              console.log("got response", userDataForCookies);
              console.log("setting cookies");
              cookies.set("email", userEmail);
              // cookies.set("password", userPassword);

              // socket.emit("LOGIN", { userData }).catch(err => console.log(err))
              // <Redirect to="/game" />;
              // 데이터 validation ... is true? else preventdefault
            }}
          >
          Login
        </button>
      </form>
    </>
  );
}
