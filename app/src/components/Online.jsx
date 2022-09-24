// import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { UserListContext, SocketContext } from "../App.js";
import Avatar from "./Avatar.jsx";
import "./Online.scss";
import Cookies from "universal-cookie";

export default function Online({ changeRecipient }) {
  const { room, onlineList, updateFriendList } = useContext(UserListContext);
  const { axios } = useContext(SocketContext);
  const [toggle, setToggle] = useState(false);
  const [showOnline, setShowOnline] = useState("show");
  const toggleOnline = (showOnline) => {
    showOnline === "show" ? setShowOnline("hide") : setShowOnline("show");
  };
  const [onlineUserNames, setOnlineUserNames] = useState([]);

  useEffect(() => {
    setOnlineUserNames([]);
  }, [room]);

  useEffect(() => {
    const cookie = new Cookies().getAll().userdata;
    const userName = cookie?.userName;
    const filterOnlineList = Object.keys(onlineList).filter(
      (online) =>
        online !== undefined &&
        onlineList[online]?.username &&
        online !== userName
    );
    setOnlineUserNames(filterOnlineList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineList]);


  const addFriend = (userName, avatar) => {
    const cookie = new Cookies().getAll().userdata;
    const userID = cookie.userID;
    axios
      .post("/user/add", { userID, add: userName, avatar })
      .then((res) => {
        const updateOnline = res.data.updateOnline;
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

  const onlineUserList = onlineUserNames.map((user) => {
      if (onlineList[user] && onlineList[user].avatar) {
        return (
          <div className="user-container" key={user}>
            <div
              className="user"
              onClick={() => {
                setToggle(user);
              }}
            >
              <Avatar url={onlineList[user].avatar} />
              <div className="name">{user}</div>
            </div>
            {toggle === user && userInfoBox(user, onlineList[user].avatar)}
          </div>
        );
      }
    });
  // };

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
      {showOnline === "show" && onlineUserList}
    </div>
  );
}
