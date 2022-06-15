import React, { useState } from "react";
// import { RegistrationChecker } from "./helper/RegistrationChecker";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import DrawCanvas from "./three/three-scene";
import Navbar from "./Navbar";
import Layout from "./Layout";
import axios from "axios";

export default function Register(props) {
  const [userEmail, setUserEmail] = useState();
  const [userName, setUserName] = useState();
  const [userPassword, setUserPassword] = useState();
  const [userLanguages, setUserLanguages] = useState([]);
  const [userAvatar, setUserAvatar] = useState();
  const cookies = new Cookies();
  const navigate = useNavigate()
  // window.addEventListener("click", (e) => {
  //   console.log("REG PROPS", props)
  //   props.submitRegistrationInfo("test")
  // })
  console.log("emit to server", props.submitRegistrationInfo);
  const insertLanguages = (e, id) => {
    const checked = e.target.checked;
    if (checked) {
      setUserLanguages((prev) => [...prev, id]);
    } else {
      setUserLanguages((prev) => prev.filter((el) => el !== id));
    }
  };
  return (
    <div className="div_relative">
      <Layout />
      <form action="/login" method="GET" id="form_registration">
        EMAIL :{" "}
        <input
          // name="email"
          id="register_email"
          rows="1"
          placeholder="EMAIL"
          typeof="email"
          onChange={(e) => {
            console.log(e.target.value);
            setUserEmail(e.target.value);
          }}
        ></input>
        <br />
        NAME :{" "}
        <input
          // name="name"
          id="register_name"
          rows="1"
          placeholder="NAME"
          type="text"
          onChange={(e) => {
            console.log(e.target.value);
            if (e.target.value.length < 4)
              console.log("username should be longer than 4 chars");
            setUserName(e.target.value);
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
          onChange={(e) => {
            if (e.target.value.length < 4)
              console.log("password should be longer than 4 chars");
            console.log(e.target.value);
            setUserPassword(e.target.value);
          }}
        ></input>
        <br />
        CONFIRM PASSWORD :{" "}
        <input
          // name="password_confirmation"
          id="register_password_confirmation"
          rows="1"
          placeholder="PASSWORD_CONFIRMATION"
          type="password"
          onChange={(e) => {
            if (e.target.value !== userPassword)
              console.log("confirmation password is not matched");
          }}
        ></input>
        <br />
        PROGRAMMING LANGUAGES :
        <ul>
          <input
            type="checkbox"
            id="html"
            value="HTML"
            onChange={(e) => insertLanguages(e, 1)}
          />
          <label>HTML</label>
          <br />
          <input
            type="checkbox"
            id="css"
            value="CSS"
            onChange={(e) => insertLanguages(e, 2)}
          />
          <label>CSS</label>
          <br />
          <input
            type="checkbox"
            id="javascript"
            value="JavaScript"
            onChange={(e) => insertLanguages(e, 3)}
          />
          <label>JavaScript</label>
          <br />
          <input
            type="checkbox"
            id="react"
            value="react"
            onChange={(e) => insertLanguages(e, 4)}
          />
          <label>React</label>
          <br />
          <input
            type="checkbox"
            id="ruby"
            value="ruby"
            onChange={(e) => insertLanguages(e, 5)}
          />
          <label>Ruby</label>
          <br />
        </ul>
        <br />
        AVATAR :
        <ul>
          <input
            type="checkbox"
            id="man"
            value="M"
            onChange={(e) => {
              setUserAvatar(1);
            }}
          />
          <label>M</label>
          <br />
          <input
            type="checkbox"
            id="woman"
            value="W"
            onChange={(e) => {
              setUserAvatar(2);
            }}
          />
          <label>W</label>
          <br />
        </ul>
        <br />
        <button
          type="submit"
          onClick={(e) => {
            // return new Promise((res) => {
            // const formValues = document.querySelectorAll(
            // "#form_registration input" // get all input tags in form tag
            // );
            // fetch('/register', (e) => {
            // console.log('eee', e)
            // })
            const userInfo = {
              userName,
              userPassword,
              userEmail,
              userLanguages,
              userAvatar,
            };
            axios
              .post("http://localhost:8000/register", {userInfo})
              .then(res => {
                if (res.data) {
                  console.log(res.data)
                  props.submitRegistrationInfo(res.data);
                  cookies.set("username", res.data)
                  navigate("/game")
                }
              })
            e.preventDefault();
            // })
            // cookies.set("username", username);
          }}
        >
          Register
        </button>
        이미지 마우스로 화면전환 가능
      </form>
      <div className="div_canvas">{/* <DrawCanvas /> */}</div>
      {/* <Outlet /> */}
    </div>
  );
}
