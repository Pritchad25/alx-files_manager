import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export const getStatus = (req, res) => {
  try {
    const redis = redisClient.isAlive();
    const db = dbClient.isAlive();

    res.status(200).send({ redis, db });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getStats = async (req, res) => {
  try {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();

    res.status(200).send({ users, files });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};
