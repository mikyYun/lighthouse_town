import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.scss";

export default function Login(props) {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const { setUser } = props;
  const navigate = useNavigate();
  const goRegister = () => {
    navigate("/register");
  };

  const updateLoggedUser = (user) => {
    props.setLoggedUser(user)
  };

  return (
    <div className="login-page">
      <div className="logo"></div>
      <form id="form_login" action="/game/plaza" method="GET" runat="server">
        <div>
          <p>EMAIL</p>
          <input
            name="email"
            id="login_email"
            rows="1"
            placeholder="EMAIL"
            type="email"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <p>PASSWORD </p>
          <input
            name="password"
            id="login_password"
            rows="1"
            placeholder="PASSWORD"
            value={userPassword}
            type="password"
            onChange={(e) => {
              setUserPassword(e.target.value);
            }}
          ></input>
        </div>
        <div className="btns">
          <button
            className="btn"
            type="submit"
            onClick={(e) => {
              const loginInfo = { userEmail, userPassword }
              axios
                .post("/login", loginInfo)
                .then((res) => {
                  const target = res.data;
                  if (target.userName) {
                    setUser(target)
                  }
                })
                .catch((err) => {
                  alert("Invalid information. Please try again");
                });
              e.preventDefault();
            }}
          >
            Login
          </button>
          <button className="btn" onClick={goRegister}>
            New here?
          </button>
        </div>
      </form>
    </div>
  );
}
