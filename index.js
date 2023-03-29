const express = require("express");
const app = express();
const port = 3001;

app.use("/book", require("./routes/book_route"));

///unknown route
app.use("/*", (req, res, next) => {
  let err = new Error("Route Not Found");
  err.status = 404;
  next(err);
});

///error handling
app.use((err, req, res, next) => {
  var code = err.status || 500;
  res.status(code == 200 ? 500 : code).json({
    status: false,
    message: err.message,
    data: null,
  });
});

app.listen(port, () => console.log("Server is running at ", port));
