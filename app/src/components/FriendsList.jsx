import { useEffect, useContext, useState, useMemo } from "react";
import { SocketContext, UserListContext } from "../App.js";
import "./FriendsList.scss";
import Cookies from "universal-cookie";
import Avatar from "./Avatar.jsx";

export default function FriendList() {
  const { socket } = useContext(SocketContext);
  const { friendList } = useContext(UserListContext);
  // const friendsNames = Object.keys(friendList); // [이름, 이름]
  const [toggle, setToggle] = useState(false);
  const cookies = new Cookies();
  const [friends, setFriens] = useState({});
  const [showFriends, setShowFriends] = useState("hide");
  const toggleFriends = (showFriends) => {
    showFriends === "show" ? setShowFriends("hide") : setShowFriends("show");
  };
  const handleToggle = (value) => {
    if (toggle) {
      setToggle(false);
    } else {
      setToggle(value);
    }
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
    setFriens({...currentCookies.userdata.userFriendsList});
  }, []);

  const friendNames = Object.keys(friends)
  const friendsList = friendNames.map((friend, i) => {
    // const lists = () => {
    //   if (friends.length > 0) {
    //     const languages = friendList[friend].languages;
    //     return languages.map((lang, index) => (
    //       <div key={index} className="languageDiv">
    //         {lang}
    //       </div>
    //     ));
    //   }
    // };

    return (
      <div
        key={i}
        className="friend"
        onClick={() => {
          handleToggle(friend);
        }}
      >
          <Avatar url={friends[friend].avatar} />
        <div className="name">
          {friend}
        </div>
        {/* {toggle === friend ? (
          <div className="languageLists">{lists()}</div>
        ) : null} */}
      </div>
    );
  });

  return (
    <div className={`friendsList ${showFriends}`}>
      <div
        className="side-bar-label"
        onClick={() => {
          toggleFriends(showFriends);
        }}
      >
        My Friends
      </div>
      {friendsList}
    </div>
  );
}
