const User = require("./user.ts");
import { UserDetails } from ".";


class Manager extends User {
  constructor(userDetails: UserDetails) {
    super(userDetails);
    this.role = "manager";
  }
}

module.exports = Manager;
