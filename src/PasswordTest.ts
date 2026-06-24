import bcrypt from "bcryptjs";

const rawPassword = "123456";

const encoded = bcrypt.hashSync(rawPassword, 10);

console.log("Raw Password:", rawPassword);
console.log("BCrypt Hash:", encoded);