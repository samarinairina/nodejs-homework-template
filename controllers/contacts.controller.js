const Contacts = require("../repository/contacts.repository");
const { CustomError } = require("../helpers/customError");

const getAllContacts = async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  const data = await Contacts.listContacts(userId, req.query);
  res.json({ status: "success", code: 200, data: { ...data } });
};

const getContactById = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await Contacts.getContactById(req.params.contactId, userId);
  if (contact) {
    console.log(contact);
    console.log(contact.id);
    return res
      .status(200)
      .json({ status: "success", code: 200, data: { contact } });
  }

  throw new CustomError(404, "Not Found");
};

const addContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await Contacts.addContact({ ...req.body, owner: userId });
  res.status(201).json({ status: "success", code: 201, data: { contact } });
};

const deleteContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await Contacts.removeContact(req.params.contactId, userId);
  if (contact) {
    return res
      .status(200)
      .json({ status: "success", code: 200, data: { contact } });
  }
  throw new CustomError(404, "Not Found");
};

const changeContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await Contacts.updateContact(
    req.params.contactId,
    req.body,
    userId
  );
  if (contact) {
    return res
      .status(200)
      .json({ status: "success", code: 200, data: { contact } });
  }
  throw new CustomError(404, "Not Found");
};

const updateContact = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await Contacts.updateContact(
    req.params.contactId,
    req.body,
    userId
  );
  if (contact) {
    return res
      .status(200)
      .json({ status: "success", code: 200, data: { contact } });
  }
  throw new CustomError(404, "Not Found");
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  changeContact,
  updateContact,
  deleteContact,
};