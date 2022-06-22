import { useEffect, useCallback, useContext, useState } from "react";
import { SocketContext, UserListContext } from "../App.js";
import { PanelGroup } from "bootstrap";
import './FriendsList.scss'

export default function FriendList() {
  // const { online,  socket } = useContext(SocketContext);
  const { online, friendList, socket } = useContext(SocketContext);
  const { setFriendList } = useContext(UserListContext);
  // const [toggle, setToggle] = useState(false);
  // const toggleButton = useCallback(() => setToggle(!toggle));
  const [updateFriend, setUpdateFriend] = useState();
  const friendsNames = Object.keys(friendList); // [이름, 이름]
  const [toggle, setToggle] = useState(false);

  const handleToggle = (value) => {
  //  setToggle(prev => ({...prev, value: !toggle[value]}))
    if(toggle) {
      setToggle(false);
    } else {
      setToggle(value);
    }
    console.log(toggle);
  }

  useEffect(() => {
    socket.emit("friendsList", { socketID: socket.id });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // console.log("GETNAME", document.getElementsByClassName("name"));


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
      <div key={i} className="friend " onClick={() => {
        handleToggle(friendName)}}>
          <div className="name">{friendName}</div>
          { toggle === friendName ? <div className="languageLists">{lists()}</div> : null }
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
