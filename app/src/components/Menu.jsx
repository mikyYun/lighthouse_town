import { useContext, useState } from "react";
import { UserListContext, SocketContext } from '../App.js'
import { useLocation } from "react-router-dom";

const Menu = (props) => {
  const {socket, online, friendList} = useContext(SocketContext)
  const location = useLocation()
  const { clicked, setRecipient, setShow, nickname, recipient, setProfileShow, profiles } = useContext(UserListContext);
  // console.log('clicked', clicked)
  const username = props.username
  const userID = location.state?.[3]
  const [addFriendAlert, setAddFriendAlert ] = useState("newFriend")
  // setProfileShow
  console.log("online users", online, userID, profiles)
  const currentFriendsNames = Object.keys(friendList)

  return (
    <ul className="menu">
      <li className="add friend" onClick={(e) => {
        // console.log(clicked.value) // clicked name
        const addFriendName = clicked.value
        console.log("add-friend clicked", username, addFriendName, userID);
        // if addFriiendName is included in current friends list, block add
        currentFriendsNames.includes(addFriendName) ? setAddFriendAlert("notANewFriend") : socket.emit("add friend", {username, addFriendName, userID});
        // console.log("add-friend clicked", e);
        // socket.emit("add friend", {username, addFriendName, userID});
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
      }}>View {clicked.value}'s Profile</li>
      <button onClick={()=>{setShow(false)}}>CLOSE</button>
    </ul>
  );
};

export default Menu;