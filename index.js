import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors"

const app = express();
const port = 4000;

const corsOptions = {
    origin: "https://savoritefrontend.onrender.com/",
    credentials: true,
  }
  
  app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.enable("trust proxy");

const db = new pg.Client({
    user: "postgresql",
    host: "dpg-cnk4gaol6cac73a2c530-a.singapore-postgres.render.com",
    database: "tracker_fuo4",
    password: "65eC1V1NjylWAPNyG6aLCbANfl3s5tF2",
    port: "5432",
    connectionString: "postgres://postgresql:65eC1V1NjylWAPNyG6aLCbANfl3s5tF2@dpg-cnk4gaol6cac73a2c530-a.singapore-postgres.render.com/tracker_fuo4?ssl=true",// needed for remote db connection
  });

db.connect();

app.get("/fetch", async (req,res)=>{
    const result = await db.query(
        `SELECT *
        FROM savorite
        ORDER BY id DESC`
    )
    res.send(result.rows);
});
app.post("/add", (req,res)=>{
    try {
        db.query(
            `INSERT INTO savorite (title, status)
            VALUES($1,$2)`,[req.body.title, req.body.status]
        )
        res.send("OK")    
    } catch (error) {
        res.send(error.message)
    }
    
});
app.put("/toggle", (req,res)=>{
    try {
    db.query(`UPDATE savorite SET status = $1 WHERE id = $2`,
      [req.body.status, req.body.id]);
      res.send("OK")
    } catch (error) {
        res.send(error.message)
    }
    
});

app.delete("/delete", (req,res)=>{
    try {
    db.query(
        `DELETE FROM savorite 
        WHERE id = $1`,
      [req.body.id]);
      res.send("OK")
    } catch (error) {
        res.send(error.message)
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });