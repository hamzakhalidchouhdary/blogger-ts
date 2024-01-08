const User = require("./user.ts");
import { UserDetails } from "../../../utils/common/interfaces";


class Manager extends User {
  constructor(userDetails: UserDetails) {
    super(userDetails);
    this.role = "manager";
  }
}

module.exports = Manager;
