import { useEffect, useContext, useState, useMemo } from "react";
import { SocketContext, UserListContext } from "../App.js";
import Avatar from "./Avatar.jsx";
import Menu from "./Menu.jsx";
import Profile from "./Profile.jsx";
import "./Online.scss";
import selectAvatar from "./helper/selectAvatar.js";
import Cookies from "universal-cookie";

export default function Online(props) {
  const { socket } = useContext(SocketContext);
  const { room, userCookie, onlineList } = useContext(UserListContext);
  const [showOnline, setShowOnline] = useState("show");
  const toggleOnline = (showOnline) => {
    showOnline === "show" ? setShowOnline("hide") : setShowOnline("show");
  };
  // const [onlineList, setOnlineList] = useState([room])
  useEffect(() => {
    // socket.on("REMOVE LOGOUT USER", (updatedUserNames) => {
    //   console.log(onlineList[updatedUserNames]);
    // });
    // return () => {
    //   socket.disconnect();
    // }
    // const cookies = new Cookies();
    // const allCookies = cookies.getAll();
    // const username = allCookies.userdata.userName;
    // onlineList[username]
  }, []);

  // useEffect(() => {
  //   console.log("TEST")
  //   // socket && socket.emit("SET USERNAME", {
  //   //   socketID: socket.id,
  //   //   username: "moon",
  //   //   currentRoom: room
  //   // })
  //   socket.on("PLAZA", (userNames) => {
  //     console.log("datat",userNames)
  //   })
  //   return () => {
  //     socket.disconnect();
  //   }
  // }, [socket])
  // const { setClicked, setShow, nickname, online } = useContext(UserListContext);
  // const [showMenu, setShowMenu] = useState(false);
  // const removeSelfAndAll = online.filter(obj =>
  //   obj.value !== "all" && obj.value !== nickname
  // )

  // const closeMenu = () => {
  //   setShowMenu(false)
  // }

  // const usersOnline = removeSelfAndAll.map((obj, i) =>
  //   <div className="online-user" key={i}>
  //     <li className="users-online" onClick={() => {
  //       setShowMenu(showMenu === false ? obj.value : false);
  //       setClicked(obj);
  //       setShow(true); // 클릭 뒤 사라지게
  //       // console.log(obj)
  //     }}>
  //       {<Avatar url={obj.avatar} alt="avatar" />}
  //       <p>{obj.value}</p>
  //     </li>
  //     { showMenu === obj.value ?<Menu close={closeMenu} obj={obj} /> : null }
  //   </div>
  //   );

  // useEffect(() => {
  //   socket.emit("friendsList", { socketID: socket.id });
  // }, [online]);
  

  const onlineUserList = onlineList.map((user) => {
    if (user !== userCookie.userName)
    return (
      <div className="user" key={user}>
        <li className="users-online">{user}</li>
      </div>
    );
  });

  const usersOnline = (
    <div className={`online-users ${showOnline}`}>
      {/* {onlineList.map} */}
      {onlineUserList}
      {/* <div className="user">
        <img src="../images/boy1-face.png" alt="" />
        <li className="users-online">list</li>
      </div>
      <div className="user">
        <img src="" alt="" />
        <li className="users-online">list</li>
      </div>
      <div className="user">
        <img src="" alt="" />
        <li className="users-online">list</li>
      </div>
      <div className="user">
        <img src="" alt="" />
        <li className="users-online">list</li>
      </div>
      <div className="user">
        <img src="" alt="" />
        <li className="users-online">list</li>
      </div>
      <div className="user">
        <img src="" alt="" />
        <li className="users-online">list</li>
      </div> */}
    </div>
  );

  return (
    <div className="online-list">
      {/* <FriendList /> */}
      <div
        className="side-bar-label"
        onClick={() => {
          toggleOnline(showOnline);
        }}
      >
        Online
      </div>
      {usersOnline}
    </div>
  );
}
