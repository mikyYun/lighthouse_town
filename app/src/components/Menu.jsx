import { useContext } from "react";
import { UserListContext, SocketContext } from '../App.js'
import { useLocation } from "react-router-dom";

const Menu = (props) => {
  const {socket} = useContext(SocketContext)
  const location = useLocation()
  const { clicked, setRecipient, setShow, nickname, recipient, setProfileShow } = useContext(UserListContext);
  // console.log('clicked', clicked)
  const username = props.username
  const userID = location.state?.[3]
  // setProfileShow


  return (
    <ul className="menu">

      <li className="add friend" onClick={(e) => {
        // console.log(clicked.value) // clicked name
        const addFriendName = clicked.value
        console.log("add-friend clicked", username, addFriendName, userID);
        socket.emit("add friend", {username, addFriendName, userID});
        setShow(false)
      }}>Add Friend</li>

      <li className="send-message" onClick={() => {
        setRecipient(clicked);
        console.log('clicked in Menu', clicked)
        setShow(false); // 클릭 뒤 사라지게
      }}>Send Message</li>

      <li className="view-profile" onClick={(e) => {
        console.log("clicked vie-porifle", clicked.value)
        setProfileShow("inline");
        setShow(false);
      }}>View Profile</li>

      <button onClick={props.close}>CLOSE</button>
    </ul>
  );
};

export default Menu;
// CLICK VIEW-PROFILE
// display table ?
// element : usernameS, languagesS, avatarS