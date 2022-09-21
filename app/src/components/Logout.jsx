import Cookies from "universal-cookie";
// import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserListContext, SocketContext } from "../App";
const Logout = () => {
  const {socket} = useContext(SocketContext)
  const { navigate, setRoom, room, logout } = useContext(UserListContext);
  // const navigate = useNavigate();


  return (
    <div className="logout-box">
      <button className="logout-button" onClick={() => logout(room)}>Logout</button>
    </div>
  );
};
export default Logout;
