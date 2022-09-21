import { useEffect, useContext } from "react";
import { SocketContext, UserListContext } from "../App_backup.js";

export default function Profile(props) {
  const { clicked, profiles, nickname, setProfiles } = useContext(UserListContext);
  const {socket} = useContext(SocketContext)

  useEffect(() => {
    socket.on("update login users information", ({disconnectedUser}) => {
      // console.log("THIS second", disconnectedUser)
      const newProfiles = profiles
        if (newProfiles[disconnectedUser]) {
          delete newProfiles[disconnectedUser]
          setProfiles(newProfiles)
        }
    })
    return () => {
      socket.off();
    }
  }, [profiles])


  const profileNames = Object.keys(profiles);
  const profileArticles = profileNames.map((username, ind) => {

    if (username !== nickname) {
      const email = profiles[username].email;
      const languageLists = profiles[username].languages.map((lang, index) => (
        <li key={index} className="list-languages">{lang}</li>
      ));

      if (clicked.value === username) {
        return (
            <div className='profile' key={ind} onClick={props.closeProfile}>
            <div className="profile-email"><p>Email</p>{email}</div>
            <div>
            <p>Languages</p>
              <div className="profile-language">{languageLists}</div>
            </div>
          </div>
          );
        }
      }
    });

  return <div className="div_profile" onClick={props.close}>{profileArticles}</div>

}
