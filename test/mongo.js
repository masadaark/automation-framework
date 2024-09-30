const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
let client
async function createDatabase() {
    try {
        client = await MongoClient.connect(url);
        console.log("DB created");
        const dbo = await client.db("mydb")
        // try {
        //     const resp = await dbo.createCollection("test")
        //     console.log("Coll Created")
        // } catch (err) {
        //     console.error("Coll Error",err)
        // }
        // let myObj = { name: "msd" }
        // await dbo.collection("test").insertOne(myObj).catch((err)=>{
        //     console.error(err)
        // })
        return dbo
    } catch (err) {
        console.error("Conn Error", err);
    }
}

const query = async () => {
    const dbo = await createDatabase();
    try {
        const r = await dbo.collection("test").findOne({})
        console.log(r.name)
    } catch (err) {
        console.error(err)
    } finally {
        client.close()
    }
}

query()