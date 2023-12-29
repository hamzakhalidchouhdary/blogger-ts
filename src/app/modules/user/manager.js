const User = require("./user.ts");

class Manager extends User {
  constructor(userDetails) {
    super(userDetails);
    this.role = "manager";
  }
}

module.exports = Manager;
