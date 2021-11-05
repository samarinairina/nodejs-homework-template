const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../config/db");
const app = require("../app");
const Contact = require("../model/contactModel");
const User = require("../model/userModel");
const { newContact, newUserforRouteContact } = require("./data/data");

describe("Test route contacts", () => {
  let user, token;
  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUserforRouteContact.email });
    user = await User.create(newUserforRouteContact);
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    const issueToken = (payload, secret) => jwt.sign(payload, secret);
    token = issueToken({ id: user._id }, SECRET_KEY);
    User.updateOne({ _id: user._id }, { token });
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUserforRouteContact.email });
    await mongo.disconnect();
  });

  beforeEach(async () => {
    await Contact.deleteMany;
  });

  describe("Get request", () => {
    it("should return 200 get all contacts", async () => {
      const response = await request(app)
        .get("api/contacts/")
        .set("Authorization", `Bearer ${token}`);
      console.log("response.status", response.status);
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();
      expect(response.body.data.contacts).tobeInstanceOf(Array);
    });

    it("should return 200 get by ID contacts", () => {});
    it("should return 404 if contacts not found", () => {});
  });
});