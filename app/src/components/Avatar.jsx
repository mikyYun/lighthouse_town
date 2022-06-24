export default function Avatar(props) {
  console.log('PROPS URL:', props.url)
  return (
    <img className="user-avatar" src={props.url} alt="avatar" />
  )
}