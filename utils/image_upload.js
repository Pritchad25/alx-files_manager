import Queue from 'bull';
import imageThumbnail from 'image-thumbnail';

import { writeFile } from './files';

const fileQueue = new Queue('image file processing');

fileQueue.process(async ({ data }, done) => {
  const { _id, userId } = data;
  let { path } = data;
  const fileData = data.data;

  path = path.slice(19);

  if (!_id) done(Error('Missing fileId'));
  if (!userId) done(Error('Missing userId'));

  const thumbnail100 = await imageThumbnail(fileData, { width: 100 });
  const thumbnail250 = await imageThumbnail(fileData, { width: 250 });
  const thumbnail500 = await imageThumbnail(fileData, { width: 500 });

  writeFile(`${path}_100`, 'image', thumbnail100);
  writeFile(`${path}_250`, 'image', thumbnail250);
  writeFile(`${path}_500`, 'image', thumbnail500);
});
