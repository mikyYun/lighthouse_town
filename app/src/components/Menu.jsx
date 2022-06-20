import { useContext } from "react";
import { UserListContext, SocketContext } from '../App.js'
import { useLocation } from "react-router-dom";

const Menu = (props) => {
  const {socket} = useContext(SocketContext)
  const location = useLocation()
  const { clicked, setRecipient, setShow, nickname, recipient } = useContext(UserListContext);
  // console.log('clicked', clicked)
  const username = props.username
  const userID = location.state?.[3]
  return (
    <ul className="menu">
      <li className="add friend" onClick={(e) => {
        // console.log(clicked.value) // clicked name
        const addFriendName = clicked.value
        console.log("add-friend clicked", username, addFriendName, userID)
        
        socket.emit("add friend", {username, addFriendName, userID})
      }}>Add Friend</li>
      <li className="send-message" onClick={() => {
        setRecipient(clicked);
        console.log('clicked in Menu', clicked)
        setShow(false); // 클릭 뒤 사라지게
      }}>Send Message</li>
      <li className="view-profile" onClick={() => {
        console.log("clicked vie-porifle")
      }}>View Profile</li>
    </ul>
  );
};

export default Menu;
// add friend => get obj => send obj to server => server////
// user_name, target_name // select id FROM users // res.rows[{id: 1, username: name}, {id: 2, username: name2}]
// let added_by, added
// res.rows => map / loop -> eachObj.username = user_name => added_by = eachObj.id, added = eachObj.id
// name = user_name || target_name //