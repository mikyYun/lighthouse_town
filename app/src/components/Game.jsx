import React, { useState} from "react";
import "./Game.scss";
import Canvas from "./Canvas";
import Chat from "./Chat";

export default function Game() {
  const [recipient, setRecipient] = useState("all");
  const changeRecipient = (newRecipient) => {
    setRecipient(newRecipient);
  };


  return (

    <div className='main'>
      <Canvas changeRecipient={changeRecipient}/>
      <Chat recipient={recipient} changeRecipient={changeRecipient}/>
    </div>
  );
}
