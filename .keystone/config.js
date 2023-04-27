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
var import_core14 = require("@keystone-6/core");

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
  sessionData: "name createdAt role",
  secretField: "password"
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret,
  sameSite: "none"
});

// schema.ts
var import_core8 = require("@keystone-6/core");
var import_access5 = require("@keystone-6/core/access");
var import_fields9 = require("@keystone-6/core/fields");

// src/lists/basket.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");

// src/utils/get-user.ts
var getUserFromSession = async (ctx, query = "id", noUserValue) => {
  const ses = ctx.session;
  if (!ses) {
    return noUserValue;
  }
  const user = await ctx.query.User.findOne({
    where: {
      id: ses.itemId
    },
    query
  });
  return user;
};

// src/utils/hidden.ts
var import_fields = require("@keystone-6/core/fields");
var hiddenText = (0, import_fields.text)({
  ui: {
    createView: {
      fieldMode: "hidden"
    },
    itemView: {
      fieldMode: "read"
    }
  }
});

// src/utils/is-admin.ts
var isAdmin = ({ session: session2 }) => {
  if (!session2)
    return false;
  return session2.data.role === "ADMIN" /* ADMIN */;
};

// src/utils/admin-operations.ts
var adminOperations = {
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin
};

// src/lists/basket.ts
var basketList = (0, import_core.list)({
  access: {
    operation: {
      ...(0, import_access.allOperations)(import_access.allowAll),
      delete: isAdmin
    }
  },
  fields: {
    goods: (0, import_fields2.relationship)({ ref: "Good", many: true }),
    user: (0, import_fields2.relationship)({ ref: "User", many: false }),
    sum: (0, import_fields2.virtual)({
      field: import_core.graphql.field({
        type: import_core.graphql.Int,
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
var import_fields3 = require("@keystone-6/core/fields");
var resolveVirtualFields = async (ctx, item, field, whereId) => {
  const data = await ctx.query[field].findOne({
    where: {
      id: whereId
    },
    query: "goods { id }"
  });
  if (data === null) {
    return false;
  }
  const ids = data.goods.map((good) => good.id);
  return ids.includes(item.id);
};
var goodList = (0, import_core2.list)({
  access: {
    operation: {
      ...adminOperations,
      query: () => true
    }
  },
  fields: {
    title: (0, import_fields3.text)({ validation: { isRequired: true } }),
    description: (0, import_fields3.text)({
      validation: { isRequired: true },
      ui: { displayMode: "textarea" }
    }),
    brand: (0, import_fields3.relationship)({ ref: "Brand" }),
    audienceCategory: (0, import_fields3.select)({
      options: [
        { label: "\u041C\u0443\u0436\u0441\u043A\u0430\u044F", value: "MALE" /* MALE */ },
        { label: "\u0416\u0435\u043D\u0441\u043A\u0430\u044F", value: "FEMALE" /* FEMALE */ },
        { label: "\u0414\u0435\u0442\u0441\u043A\u0430\u044F", value: "KIDS" /* KIDS */ }
      ],
      type: "enum"
    }),
    category: (0, import_fields3.relationship)({ ref: "Category", many: false }),
    price: (0, import_fields3.integer)({ validation: { isRequired: true } }),
    images: (0, import_fields3.relationship)({
      ref: "Image",
      many: true
    }),
    isInBasket: (0, import_fields3.virtual)({
      field: import_core2.graphql.field({
        type: import_core2.graphql.Boolean,
        async resolve(item, _, ctx) {
          const user = await getUserFromSession(ctx, "basketId", false);
          if (!user) {
            return false;
          }
          return await resolveVirtualFields(ctx, item, "Basket", user.basketId);
        }
      })
    }),
    isInFavorite: (0, import_fields3.virtual)({
      field: import_core2.graphql.field({
        type: import_core2.graphql.Boolean,
        async resolve(item, _, ctx) {
          const user = await getUserFromSession(ctx, "favoritesId", false);
          if (!user) {
            return false;
          }
          return await resolveVirtualFields(
            ctx,
            item,
            "Favorite",
            user.favoritesId
          );
        }
      })
    }),
    createdAt: (0, import_fields3.timestamp)({ defaultValue: { kind: "now" } })
  }
});

// src/lists/user.ts
var import_core3 = require("@keystone-6/core");
var import_access2 = require("@keystone-6/core/access");
var import_fields4 = require("@keystone-6/core/fields");
var afterCreateInput = (item) => ({
  goods: { create: [] },
  user: { connect: { id: item.id } }
});
var userList = (0, import_core3.list)({
  access: import_access2.allowAll,
  fields: {
    name: (0, import_fields4.text)({ validation: { isRequired: true } }),
    email: (0, import_fields4.text)({
      validation: { isRequired: true },
      isIndexed: "unique"
    }),
    password: (0, import_fields4.password)({ validation: { isRequired: true } }),
    basketId: hiddenText,
    favoritesId: hiddenText,
    role: (0, import_fields4.select)({
      options: [
        { label: "\u0410\u0434\u043C\u0438\u043D", value: "ADMIN" /* ADMIN */ },
        { label: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C", value: "USER" /* USER */ }
      ],
      type: "enum",
      defaultValue: "USER" /* USER */,
      access: {
        read: () => true,
        update: isAdmin
      }
    }),
    createdAt: (0, import_fields4.timestamp)({
      defaultValue: { kind: "now" }
    })
  },
  hooks: {
    async afterOperation({ operation, item, context, originalItem }) {
      if (operation === "create") {
        const basket = await context.db.Basket.createOne({
          data: afterCreateInput(item)
        });
        const favorites = await context.db.Favorite.createOne({
          data: afterCreateInput(item)
        });
        await context.db.User.updateOne({
          where: {
            id: item.id.toString()
          },
          data: {
            basketId: basket.id,
            favoritesId: favorites.id
          }
        });
      }
      if (operation === "delete") {
        await context.db.Basket.deleteOne({
          where: {
            id: originalItem.basketId
          }
        });
        await context.db.Favorite.deleteOne({
          where: {
            id: originalItem.favoritesId ?? ""
          }
        });
      }
    }
  }
});

// src/lists/brand.ts
var import_core4 = require("@keystone-6/core");
var import_fields5 = require("@keystone-6/core/fields");
var brandList = (0, import_core4.list)({
  access: {
    operation: {
      ...adminOperations,
      query: () => true
    }
  },
  fields: {
    title: (0, import_fields5.text)({ validation: { isRequired: true } })
  }
});

// src/lists/requests.ts
var import_core5 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");
var import_fields6 = require("@keystone-6/core/fields");
var requestsList = (0, import_core5.list)({
  access: {
    operation: {
      ...(0, import_access3.allOperations)(import_access3.allowAll),
      delete: isAdmin
    }
  },
  fields: {
    goods: (0, import_fields6.relationship)({ ref: "Good", many: true }),
    status: (0, import_fields6.select)({
      options: [
        { label: "\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435", value: "PENDING" /* PENDING */ },
        { label: "\u041F\u0440\u0438\u043D\u044F\u0442", value: "FULFILLED" /* FULFILLED */ },
        { label: "\u0414\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D", value: "DELIVERED" /* DELIVERED */ },
        { label: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D", value: "CANCELLED" /* CANCELLED */ },
        { label: "\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D", value: "REJECTED" /* REJECTED */ }
      ],
      type: "enum",
      defaultValue: "PENDING" /* PENDING */
    }),
    user: (0, import_fields6.relationship)({ ref: "User", many: false }),
    recipientName: (0, import_fields6.text)(),
    recipientEmail: (0, import_fields6.text)(),
    phone: (0, import_fields6.text)({ validation: { isRequired: true } }),
    sum: (0, import_fields6.integer)({ validation: { isRequired: true } }),
    address: (0, import_fields6.text)({ validation: { isRequired: true } }),
    paymentType: (0, import_fields6.select)({
      options: [
        {
          label: "\u041F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438",
          value: "RECEIVING" /* RECEIVING */
        },
        {
          label: "\u041A\u0430\u0440\u0442\u043E\u0439 \u043E\u043D\u043B\u0430\u0439\u043D",
          value: "ONLINE" /* ONLINE */
        }
      ],
      type: "enum"
    }),
    rejectReason: (0, import_fields6.text)(),
    createdAt: (0, import_fields6.timestamp)({ defaultValue: { kind: "now" } })
  },
  hooks: {
    async afterOperation({ operation, context, inputData }) {
      if (operation === "create") {
        const user = await context.query.User.findOne({
          where: {
            id: inputData.user.connect.id
          },
          query: `basketId`
        });
        await context.query.Basket.updateOne({
          where: {
            id: user.basketId
          },
          data: {
            goods: {
              disconnect: inputData.goods.connect
            }
          }
        });
      }
    }
  }
});

// src/lists/favorites.ts
var import_core6 = require("@keystone-6/core");
var import_access4 = require("@keystone-6/core/access");
var import_fields7 = require("@keystone-6/core/fields");
var favoritesList = (0, import_core6.list)({
  access: {
    operation: {
      ...(0, import_access4.allOperations)(import_access4.allowAll),
      delete: isAdmin
    }
  },
  fields: {
    goods: (0, import_fields7.relationship)({ ref: "Good", many: true }),
    user: (0, import_fields7.relationship)({ ref: "User", many: false })
  }
});

// src/lists/category.ts
var import_core7 = require("@keystone-6/core");
var import_fields8 = require("@keystone-6/core/fields");
var categoryList = (0, import_core7.list)({
  access: {
    operation: {
      ...adminOperations,
      query: () => true
    }
  },
  fields: {
    title: (0, import_fields8.text)({ validation: { isRequired: true } })
  }
});

// schema.ts
var lists = {
  User: userList,
  Good: goodList,
  Basket: basketList,
  Brand: brandList,
  Request: requestsList,
  Favorite: favoritesList,
  Category: categoryList,
  Image: (0, import_core8.list)({
    access: import_access5.allowAll,
    fields: {
      image: (0, import_fields9.image)({ storage: "images" })
    }
  })
};

// src/ext/registration.ts
var import_core9 = require("@keystone-6/core");
var registration = (base) => {
  return import_core9.graphql.field({
    type: base.union("UserAuthenticationWithPasswordResult"),
    args: {
      name: import_core9.graphql.arg({ type: import_core9.graphql.nonNull(import_core9.graphql.String) }),
      email: import_core9.graphql.arg({ type: import_core9.graphql.nonNull(import_core9.graphql.String) }),
      password: import_core9.graphql.arg({ type: import_core9.graphql.nonNull(import_core9.graphql.String) })
    },
    async resolve(_, { email, password: password2, name }, ctx) {
      const user = await ctx.query.User.findOne({
        where: {
          email
        }
      });
      if (user) {
        throw new Error("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0441 \u0442\u0430\u043A\u0438\u043C email \u0443\u0436\u0435 \u0435\u0441\u0442\u044C");
      }
      await ctx.db.User.createOne({
        data: {
          email,
          password: password2,
          name,
          role: "USER" /* USER */
        }
      });
      const result = await ctx.graphql.run({
        query: `
        mutation Auth($email: String!, $password: String!) {
          authenticateUserWithPassword(email: $email, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
              sessionToken
              item {
                id
                name
                email
                basketId
                favoritesId
              }
            }
            ... on UserAuthenticationWithPasswordFailure {
              message
            }
          }
        }`,
        variables: {
          email,
          password: password2
        }
      });
      return result.authenticateUserWithPassword;
    }
  });
};

// src/ext/my-favorite.ts
var import_core10 = require("@keystone-6/core");
var updateMyFavorite = (base) => {
  return import_core10.graphql.field({
    type: base.object("Good"),
    args: {
      id: import_core10.graphql.arg({ type: import_core10.graphql.nonNull(import_core10.graphql.ID) })
    },
    async resolve(_, { id }, ctx) {
      const user = await getUserFromSession(ctx, "favoritesId", null);
      if (!user) {
        return null;
      }
      const { isInFavorite } = await ctx.query.Good.findOne({
        where: {
          id
        },
        query: `isInFavorite`
      });
      const option = isInFavorite ? "disconnect" : "connect";
      await ctx.query.Favorite.updateOne({
        where: {
          id: user.favoritesId
        },
        data: {
          goods: {
            [option]: [{ id }]
          }
        }
      });
      return {
        id,
        isInFavorite: !isInFavorite
      };
    }
  });
};

// src/ext/my-basket.ts
var import_core11 = require("@keystone-6/core");
var updateMyBasket = (base) => {
  return import_core11.graphql.field({
    type: base.object("Good"),
    args: {
      id: import_core11.graphql.arg({ type: import_core11.graphql.nonNull(import_core11.graphql.ID) })
    },
    async resolve(_, { id }, ctx) {
      const user = await getUserFromSession(ctx, "basketId", null);
      if (!user) {
        return null;
      }
      const { isInBasket } = await ctx.query.Good.findOne({
        where: {
          id
        },
        query: `isInBasket`
      });
      const option = isInBasket ? "disconnect" : "connect";
      await ctx.query.Basket.updateOne({
        where: {
          id: user.basketId
        },
        data: {
          goods: {
            [option]: [{ id }]
          }
        }
      });
      return {
        id,
        isInBasket: !isInBasket
      };
    }
  });
};

// src/ext/addresses.ts
var import_core12 = require("@keystone-6/core");
var type = import_core12.graphql.object()({
  name: "Address",
  fields: {
    value: import_core12.graphql.field({
      type: import_core12.graphql.list(import_core12.graphql.String),
      resolve(value) {
        return value;
      }
    })
  }
});
var addresses = import_core12.graphql.field({
  type,
  args: {
    query: import_core12.graphql.arg({ type: import_core12.graphql.String })
  },
  async resolve(_, { query }) {
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + process.env.DADATA_API_KEY
      },
      body: JSON.stringify({ query })
    };
    const response = await fetch(url, options);
    const data = await response.json();
    const value = data.suggestions.map((item) => item.value);
    return value;
  }
});

// src/ext/my-requests.ts
var import_core13 = require("@keystone-6/core");
var getMyRequests = (base) => {
  const field = import_core13.graphql.field({
    type: import_core13.graphql.list(base.object("Request")),
    args: {
      take: import_core13.graphql.arg({ type: import_core13.graphql.nonNull(import_core13.graphql.Int) }),
      skip: import_core13.graphql.arg({ type: import_core13.graphql.nonNull(import_core13.graphql.Int) })
    },
    async resolve(_, { take, skip }, ctx) {
      const user = await getUserFromSession(ctx);
      if (!user)
        return null;
      const data = await ctx.query.Request.findMany({
        take,
        skip,
        where: {
          user: {
            id: {
              equals: user.id
            }
          }
        },
        query: `
          id
          status
          createdAt
          sum
        `
      });
      return data.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }));
    }
  });
  return field;
};

// storage.ts
var storage = {
  images: {
    kind: "local",
    type: "image",
    generateUrl: (path) => `/images${path}`,
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
      password: process.env.ADMIN_PASSWORD,
      role: "ADMIN" /* ADMIN */
    }
  });
};
var keystone_default = withAuth(
  (0, import_core14.config)({
    db: {
      provider: "sqlite",
      url: "file:./keystone.db",
      useMigrations: true,
      onConnect
    },
    ui: {
      isAccessAllowed: isAdmin
    },
    lists,
    session,
    storage,
    server: {
      port: 8e3,
      cors: true,
      extendExpressApp: (app) => {
        app.set("trust proxy", true);
      }
    },
    extendGraphqlSchema: import_core14.graphql.extend((base) => {
      return {
        query: {
          addresses,
          myRequests: getMyRequests(base)
        },
        mutation: {
          registration: registration(base),
          updateMyFavorite: updateMyFavorite(base),
          updateMyBasket: updateMyBasket(base)
        }
      };
    })
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
