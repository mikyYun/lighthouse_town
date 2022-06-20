import { useEffect, useCallback, useContext, useState } from "react";
import { SocketContext, UserListContext } from "../App.js";
import { PanelGroup } from "bootstrap";
import { useLocation } from "react-router-dom";

export default function FriendList() {
  // const { online,  socket } = useContext(SocketContext);
  const { online, friendList, socket } = useContext(SocketContext);
  const { user } = useContext(UserListContext);
  const [toggle, setToggle] = useState(false);
  const toggleButton = useCallback(() => setToggle(!toggle));
  const [updateFriend, setUpdateFriend] = useState();
  const friendsNames = Object.keys(friendList); // [이름, 이름]
  const location = useLocation()
  const userID = location.state?.[3]
  const friendsListing = friendsNames.map((friendName, i) => {
    const lists = () => {
      // console.log("LIST", friendList);
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
      <div key={i}>
        <div className="btn btn-primary collaps">
          <div>{friendName}</div>
        </div>
        <div className="languageLists">{lists()}</div>
      </div>
    );
  });

  useEffect(() => {
    socket.emit("friendsList", { newSocketID: socket.id, user, userID });
    // console.log("USER", userID)
    // user is an object
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="friendsList">
      <div className="friendsListLabel">Friends</div>
      {friendsListing}
    </div>
  );
}
