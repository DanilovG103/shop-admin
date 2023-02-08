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
var import_core7 = require("@keystone-6/core");

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
  initFirstItem: void 0
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// schema.ts
var import_core6 = require("@keystone-6/core");
var import_access6 = require("@keystone-6/core/access");
var import_fields6 = require("@keystone-6/core/fields");

// src/lists/basket.ts
var import_schema = require("@graphql-ts/schema");
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var basketList = (0, import_core.list)({
  access: import_access.allowAll,
  fields: {
    goods: (0, import_fields.relationship)({ ref: "Good", many: true }),
    user: (0, import_fields.relationship)({ ref: "User", many: false }),
    sum: (0, import_fields.virtual)({
      field: import_schema.graphql.field({
        type: import_schema.graphql.Int,
        async resolve(item, args, ctx) {
          const data = await ctx.query.Basket.findMany({
            where: {
              user: {
                id: {
                  equals: item.userId
                }
              }
            },
            query: "goods { price }"
          });
          const resolved = data[0] ? data[0].goods.map((el) => el.price) : [];
          return resolved.reduce((acc, curr) => acc + curr, 0);
        }
      })
    })
  }
});

// src/lists/good.ts
var import_core2 = require("@keystone-6/core");
var import_access2 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var goodList = (0, import_core2.list)({
  access: import_access2.allowAll,
  fields: {
    title: (0, import_fields2.text)({ validation: { isRequired: true } }),
    description: (0, import_fields2.text)({
      validation: { isRequired: true },
      ui: { displayMode: "textarea" }
    }),
    brand: (0, import_fields2.relationship)({ ref: "Brand" }),
    category: (0, import_fields2.select)({
      options: [
        { label: "\u041C\u0443\u0436\u0441\u043A\u0430\u044F", value: "MALE" /* MALE */ },
        { label: "\u0416\u0435\u043D\u0441\u043A\u0430\u044F", value: "FEMALE" /* FEMALE */ },
        { label: "\u0414\u0435\u0442\u0441\u043A\u0430\u044F", value: "KIDS" /* KIDS */ }
      ],
      type: "enum"
    }),
    price: (0, import_fields2.integer)({ validation: { isRequired: true } }),
    images: (0, import_fields2.relationship)({
      ref: "Image",
      many: true
    }),
    createdAt: (0, import_fields2.timestamp)({ defaultValue: { kind: "now" } })
  }
});

// src/lists/user.ts
var import_core3 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");
var import_fields3 = require("@keystone-6/core/fields");
var userList = (0, import_core3.list)({
  access: import_access3.allowAll,
  fields: {
    name: (0, import_fields3.text)({ validation: { isRequired: true } }),
    email: (0, import_fields3.text)({
      validation: { isRequired: true },
      isIndexed: "unique"
    }),
    password: (0, import_fields3.password)({ validation: { isRequired: true } }),
    createdAt: (0, import_fields3.timestamp)({
      defaultValue: { kind: "now" }
    })
  },
  hooks: {
    afterOperation({ operation, item, context }) {
      if (operation === "create") {
        context.db.Basket.createOne({
          data: {
            goods: { create: [] },
            user: { connect: { id: item.id } }
          }
        });
      }
    }
  }
});

// src/lists/brand.ts
var import_core4 = require("@keystone-6/core");
var import_access4 = require("@keystone-6/core/access");
var import_fields4 = require("@keystone-6/core/fields");
var brandList = (0, import_core4.list)({
  access: import_access4.allowAll,
  fields: {
    title: (0, import_fields4.text)({ validation: { isRequired: true } })
  }
});

// src/lists/requests.ts
var import_core5 = require("@keystone-6/core");
var import_access5 = require("@keystone-6/core/access");
var import_fields5 = require("@keystone-6/core/fields");
var requestsList = (0, import_core5.list)({
  access: import_access5.allowAll,
  fields: {
    data: (0, import_fields5.relationship)({
      ref: "Basket",
      many: false
    }),
    status: (0, import_fields5.select)({
      options: [
        { label: "\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435", value: "PENDING" /* PENDING */ },
        { label: "\u041F\u0440\u0438\u043D\u044F\u0442", value: "FULFILLED" /* FULFILLED */ },
        { label: "\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D", value: "REJECTED" /* REJECTED */ }
      ],
      type: "enum"
    }),
    rejectReason: (0, import_fields5.text)()
  }
});

// schema.ts
var lists = {
  User: userList,
  Good: goodList,
  Basket: basketList,
  Brand: brandList,
  Request: requestsList,
  Image: (0, import_core6.list)({
    access: import_access6.allowAll,
    fields: {
      image: (0, import_fields6.image)({ storage: "images" })
    }
  })
};

// storage.ts
var storage = {
  images: {
    kind: "local",
    type: "image",
    generateUrl: (path) => `http://localhost:8000/images${path}`,
    serverRoute: {
      path: "/images"
    },
    storagePath: "public/images"
  }
};

// keystone.ts
var onConnect = async (ctx) => {
  const user = await ctx.db.User.findOne({
    where: { email: process.env.ADMIN_EMAIL }
  });
  if (user)
    return;
  await ctx.db.User.createOne({
    data: {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    }
  });
};
var keystone_default = withAuth(
  (0, import_core7.config)({
    db: {
      provider: "sqlite",
      url: "file:./keystone.db",
      useMigrations: true,
      onConnect
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
