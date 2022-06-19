import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import Select from "react-select";
import FriendList from "./FriendsList.jsx";

export default function Online() {
  const { online, friendList, socket } = useContext(SocketContext);
  const usersOnline = online.map((obj, i) => <li key={i}>{obj.value}</li>);
  // const friendsNames = Object.keys(friendList); // [이름, 이름]

  // // window.addEventListener("click", () => {
  // const listing = (friendName) => {
  //   for (let obj in friendList) {
  //     // console.log("OBJECT",obj, friendName)
  //     const languages = friendList[obj].languages
  //     if (obj === friendName) {
  //       languages.map(lang => {
  //         {console.log(lang)}
  //         // <li key={lang}>
  //           return {lang}
  //         {/* </li> */}
  //       })
  //     }
  //   }
  // }

  // const friendsListing = friendsNames.map((friendName) => (
  //   <>
  //     <ol key={friendName}>{friendName} </ol>
  //     {/* <div> */}
  //     <li>
  //       {listing(friendName)}
  //     </li>
  //     {/* </div> */}
  //   </>
  // ));


  // useEffect(() => {
  //   socket.emit("friendsList", { socketID: socket.id });
  //   // console.log("ONLINE USEEFFECT");

  //   // return () => {
  //   //   socket.disconnect();
  //   // };
  // }, [online]);
  return (
    <>
      <div className="onlinelist">
        {/* <div className="friendsListToggle">Friends</div> */}
        {/* {friendsListing} */}
        {/* {friendLanguages} */}
        <FriendList />
        <span>Online</span>
        <div>{usersOnline}</div>
        {/* </div> */}
      </div>
    </>
  );
}
