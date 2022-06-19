import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import { ClickContext } from '../App.js'
import FriendList from "./FriendsList.jsx";
export default function Online() {
  const { online, friendList, socket } = useContext(SocketContext);
  const { setClicked } = useContext(ClickContext);
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
