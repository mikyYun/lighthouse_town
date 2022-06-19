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
  const goChat = (username, avatar) => {
    const data = [username, avatar]
    navigate('/game/plaza', { state: data })
  }

  return (
    <form id="form_login" action="/game" method="GET" runat="server">
      <div>
        <span>EMAIL : </span>
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
        <span>PASSWORD :{" "}</span>
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
      <button
        className="btn"
        type="submit"
        onClick={(e) => {
          const loginInfo = { userEmail, userPassword }
          cookies.set("username", userEmail)
          axios
            .post("/login", loginInfo)
            .then((res) => {
              if (res.data.userName) {
                setUser(res.data.userName) // pass username so that server set username and socketid as key:value pair
                console.log("res.data - Login.js", res.data);
                cookies.set("userdata", res.data);
                goChat(res.data.userName, res.data.avatar)
                // props.setNickname(res.data.userName)
              } else {
                console.log(res.data)
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
    </form>
    // </>
  );
}
