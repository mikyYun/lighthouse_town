import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import { UserListContext } from '../App.js'
import Avatar from "./Avatar.jsx"
import Menu from "./Menu.jsx";
import Profile from "./Profile.jsx";

export default function Online(props) {
  const { online, socket, nickname } = useContext(SocketContext);
  const { setClicked, setShow, blockAddFriendAlert } = useContext(UserListContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // const [playToggleClassName, setPlayToggleClassName] = useState("friendsListToggle");
  // console.log("online_in_Online.jsx", online);
  const removeSelfAndAll = online.filter(obj =>
    obj.value !== "all" && obj.value !== nickname
  )

  const closeMenu = () => {
    setShowMenu(false)
  }
  const openProfile = () => {
    setShowProfile(true);
  }

  const usersOnline = removeSelfAndAll.map((obj, i) =>
    <div className="online-user">
      <li className="users-online" key={i} onClick={() => {
        setShowMenu(true);
        setClicked(obj)
        setShow(true); // 클릭 뒤 사라지게
      }}>
        {<Avatar url={obj.avatar} alt="avatar" />}
        {obj.value}
      </li>
    </div>
    );

  console.log(showMenu)

  useEffect(() => {
    socket.emit("friendsList", { socketID: socket.id });
  }, [online]);


  return (
    <div className="online-list">
      {/* <FriendList /> */}
      <p>Online</p>
      { showMenu === true ?<Menu close={closeMenu} openProfile={openProfile}/> : null}
      <div>{usersOnline}</div>
    </div>
  );
}
