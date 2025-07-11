const mongoose = require("mongoose");
const { Schema } = mongoose;
main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/relationDemo");
}

const userSchema = new Schema({
  username: String,
  addresses: [
    {
      location: String,
      city: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

const addUsers = async () => {
  let user1 = new User({
    username: "Sherlock Holmes",
    addresses: [
      {
        location: "221B Baker street",
        city: "London",
      },
      {
        location: "221B wall street",
        city: "New york",
      },
    ],
  });
  let result = await user1.save();
  console.log(result);
};

addUsers();