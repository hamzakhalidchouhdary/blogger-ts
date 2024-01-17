import { describe, it } from 'mocha';
const { expect } = require("chai");
const UserModule = require("../../app/modules/user");
const USER_ROLES = require("../../utils/constants/userRoles");
const UserFixtures = require("../fixtures/user");

describe('User Module', function(){
  beforeEach(function(){
    this.createUserWithRole = async function(userRole = '') {
      return UserFixtures.createUser({role: userRole})
    }
  });
  it('should throw error if user not found', async function() {});
  it('should return user of `Admin` type', async function(){});
  it('should return user of `Manager` type', async function(){});
  it('should return user of `Reader` type', async function(){});
  it.skip('should throw error for unsupported user type', async function(){
    try{
      const user = await this.createUserWithRole(null);
      user.role = 'test';
      await user.save();
      await UserModule.getUser(user.id);
    } catch(err) {
      expect(err.message).to.equal('user role not supported');
    };
  });
});