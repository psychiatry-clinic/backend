require("dotenv").config();
import jwt from "jsonwebtoken";

// Replace 'your-secret-key' with your actual secret key
const secretKey = process.env.SECRET_KEY || "alnoorimustafa";

export default async (user: object) => {
  try {
    if (secretKey === "") {
      throw new Error("Missing secret key");
    }
    // Customize the token payload as needed
    const tokenPayload = {
      ...user,
    };
    // Generate the JWT token
    const accessToken = jwt.sign(tokenPayload, secretKey);
    return accessToken;
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw new Error("Failed to generate JWT token.");
  }
};
