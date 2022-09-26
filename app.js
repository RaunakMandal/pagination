const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8000;

app.listen(port, () => {
  console.log(`App is running at port: ${port}`);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/pagination", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const demoSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
const Demo = mongoose.model("Demo", demoSchema);

app.get("/", (req, res) => {
  return res.send("Hello World!");
});
app.get("/create", async (req, res) => {
  const demo = new Demo({
    name: "Test",
    age: 20,
  });
  await demo.save().then((result) => {
    return res.send(result);
  });
});

app.get("/get", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const data1 = await Demo.find();
  const data2 = await Demo.find()
    .limit(limit)
    .skip(limit * (page - 1));
  return res.json({
    total: data1.length,
    page: page,
    limit: limit,
    paginated_data: data2,
    data: data1,
  });
});
