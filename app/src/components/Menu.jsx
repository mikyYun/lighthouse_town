import { useContext, useState } from "react";
import { UserListContext, SocketContext } from '../App.js'
import { useLocation } from "react-router-dom";
import Profile from "./Profile.jsx";


const Menu = (props) => {
  const {socket, online, friendList} = useContext(SocketContext)
  const location = useLocation()
  const { clicked, setRecipient, setShow, nickname, recipient, setProfileShow, profiles, setBlockAddFriendAlert } = useContext(UserListContext);
  const [showProfile, setShowProfile] = useState(false);
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
    <div>
      <div className="menu">
        <div className="menu-action" onClick={(e) => {
          // console.log(clicked.value) // clicked name
          const addFriendName = clicked.value
          // console.log("add-friend clicked", username, addFriendName, userID);
          // if addFriiendName is included in current friends list, block add
          currentFriendsNames.includes(addFriendName) ? blockAddFriend("block-friend") : socket.emit("add friend", {username, addFriendName, userID});
          // console.log("add-friend clicked", e);
          socket.emit("add friend", {username, addFriendName, userID});
          props.close();
        }}>Add Friend</div>

        <div className="menu-action" onClick={() => {
          setRecipient(clicked);
          // console.log('clicked in Menu', clicked)
          props.close();
        }}>Send Message</div>

        <div className="menu-action" onClick={(e) => {
          // console.log("clicked vie-porifle", clicked.value)
          setShowProfile(clicked.value);
          // console.log(showProfile)
          // props.close();
        }}>View Profile
          </div>
      </div>
        { showProfile === clicked.value ? <Profile close={props.close}/> : null}
  </div>
  );
};

export default Menu;