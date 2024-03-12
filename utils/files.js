import fs from 'fs';

export const writeFile = (name, type, data) => {
  const path = `/tmp/files_manager/${name}`;
  let fileData = Buffer.from(data, 'base64');

  if (type !== 'image') {
    fileData = fileData.toString('utf8');
  }

  fs.writeFile(path, fileData, { flag: 'w' }, (err) => {
    if (err) throw err;
  });

  return path;
};
