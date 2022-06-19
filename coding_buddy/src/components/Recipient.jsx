import { useState, useContext, useEffect } from "react";
import Select from 'react-select';
import { SocketContext } from '../App.js'

function Recipient() {
  let { nickname, online, recipient, setRecipient } = useContext(SocketContext)

  const [otherUsers, setOtherUsers] = useState([])
  // other users => dynamic values
  // const recipient = props.recipient
  // const setRecipient = props.setRecipient
  // console.log("ONLINE - RECIPIENT.JSX", online)
  // console.log("ONLINE - RECIPIENT.JSX", nickname)
  // console.log("INSIDE", online)

  // online.map(onlineMember => {
  // if (onlineMember.value === nickname) delete onlineMember[nickname]
  // console.log(onlineMember.value === nickname)
  // console.log("TEST", onlineMember)
  // })
  useEffect(() => {

    const onlineOthers = online.filter(user => user.value !== nickname)
    return setOtherUsers(onlineOthers)
  }, [online, nickname])

  return (
    <div className="card d-flex flex-row align-items-center" >
      <label htmlFor="user-name-input" style={{ width: 290 }}>
        Recipient
      </label>
      <Select
        type="text"
        id="pdown"
        maxLength={12}
        value={recipient !== null && (recipient || { value: "all", label: "all" })}
        defaultValue={recipient}
        onChange={setRecipient}
        options={otherUsers}
      />

    </div>

  );
};

export default Recipient;