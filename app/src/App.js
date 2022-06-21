// = packages =
import './App.css';
import { useState, useEffect, useContext, createContext, } from "react";
import { Routes, Route, useNavigate, useLocation, } from "react-router-dom";
import { socket } from './components/service/socket.js';
import Cookies from 'universal-cookie';

// = compononents =
import Game from './components/Game';
import Register from './components/Register';
import Login from './components/Login';

// = images =
import town from './components/game_img/town-map.png';
import classroom from './components/game_img/classroom.png';
import lounge from './components/game_img/lounge.png';

// = instantiations =
export const SocketContext = createContext(socket); // going to Recipient.jsx
export const UserListContext = createContext({});
export const MsgContext = createContext([]);

// = main component =
function App() {
  // ================= STATE =============== //
  const [room, setRoom] = useState('plaza');
  const [online, setOnline] = useState([{ value: 'all', label: 'all' }]);
  const [friendList, setFriendList] = useState([]);
  const [show, setShow] = useState(false);
  const [clicked, setClicked] = useState({});
  const [recipient, setRecipient] = useState({ value: "all", label: "all" });
  const [user, setUser] = useState({ value: "all", label: "all", avatar: 1 });
  const [profiles, setProfiles] = useState({});
  const [profileShow, setProfileShow] = useState("none");
  const [blockAddFriendAlert, setBlockAddFriendAlert] = useState("add-friend");

  // ================= INSTANCES =============== //
  const cookies = new Cookies();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ================= VARIABLES =============== //
  const nickname = location.state?.[0] || '';

  // set map for navigate
  const maps = {
    plaza: town,
    ruby: lounge,
    html: classroom,
    css: lounge,
    js: classroom,
  };

  const avatars = {
    1: "/images/boy1-face.png",
    2: "/images/boy2-face.png",
    3: "/images/girl1-face.png",
    4: "/images/girl2-face.png"
  };

  // ================= EFFECTS =============== //
  useEffect(() => {
    setUser({ ...user, avatarURL: avatars[user.avatar || 1] }); //[user.avatar] is a number (avatar id)
    // @@@@@@@@@@@@ SUNDAY : WE SHOULD GET A USER FROM THE DATA BASE
    // @@@@@@@@@@@@ SUNDAY : WE SHOULD ALSO SET AN AVATAR WHEN WE GET AN USER OBJECT.
    // set URL for navigate when enter the house
    const newRoom = location.pathname.split("/").splice(2)[0];
    if (maps[newRoom]) setRoom(newRoom);

    const currentCookies = cookies.getAll();
    // cookies maxAge 3600.
    socket.on("connect", () => {
      if ((location.pathname === "/login"
        || location.pathname === "/register"
        || location.pathname === "/game"
        || location.pathname === "/game/plaza")
        && currentCookies.userdata) {
        createSocketIdNameObject(currentCookies.userdata.userName);
        const goChat = (username, avatar, userLanguages, id) => {
          const data = [username, avatar, userLanguages, id];
          navigate('/game/plaza', { state: data });
        };
        goChat(currentCookies.userdata.userName, currentCookies.userdata.avatar, currentCookies.userdata.userLanguages, currentCookies.userdata.userID);
      }
      if (!currentCookies.userdata) {
        // if (!urlLists.includes(location.pathname)) {
        clearCookies();
        navigate("/");
      }
    });
    // if (!urlLists.includes(location.pathname)) clearCookies();
  }, [location.pathname]);

  // = front end socket connections =
  useEffect(() => {
    socket.on("connect", () => {
      const all_cookies = cookies.getAll();
      //  게임에 들어왔는데 쿠키에 유저데이터가 없으면 메인페이지로
      // if (location.pathname === "/game") {
      // navigate("/")
      // }
      // 유저데이터가 아직 삭제되지 않았고, 게임페이지 리로드 한 경우 서버랑 연결하고 currentUser update in server
      if (all_cookies.userdata) {
        // 쿠키 존재하면 리커넥트 요청
        socket.emit("SET USERNAME", { username: all_cookies.userdata.userName, socketID: socket.id });
        // socket.emit("reconnection?", { username: all_cookies.userdata.userName, newSocketId: socket.id });
        // socket.on("DENY CONNECTION", (e) => {
        //   clearCookies()
        //   navigate("/")
        // })
      } else {
        // 쿠키 없으면 홈으로
        navigate("/");
      }
      // 유저가 연결될 때 마다 친구리스트 요청
      // socket.emit("friendsList", {socketID: socket.id})
      // 쿠키는 있는데 현재 사용중인 유저이면 클리어하고 집으로
      socket.on("DENY CONNECTION", (e) => {
        // clearCookies();
        // navigate("/");
      });
    }, []);

    // socket.on("DENY CONNECTION", (e) => {
    //   clearCookies()
    //   navigate("/")
    // })

    // socket.on("updateFriendsList", newFriendInfo => {
    //   setFriendList(prev => ({
    //     ...prev,
    //     newFriendInfo
    //   }));
    // });
    socket.on("updateFriendsList", ({ newFriendName, languages }) => {
      const nameAndLangObj = {};
      nameAndLangObj[newFriendName] = { languages };
      setFriendList((prev) => ({
        ...prev,
        ...nameAndLangObj
      }));
    });

    socket.on("friendsListBack", friendsInfo => {
      setFriendList(friendsInfo);
    });

    socket.on("REGISTRATION SUCCESS", (userInfo) => {
      cookies.set("email", userInfo, { maxAge: 3600 });
      navigate("/game/plaza");
    });

    socket.on("init", msg => console.log("msg - App.js", msg)); //coming from server
    socket.on("backData", data => console.log("data", data)); //coming from server

    // socket.on("update login users information", ({disconnectedUser}) => {
    //   // const updateProfileLists = () => {
    //     // delete profiles[disconnectedUser]
    //   // }
    //   // setProfiles(prev => ({
    //   //   [disconnectedUser]: remove,
    //   //   ...rest
    //   // }))
    // })


    socket.on("all user names", (obj) => { //@@@SUNDAY: all user objects
      // obj => {uniqname: {email:, avatar_id:, languages: [arr]},
      //  uniqname: {},
      //  uniqname: {}
      // }

      const loginUsersObject = obj.users;
      const loginUserNames = Object.keys(loginUsersObject);
      const loginUsersInformation = {};
      const usersOnline = [];
      loginUserNames.map(name => {
        usersOnline.push({ value: name, label: name, avatar: avatars[loginUsersObject[name].avatar_id] });
        loginUsersInformation[name] = {
          name: name,
          email: loginUsersObject[name].email,
          languages: loginUsersObject[name].languages,
          avatar_id: loginUsersObject[name].avatar_id,
        };
      });
      //@@@@ SUNDAY - this should be dynamic and need an avatar from socket.
      setProfiles(loginUsersInformation);

      usersOnline.unshift({ value: "all", label: "all", avatar: avatars[1] });
      // const onlineOthers = usersOnline.filter(user => user.value !== nickname)


      setOnline(usersOnline);
    }); // this works

    // clean up function
    return () => {
      socket.disconnect();  // => prevent memory leak..
    };
  }, []);



  // ================= FUNCTIONS =============== //
  const RegistrationChecker = (val) => {
    socket && socket.emit("REGISTERED", val);
  };

  const clearCookies = () => {
    const all_cookies = cookies.getAll();
    // if (all_cookies.length > 0) {
    Object.keys(all_cookies).forEach((each) => {
      cookies.remove(each);
    });
  };

  const createSocketIdNameObject = (username) => {
    socket && socket.emit("SET USERNAME", { "socketID": socket.id, "username": username });
    // socket && socket.emit("REGISTERED", val); //if socket exists, then emit
  };

  const sendMessage = () => {
    socket && socket.emit("NEW MESSAGE", socket.id);
  };

  const privateMessage = (target, msg, username) => {
    socket && socket.emit("PRIVATE MESSAGE", { "target": target, "message": msg, "username": username });
  };



  // = render main App =
  return (
    <SocketContext.Provider value={{ socket, online, nickname, friendList }} >
      <UserListContext.Provider value={{ show, setShow, recipient, setRecipient, clicked, setClicked, user, setUser, profiles, nickname, setProfiles, profileShow, setProfileShow, blockAddFriendAlert, setBlockAddFriendAlert }} >

        {/* clicked -> used in Menu.jsx
    setClicked -> used in Online.jsx */}
        {/* {show && <Menu username={nickname} />} */}
        <Routes>
          <Route path='/' element={<Login setUser={createSocketIdNameObject} />} />
          <Route path='/register' element={<Register submitRegistrationInfo={RegistrationChecker} />} />
          <Route path='/login' element={<Login setUser={createSocketIdNameObject} />} />
          <Route path={`/game/${room}`} element={(
            <Game
              username={nickname}
              avatar={user.avatar}
              sendMessage={sendMessage}
              sendPrivateMessage={privateMessage}
              // sendData={sendData}
              setUser={createSocketIdNameObject}
              room={room}
              online={online}
              map={maps[room]}
            />
          )}
          />;
        </Routes>
      </UserListContext.Provider>
    </SocketContext.Provider>
  );
};
export default App;