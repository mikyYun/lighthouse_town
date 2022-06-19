import { useContext } from "react";
import { UserListContext } from '../App.js'

const Menu = () => {
  const { clicked, setRecipient, setShow } = useContext(UserListContext);
  console.log('clicked', clicked)
  return (
    <ul className="menu">
      <li className="add-friend" onClick={''}>Add Friend</li>
      <li className="send-message" onClick={() => {
        setRecipient(clicked);
        console.log('clicked in Menu', clicked)
        setShow(false); // 클릭 뒤 사라지게
      }}>Send Message</li>
      <li className="view-profile" onClick={''}>View Profile</li>
    </ul>
  );
};

export default Menu;