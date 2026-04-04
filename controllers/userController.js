const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// LOGIN
const login = async (req, res) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide both email and password"
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User NOT FOUND!"
      });
    }

    // ✅ FIX: allow login if authProvider missing OR local
    if (!user.authProvider || user.authProvider === "local") {

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid email or password"
        });
      }

      // ✅ FIX: fallback for env variable
      const secret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;

      if (!secret) {
        throw new Error("JWT secret not defined");
      }

      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        secret,
        { expiresIn: "1h" }
      );

      return res.status(StatusCodes.OK).json({
        token,
        user: {
          name: user.name,
          email: user.email,
          id: user._id
        }
      });

    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Use Google login for this account"
      });
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err); // ✅ important for Render logs

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message
    });
  }
};

// REGISTER (minimal improvements only)
const register = async (req, res) => {
  const { name, password, email } = req.body;

  if (!name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide name, email, and password"
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "User already exists!"
      });
    }

    if (password.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: { password: "Password must be at least 6 characters long." }
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
            "Password must include at least one uppercase letter, one number, and one special character."
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      authProvider: "local" // keep your logic
    });

    await newUser.save();

    res.status(StatusCodes.CREATED).json({
      message: "User registered"
    });

  } catch (e) {
    console.error("REGISTER ERROR:", e); // ✅ important

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: e.message
    });
  }
};

module.exports = { login, register };
