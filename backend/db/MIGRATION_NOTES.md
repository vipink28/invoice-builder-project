# Converting to MongoDB — What Changed & What You Need To Do

## 1. Install dependencies

```bash
npm install mongoose
npm uninstall fs   # not a real package, just remove any leftover references
```

## 2. Add your connection string

In `backend/.env`:

```
MONGODB_URI=mongodb://localhost:27017/invoice-generator
```

(Use a local MongoDB install, or a free MongoDB Atlas cluster URI, e.g.
`mongodb+srv://user:pass@cluster.mongodb.net/invoice-generator`)

## 3. Connect on server startup

In `server.js`, before `app.listen(...)`:

```js
const connectDB = require("./db/connection");

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Backend running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
```

(Remove the old plain `app.listen(...)` call so you don't start the server before the DB is connected.)

## 4. The most important change: everything is now `async`

The JSON-file version was synchronous — every function returned its result
immediately. MongoDB calls happen over the network, so every function in
`database.js` is now `async` and returns a `Promise`. **Every call site in
your routes needs `await` in front of it now.**

Example — before:

```js
const user = db.findUserByEmail(email);
```

After:

```js
const user = await db.findUserByEmail(email);
```

Your route handlers were likely already written as regular (non-async)
functions since the old version didn't need `await`. You'll need to mark
each route handler `async` too:

```js
// before
router.post("/login", (req, res) => { ... });

// after
router.post("/login", async (req, res) => { ... });
```

## 5. IDs are now MongoDB ObjectIds, not custom numbers

Previously your app probably generated its own incrementing numeric IDs.
MongoDB assigns each document an `_id` (a 24-character hex string).
Mongoose adds a convenient `.id` virtual that returns this as a string, so
code like `user.id` or `invoice.id` should keep working without changes.

One thing to double check: anywhere you compare an invoice's `userId` to
the logged-in user's id (e.g. to make sure a user can only see their own
invoices), make sure both sides are strings when comparing directly:

````js
if (invoice.userId.toString() !== req.user.id) { ... }
```//
(`getInvoicesByUser` and the JWT-authenticated ownership checks in your
routes are the two places this usually matters.)

## 6. Password hashing, JWT, route logic — unchanged

Nothing about how you hash passwords with bcrypt or sign/verify JWTs needs
to change. Only the data-access layer changed.

## Files in this conversion

- `db/connection.js` — opens the MongoDB connection (call once at startup)
- `models/User.js` — Mongoose schema for users
- `models/Invoice.js` — Mongoose schema for invoices (with embedded line items)
- `db/database.js` — same function names as your original JSON version, now async and backed by MongoDB
````
