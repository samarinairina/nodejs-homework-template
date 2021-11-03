const express = require("express");
const router = express.Router();
const { HttpCode } = require("../../config/constants");

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

const guard = require("../../helpers/guard");
const role = require("../../helpers/role");
const wrapError = require("../../helpers/errorHandler");
const { Gender } = require("../../config/constants");

router.get("/", guard, wrapError(getAllContacts));

router.get(
  "/test",
  guard,
  role(Gender.MALE),
  wrapError((req, res, next) => {
    res.json({
      status: "success",
      code: HttpCode.OK,
      data: { message: "Only for man" },
    });
  })
);

router.get("/:contactId", guard, validateId, wrapError(getContactById));

router.post("/", guard, validateContact, wrapError(addContact));

router.delete("/:contactId", guard, validateId, wrapError(deleteContact));

router.put(
  "/:contactId",
  guard,
  validateId,
  validateContact,
  wrapError(changeContact)
);

router.patch(
  "/:contactId/favorite/",
  guard,
  validateId,
  validateStatusContact,
  wrapError(updateContact)
);

module.exports = router;