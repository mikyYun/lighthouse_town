import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import { UserListContext } from '../App.js'
import Avatar from "./Avatar.jsx"
import Menu from "./Menu.jsx";
import Profile from "./Profile.jsx";
import './Online.scss'

export default function Online(props) {
  const { online, socket, nickname } = useContext(SocketContext);
  const { setClicked, setShow, blockAddFriendAlert } = useContext(UserListContext);
  const [showMenu, setShowMenu] = useState(false);


  // const [playToggleClassName, setPlayToggleClassName] = useState("friendsListToggle");
  // console.log("online_in_Online.jsx", online);
  const removeSelfAndAll = online.filter(obj =>
    obj.value !== "all" && obj.value !== nickname
  )
  // console.log('removeSelfAndAll', removeSelfAndAll)

  const closeMenu = () => {
    setShowMenu(false)
  }

/// click the each online-user
//  - view Menu
//    - view Profile


  const usersOnline = removeSelfAndAll.map((obj, i) =>
    <div className="online-user" key={i}>
      <li className="users-online" onClick={() => {
        setShowMenu(showMenu === false ? obj.value : false);
        setClicked(obj);
        setShow(true); // 클릭 뒤 사라지게
        console.log(obj)
      }}>
        {<Avatar url={obj.avatar} alt="avatar" />}
        <p>{obj.value}</p>
      </li>
      { showMenu === obj.value ?<Menu close={closeMenu} obj={obj} /> : null }
    </div>
    );

  // console.log(showMenu)

  useEffect(() => {
    socket.emit("friendsList", { socketID: socket.id });
  }, [online]);


  return (
    <div className="online-list">
      {/* <FriendList /> */}
      <div className="side-bar-label">Online</div>
      <div>{usersOnline}</div>
    </div>
  );
}
