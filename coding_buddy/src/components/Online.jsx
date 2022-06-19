import { useEffect, useContext, useState } from "react";
import { SocketContext } from "../App.js";
import Select from "react-select";

export default function Online() {
  const { online, friendList, socket } = useContext(SocketContext);
  // const [playToggleClassName, setPlayToggleClassName] = useState("friendsListToggle");
  // console.log("online_in_Online.jsx", online);
  const usersOnline = online.map((obj) => <li key={obj.value}>{obj.value}</li>);
  const friendsNames = Object.keys(friendList); // [이름, 이름]

  window.addEventListener("click", () => {
    for (let obj in friendList) {
      // console.log(obj)
      const languages = friendList[obj].languages
      if (obj === 'mike') {
        console.log(languages)
        languages.map(lang => {
          <li>{lang}</li>
        })
      }
    }
  })
  // const languagesArr = Object.values(friendList)

  const listing = (arr) => {
    arr.map((element) => {
      <li>{element}</li>;
    });
  };

  const createLists = (friendName) => {
    friendList.map((obj) => {
      <li>{listing(obj[friendName].languages)}</li>;
    });
  };
  const friendsListing = friendsNames.map((friendName) => (
    <>
      <li key={friendName}>{friendName}</li>
      <div>
        {/* <li>{createLists(friendName)}</li> */}
      </div>
    </>
  ));

  const makeLanguageList = (friendName) => {
    // <li>{friendList}</li>
  };

  console.log("this is friends lists", friendList);
  // friendList = {object}
  // const makeList = (friendname) => {
  //   if (friendList[friendname].languages)
  //     console.log(friendList[friendname].languages);
  //   return friendList[friendname].languages;
  // };
  // window.addEventListener("click", (e) => {
  //   makeList("heesoo");
  // });
  // console.log(makeList("moon"))
  // let languageLists = []
  //   friendsNames.map(friendName => {
  //     languageLists.push(friendList[friendName].languages)
  //   })

  // console.log("LISTS",languageLists)

  useEffect(() => {
    socket.emit("friendsList", { socketID: socket.id });
    // console.log("ONLINE USEEFFECT");

    // return () => {
    //   socket.disconnect();
    // };
  }, [online]);
  return (
    <>
      <div className="onlinelist">
        <div className="friendsListToggle">Friends</div>
        {friendsListing}
        {/* {friendLanguages} */}
        <span>Online</span>
        <div>{usersOnline}</div>
        {/* </div> */}
      </div>
    </>
  );
}
