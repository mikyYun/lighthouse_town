import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import { UserListContext } from '../App.js';
// import FriendList from "./FriendsList.jsx";
import Avatar from "./Avatar.jsx";
import Menu from "./Menu.jsx";
import Profile from "./Profile.jsx";

export default function Online(props) {
  const { online, socket, nickname } = useContext(SocketContext);
  const { setClicked, setShow, blockAddFriendAlert } = useContext(UserListContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // const [playToggleClassName, setPlayToggleClassName] = useState("friendsListToggle");
  const removeSelfAndAll = online.filter(obj => obj.value !== "all" && obj.value !== nickname);

  const closeMenu = () => {
    setShowMenu(false);
  };

  const usersOnline = removeSelfAndAll.map((obj, i) =>
    <li key={i}
      className="users-online"
      // 클릭 뒤 사라지게
      onClick={() => { setShowMenu(true); setShow(true); }}>
      {<Avatar url={obj.avatarURL} alt="avatar" />}
      {obj.value}
    </li>);

  useEffect(() => {
    socket.emit("friendsList", { socketID: socket.id });
  }, [online]);


  return (
    <div className="online-list">
      {/* <FriendList /> */}
      <p>Online</p>
      {showMenu === true ? <Menu close={closeMenu} openProfile={() => { setShowProfile(!showProfile); }} /> : null}
      <div>{usersOnline}</div>
    </div>
  );
};
