const { readFile, writeFile, readdir } = require('fs/promises');
const { nanoid } = require('nanoid');
const path = require('path');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  get(id) {
    const newPath = `${this.dirPath}/${id}.json`;
    return readFile(newPath, JSON)
      .then((result) => JSON.parse(result))
      .catch((err) => {
        if (err.code === 'ENOENT') return null;

        throw err;
      });
  }

  save(obj) {
    const id = nanoid(5);

    const filePath = path.join(this.dirPath, `${id}.json`);

    obj.id = id;
    return writeFile(filePath, JSON.stringify(obj));
  }

  getAll() {
    return readdir(this.dirPath).then((files) =>
      Promise.all(files.map((file) => this.get(file.slice(0, 5))))
    );
  }
}

module.exports = SimpleDb;
