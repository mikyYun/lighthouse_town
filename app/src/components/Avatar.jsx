export default function Avatar(props) {
  // console.log('PROPS URL:', props.url)
  const loadAvatar = (avatar_id) => {
    let url = "../images/"
    switch(avatar_id) {
      case 1: 
        url += `boy1-face.png`
        break;
        case 2: 
        url += "boy2-face.png"
        break;
        case 3: 
        url += "girl1-face.png"
        break;
        case 4: 
        url += "girl2-face.png"
        break;
    }

    return url
  }

  return (
    <img className="user-avatar" 
    src={loadAvatar(props.url)}
    // src="../images/boy1-face.png"
     alt="avatar" />
    // <img className="user-avatar" src={"../images/boy1-face.png"} alt="avatar" />
  )
}