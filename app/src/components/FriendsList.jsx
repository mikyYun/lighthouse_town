import { useEffect, useContext, useState } from "react";
import { SocketContext, UserListContext } from "../App.js";
import "./FriendsList.scss";

export default function FriendList() {
  const { friendList, socket } = useContext(SocketContext);
  const friendsNames = Object.keys(friendList); // [이름, 이름]
  const [toggle, setToggle] = useState(false);

  const handleToggle = (value) => {
    if (toggle) {
      setToggle(false);
    } else {
      setToggle(value);
    }
    // console.log(toggle);
  };

  useEffect(() => {
    socket.emit("friendsList", { socketID: socket.id });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const friendsListing = friendsNames.map((friendName, i) => {
    const lists = () => {
      if (friendsNames.length > 0 && friendList[friendName].languages) {
        const languages = friendList[friendName].languages;
        return languages.map((lang, index) => (
          <div key={index} className="languageDiv">
            {lang}
          </div>
        ));
      }
    };

    return (
      <div
        key={i}
        className="friend "
        onClick={() => {
          handleToggle(friendName);
        }}
      >
        <div className="name">
          <p>{friendName}</p>
        </div>
        {toggle === friendName ? (
          <div className="languageLists">{lists()}</div>
        ) : null}
      </div>
    );
  });

  return (
    <div className="friendsList">
      <div className="side-bar-label">My Friends</div>
      {friendsListing}
    </div>
  );
}
