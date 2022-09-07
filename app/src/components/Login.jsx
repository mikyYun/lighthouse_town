import { useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.scss'

export default function Login(props) {

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const { setUser } = props
  const cookies = new Cookies();
  const navigate = useNavigate()
  const goRegister = () => {
    navigate('/register')
  }
  const goChat = (username, avatar, userLanguages, id) => {
    const data = [username, avatar, userLanguages, id]
    navigate(`/game/plaza`, { state: data })
    navigate(0, { state: data })
  }

  return (
    <div className="login-page">
      {/* <div className="logo"></div> */}
      <h1>Lighthouse Town</h1>
      <h2>A place to find a coding buddy</h2>
    <form id="form_login" action="/game/plaza" method="GET" runat="server">
      <div>
        <input
          // name="email"
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
        <input
          // name="password"
          id="login_password"
          rows="1"
          placeholder="PASSWORD"
          type="password"
          value={userPassword}
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
            // cookies.set("username", userEmail)
            axios
              .post("/login", loginInfo)
              .then((res) => {
                if (res.data.userName) {
                  setUser(res.data.userName) // pass username so that server set username and socketid as key:value pair
                  cookies.set("userdata", res.data, {maxAge: 3600});
                  goChat(res.data.userName, res.data.avatar, res.data.userLanguages, res.data.userID)
                } else {
                  console.log("no matching user - Login.js")
                  alert("Invalid information. Please confirm your email and password")
                }
              });
            e.preventDefault();
          }}
        >
          Login
        </button>
        <button className="btn" onClick={goRegister}>New here?</button>
      </div>
    </form>
    </div>

  );
}
