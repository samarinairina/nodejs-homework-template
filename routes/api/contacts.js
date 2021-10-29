const express = require("express");
const router = express.Router();

const {
  validateContact,
  validateStatusContact,
  validateId,
} = require("./validation");

const {
  getAllContacts,
  getContactById,
  addContact,
  changeContact,
  updateContact,
  deleteContact,
} = require("../../controllers/contacts.controller");

router.get("/", getAllContacts);

router.get("/:contactId", validateId, getContactById);

router.post("/", validateContact, addContact);

router.delete("/:contactId", validateId, deleteContact);

router.put("/:contactId", validateId, validateContact, changeContact);

router.patch(
  "/:contactId/favorite/",
  validateId,
  validateStatusContact,
  updateContact
);

module.exports = router;