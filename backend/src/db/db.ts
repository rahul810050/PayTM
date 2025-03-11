import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;



const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minLength: 3, maxLength: 30 },
  email: { type: String, required: true },
  password: { type: String, required: true, minLength: 6 },
  firstname: { type: String, required: true, trim: true, maxLength: 50 },
  lastname: { type: String, required: true, trim: true, maxLength: 50 },
  mobile: {
    type: Number,
    validate: {
      validator: function (v: number) {
        return /^\d{10}$/.test(v.toString());
      },
      message: "Mobile number must be exactly 10 digits",
    },
  },
});


const accountSchema = new mongoose.Schema({
  userId: {type: ObjectId, ref: "users", require: true},
  balance: {type: Number, require: true, default: 0}
})

const userModel = mongoose.model("users", userSchema);
const accountModel = mongoose.model("accounts", accountSchema);

export { userModel, accountModel };