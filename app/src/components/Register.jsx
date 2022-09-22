import React, { useState, useContext } from "react";
import { SocketContext } from "../App";
// import axios from "axios";
import "./Register.scss";

export default function Register(props) {
  const {axios} = useContext(SocketContext)
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userLanguages, setUserLanguages] = useState([]);
  const [userAvatar, setUserAvatar] = useState(1); // 기본 아바타 1
  const [incorrectPassword, setIncorrectPassword] =
    useState("correct_password");
  const { setUser } = props;
  const insertLanguages = (e, id) => {
    const checked = e.target.checked;
    if (checked) {
      setUserLanguages((prev) => [...prev, id]);
    } else {
      setUserLanguages((prev) => prev.filter((el) => el !== id));
    }
  };
  const [alertUsername, setAlertUsername] = useState(false);
  const [alertUserpassword, setAlertUserpassword] = useState(false);

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
            placeholder="NAME:min 4 chars"
            type="text"
            value={userName}
            onChange={(e) => {
              if (e.target.value.length < 4 || e.target.value.length > 10) {
                if (!alertUsername) setAlertUsername(true);
              } else {
                if (alertUsername) setAlertUsername(false);
              }
              setUserName(e.target.value);
            }}
          ></input>
        </div>
        {alertUsername && (
          <span className="check-username-length">
            username should be longer than 4 and less than 10 chars
          </span>
        )}
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
            }}
          ></input>
        </div>

        <div className="field">
          <input
            className="text-input"
            id="register_password"
            rows="1"
            placeholder="PASSWORD"
            type="password"
            onChange={(e) => {
              if (e.target.value.length < 4) {
                if (!alertUserpassword) setAlertUserpassword(true);
              } else {
                if (alertUserpassword) setAlertUserpassword(false);
              }
              setUserPassword(e.target.value);
            }}
          ></input>
        </div>
        {alertUserpassword && (
          <span className="check-password-length">
            Password should be longer than 4 chars
          </span>
        )}
        <div className="field">
          <input
            className="text-input"
            id="register_password_confirmation"
            rows="1"
            placeholder="PASSWORD CONFIRMATION"
            type="password"
            onChange={(e) => {
              if (e.target.value !== userPassword) {
                setIncorrectPassword("incorrect_password");
              } else {
                setIncorrectPassword("correct_password");
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
                  checked={userAvatar === 1 ? true : false}
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
                  checked={userAvatar === 2 ? true : false}
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
                  checked={userAvatar === 3 ? true : false}
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
                  checked={userAvatar === 4 ? true : false}
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
              axios
                .post("/register", { userInfo })
                .then((res) => {
                  if (res.data.unique)
                    alert(`
                    Registration failed. Please try with different email or username
                  `);
                  const target = res.data;
                  if (target.userName) {
                    setUser(target);
                  } else {
                    alert(
                      "Registration failed. Please try with different email or username"
                    );
                    window.location = "/register";
                  }
                })
                .catch((error, msg) => {
                  alert(
                    "Registration failed. Please try with different email or username"
                  );
                });
            }}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
