import { useContext } from "react";
import { SocketContext } from '../App.js'

export default function Chat() {
  const { online } = useContext(SocketContext)
  console.log("online", online)
  const usersOnline = online.map(name => (<li>{name.value}</li>))

  console.log("david", usersOnline)

  console.log('Online.jsx - online', online)
  return (

    <>
      <div className="d-flex flex-column onlinelist">
        <span>Online</span>
        <div>
          {usersOnline}
        </div>
      </div>

    </>
  )
}