import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import { UserListContext } from '../App.js'
import Avatar from "./Avatar.jsx"
import Menu from "./Menu.jsx";

export default function Online(props) {
  const { online, socket, nickname } = useContext(SocketContext);
  const { setClicked, setShow, blockAddFriendAlert } = useContext(UserListContext);
  const [showMenu, setShowMenu] = useState(false);
  // const [playToggleClassName, setPlayToggleClassName] = useState("friendsListToggle");
  // console.log("online_in_Online.jsx", online);
  const removeSelfAndAll = online.filter(obj =>
    obj.value !== "all" && obj.value !== nickname
  )

  const closeMenu = () => {
    setShowMenu(false)
  }

  const usersOnline = removeSelfAndAll.map((obj, i) =>
    <li className="users-online" key={i} onClick={() => {
      setShowMenu(true);
      setClicked(obj)
      setShow(true); // 클릭 뒤 사라지게
    }}>
      {<Avatar url={obj.avatar} alt="avatar" />}
      {obj.value}
    </li>);

  console.log(showMenu)
  console.log()

  useEffect(() => {
    socket.emit("friendsList", { socketID: socket.id });
  }, [online]);


  return (
    <div className="online-list">
      {/* <FriendList /> */}
      <p>Online</p>
      { showMenu === true ?
        <div className="menu-background" onClick={(e) => {
          e.stopPropagation();
          closeMenu();
        }}><Menu close={closeMenu}/></div> : null}
      <div>{usersOnline}</div>
    </div>
  );
}
