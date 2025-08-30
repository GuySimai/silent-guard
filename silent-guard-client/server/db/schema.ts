import { integer, pgTable, varchar,text} from "drizzle-orm/pg-core";

//USER table
export const usersTable = pgTable("users", {
  id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 255 }),
});

// IT table
export const IT_Table = pgTable("IT", {
  id: text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  ITnumber: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});


//CATEGORY table
export const categoriesTable = pgTable("categories", {
  id: text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id),
  name: varchar({ length: 255 }).notNull(),
  color: varchar("color", { length: 255 }).notNull(),
});


export const camerasTable = pgTable("cameras", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

    categoryId: text("id_category")
    .notNull()
    .references(() => categoriesTable.id, { onDelete: "cascade" }),

  userId: text("user_id").references(() => usersTable.id),

  admin: varchar("admin", { length: 255 }).notNull(),

  password: varchar("password", { length: 255 }).notNull(),

  connectionUrl: varchar("connection_url", { length: 255 }).notNull(),

  name: varchar("name", { length: 255 }).notNull(),
});