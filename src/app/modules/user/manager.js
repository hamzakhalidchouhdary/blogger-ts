const User = require("./user");

function Manager(userDetails) {
  User.call(this, userDetails);
}

Manager.prototype = new User();
Manager.prototype.role = "manager";

module.exports = Manager;
