import { ObjectID } from 'mongodb';
import { v4 as uuid } from 'uuid';

import dbClient from '../utils/db';
import { writeFile } from '../utils/files';
import fileQueue from '../utils/image_upload';

const validFileTypes = ['folder', 'file', 'image'];

export const postUpload = async (req, res) => {
  try {
    const { name, type, data } = req.body;
    let { parentId, isPublic } = req.body;

    if (parentId === undefined) parentId = '0';
    if (isPublic === undefined) isPublic = false;

    if (!name) {
      res.status(400).json({ error: 'Missing name' });
      return;
    }

    if (!type || !validFileTypes.includes(type)) {
      res.status(400).json({ error: 'Missing type' });
      return;
    }

    if (type !== 'folder' && !data) {
      res.status(400).json({ error: 'Missing data' });
      return;
    }

    if (parentId !== '0') {
      const parent = await dbClient.findFile({ _id: ObjectID(parentId) });

      if (!parent) {
        res.status(400).json({ error: 'Parent not found' });
        return;
      }
      if (parent.type !== 'folder') {
        res.status(400).json({ error: 'Parent is not a folder' });
        return;
      }
    }

    const fileData = {
      userId: req.user.id,
      name,
      type,
      parentId,
      isPublic,
    };

    if (type !== 'folder') {
      fileData.data = data;
      fileData.path = writeFile(uuid(), type, data);
    }

    const newFile = await dbClient.uploadFile(fileData);

    if (type === 'image') {
      await fileQueue.add(newFile);
    }

    newFile.id = newFile._id;
    delete newFile._id;
    delete newFile.data;
    delete newFile.path;

    res.json(newFile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};
