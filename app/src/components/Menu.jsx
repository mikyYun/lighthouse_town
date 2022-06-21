import { useContext, useState } from "react";
import { UserListContext, SocketContext } from '../App.js'
import { useLocation } from "react-router-dom";

const Menu = (props) => {
  const {socket, online, friendList} = useContext(SocketContext)
  const location = useLocation()
  const { clicked, setRecipient, setShow, nickname, recipient, setProfileShow, profiles, setBlockAddFriendAlert } = useContext(UserListContext);
  // console.log('clicked', clicked)
  const username = props.username
  const userID = location.state?.[3]
  // const [addFriend, setAddFriend ] = useState("Add")
  // setProfileShow
  // console.log("online users", online, userID, profiles)
  const currentFriendsNames = Object.keys(friendList)
  const blockAddFriend = (str) => {
    setBlockAddFriendAlert(str)
    setTimeout(() => {
      setBlockAddFriendAlert("add-friend")
    }, 1000);
  }

  return (
    <ul className="menu">

      <li className="add friend" onClick={(e) => {
        // console.log(clicked.value) // clicked name
        const addFriendName = clicked.value
        // console.log("add-friend clicked", username, addFriendName, userID);
        // if addFriiendName is included in current friends list, block add
        currentFriendsNames.includes(addFriendName) ? blockAddFriend("block-friend") : socket.emit("add friend", {username, addFriendName, userID});
        // console.log("add-friend clicked", e);
        // socket.emit("add friend", {username, addFriendName, userID});
        props.close();
      }}>Add Friend</li>

      <li className="send-message" onClick={() => {
        setRecipient(clicked);
        // console.log('clicked in Menu', clicked)
        props.close();
      }}>Send Message</li>

      <li className="view-profile" onClick={(e) => {
        console.log("clicked vie-porifle", clicked.value)
        setProfileShow("inline");
        // props.openProfile();
        props.close();
      }}>View Profile</li>

      <button onClick={props.close}>CLOSE</button>
    </ul>
  );
};

export default Menu;