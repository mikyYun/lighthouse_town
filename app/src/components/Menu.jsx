import { useContext, useState } from "react";
import { UserListContext, SocketContext } from '../App_backup.js'
import { useLocation } from "react-router-dom";
import Profile from "./Profile.jsx";


const Menu = (props) => {
  const {socket} = useContext(SocketContext)
  const location = useLocation()
  const { clicked, setRecipient, setBlockAddFriendAlert, friendList } = useContext(UserListContext);
  const [showProfile, setShowProfile] = useState(false);
  const username = props.username
  const userID = location.state?.[3]
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
          const addFriendName = clicked.value
          currentFriendsNames.includes(addFriendName) ? blockAddFriend("block-friend") : socket.emit("add friend", {username, addFriendName, userID});
          props.close();
        }}>Add Friend</div>

        <div className="menu-action" onClick={() => {
          setRecipient(clicked);
          props.close();
        }}>Send Message</div>

        <div className="menu-action" onClick={(e) => {
          setShowProfile(clicked.value);
        }}>View Profile
          </div>
      </div>
        { showProfile === clicked.value ? <Profile close={props.close}/> : null}
  </div>
  );
};

export default Menu;