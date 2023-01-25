"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core4 = require("@keystone-6/core");

// auth.ts
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var import_crypto = require("crypto");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  sessionData: "name createdAt",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"]
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// schema.ts
var import_core3 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");
var import_fields3 = require("@keystone-6/core/fields");

// src/lists/good.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var goodList = (0, import_core.list)({
  access: import_access.allowAll,
  fields: {
    title: (0, import_fields.text)({ validation: { isRequired: true } }),
    description: (0, import_fields.text)({
      validation: { isRequired: true },
      ui: { displayMode: "textarea" }
    }),
    category: (0, import_fields.select)({
      options: [
        { label: "Male", value: "MALE" /* MALE */ },
        { label: "Female", value: "FEMALE" /* FEMALE */ },
        { label: "Kids", value: "KIDS" /* KIDS */ }
      ]
    }),
    price: (0, import_fields.integer)({ validation: { isRequired: true } }),
    promotion: (0, import_fields.checkbox)(),
    images: (0, import_fields.relationship)({
      ref: "Image",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["image"],
        inlineCreate: { fields: ["image"] },
        inlineEdit: { fields: ["image"] }
      }
    }),
    createdAt: (0, import_fields.timestamp)({ defaultValue: { kind: "now" } })
  }
});

// src/lists/user.ts
var import_core2 = require("@keystone-6/core");
var import_access2 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var userList = (0, import_core2.list)({
  access: import_access2.denyAll,
  fields: {
    name: (0, import_fields2.text)({ validation: { isRequired: true } }),
    email: (0, import_fields2.text)({
      validation: { isRequired: true },
      isIndexed: "unique"
    }),
    password: (0, import_fields2.password)({ validation: { isRequired: true } }),
    createdAt: (0, import_fields2.timestamp)({
      defaultValue: { kind: "now" }
    })
  }
});

// schema.ts
var lists = {
  User: userList,
  Good: goodList,
  Image: (0, import_core3.list)({
    access: import_access3.allowAll,
    fields: {
      image: (0, import_fields3.image)({ storage: "images" })
    }
  })
};

// storage.ts
var storage = {
  images: {
    kind: "local",
    type: "image",
    generateUrl: (path) => `${process.env.BASE_URL}/images${path}`,
    serverRoute: {
      path: "/images"
    },
    storagePath: "public/images"
  }
};

// keystone.ts
var keystone_default = withAuth(
  (0, import_core4.config)({
    db: {
      provider: "sqlite",
      url: "file:./keystone.db"
    },
    lists,
    session,
    storage,
    server: {
      port: 8e3,
      cors: true
    }
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
