import express from 'express'
import { logincontroller, signupcontroller, verifyCodeController} from '../Controller/usercontroller.js';

const userroutes = express.Router();

userroutes.route('/post').post(signupcontroller);
userroutes.route('/login').post(logincontroller);
userroutes.route('/verify-code').post(verifyCodeController);


export default userroutes;
