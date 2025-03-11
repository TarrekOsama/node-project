const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("express-async-errors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const limiter = require("./middlewares/rate-limiter");

dotenv.config();

const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");
const APIError = require("./util/APIError");
const errorHandler = require("./middlewares/errorhandler");
const auth = require("./middlewares/auth"); // Add this

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(limiter);

// Routes
const V1_PREFIX = "/api/v1";
app.use(`${V1_PREFIX}/users`, usersRoutes); // Public routes (e.g., login, register)
app.use(`${V1_PREFIX}/posts`, auth, postsRoutes); // Protect posts routes with JWT

// Not Found Handler
app.use((req, res, next) => {
    next(new APIError(`${req.method} ${req.path} is not found`, 404));
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
    }
};

startServer();