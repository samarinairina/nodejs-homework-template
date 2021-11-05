const User = require("../model/userModel");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (options) => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateSubscription = async (userId, body) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { ...body },
    { new: true }
  );
  return result;
};

const updateAvatar = async (userId, avatar) => {
  return await User.updateOne({ _id: userId }, { avatar });
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
  updateSubscription,
  updateAvatar,
};