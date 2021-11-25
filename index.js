const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 7000;
const ObjectId = require("mongodb").ObjectId;

let cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fs9pd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("motorbike-shop");
        const productCollection = database.collection("products");
        const orderCollection = database.collection("orders");
        const aboutCollection = database.collection("about");
        const userCollection = database.collection("users");
        const reviewCollection = database.collection("reviews");

        // Get products api
        app.get("/products", async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // uses get
        app.get("/users", async (req, res) => {
            const cursor = userCollection.find({});
            const user = await cursor.toArray();
            res.send(user);
        });

        // Delete single product
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);

            console.log("delete id no is", result);
            res.json(result);
        });

        // Get about api
        app.get("/about", async (req, res) => {
            const cursor = aboutCollection.find({});
            const about = await cursor.toArray();
            res.send(about);
        });

        // POST products api
        app.post("/products", async (req, res) => {
            const service = req.body;
            const result = await productCollection.insertOne(service);
            res.json(result);
        });

        // user post
        app.post("/users", async (req, res) => {
            const users = req.body;
            const result = await userCollection.insertOne(users);
            res.json(result);
        });
        // Google sign er jnno
        app.put("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.json(result);
        });

        // POST review api
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        });

        // Get review api
        app.get("/reviews", async (req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        });

        // Add orders api
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        });

        // Get order api
        app.get("/orders", async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            const count = await cursor.count();
            res.send({
                count,
                orders,
            });
        });

        //UPDATE API
        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    phone: updatedUser.phone,
                    roadNo: updatedUser.serviceName,
                    flatno: updatedUser.flatno,
                    name: updatedUser.name,
                    status: updatedUser.status,
                    order: updatedUser.order,
                },
            };
            const result = await orderCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            // console.log("updating", id);
            res.json(result);
        });
        //

        // Delete api
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);

            res.json(result);
        });

        app.put("/users/admin", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            // console.log(filter);
            // const options = { upsert: true };
            const updateDoc = { $set: { role: "admin" } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        // get user is admin or not
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === "admin") {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("my first ever node ");
});
app.listen(port, () => {
    console.log("Listening from ", port);
});
