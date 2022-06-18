import girlImage from "../game_img/girl1.png";
import boyImage from "../game_img/boy1.png";


const selectAvatar = (num) => {
  if (num === 1) {
    return boyImage
  }
  if (num === 2) {
    return girlImage
  }

}

export default selectAvatar;