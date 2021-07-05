const DataAccess = require('./db');

class UserDataAccess extends DataAccess {
  constructor() {
    super('users');
  }

  async getUserByEmailAddress(emailAddress) {
    const user = await this.getByEmail(emailAddress);
    return user;
  }

  async getUserByUsername(username) {
    const user = await this.getByUsername(username);
    return user;
  }
}

module.exports = new UserDataAccess();
