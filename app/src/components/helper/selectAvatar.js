import boyImage1 from "../game_img/boy1.png";
import boyImage2 from "../game_img/boy2.png";
import girlImage1 from "../game_img/girl1.png";
import girlImage2 from "../game_img/girl2.png";


const selectAvatar = (num) => {
  const avatarPaths = {
    1: boyImage1,
    2: boyImage2,
    3: girlImage1,
    4: girlImage2,
  };

  return avatarPaths[num];
};

export default selectAvatar