let users = [];

module.exports = {
  getAll: () => users,
  add: (user) => {
    user.id = users.length + 1;
    users.push(user);
  },
  delete: (id) => {
    users = users.filter(u => u.id != id);
  },
  update: (id, newUser) => {
    users = users.map(u => (u.id == id ? { ...u, ...newUser } : u));
  }
};

