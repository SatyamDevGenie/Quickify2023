import bcrypt from "bcryptjs";
const users = [
  {
    name: "Satyam Administrator",
    email: "satyamsawant54@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Subhash Values",
    email: "subhashsawant8888@gmail.com",
    password: bcrypt.hashSync("123", 10),
    isAdmin: false,
  },
  {
    name: "Shreyas Chikane",
    email: "shreyaschikane@gmailcom",
    password: bcrypt.hashSync("123", 10),
    isAdmin: false,
  },
];

export default users;
