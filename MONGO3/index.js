const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log("Connection is successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

//index route
app.get("/chats", async (req, res) => {
  try {
    let chats = await Chat.find(); //this function is used to get all chats from DB
    res.render("index.ejs", { chats });
  } catch (err) {
    next(err);
  }
});

//new route
app.get("/chats/new", (req, res) => {
  // throw new ExpressError(404, "Page not found");
  try {
    res.render("new.ejs");
  } catch (err) {
    next(err);
  }
});

//Create route
app.post("/chats", (req, res) => {
  try {
    let { from, to, message } = req.body;
    let newChat = new Chat({
      from: from,
      to: to,
      message: message,
      created_at: new Date(),
    });
    newChat
      .save()
      .then((res) => {
        console.log("Chat was saved");
      })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

//demonstration of asyncWrap()
function asyncWrap(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(err => {
      next(err);
    })
  }
}

//NEW - show route (for middlewares chapter to handle async errors)
app.get(
  "/chats/:id",
  asyncWrap(async (req, res, next) => { //Whole function is put under an asyncWrap
      let { id } = req.params;
      let chat = await Chat.findById(id);
      if (!chat) {
        // throw new ExpressError(404, "Chat not found!"); //this syntax doesn't handle async errors proerly
        next(new ExpressError(500, "Chat not found"));
      }
      res.render("edit.ejs", { chat });
  })
);

//Edit route
app.get("/chats/:id/edit", async (req, res) => {
  try {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  } catch (err) {
    next(err);
  }
});

//Update route
app.put("/chats/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { message: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      id,
      { message: newMsg },
      { runValidators: true, new: true }
    );

    console.log(updatedChat);
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

//Delete route
app.delete("/chats/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

//Error handling middleware
app.use((err, req, res, next) => {
  try {
    let { status = 500, message = "Some error occurred" } = err;
    res.status(status).send(message);
  } catch (err) {
    next(err);
  }
});

// let chat1 = new Chat({
//     from : "neha",
//     to :  "priya",
//     message : "hello priya",
//     created_At : new Date()
// });

// chat1.save().then((res) => {
//     console.log(res);
// })

app.get("/", (req, res) => {
  res.send("Root is working");
});

const handleValidationErr = (err) => {
  console.log("This is a validation error. Please follow rules");
  console.dir(err);
  return err;
}
app.use((err, req, res, next) => {
  console.log(err.name);
  if(err.name == "ValidationError") {
    err = handleValidationErr(err);
  }
  next(err);
})
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});