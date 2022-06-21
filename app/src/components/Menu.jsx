import { useContext, useState } from "react";
import { UserListContext, SocketContext } from '../App.js'
import { useLocation } from "react-router-dom";
import Profile from "./Profile.jsx";


const Menu = (props) => {
  const {socket, online, friendList} = useContext(SocketContext)
  const [showProfile, setShowProfile] = useState(false);
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
        <li className="menu-action" onClick={(e) => {
          // console.log(clicked.value) // clicked name
          const addFriendName = clicked.value
          // console.log("add-friend clicked", username, addFriendName, userID);
          // if addFriiendName is included in current friends list, block add
          currentFriendsNames.includes(addFriendName) ? blockAddFriend("block-friend") : socket.emit("add friend", {username, addFriendName, userID});
          // console.log("add-friend clicked", e);
          socket.emit("add friend", {username, addFriendName, userID});
          props.close();
        }}>Add Friend</li>

        <li className="menu-action" onClick={() => {
          setRecipient(clicked);
          // console.log('clicked in Menu', clicked)
          props.close();
        }}>Send Message</li>

        <li className="menu-action" onClick={(e) => {
          // console.log("clicked vie-porifle", clicked.value)
          props.setShowProfile(true);
          // props.openProfile();
          props.close();
        }}>View Profile
              {/* <Profile /> */}
          </li>
      </ul>
  );
};

export default Menu;