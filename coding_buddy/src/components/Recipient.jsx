import { useContext } from "react";
import Select from 'react-select';
import { SocketContext } from '../App.js'

function Recipient(props) {
  const { online } = useContext(SocketContext)
  const {nickname, recipient, setRecipient} = props
  // const recipient = props.recipient
  // const setRecipient = props.setRecipient 
  console.log("ONLINE - RECIPIENT.JSX", online)
  const onlineOthers = online.filter(user => user.value !== nickname)
  return (
    <div className="card d-flex flex-row align-items-center" >
      <label htmlFor="user-name-input" style={{ width: 290 }}>
        Recipient
      </label>
      <Select
        type="text"
        id="recipient-dropdown"
        maxLength={12}
        value={recipient!==null && recipient || {value: "all", label: "all"}}
        defaultValue={recipient}
        onChange={setRecipient}
        options={onlineOthers}
      />
    </div>
  );
};

export default Recipient;