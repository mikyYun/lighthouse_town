import axios from "axios";
import { useEffect, useContext, useState, useMemo } from "react";
import { SocketContext, UserListContext } from "../App.js";
import "./FriendsList.scss";
import Cookies from "universal-cookie";
import Avatar from "./Avatar.jsx";

export default function FriendList({changeRecipient}) {
  const { socket } = useContext(SocketContext);
  const { friendList } = useContext(UserListContext);
  // const friendsNames = Object.keys(friendList); // [이름, 이름]
  const [toggle, setToggle] = useState(false);
  const cookies = new Cookies();
  const [friends, setFriens] = useState({});
  const [showFriends, setShowFriends] = useState("hide");
  const [friendsInfo, setFriendsInfo] = useState({});
  const toggleFriends = (showFriends) => {
    showFriends === "show" ? setShowFriends("hide") : setShowFriends("show");
  };
  const handleToggle = (value) => {
    // console.log(value); // friend name
    if (!friendsInfo[value]) {
      axios
        .post("/user", { username: value })
        .then((res) => {
          // console.log("RES", res.data)
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
          console.log("ERROR", err);
        });
    } else {
      setToggle(value);
      // setToggle(undefined)
    }
    // if (toggle) {
    // setToggle(false);
    // } else {
    // setToggle(value);
    // }
    // console.log(toggle);
  };

  // useMemo(() => {
  //   socket.emit("")
  // }, [toggle])

  useEffect(() => {
    socket && socket.emit("friendsList", { socketID: socket.id });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    const currentCookies = cookies.getAll();
    // console.log(currentCookies.userdata)
    // console.log(currentCookies.userdata.userFriendsList);
    setFriens({ ...currentCookies.userdata.userFriendsList });
  }, []);

  const friendNames = Object.keys(friends);
  const friendsList = friendNames.map((friend, i) => {
    const lists = () => {
      // if (friends.length > 0) {
      const languages = friendsInfo[friend].languages;
      return languages.map((lang, index) => (
        <div key={index} className="languageDiv">
          {lang}
        </div>
      ));
      // }
    };

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
        {/* {toggle === friend ? (
          <div className="languageLists">{lists()}</div>
        ) : null} */}
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
          onClick={() => {setToggle(false);}}
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
            <div className="send_message" onClick={() => {
              console.log("CLICKED", friendName)
              changeRecipient(friendName);
            }}>
              SEND MESSAGE
            </div>
            <div className="delete_friend" onClick={() => {}}>
              DELETE
            </div>
          </div>
        </div>
        {/* {languageList} */}
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
