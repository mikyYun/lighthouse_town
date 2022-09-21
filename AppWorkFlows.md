# Work Flows

## Connection Request
* User open the main page
* Unlogged in user should see login page
* Unregistered user should register user account in register page
<!-- REGISTER -->
* Click register => send data to server => query to check unique email
* If registration information is unique, store in DB and set currentUser Object with userName and socketID. And send data {loggedInUsers, the user's info_friendsLists, Languages, email}
* If registration was failed, return error message or false to show error message to user(EX_res.status(409) : CONFLICT. Existing User. Try with different..)

<!-- LOGIN -->
* Click Login => send data to server => query to compare users data to find user email / password
* If submitted email does not exist in DB OR password does not match with DB, return error message or false to show error message(EX_res.status(401) : the credentials are invalid)
* If submitted information match with DB, query to find the user's information with friends list, languages
* => store currentUsers Object with socketID and userName
* => send data {loggedInUsers, the user's info_friendsLists, Languages, email}

<!-- UNSUCCESSFUL REGISTER || LOGIN -->
* Catch(err) and show alert(status_409 or 401)
* Appear failed message on screen

<!-- SUCCESSFUL REGISTER && LOGIN -->
* store received user data(name, email, friends list, languages) & onlineUsers.. 
<!-- WHERE??? Cookies?? Storage?? React.State?? ==> with Cookies, state -->
* after store data, then redirect or navigate to "GAME/PLAZA"

<!-- RENDER GAME/PLAZA -->
* Draw Canvas
* Show Avatar according to avatar id of each indivisual
* Show friendsLists using cookies or state
* Show onlineLists using cookies or state
* Draw all onlined avatars on their own x,y positions

<!-- UPDATE IDEAS -->
* Create FriendsList && OnlineLists outside canvas so that don't need to rerender those datas
* Lists only re-render if the lists updated(add / remove friends || login || logout users )
<!-- REFACTORING VERSION 1 _ END -->