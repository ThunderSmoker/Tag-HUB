import { Schema, model, models } from 'mongoose';

const MyUserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
    match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"]
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    
  },
  image: {
    type: String,
    default:"https://stickerly.pstatic.net/sticker_pack/Lj8OAn7LfLDvFNbKpISg/H8SSLG/35/2db8ef3f-5022-466c-a915-c225d09fd772.png"
  }
});

const MyUser = models.MyUser || model("MyUser", MyUserSchema);

export default MyUser;