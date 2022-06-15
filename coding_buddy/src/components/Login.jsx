import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { loginHandler } from "./helper/RegistrationChecker";
import { Routes, Route, useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";
import Layout from "./Layout";
import axios from "axios";
import './Login.scss'


export default function Login(props) {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [username, setUsername] = useState("");

  const cookies = new Cookies();
  const navigate = useNavigate()

  const goRegister = () => {
    navigate('/register')
  }

  const goChat = (username, avatar) => {
    console.log('user', username, avatar)
    const data = [username, avatar]
    navigate('/game', {state : data})
  }

  return (
    // <>
      // {/* <Navbar click={props.click}/> */}
      // {/* <Layout /> */}
      <form id="form_login" action="/game" method="GET" runat="server">
        {/* <form id="form_login" action="/game" method="GET"  runat="server"  onSubmit={(e) => e.preventDefault()}> */}
        <div>
          <span>EMAIL : </span>
          <input
            // name="email"
            id="register_email"
            rows="1"
            placeholder="EMAIL"
            type="email"
            value={userEmail}
            onChange={(e) => {
              // console.log(e.target.value);
              setUserEmail(e.target.value);
            }}
            ></input>
        </div>
        <div>
        <span>PASSWORD :{" "}</span>
        <input
          // name="password"

          id="register_password"
          rows="1"
          placeholder="PASSWORD"
          type="password"
          value={userPassword}
          onChange={(e) => {
            // console.log(e.target.value);
            setUserPassword(e.target.value);
          }}
          ></input>
        </div>
        <button
          className="btn"
          type="submit"
          onClick={(e) => {
            const loginInfo = {userEmail, userPassword}
            axios
              .post("http://localhost:8000/login", loginInfo)
              .then((res) => {
                if (res.data) {
                  // console.log("1", res);
                  console.log('login with', res.data);
                  cookies.set("email", res.data);
                  goChat(res.data.userName, res.data.avatar)
                } else {
                  console.log("no matching user")
                  alert ("Invalid information. Please confirm your email and password")
                }
              });
            // useEffect(() => {
            // })
            // console.log(res)
            // console.log("CLICKED");
            // const userDataForCookies = loginHandler({
            //   userEmail,
            //   userPassword,
            // });
            // userDataForCookies.then((data) => {
            //   cookies.set("email", data);
            //   console.log("LOGIN DATA", data);
            // });
            // console.log("got response", userDataForCookies);
            // console.log("setting cookies");
            e.preventDefault();

            // cookies.set("password", userPassword);

            // socket.emit("LOGIN", { userData }).catch(err => console.log(err))
            // <Redirect to="/game" />;
            // 데이터 validation ... is true? else preventdefault
          }}
        >
          Login
        </button>
        <button className="btn" onClick={goRegister}>New here ?</button>
      </form>
    // </>
  );
}
