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
  const [userAvatar, setUserAvatar] = useState(1);// 기본 아바타 1
  const [incorrectPassword, setIncorrectPassword] =
    useState("correct_password");
  const [registerFormCheck, setRegisterFormCheck] = [];
  const setUser = props.setUser;
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

  const goChat = (username, avatar, userLanguages, id) => {
    const data = [username, avatar, userLanguages, id];
    navigate(`/game/plaza`, { state: data });
    navigate(0, { state: data })
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
        <li key={index} className="lang-li">
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
          <input
          className="text-input"
            id="register_name"
            rows="1"
            placeholder="NAME"
            type="text"
            value={userName}
            onChange={(e) => {
              if (e.target.value.length < 4) {
                console.log(
                  "username should be longer than 4 chars - Register.js"
                );
              }
              if (e.target.value.length > 10) {
                alert("cannot have over 10 digits name");
              }
              setUserName(e.target.value);
            }}
          ></input>
        </div>
        <div className="field">
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
                // console.log(e.target.value)
              }
              setUserPassword(e.target.value);
            }}
          ></input>
        </div>
        <div className="field">
          <input
            // name="password_confirmation"
            className="text-input"
            id="register_password_confirmation"
            rows="1"
            placeholder="PASSWORD CONFIRMATION"
            type="password"
            onChange={(e) => {
              if (e.target.value !== userPassword) {
                // console.log(userPassword)
                setIncorrectPassword("incorrect_password");
                console.log(
                  "confirmation password doesn't match. - Register.js"
                );
              } else {
                setIncorrectPassword("correct_password");
                console.log(e.target.value);
              }
            }}
          ></input>
        </div>
        <span className={incorrectPassword}>
          confirmation password is incorrect
        </span>
        <div className="field">
          <p> PROGRAMMING LANGUAGES </p>
          <ul className="lang-choice">{makeLanguageLists}</ul>
        </div>
        <div className="field">
          <p className="avatar-label">AVATAR </p>
          <ul>
            <li>
              <div className="div_boyImage1"></div>
              <div>
                <input
                  type="checkbox"
                  id="man"
                  value="1"
                  checked={(userAvatar === 1) ? true : false}
                  onChange={(e) => {
                    setUserAvatar(1);
                  }}
                />
              </div>
            </li>
            <li>
              <div className="div_boyImage2"></div>
              <div>
                <input
                  type="checkbox"
                  value="2"
                  checked={(userAvatar === 2) ? true : false}
                  onChange={(e) => {
                    setUserAvatar(2);
                  }}
                />
              </div>
            </li>
            <li>
              <div className="div_girlImage1"></div>
              <div>
                <input
                  type="checkbox"
                  value="3"
                  checked={(userAvatar === 3) ? true : false}
                  onChange={(e) => {
                    setUserAvatar(3);
                  }}
                />
              </div>
            </li>
            <li>
              <div className="div_girlImage2"></div>
              <div>
                <input
                  type="checkbox"
                  value="4"
                  checked={(userAvatar === 4) ? true : false}
                  onChange={(e) => {
                    setUserAvatar(4);
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
                if (res.data.username) {
                  // res.data = [username, avatar_id, userLanguages, id];
                  console.log("register button click and response data",res.data)
                  setUser(res.data.username)
                  // props.submitRegistrationInfo(res.data);
                  cookies.set("userdata", res.data, { maxAge: 3600 });
                  goChat(
                    res.data.username,
                    res.data.avatar,
                    res.data.userLanguages,
                    res.data.userID
                  )
                } else {
                  alert("Invalid information. Please try with different email or username")
                }
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
