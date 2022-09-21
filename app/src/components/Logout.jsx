import { useContext } from "react";
import { UserListContext } from "../App";
const Logout = () => {
  const { room, logout } = useContext(UserListContext);

  return (
    <div className="logout-box">
      <button className="logout-button" onClick={() => logout(room)}>Logout</button>
    </div>
  );
};
export default Logout;
