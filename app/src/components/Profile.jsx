import { useEffect, useCallback, useContext, useState } from "react";
import { SocketContext, UserListContext } from "../App.js";

export default function Profiles(props) {
  const { profiles, nickname, setProfiles, profileShow } = useContext(UserListContext);
  const {socket} = useContext(SocketContext)
  useEffect(() => {
    socket.on("update login users information", ({disconnectedUser}) => {
        const newProfiles = profiles
        if (newProfiles[disconnectedUser]) {
          delete newProfiles[disconnectedUser]
          setProfiles(newProfiles)
        }
        console.log("THIS second", profiles)
    })
  }, [profiles])
  // const { nickname } = useCallback(SocketContext)
  // console.log("ONLINE USERS PROFILES", profiles);
  // console.log("ONLINE USERS PROFILES", nickname);
  /**
   * provile = {
   *  name: {
   *     name: 'mike',
   *     email: 'email',
   *     languages: [html, css....],
   *     avatar_id: 'avatar_id',
   *   }
   * }
   */
  const profileNames = Object.keys(profiles);
  const profileArticles = profileNames.map((username, ind) => {
    if (username !== nickname) {
      // console.log(username)
      const title = profiles[username].name;
      const email = profiles[username].email;
      console.log("TITLE", title, "EMAIL", email)
      const languageLists = profiles[username].languages.map((lang, index) => (
        <li key={index} className="list-languages">{lang}</li>
      ));
      return (
        <div className={`profile ${username}`} key={ind} style={{display: profileShow}}>
          {/* <title> */}
            {title} <br />
            {email}
          {/* </title> */}
          <div key={ind}>
            {languageLists}
          </div>
        </div>
      );
    }
  });

  return <div className="div_profile">{profileArticles}</div>;
}
