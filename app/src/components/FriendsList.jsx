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
  const location = useLocation()
  const userID = location.state?.[3]
  console.log('FRIENDLIST', friendList)
  const friendsListing = friendList.map((friend, i) => {
    const lists = () => {
      // console.log("LIST", friendList);
      if (friend.languages.length > 0) {
        const languages = friend.languages;
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
          <div>{friend.friend_name}</div>
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
  }, [socket, user, userID]);

  return (
    <div className="friendsList">
      <div className="friendsListLabel">My Friends</div>
      {friendsListing}
    </div>
  );
}
