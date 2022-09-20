import { SocketContext, UserListContext } from "../App";
import { useEffect, useNavigate, useContext, useState } from "react";
import "./NotReady.scss";
const NotReady = () => {
  const { socket } = useContext(SocketContext);
  const [count, setCount] = useState(3);
  const {
    room,
    userCookie,
    updateUserState,
    onlineLIst,
    reSendData,
    setReSendData,
    roomList,
    setRoom,
    navigate,
    message,
  } = useContext(UserListContext);
  // const navigate = useNavigate();
  useEffect(() => {
    const goBack = setInterval(() => {
      if (count >0) setCount(count - 1);
      console.log(count);
      if (count === 0) {
      console.log("count");

        return setTimeout(() => {
          navigate("/game/plaza");
        }, 100);
      }
    }, [1000]);
    // goBack();
    return () => clearInterval(goBack)
  }, [count]);

  const goBackMessage = () => {
    // goBack();
    return (
      <div className="go_back_message">
        GO BACK TO PREVIOUS ROOM in :
        <span>{count > 1 ? count + " seconds" : count + " second"}</span>
      </div>
    );
  };
  // goBack()
  return (
    <section className="container">
      <div className="inner">
        <div className="header">Sorry, This room is not ready yet.</div>
        {goBackMessage()}
      </div>
    </section>
  );
};

export default NotReady;
