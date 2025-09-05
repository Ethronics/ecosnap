const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

const corsOptions = {
    origin: "*",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "30kb" }));
// app.use(cookieParser());

app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "Backend is running",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/auth", require("./Auth/Auth"));
app.use("/api/users", require("./routes/user.routes.js"));
app.use("/api/domain", require("./routes/domain.routes.js"));
app.use("/api/config", require("./routes/config.routes.js"));
app.use("/api/companies", require("./routes/company.route.js"));
app.use("/api/plans", require("./routes/plan.routes.js"));
app.use("/api/payments", require("./routes/payment.route.js"));

app.use("/api/predict", require("./routes/predict.routes.js"));

app.use("/api/alerts", require("./routes/alert.routes.js"));
 

const connectDB = require("./config/db");
connectDB();

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));