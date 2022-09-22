// import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { SocketContext, UserListContext } from "../App.js";
import "./FriendsList.scss";
import Cookies from "universal-cookie";
import Avatar from "./Avatar.jsx";

export default function FriendList({ changeRecipient }) {
  const { socket, axios } = useContext(SocketContext);
  const { userCookie, updateFriendList } = useContext(UserListContext);
  const [toggle, setToggle] = useState(false);
  const [friends, setFriens] = useState({});
  const [showFriends, setShowFriends] = useState("hide");
  const [friendsInfo, setFriendsInfo] = useState({});
  const toggleFriends = (showFriends) => {
    showFriends === "show" ? setShowFriends("hide") : setShowFriends("show");
  };
  const handleToggle = (value) => {
    if (!friendsInfo[value]) {
      axios
        .post("/user", { username: value })
        .then((res) => {
          const userInfo = res.data;
          setFriendsInfo((prev) => ({
            ...prev,
            ...userInfo,
          }));
        })
        .then(() => {
          setToggle(value);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setToggle(value);
    }
  };

  const removeFriend = (removeUserName) => {
    const cookies = new Cookies().getAll();
    const userData = cookies.userdata;
    const userID = userData.userID;
    axios
      .post("/user/remove", { userID, remove: removeUserName })
      .then((res) => {
        const updateOnline = res.data.updateOnline;
        updateFriendList(updateOnline);
        setToggle(false);
      })
      .catch((err) => {
        alert("Failed. Please contact us");
        console.log(err);
      });
  };

  useEffect(() => {
    socket && socket.emit("friendsList", { socketID: socket.id });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    const cookies = new Cookies();
    const currentCookies = cookies.getAll();
    setFriens({ ...currentCookies.userdata.userFriendsList });
  }, [userCookie]);

  const friendNames = Object.keys(friends);
  const friendsList = friendNames.map((friend, i) => {
    return (
      <div
        key={i}
        className="friend"
        onClick={() => {
          handleToggle(friend);
        }}
      >
        <Avatar url={friends[friend].avatar} />
        <div className="name">{friend}</div>
      </div>
    );
  });

  const friendInfoBox = (friendName) => {
    const languageList = friendsInfo[friendName]?.languages?.map((lang) => {
      return (
        <div className="language" key={lang}>
          {lang}
        </div>
      );
    });

    return (
      <div className="friend_info_box">
        <span
          className="material-icons close"
          onClick={() => {
            setToggle(false);
          }}
        >
          close
        </span>
        <div className="friend_info_container">
          <div className="friend_title">{friendName}</div>
          <div className="friend_email">{friendsInfo[friendName]?.email}</div>
          <div className="friend_info">
            <div className="languages">
              <ul>{friendName}'s languages</ul>
              {languageList}
            </div>
          </div>
          <div className="controller">
            <div
              className="send_message"
              onClick={() => {
                setToggle(false);
                changeRecipient(friendName);
              }}
            >
              SEND MESSAGE
            </div>
            <div
              className="delete_friend"
              onClick={() => {
                removeFriend(friendName);
              }}
            >
              DELETE
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`friendsList ${showFriends}`}>
      <div
        className="side-bar-label"
        onClick={() => {
          toggleFriends(showFriends);
        }}
      >
        Friends
      </div>
      {friendsList}
      {toggle && friendInfoBox(toggle)}
    </div>
  );
}
