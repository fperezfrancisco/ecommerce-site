const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());

const jwt = require("jsonwebtoken");

const JWT_SECRET = "hvasdfakjh123421534jhjkj234kj24k";

const mongoUrl =
  "mongodb+srv://fperezfrancisco4:trilogy97@cluster0.pdmuxdz.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((e) => console.log(e));

app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

app.post("/post", (req, res) => {});

app.listen(5010, () => {
  console.log("Server started on port 5010");
});

require("./userDetails");

const user = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const oldUser = await user.findOne({ email });
    console.log(oldUser);
    if (oldUser) {
      return res.send({ error: "User exists" });
    }
    await user.create({ username, email, password });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "Error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const activeUser = await user.findOne({ email });

  if (!activeUser) {
    return res.send({ status: "error", error: "User Not Found" });
  }

  if (password === activeUser.password) {
    const token = jwt.sign({ email: activeUser.email }, JWT_SECRET);
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }

  res.json({ status: "error", error: "Password incorrect." });
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const currUser = jwt.verify(token, JWT_SECRET);
    const useremail = currUser.email;
    user
      .findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((err) => res.send({ status: "error", data: err }));
  } catch (error) {}
});
