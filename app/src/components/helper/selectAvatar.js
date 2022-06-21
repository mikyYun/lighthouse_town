const selectAvatar = (num) => {
  const avatarPaths = {
    1: "../game_img/boy1.png",
    2: "../game_img/boy2.png",
    1: "../game_img/girl1.png",
    3: "../game_img/girl2.png",
  };

  return avatarPaths[num];
};

export default selectAvatar