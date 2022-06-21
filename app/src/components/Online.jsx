import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import { UserListContext } from '../App.js'
// import FriendList from "./FriendsList.jsx";
import Avatar from "./Avatar.jsx"
import Menu from "./Menu.jsx";

export default function Online(props) {
  const { online, socket, nickname } = useContext(SocketContext);
  const { setShow } = useContext(UserListContext);
  const [showMenu, setShowMenu] = useState(false);
  // const [playToggleClassName, setPlayToggleClassName] = useState("friendsListToggle");
  // console.log("online_in_Online.jsx", online);
  const removeSelfAndAll = online.filter(obj =>
    obj.value !== "all" && obj.value !== nickname
  )
  console.log('removeSelfAndAll',removeSelfAndAll)
//  [{
//     "value": "heesoo",
//     "label": "heesoo",
//     "avatar": "/images/girl1-face.png"
// }]

  const closeMenu = () => {
    setShowMenu(false)
  }

  const usersOnline = removeSelfAndAll.map((obj, i) =>
    <li className="users-online" key={i} onClick={() => {
      setShowMenu(true);
      setShow(true); // 클릭 뒤 사라지게
    }}>
      {<Avatar url={obj.avatar} alt="avatar" />}
      {obj.value}
    </li>);
  // const friendsNames = Object.keys(friendList); // [이름, 이름]
  // console.log(removeSelfAndAll)
  // console.log('clicked', clicked)
  console.log(showMenu)

  useEffect(() => {
    socket.emit("friendsList", { socketID: socket.id });
  }, [online]);


  return (
    <div className="online-list">
      {/* <FriendList /> */}
      <p>Online</p>
      { showMenu === true ? <Menu close={closeMenu}/> : null}
      <div>{usersOnline}</div>
    </div>
  );
}
