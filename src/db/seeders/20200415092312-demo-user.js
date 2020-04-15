const { nanoid } = require("nanoid");

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("users", [
      {
        id: nanoid(),
        firstName: "John",
        lastName: "Doe",
        email: "example@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
