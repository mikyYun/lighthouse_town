import axios from "axios";
import { useEffect, useContext, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { SocketContext, UserListContext } from "../App.js";
import Avatar from "./Avatar.jsx";
import Menu from "./Menu.jsx";
import Profile from "./Profile.jsx";
import "./Online.scss";
import selectAvatar from "./helper/selectAvatar.js";
import Cookies from "universal-cookie";

export default function Online({ changeRecipient }) {
  const { socket } = useContext(SocketContext);
  const { room, userCookie, onlineList, updateFriendList } =
    useContext(UserListContext);
  const [toggle, setToggle] = useState(false);
  const [showOnline, setShowOnline] = useState("show");
  const toggleOnline = (showOnline) => {
    showOnline === "show" ? setShowOnline("hide") : setShowOnline("show");
  };
  const [onlineUserNames, setOnlineUserNames] = useState(
    Object.keys(onlineList)
  );
  // const [onlineList, setOnlineList] = useState([room])
  useEffect(() => {
    // console.log("ONLINECHECK");
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
  }, [room]);

  useEffect(() => {
    setOnlineUserNames(Object.keys(onlineList));
  }, [onlineList]);

  const addFriend = (userName, avatar) => {
    // console.log(userCookie)
    const cookie = new Cookies().getAll().userdata;
    console.log(cookie);
    const userID = cookie.userID;
    axios
      .post("/user/add", { userID, add: userName, avatar })
      .then((res) => {
        const updateOnline = res.data.updateOnline
        updateFriendList(updateOnline);
      })
      .catch((err) => {
        alert("USER_" + userName + " already in your list");
      });
  };

  const userInfoBox = (userName) => {
    return (
      <div className="box">
        {/* <div className="box-close"> */}
        <span
          className="material-icons close"
          onClick={() => {
            setToggle(false);
            console.log("CLOSE");
          }}
        >
          close
        </span>
        {/* </div> */}
        <div className="option">
          <div
            className="add"
            onClick={() => {
              setToggle(false);
              addFriend(userName, onlineList[userName].avatar);
            }}
          >
            ADD
          </div>
          <div
            className="send_message"
            onClick={() => {
              setToggle(false);
              changeRecipient(userName);
            }}
          >
            SEND MESSAGE
          </div>
        </div>
      </div>
    );
  };
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

  // const onlineUserNames = Object.keys(onlineList);
  const onlineUserList = onlineUserNames.map((user) => {
    if (user !== userCookie.userName)
      return (
        <div className="user-container" key={user}>
          <div
            className="user"
            // key={user}
            onClick={() => {
              setToggle(user);
              console.log("USER");
            }}
          >
            <Avatar url={onlineList[user].avatar} />
            <div className="name">{user}</div>
          </div>
          {toggle === user && userInfoBox(user, onlineList[user].avatar)}
        </div>
      );
  });

  return (
    <div className={`online-list ${showOnline}`}>
      {/* <FriendList /> */}
      <div
        className="side-bar-label"
        onClick={() => {
          toggleOnline(showOnline);
        }}
      >
        Online
      </div>
      {onlineUserList}
      {/* {toggle && userInfoBox(toggle)} */}
    </div>
  );
}
