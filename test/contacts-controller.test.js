const { expectCt } = require("helmet");
const { updateContact } = require("../controllers/contacts.controller");
const Contact = require("../model/contactModel");
const Contacts = require("../repository/contacts.repository");

jest.mock("../repository/contacts.repository.js");

describe("Unit test controller updateContact", function () {
  const req = { params: { id: 3 }, body: {}, user: { _id: 1 } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn(); //()=>{}

  it("Contact exist ", async () => {
    const contact = { id: 3, name: "Simon", age: 4 };
    Contacts.updateContact = jest.fn(() => {
      return contact;
    });
    const result = await updateContact(req, res, next);
    expect(result).toBeDefined();
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("code");
    expect(result).toHaveProperty("data");
    expect;
  });

  it("Contact not exist ", () => {});
});