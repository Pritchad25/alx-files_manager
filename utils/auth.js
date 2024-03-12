import redisClient from './redis';

export default async (req, res, next) => {
  const token = req.header('X-Token');

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const id = await redisClient.get(`auth_${token}`);

  if (!id) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  req.user = { id, token };
  next();
};
