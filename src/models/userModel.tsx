import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please provide a fullname"],
  },

  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  phone: {
    type: Number,
    required: [true, "Please provide a phone"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  password2: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  fastatus: {
    type: Boolean,
    default: true,
  },
  profilecomplete: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
  },

  referrals: {
    type: [
      {
        referredEmail: String,
        referredName: String,
        registrationDateTime: Date,
      },
    ],
  },

  tickets: {
    type: [
      {
        subject: String,
        message: String,
        priority: String,
        status: String,
        conversations: [
          {
            messagefromUser: String,
            messagefromAdmin: String,
            registrationDateTime: Date,
          },
        ],
        registrationDateTime: Date,
      },
    ],
  },

  totalDepositedAmount: {
  type: Number,
  },

  transactionHistory: {
    type: [
      {
        status: String,
        registrationDateTime: Date,
        amount: String,
        addressSentTo: String,
        network: String,
        typeOfTransaction: String,
        name: String,
      },
    ],
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  BTCBalance: {
    type: Number,
  },
  USDTBalance: {
    type: Number,
  },
  ETHBalance: {
    type: Number,
  },
  TRONBalance: {
    type: Number,
  },
  BNBBalance: {
    type: Number,
  },
  BCHBalance: {
    type: Number,
  },
  DOGEBalance: {
    type: Number,
  },
  BTCAddress: {
    type: String,
  },
  USDTAddress: {
    type: String,
  },
  ETHAddress: {
    type: String,
  },
  TRONAddress: {
    type: String,
  },
  BNBAddress: {
    type: String,
  },
  BCHAddress: {
    type: String,
  },
  DOGEAddress: {
    type: String,
  },

  BTCWithdrawalMessage: {
    type: String,
  },
  USDTWithdrawalMessage: {
    type: String,
  },
  ETHWithdrawalMessage: {
    type: String,
  },
  TRONWithdrawalMessage: {
    type: String,
  },
  BNBWithdrawalMessage: {
    type: String,
  },
  BCHWithdrawalMessage: {
    type: String,
  },
  DOGEWithdrawalMessage: {
    type: String,
  },

  address: {
    type: String,
  },
  residentialaddress: {
    type: String,
  },
  country: {
    type: String,
  },
  nextofkinname: {
    type: String,
  },
  nextofkinphone: {
    type: Number,
  },
  nextofkinaddress: {
    type: String,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  faToken: String,
  faTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
