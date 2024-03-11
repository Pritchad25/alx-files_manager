import sha1 from 'sha1';
import { v4 as uuid } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export const getConnect = async (req, res) => {
  try {
    let credentials = req.header('Authorization');

    if (!credentials) {
      res.status(400).json({ error: 'No authorization header' });
      return;
    }

    credentials = credentials.slice(6);
    const buff = Buffer.from(credentials, 'base64');

    const [email, password] = buff.toString('utf8').split(':');

    const user = await dbClient.findUser({ email });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (sha1(password) !== user.password) {
      res.status(403).json({ error: 'Invalid credentials' });
      return;
    }

    const token = uuid();
    const key = `auth_${token}`;
    // token kept as a key in redis db for 24 hours (86400 secs)
    await redisClient.set(key, user._id.toString(), 86400);

    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDisconnect = async (req, res) => {
  try {
    await redisClient.del(`auth_${req.user.token}`);
    res.status(204).send('');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};
