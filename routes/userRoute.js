const express = require("express");
const router = express.Router();
const { validateBody, isNewUser, hashPass, isExistingUser, verifyPass, auth, adminAuth } = require('../middleware/usersMiddleware');
const Controller = require('../controllers/userController');

//signup a new user
router.post('/signup', validateBody, isNewUser, hashPass, Controller.signUp)

//login an exiting user
router.post('/login', validateBody, isExistingUser, verifyPass, Controller.login);

//logout currently logged in user
router.get('/logout', Controller.logout);

//get entire users list
router.get('/', adminAuth, Controller.getUsersList);

//get specific user
router.get('/:id', Controller.getUser);

//delete a user from the db
router.delete('/:id/delete-user', adminAuth, Controller.deleteUser);

//update a user
router.put('/:id', auth, validateBody, isNewUser, Controller.updateUser);

//update the password of the user
router.put('/:id/update-password', auth, hashPass, Controller.updateUser);

//get specific user by email
router.get('/email/:email', auth, Controller.getUserFromEmail);

module.exports = router;