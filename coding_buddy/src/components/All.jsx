import { useState } from "react";


export default function Friends() {


  return (
    <div className="d-flex flex-column chat-form">
      <div className="text-box">
        <span>These are all users</span>
      </div>
      <div className="chat-window card" ref={chatWindow}>
        {messages.map((message, index) => {
          const { nickname, content, time } = message;
          let recipient = ''
          message.recipient ? recipient = message.recipient : recipient = 'all'

          return (
            <div key={index} className="d-flex flex-row">
              {nickname && <div className="message-nickname">{nickname} to {recipient}:  </div>}
              {/* {recipient && <div className="recipient-name"> */}
              {/* To: {recipient} </div>} */}
              <div>{content}</div>
              <div className="time">{time}</div>
            </div>
          );
        })}
      </div>
      <MessageForm nickname={nickname} recipient={recipient} />
    </div>
  )
}