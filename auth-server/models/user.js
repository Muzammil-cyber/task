module.exports = (pool) => {
  return {
    findByEmail: (email, callback) => {
      pool.query("SELECT * FROM users WHERE email = ?", [email], callback);
    },
    create: (user, callback) => {
      pool.query("INSERT INTO users SET ?", user, callback);
    },
  };
};
