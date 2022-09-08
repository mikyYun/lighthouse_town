import { useEffect, useContext, useState } from "react";
import { SocketContext, UserListContext } from "../App_backup.js";
import Avatar from "./Avatar.jsx"
import Menu from "./Menu.jsx";
import Profile from "./Profile.jsx";
import './Online.scss'

export default function Online(props) {
  const { socket } = useContext(SocketContext);
  const { setClicked, setShow, nickname, online } = useContext(UserListContext);
  const [showMenu, setShowMenu] = useState(false);
  const removeSelfAndAll = online.filter(obj =>
    obj.value !== "all" && obj.value !== nickname
  )

  const closeMenu = () => {
    setShowMenu(false)
  }

  const usersOnline = removeSelfAndAll.map((obj, i) =>
    <div className="online-user" key={i}>
      <li className="users-online" onClick={() => {
        setShowMenu(showMenu === false ? obj.value : false);
        setClicked(obj);
        setShow(true); // 클릭 뒤 사라지게
        // console.log(obj)
      }}>
        {<Avatar url={obj.avatar} alt="avatar" />}
        <p>{obj.value}</p>
      </li>
      { showMenu === obj.value ?<Menu close={closeMenu} obj={obj} /> : null }
    </div>
    );


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
