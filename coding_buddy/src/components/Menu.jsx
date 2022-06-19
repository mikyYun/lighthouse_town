import { useContext } from "react";
import { SocketContext } from '../App.js'

const Menu = () => {

  const { anchorPoint, clicked, setRecipient } = useContext(SocketContext);

  return (
    <ul className="menu" style={{ top: anchorPoint.y, left: anchorPoint.x }}>
      <li onClick={''}>Add Friend</li>
      <li onClick={() => { setRecipient(clicked) }}>Send Message</li>
      <li onClick={''}>View Profile</li>
    </ul>
  );
};

export default Menu;