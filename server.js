const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// get driver connection
const connectDB = require("./db/conn");
connectDB();
// const dbo = require("./db/conn");

// router setting
app.use('/', require("./routes/index"));
app.use('/api/home', require("./routes/api/home"));
app.use('/api/webtoon', require("./routes/api/webtoon"));
app.use('/api/genre', require("./routes/api/genre"));
app.use('/api/artist', require("./routes/api/artist"));
app.use('/api/platform', require("./routes/api/platform"));
app.use('/api/date', require("./routes/api/date"));


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: err});
});

// console.log(req.headers);



// app.listen(port, () => {
//   // perform a database connection when server starts
//   dbo.connectToServer(function (err) {
//     if (err) console.error(err);
 
//   });
//   console.log(`Server is running on port: ${port}`);
// });