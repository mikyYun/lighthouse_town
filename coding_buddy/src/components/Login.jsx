import { useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.scss'

export default function Login(props) {

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const setUser = props.setUser
  const cookies = new Cookies();
  const navigate = useNavigate()
  const goRegister = () => {
    navigate('/register')
  }
  const goChat = (username, avatar) => {
    console.log('user', username, avatar)
    const data = [username, avatar]
    navigate('/game', { state: data })
  }

  return (

    <form id="form_login" action="/game" method="GET" runat="server">
      <div>
        <span>EMAIL : </span>
        <input
          id="register_email"
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
          id="register_password"
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
          props.setNickname(userEmail)
          axios
            .post("/login", loginInfo)
            .then((res) => {
              if (res.data) {
                // console.log("1", res);
                setUser(res.data.userName) // pass username so that server set username and socketid as key:value pair
                console.log("res.data", res.data);
                cookies.set("email", res.data);
                goChat(res.data.userName, res.data.avatar)
              } else {
                console.log("no matching user")
                alert("Invalid information. Please confirm your email and password")
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
