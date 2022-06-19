import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";

export default function FriendList() {
  const { online, friendList, socket } = useContext(SocketContext);
  const friendsNames = Object.keys(friendList); // [이름, 이름]

  console.log("dfddddddddddddddddd", friendList);
  const friendsListing = friendsNames.map((friendName) => {
    const lists = () => {
      if (friendsNames.length > 0) {
        if (friendList[friendName].languages) {
          console.log(friendList[friendName].languages);
          const languages = friendList[friendName].languages;
          return languages.map((lang, index) => (
              <div key={index} className>
                {lang}
              </div>
            // );
          ));
        }
      }
    };
    return (
      <>
        <div>
          {friendName}
        </div>
          {lists()}
      </>
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
