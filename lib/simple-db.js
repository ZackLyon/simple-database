const { readFile } = require('fs/promises');
// const path = require('path');

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
}

module.exports = SimpleDb;
