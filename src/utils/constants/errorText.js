module.exports = {
  INTERNAL_ERROR: "internal error",
  EMPTY: "unexpected empty value",
  NOT_OBJECT: "a object is expected",
  INVALID_NUM: "invalid number value",
  NOT_A_OWNER: "only owner can perform this action",
  NO_AUTH_HEADER: "token not found",
  NO_AUTH_TOKEN: "token is empty",
  NO_USER: "user not found",
  UNSUPPORTED_USER_ROLE: "user role not supported",
  INVALID_CREDENTIALS: "username or password incorrect",
  PERMISSIONS: {
    CREATE: {
      ARTICLE:  "not authorized to create new article",
      USER: "not authorized to create new user"
    },
    UPDATE: {
      ARTICLE:  "not authorized to update article",
      USER: "not authorized to update user"
    },
    DELETE: {
      ARTICLE:  "not authorized to delete article",
      USER: "not authorized to delete user"
    }
  }
};
