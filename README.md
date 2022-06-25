# Lighthouse Town
## Collaborator
* Moon Choi : https://github.com/moon-choi
* Heesoo Park : https://github.com/moon-choi
* Myeonghwan Mike Yun : https://github.com/mikyYun

## Preview
![alt-text](https://github.com/mikyYun/lighthouse_town/blob/main/src/login.gif)
![alt-text](https://github.com/mikyYun/lighthouse_town/blob/main/src/register.gif)
![alt-text](https://github.com/mikyYun/lighthouse_town/blob/main/src/onlineUserSync.gif)
![alt-text](https://github.com/mikyYun/lighthouse_town/blob/main/src/shareVideo.gif)
![alt-text](https://github.com/mikyYun/lighthouse_town/blob/main/src/liveSyncVideo.gif)
![alt-text](https://github.com/mikyYun/lighthouse_town/blob/main/src/syncedVideo.gif)
![alt-text](https://github.com/mikyYun/lighthouse_town/blob/main/src/bubbleChat.gif)
![alt-text](https://github.com/mikyYun/lighthouse_town/blob/main/src/privateChat.gif)

## User Story
- User can login with existing userdata
- User can register with unique email and username
- User can choose their programming languages and avatar in registeration
- User can see other online users
- User can control their own avatar
- User can see other online users' movement
- User can communicate to all 
- User can communicate to specific user
- User can share video link in js room via lecture button
- User cannot see unrelated private messages
- User can see public messaged over the head of avatar
- User can see online users list and friends list
- User can add a friend by click 'Add frined' on online list 
- User can see online user's information by click 'View profile' on online list's user tag
- User can send message by click 'Send message' on online list's user tag


## Setup
### Server And Client
- 'npm install' to install npm packagies in 'app' and 'server' independently
- create .env in server folder <br />
/server/.env <br />
PGUSER=coding_buddy <br />
PGHOST=localhost <br />
PGDATABASE=coding_buddy <br />
PGPASSWORD=123 <br />
PGPORT=5432
- create .env in app folder <br />
/app/.env <br />
BACK_URL=http://localhost:8000

### Database
- login any psql user
- create new user as superuser with password 123
* $ CREATE USER coding_buddy WITH SUPERUSER PASSWORD '123';
* $ \du => check new user

- create new database
* $ CREATE DATABASE coding_buddy;
* $ \l => check new database

- login with new user
* $ psql -d coding_buddy -U coding_buddy
* $ type password to login
* $ \conninfo => check current user

### Reset Database
- initialize database
/server <br />
- npm run db:reset
: this will initialize codding_buddy database <br />
since this initialization is needed to stop, ctrl + C || command + C to stop server run

### Run
- run server and client together <br />
/server <br />
npm run runall
- run server
/server <br />
npm run dev
- run client
/app <br />
npm start