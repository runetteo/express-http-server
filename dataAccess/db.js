const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const path = require('path');
const dbAsync = lowdb(new FileAsync(path.join(__dirname, 'db.json')));
const { v4: uuid } = require('uuid');

class DataAccess {
  constructor(tableName) {
    this.tableName = tableName;
    // Promise chaining..
    this.dbContext = dbAsync.then(db => {
      // create the json property if not existing
      db.defaults({ [tableName]: [] }).write();

      return db;
    });
  }

  async getAll() {
    const dbContext = await this.dbContext;

    return dbContext.get(this.tableName).value();
  }

  async getById(id) {
    const dbContext = await this.dbContext;

    return dbContext
      .get(this.tableName)
      .find({ id })
      .value();
  }

  async getByUsername(username) {
    const dbContext = await this.dbContext;

    return dbContext
      .get(this.tableName)
      .find((_) => _.username.toUpperCase() === username.toUpperCase())
      .value();
  }

  async getByEmail(emailAddress) {
    const dbContext = await this.dbContext;

    return dbContext
      .get(this.tableName)
      .find((_) => _.emailAddress.toUpperCase() === emailAddress.toUpperCase())
      .value();
  }


  async insert(data) {
    const dbContext = await this.dbContext;
    const id = uuid();

    dbContext.get(this.tableName)
      .push({
        id,
        ...data
      })
      .write();

    return this.getById(id);
  }

  async update(username, data) {
    const dbContext = await this.dbContext;

    dbContext.get(this.tableName)
      .find((_) => _.username.toUpperCase() === username.toUpperCase())
      .assign(data)
      .write();
  }

  async delete(username) {
    const dbContext = await this.dbContext;

    dbContext
      .get(this.tableName)
      .remove((_) => _.username.toUpperCase() === username.toUpperCase())
      .write();
  }
}

module.exports = DataAccess;
