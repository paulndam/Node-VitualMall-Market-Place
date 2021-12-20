const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./server/express");

dotenv.config({ path: `./.env` });

const PORT = process.env.PORT || 8080;

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

const server = app.listen(PORT, () => {
  console.log(`APP  Running on Port ----------- ${PORT} --------- `);
});

// mongoose.Promise = global.Promise;

// Database Connection URL
mongoose
  // .connect(process.env.DATABASE_LOCAL)
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    //console.log(connect.connections);
    console.log(`Connection with DataBase successfull  🦾 🤠`);
  });

process.on("unhandledRejection", (error) => {
  console.log(`---- Unhandled Rejection 😢 😢  Shutting down----`);
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});
