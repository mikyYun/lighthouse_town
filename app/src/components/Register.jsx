import React, { useState } from "react";
// import { RegistrationChecker } from "./helper/RegistrationChecker";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.scss";

export default function Register(props) {
  const [userEmail, setUserEmail] = useState();
  const [userName, setUserName] = useState();
  const [userPassword, setUserPassword] = useState();
  const [userLanguages, setUserLanguages] = useState([]);
  const [userAvatar, setUserAvatar] = useState();
  const [incorrectPassword, setIncorrectPassword] =
    useState("correct_password");
  const [checked, setChecked] = useState(false)
  const [registerFormCheck, setRegisterFormCheck] = []
  const cookies = new Cookies();
  const navigate = useNavigate();
  // window.addEventListener("click", (e) => {
  //   console.log("REG PROPS", props)
  //   props.submitRegistrationInfo("test")
  // })
  // console.log("emit to server - Register.js", props.submitRegistrationInfo);
  const insertLanguages = (e, id) => {
    const checked = e.target.checked;
    if (checked) {
      setUserLanguages((prev) => [...prev, id]);
    } else {
      setUserLanguages((prev) => prev.filter((el) => el !== id));
    }
  };

  const languageLists = {
    html: "HTML",
    css: "CSS",
    javascript: "Javascript",
    react: "React",
    ruby: "Ruby",
  };
  const makeLanguageLists = Object.keys(languageLists).map(
    (language, index) => {
      return (
        <li>
          <input
            type="checkbox"
            id={language}
            value={languageLists[language]}
            onChange={(e) => insertLanguages(e, index + 1)}
          />
          <label>{languageLists[language]}</label>
        </li>
      );
    }
  );

  return (

    <div className="register-form">
      <form id="form_registration" onSubmit={(e) => e.preventDefault()}>

      <div className="field">
          <span> NAME : </span>
          <input
          className="text-input"
            id="register_name"
            rows="1"
            placeholder="NAME"
            type="text"
            value={userName}
            onChange={(e) => {
              if (e.target.value.length < 4) setUserName(e.target.value);
              console.log(
                "username should be longer than 4 chars - Register.js"
              );
            }}
          ></input>
        </div>
        <div className="field">
          <span>EMAIL : </span> {/* 이안에 뭐가 들어갈껀가요? */}
          <input
            className="text-input"
            id="register_email"
            rows="1"
            placeholder="EMAIL"
            typeof="email"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
              // console.log("setUserEmail - Register.js", e.target.value);
            }}
          ></input>
        </div>


        <div className="field">
          <span> PASSWORD : </span>
          <input
            // name="password"
            className="text-input"
            id="register_password"
            rows="1"
            placeholder="PASSWORD"
            type="password"
            // value={userPassword}
            onChange={(e) => {
              if (e.target.value.length < 4) {
                console.log("password should be longer than 4 chars");
                console.log(e.target.value)
              }
              setUserPassword(e.target.value)
            }}
          ></input>
        </div>
        <div className="field">
          <span> CONFIRM PASSWORD : </span>
          <input
            // name="password_confirmation"
            className="text-input"
            id="register_password_confirmation"
            rows="1"
            placeholder="PASSWORD_CONFIRMATION"
            type="password"
            onChange={(e) => {
              if (e.target.value !== userPassword) {
                console.log(userPassword)
                setIncorrectPassword("incorrect_password");
                console.log(
                  "confirmation password doesn't match. - Register.js"
                );
              } else {
                setIncorrectPassword("correct_password");
              console.log(e.target.value)

              }
            }}
          ></input>
        </div>
        <span className={incorrectPassword}>
          confirmation password is incorrect
        </span>
        <div className="field">
          <span> PROGRAMMING LANGUAGES :</span>
          <ul>
            {makeLanguageLists}
          </ul>
        </div>
        <div className="field">
          <span>AVATAR :</span>
          <ul>
            <li>
              <div className="div_boyImage1"></div>
              <div>
                <input
                  type="checkbox"
                  id="man"
                  value="M"
                  // checked={!checked}
                  onChange={(e) => {
                    setUserAvatar(1);
                    // setChecked(!checked)
                  }}
                />
              </div>
            </li>
            <li>
              <div className="div_boyImage2"></div>
              <div>
                <input
                  type="checkbox"
                  value="W"
                  // checked={checked}
                  onChange={(e) => {
                    setUserAvatar(2);
                    // setChecked(!checked)
                  }}
                />
              </div>
            </li>
            <li>
              <div className="div_girlImage1"></div>
              <div>
                <input
                  type="checkbox"
                  value="W"
                  // checked={checked}
                  onChange={(e) => {
                    setUserAvatar(3);
                    // setChecked(!checked)
                  }}
                />
              </div>
            </li>
            <li>
              <div className="div_girlImage2"></div>
              <div>
                <input
                  type="checkbox"
                  value="W"
                  // checked={checked}
                  onChange={(e) => {
                    setUserAvatar(4);
                    // setChecked(!checked)
                  }}
                />
              </div>
            </li>
          </ul>
        </div>
        <div className="btn-container">
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
            axios // client talking to the server. Asynchronous. if it doesn't happen .post,
              .post("/register", { userInfo })
              .then((res) => {
                props.submitRegistrationInfo(res.data);
                cookies.set("username", res.data, { maxAge: 3600 });
                navigate("/game/plaza");
              })
              .catch((error) => console.log(error));
          }}
        >
          Register
        </button>
        </div>
      </form>
    </div>
  );
}
