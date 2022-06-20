import { useEffect, useCallback, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import { PanelGroup } from "bootstrap";
export default function FriendList() {
  const { online, friendList, socket } = useContext(SocketContext);
  const friendsNames = Object.keys(friendList); // [이름, 이름]
  const [toggle, setToggle] = useState(false);
  const toggleButton = useCallback(() => setToggle(!toggle))

  const friendsListing = friendsNames.map((friendName, i) => {
    const lists = () => {
      if (friendsNames.length > 0) {
        if (friendList[friendName].languages) {
          // console.log(friendList[friendName].languages);
          const languages = friendList[friendName].languages;
          return languages.map((lang, index) => (
            // <div key={index} className="language collapse" id="collapseExample">
            // <div key={index} className="card card-body">
            <div key={index} className="languageDiv">
              {lang}
            </div>
            // </div>
            // </div>
          ));
        }
      }
    };
    return (
      <div key={i}>
        <div
          // btn-primary 
          className="btn btn-primary collaps"
        // onClick={toggleButton}
        >
          <div>{friendName}</div>
        </div>
        <div className="languageLists">
          {lists()}
        </div>
      </div>
    );
  });

  useEffect(() => {
    socket.emit("friendsList", { socketID: socket.id });
  }, [online]);
  return (
    <div className="friendsList">
      <div className="friendsListLabel">Friends</div>
      {friendsListing}
    </div>
  );
}
