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
    []
  );
  // const [onlineList, setOnlineList] = useState([room])
  useEffect(() => {
    setOnlineUserNames([]);
  }, [room]);

  useEffect(() => {
    setOnlineUserNames(Object.keys(onlineList));
  }, [onlineList]);

  const addFriend = (userName, avatar) => {
    // console.log(userCookie)
    const cookie = new Cookies().getAll().userdata;
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
        <span
          className="material-icons close"
          onClick={() => {
            setToggle(false);
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

  const onlineUserList = onlineUserNames.length > 0 && onlineUserNames.map((user) => {
    if (user !== userCookie.userName && onlineList[user])
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
      <div
        className="side-bar-label"
        onClick={() => {
          toggleOnline(showOnline);
        }}
      >
        Online
      </div>
      {onlineUserList}
    </div>
  );
}
