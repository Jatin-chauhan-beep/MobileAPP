let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header(
"Access-Control-Allow-Methods",
"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
);
res.header(
"Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept"
);
next();
});
const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Listening on port ${port}!`));

const { Client }=require("pg"); 
const client = new Client({
user: "postgres",
password: "MobolesApp@123", 
database: "postgres",
port: 5432,
host: "db.lxsnrphtzfhashmjktfo.supabase.co",
ssl: { rejectUnauthorized: false },
}); 
client.connect(function (res, error) {
console.log("Connected!!!");
});

app.get("/svr/mobiles", (req, res) => {
    let brand = req.query.brand;
    let ram = req.query.ram;
    let rom = req.query.rom;
    let os = req.query.os;
    let sql = "SELECT * FROM mobiles";
    let params = [];
  
    if (brand) {
      let brandArr = brand.split(",");
      sql += " WHERE brand IN ($1)";
      params.push(brandArr);
    }
  
    if (ram) {
      let ramArr = ram.split(",");
      if (params.length === 0) {
        sql += " WHERE ram IN ($1)";
      } else {
        sql += " AND ram IN ($2)";
      }
      params.push(ramArr);
    }
  
    if (rom) {
      let romArr = rom.split(",");
      if (params.length === 0) {
        sql += " WHERE rom IN ($1)";
      } else if (params.length === 1) { 
        sql += " AND rom IN ($2)";
      }
       else {
        sql += " AND rom IN ($3)";
      }
      params.push(romArr);
    }
  
    if (os) {
      let osArr = os.split(",");
      if (params.length === 0) {
        sql += " WHERE os IN ($1)";
      }else if (params.length === 1) { 
        sql += " AND os IN ($2)";
      }
      else if (params.length === 2) { 
        sql += " AND os IN ($3)";
      } 
      else {
        sql += " AND os IN ($4)";
      }
      params.push(osArr);
    }
  
    client.query(sql, params, (err, result) => {
      if (err) res.status(404).send(err);
      else {
        res.send(result.rows);
      }
    });
  });
  
app.get("/svr/mobiles/ram/:ram",(req,res)=>{
    let ram=req.params.ram;
    let sql="SELECT * FROM mobiles WHERE ram=$1";
    client.query(sql,[ram],(err,result)=>{
        if(err) res.status(404).send(err);
        else {
            res.send(result.rows);
        }
    });
});

app.get("/svr/mobiles/rom/:rom",(req,res)=>{
    let rom=req.params.rom;
    let sql="SELECT * FROM mobiles WHERE rom=$1";
    client.query(sql,[rom],(err,result)=>{
        if(err) res.status(404).send(err);
        else {
            res.send(result.rows);
        }
    });
});

app.get("/svr/mobiles/os/:os",(req,res)=>{
    let os=req.params.os;
    let sql="SELECT * FROM mobiles WHERE os=$1";
    client.query(sql,[os],(err,result)=>{
        if(err) res.status(404).send(err);
        else {
            res.send(result.rows);
        }
    });
});

app.get("/svr/mobiles/brand/:brand",(req,res)=>{
    let brand=req.params.brand;
    let sql="SELECT * FROM mobiles WHERE brand=$1";
    client.query(sql,[brand],(err,result)=>{
        if(err) res.status(404).send(err);
        else {
            res.send(result.rows);
        }
    });
});

app.post("/svr/mobiles",(req,res)=>{
    let body=Object.values(req.body);
    let sql=`INSERT INTO mobiles(name, price, brand, ram, rom, os) VALUES ($1,$2,$3,$4,$5,$6)`;
    client.query(sql,body,(err,result)=>{
        if(err) res.status(404).send(err);
        else res.send("insertion successful");
    });
});

app.put("/svr/mobiles/:name",(req,res)=>{
    let body=req.body;
    let name=req.params.name;
    let sql="UPDATE mobiles SET price = $1, brand = $2, ram = $3, rom=$4, os= $5  WHERE name =$6";
    client.query(sql,[body.price,body.brand,body.ram,body.rom,body.os,name],(err)=>{
        if(err) res.status(404).send(err);
        else res.send(body);
    });
});

app.delete("/svr/mobiles/:name",(req,res)=>{
    let name=req.params.name;
    let sql="DELETE FROM mobiles WHERE name=$1";
    client.query(sql,[name],(err)=>{
        if(err) res.status(404).send(err);
        else res.send("deleted");
    });
});