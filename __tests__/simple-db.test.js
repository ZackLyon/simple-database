const fs = require('fs/promises');
const { nanoid } = require('nanoid');
const path = require('path');
const SimpleDb = require('../lib/simple-db.js');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

const id = nanoid(5);
const testObj = { message: 'this is where the magic happens' };
const testJSONobj = JSON.stringify({ testObj, id });
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
    expect(file).toEqual({ testObj, id });
  });

  it('should return null if get(id) does not find a file', async () => {
    const file = await newDB.get('fakeId');

    expect(file).toBeNull();
  });

  it('should save an obj to test directory with id as filename', async () => {
    const newTestObj = { ...testObj };
    await newDB.save(newTestObj);
    const file = await newDB.get(newTestObj.id);

    expect(file).toEqual(newTestObj);
  });

  it('should get all file contents in the db', async () => {
    const testObjAnyId = { ...testObj, id: expect.any(String) };
    const expectedArr = new Array(3).fill(testObjAnyId);

    await newDB.save(testObj);
    await newDB.save(testObj);
    await newDB.save(testObj);

    const files = await newDB.getAll();

    expect(files).toEqual(expectedArr);
  });
});
