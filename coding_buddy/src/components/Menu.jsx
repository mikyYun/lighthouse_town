import { useContext } from "react";
import { SocketContext } from '../App.js'

const Menu = () => {

  const { anchorPoint } = useContext(SocketContext);

  return (
    <ul className="menu" style={{ top: anchorPoint.y, left: anchorPoint.x }}>
      <li onClick={''}>Add Friend</li>
      <li onClick={() => { alert('hi') }}>Send Message</li>
      <li onClick={''}>View Profile</li>
    </ul>
  );
};

export default Menu;