import { useState, useContext, useEffect } from "react";
import Select from 'react-select';
import { SocketContext } from '../App.js'

function Recipient(props) {
  const { online } = useContext(SocketContext)
  const { nickname, recipient, setRecipient } = props
  const [otherUsers, setOtherUsers] = useState([])
  // other users => dynamic values
  // const recipient = props.recipient
  // const setRecipient = props.setRecipient
  console.log("ONLINE - RECIPIENT.JSX", online)
  
  useEffect(() => {
    console.log("유저네임",nickname)
    console.log("유저네임", online)
    const onlineOthers = online.filter(user => user.value !== nickname)
    setOtherUsers(onlineOthers)
  }, [])

  return (
    <div className="card d-flex flex-row align-items-center" >
      <label htmlFor="user-name-input" style={{ width: 290 }}>
        Recipient
      </label>
      <Select
        type="text"
        id="recipient-dropdown"
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