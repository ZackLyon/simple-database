const fs = require('fs/promises');
const { nanoid } = require('nanoid');
const path = require('path');
const SimpleDb = require('../lib/simple-db.js');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

const id = nanoid(5);
const testObj = { id, message: 'this is where the magic happens' };
const testJSONobj = JSON.stringify(testObj);
let newDB;

describe('simple database', () => {
  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
    newDB = new SimpleDb(TEST_DIR);
  });

  it('should get a file by id', async () => {
    const filePath = path.join(TEST_DIR, `${id}.json`);
    await fs.writeFile(filePath, testJSONobj);

    const file = await newDB.get(id);
    expect(file).toEqual(testObj);
  });

  it('should return null if get(id) does not find a file', async () => {
    const file = await newDB.get('fakeId');

    expect(file).toBeNull();
  });
});
