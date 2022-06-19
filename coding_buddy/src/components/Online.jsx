import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import { UserListContext } from '../App.js'
import FriendList from "./FriendsList.jsx";
import Avatar from "./Avatar.jsx"
export default function Online() {
  const { online, friendList, socket } = useContext(SocketContext);
  const { setClicked, setShow } = useContext(UserListContext);
  // const [playToggleClassName, setPlayToggleClassName] = useState("friendsListToggle");
  // console.log("online_in_Online.jsx", online);
  const usersOnline = online.map((obj, i) => <li key={i} onClick={() => {
    setClicked(obj)
  }}> {obj.value} </li>);

  useEffect(() => {
    socket.emit("friendsList", { socketID: socket.id });
  }, [online]);
  return (
    <>
      <div className="onlinelist">
        <FriendList />
        <span>Online</span>
        <div>{usersOnline}</div>
        {/* </div> */}
      </div>
    </>
  );
}
