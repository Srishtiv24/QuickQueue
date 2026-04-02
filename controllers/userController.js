const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  User  = require("../models/User.js");

console.log(User);

// database-stores token method of auth
const login = async (req, res) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide both email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User NOT FOUND!" });
    }
    if (user.authProvider === "local") {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // jwt auth
        const token = jwt.sign(
          { id: user._id, name: user.name, email: user.email }, // payload
          process.env.JWT_SECRET_KEY, // secret key
          { expiresIn: "1h" } // expiry
        );

        return res.status(StatusCodes.OK).json({
          token: token,
          user: { name: user.name, email: user.email, id: user._id },
        });
      } else {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid email or password" });
      }
    } else {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Use Google login for this account" });
    }
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong ${err}` });
  }
};

const register = async (req, res) => {
  const { name, password, email } = req.body;
  if (!name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide name, email, and password" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already exists!" });
    }
    if (password.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: { password: "Password must be at least 6 characters long." },
      });
    }
    if (
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: {
          password:
            "Password must include at least one uppercase letter, one number, and one special character.",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      authProvider: "local",
    });

    await newUser.save();
    res.status(StatusCodes.CREATED).json({ message: "User registered" });
  } catch (e) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong ${e}` });
  }
};

module.exports = { login, register };
