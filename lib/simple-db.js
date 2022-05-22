const { readFile, writeFile, readdir } = require('fs/promises');
const { nanoid } = require('nanoid');
const path = require('path');

class SimpleDb {
  constructor(dirPath) {
    this.dirPath = dirPath;
  }

  async get(id) {
    const newPath = `${this.dirPath}/${id}.json`;
    try {
      const file = await readFile(newPath, JSON);

      return JSON.parse(file);
    } catch (err) {
      if (err.code === 'ENOENT') return null;

      throw err;
    }
  }

  save(obj) {
    const id = nanoid(5);

    const filePath = path.join(this.dirPath, `${id}.json`);

    obj.id = id;
    return writeFile(filePath, JSON.stringify(obj));
  }

  async getAll() {
    const fileNames = await readdir(this.dirPath);
    const files = await Promise.all(
      fileNames.map((fileName) => {
        const id = fileName.slice(0, 5);
        return this.get(id);
      })
    );

    return files;
  }
}

module.exports = SimpleDb;
