import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import { UserListContext } from '../App.js'
import FriendList from "./FriendsList.jsx";
import Avatar from "./Avatar.jsx"

export default function Online(props) {
  const { online, socket, nickname } = useContext(SocketContext);
  const { clicked, setClicked, setShow } = useContext(UserListContext);
  // const [playToggleClassName, setPlayToggleClassName] = useState("friendsListToggle");
  // console.log("online_in_Online.jsx", online);
  const removeSelfAndAll = online.filter(obj =>
    obj.value !== "all" && obj.value !== nickname
  )
  const usersOnline = removeSelfAndAll.map((obj, i) => <li className="users-online" key={i} onClick={() => {
    setClicked(obj)
    setShow(true) // 클릭 뒤 사라지게
  }}> {<Avatar url={obj.avatar} alt="avatar" />} {obj.value} </li>);

  return (
    <div className="online-list">
      {/* <FriendList /> */}
      {/* this is doing the emit */}
      <span>Online</span>
      <div>{usersOnline}</div>
    </div>
  );
}
