const bcrypt = require('bcryptjs');


async function login(req, res){
    const {username, password} = req.body;
      const db = req.app.get('db');

      const foundUser = await db.auth.checkForUserName(username);

      if (!foundUser[0]) {
         res.status(403).json("Username or Password incorrect")
      } 
      else {

         const isAuthenticated = bcrypt.compareSync(password, foundUser[0].password)

         if (!isAuthenticated) {
            res.status(403).json("Username or Password incorrect")
         } else {

            req.session.user = {
               user_id: foundUser[0].user_id,
               username: foundUser[0].username,
               
            };

            res.status(200).json(req.session.user);
         }
      }
}

async function logout(req, res){
    req.session.destroy();
    res.sendStatus(200);
}

async function register(req, res){
    const {username, password} = req.body;
      const db = req.app.get('db');

      const foundUser = await db.auth.checkForUserName(username);

      if (foundUser[0]) {
         res.status(409).json("Username Taken")
      } else {

         const salt = bcrypt.genSaltSync(10);
         const hash = bcrypt.hashSync(password, salt)

         const newUser = await db.auth.registerUser(username, hash);

         req.session.user = {
            user_id: newUser[0].user_id,
            username: newUser[0].username,
            
         };

         res.status(200).json(req.session.user);
      }
}

async function deleteUser(req, res){
    const {id} = req.session.user.id;
    console.log(id);
    const db = req.app.get('db');
    await db.auth.deleteUser(id);
    req.session.destroy();
    res.sendStatus(200);
}

module.exports = {
    login,
    logout,
    register,
    deleteUser
}