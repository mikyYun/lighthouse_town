import React, { useState } from "react";
// import { RegistrationChecker } from "./helper/RegistrationChecker";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import DrawCanvas from "./three/three-scene";
import Navbar from "./Navbar";
import Layout from "./Layout";
import axios from "axios";
import boyImage from "./game_img/boy1.png"
import './Register.scss'

export default function Register(props) {
  const [userEmail, setUserEmail] = useState();
  const [userName, setUserName] = useState();
  const [userPassword, setUserPassword] = useState();
  const [userLanguages, setUserLanguages] = useState([]);
  const [userAvatar, setUserAvatar] = useState();
  const [incorrectPassword, setIncorrectPassword] = useState("correct_password")
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
    <div className="register-form">
      {/* <Layout /> */}
      <form action="/login" method="GET" id="form_registration">

        <div className="field">
          <span>EMAIL :{" "}</span>    {/* 이안에 뭐가 들어갈껀가요? */}
          <input
            // name="email"
            id="register_email"
            rows="1"
            placeholder="EMAIL"
            typeof="email"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
              console.log(e.target.value);
            }}
          ></input>
        </div>

        <div className="field">
          <span> NAME :{" "}</span>
          <input
            // name="name"
            id="register_name"
            rows="1"
            placeholder="NAME"
            type="text"
            value={userName}
            onChange={(e) => {
              console.log(e.target.value);
              if (e.target.value.length < 4) setUserName(e.target.value);
              console.log("username should be longer than 4 chars");
            }}
          ></input>
        </div>

        <div className="field">
          <span> PASSWORD :{" "}</span>
          <input
            // name="password"
            id="register_password"
            rows="1"
            placeholder="PASSWORD"
            type="password"
            // value={userPassword}
            onChange={(e) => {
              if (e.target.value.length < 4) setUserPassword(e.target.value);
              console.log("password should be longer than 4 chars");
              console.log(e.target.value);
            }}
          ></input>
        </div>
        <div className="field">
          <span> CONFIRM PASSWORD :{" "}</span>
          <input
            // name="password_confirmation"
            id="register_password_confirmation"
            rows="1"
            placeholder="PASSWORD_CONFIRMATION"
            type="password"
            onChange={(e) => {
              if (e.target.value !== userPassword) {
                setIncorrectPassword("incorrect_password")
                console.log("confirmation password is not matched");
              } else {
                setIncorrectPassword("correct_password")
              }
            }}
          ></input>
        </div>
        <span className={incorrectPassword}>confirmation password is incorrect</span>
        <div className="field">
          <span> PROGRAMMING LANGUAGES :</span>
          <ul>
            <li>
              <input type="checkbox" id="html" value="HTML" onChange={(e) => insertLanguages(e, 1)} />
              <label>HTML</label>
            </li>
            <li>
              <input type="checkbox" id="css" value="CSS" onChange={(e) => insertLanguages(e, 2)} />
              <label>CSS</label>
            </li>
            <li>
              <input type="checkbox" id="javascript" value="JavaScript" onChange={(e) => insertLanguages(e, 3)} />
              <label>JavaScript</label>
            </li>
            <li>
              <input type="checkbox" id="react" value="react" onChange={(e) => insertLanguages(e, 4)} />
              <label>React</label>
            </li>
            <li>
              <input type="checkbox" id="ruby" value="ruby" onChange={(e) => insertLanguages(e, 5)} />
              <label>Ruby</label>
            </li>
          </ul>
        </div>
        <div className="field">
          <span>AVATAR :</span>
          <ul>
            <li>
              <div className="div_boyImage"></div>
              <div>
                <input
                  type="checkbox"
                  id="man"
                  value="M"
                  onChange={(e) => {
                    setUserAvatar(1);
                  }}
                />
                <label>M</label>
              </div>
            </li>
            <li>
              <div className="div_girlImage"></div>
              <div>
                <input
                  type="checkbox"
                  id="woman"
                  value="W"
                  onChange={(e) => {
                    setUserAvatar(2);
                  }}
                />
                <label>W</label>
              </div>
            </li>
          </ul>
        </div>
        <button
          className="btn"
          type="submit"
          onClick={(e) => {
            const userInfo = {
              userName,
              userPassword,
              userEmail,
              userLanguages,
              userAvatar,
            };
            axios
              .post("/register", { userInfo })
                .then(res => {
                  if (res.data) {
                    console.log(res.data)
                    props.submitRegistrationInfo(res.data);
                    cookies.set("username", res.data)
                    navigate("/game")
                  } else {

                  }
                })
            e.preventDefault();
            // })
            // cookies.set("username", username);
          }}
        >
          Register
        </button>
      </form>
      <div className="div_canvas">{/* <DrawCanvas /> */}</div>
      {/* <Outlet /> */}
    </div>
  );
}
