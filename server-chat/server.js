const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const socketIo = require("socket.io")(server, { //????왜 괄호 두개
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
// const socket = require("../chat-app/src/service/socket");
const socket = require("./socket");

const port = 4000;

// express의 미들웨어 사용 방식
app.get("/", (req, res) => {
  res.json({ test: "start" });
  console.log("this is server.js") //this appears in terminal
});

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // cors 미들웨어 사용
socket(socketIo);// /src/socket/index.js 의 socket으로 socketIo 객체를 전달

// homepage

server.listen(port, () => {
  console.log(
    `##### server is running on http://localhost:4000. ${new Date().toLocaleString()} #####`
  );
});

//코드를 위에서부터 보면 express로 만든 서버에 socket을 열어줬고 cors로 localhost:3000 url만 통신을 허용하도록 설정했습니다. src/socket은 아직 만들진 않았지만 이제 바로 만들 것이기 때문에 미리 작성해뒀습니다. src/socket.js 파일에서 소켓의 이벤트에 따른 로직들을 작성할 것입니다.