import express from 'express';
import auth from '../utils/auth';
import { getStatus, getStats } from '../controllers/AppController';
import { postNew, getMe } from '../controllers/UsersController';
import { getConnect, getDisconnect } from '../controllers/AuthController';
import { postUpload } from '../controllers/FilesController';

const router = express.Router();

// AppController routes

// returns true if Redis is alive and if the DB is alive too
router.get('/status', getStatus);
// returns the number of users and files in DB
router.get('/stats', getStats);

// UsersController routes

// creates a new user
router.post('/users', postNew);
// retrieves the user based on the token used
router.get('/users/me', auth, getMe);

// AuthController routes

// sign-in the user by generating a new authentication token
router.get('/connect', getConnect);
// sign-out the user based on the token
router.get('/disconnect', auth, getDisconnect);

// the FilesController routes

// creates a new file in the db and also in disk
router.post('/files', auth, postUpload);

export default router;
