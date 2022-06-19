import { useContext } from "react";
import { UserListContext } from '../App.js'

const Menu = () => {
  const { clicked, setRecipient, setShow } = useContext(UserListContext);

  return (
    <ul className="menu">
      <li onClick={''}>Add Friend</li>
      <li onClick={() => {
        setRecipient(clicked);
        setShow(false)
      }}>Send Message</li>
      <li onClick={''}>View Profile</li>
    </ul>
  );
};

export default Menu;