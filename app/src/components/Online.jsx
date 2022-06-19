import { useEffect, useContext } from "react";
import { SocketContext } from "../App.js";
import { UserListContext } from '../App.js'
import FriendList from "./FriendsList.jsx";
import Avatar from "./Avatar.jsx"
export default function Online() {
  const { online, friendList, socket } = useContext(SocketContext);
  const { clicked, setClicked, setShow } = useContext(UserListContext);
  // const [playToggleClassName, setPlayToggleClassName] = useState("friendsListToggle");
  // console.log("online_in_Online.jsx", online);
  const usersOnline = online.map((obj, i) => <li className="users-online" key={i} onClick={() => {
    setClicked(obj)
    setShow(true) // 클릭 뒤 사라지게
  }}> {<Avatar url={obj.avatar} alt="avatar" />} {obj.value} </li>);
  // const friendsNames = Object.keys(friendList); // [이름, 이름]

  console.log('clicked', clicked)

  useEffect(() => {
    socket.emit("friendsList", { socketID: socket.id });
  }, [online]);
  return (
    <div className="online-list">
      <FriendList />
      <span>Online</span>
      <div>{usersOnline}</div>
    </div>
  );
}
