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

const orderSchema = new Schema({
  item: String,
  price: Number,
});

const Order = mongoose.model("Order", orderSchema);


const customerSchema = new Schema({
  name: String,
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

// customerSchema.pre("findOneAndDelete", async () => {
//   console.log("Pre Middleware");
// })

// customerSchema.post("findOneAndDelete", async (customer) => {
//   if(customer.orders.length) {
//     let res = await Order.deleteMany({  _id: {$in: customer.orders}});
//     console.log(res);
//   }
// })




// //Functions
// const findCustomer = async() => {
//   let result = await Customer.find({}).populate("orders");
//   console.log(result[0]);
// }
const Customer = mongoose.model("Customer", customerSchema);
const addCustomer = async() => {
    // let newCustomer = new Customer({
    //   name : "Karan Arjun"
    // });

    // let order1 = await Order.findOne({item: "Chips"})
    //  let order2 = await Order.findOne({item: "Burger"})

    //  newCustomer.orders.push(order1)
    //  newCustomer.orders.push(order2)

     

    //  let result =await newCustomer.save();
    //  console.log(result) 
     let result =await Customer.find({});
     console.log(result) 

};

//     let newOrder = new Order({
//       item : "Paneer",
//       price : 250,
//     });

//     newCustomer.orders.push(newOrder);
//     await newOrder.save();
//     await newCustomer.save();

//     console.log("Added new customer");
// }

// const delCustomer = async () => {
//   let data = await Customer.findByIdAndDelete("68480b763ff81c843684ac6f");
//   console.log(data);
// }
// const addOrder = async () => {
//   let res = await Order.insertMany([
//     {
//       item: "Samosa",
//       price: 12,
//     },
//     {
//       item: "Chips",
//       price: 15,
//     },
//     {
//       item: "Burger",
//       price: 20,
//     }
//   ]);
//   console.log(res);
// };

// addOrder();
addCustomer();
// delCustomer();