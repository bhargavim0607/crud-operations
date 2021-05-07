const express=require("express");

const path=require("path");
const ejs=require('ejs');
const bodyParser=require("body-parser");
const mysql=require("mysql");
//const route=require("./routes/people");
const app=express();
app.use(bodyParser.json());
//app.use("/people",route);
var mysqlconnection=mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"Pass123",
    database:"student_info",
    multipleStatements:true
});

mysqlconnection.connect((err)=>{ 
    if(!err){
        console.log("db established");
    }
    else{
        console.log("db not connected "+err.message);
    }
});
//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM students";
    let query = mysqlconnection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            users : rows
        });
    });
});

app.get('/add',(req,res)=>{
    res.render('user_add',{
        title:'CRUD Operation using NodeJS / ExpressJS / MySQL'
    });
});


app.post('/save',(req,res)=>{
    let data={rollno:req.body.rollno,Name:req.body.Name,Email:req.body.email,Branch:req.body.branch,PhoneNumber:req.body.phone};
    let sql="INSERT INTO students SET ?";
    let query=mysqlconnection.query(sql,data,(err,results)=>{
        if(err) throw err;
        res.redirect('/');
    });
});


app.get('/edit/:rollno',(req,res)=>{
    const roll=req.params.rollno;
    let sql=`Select * from students where rollno= ${roll}`;
    let query=mysqlconnection.query(sql,(err,result)=>{
        if(err)throw err;
        res.render('edit',{
            title:'Crud Operations using NodeJS / ExpressJS / MySql',
            user:result[0]
        }); 
    });
});

app.post('/update',(req,res)=>{
    
    const roll=req.body.rollno;
    let sql="update students SET rollno='"+req.body.rollno+"',Name='"+req.body.Name+"',Email='"+req.body.email+"',Branch='"+req.body.branch+"',PhoneNumber='"+req.body.phone+"' where rollno='"+roll+"'";
    let query=mysqlconnection.query(sql,(err,results)=>{
        if(err) throw err;
        res.redirect('/');
    });

});

app.get('/delete/:rollno',(req,res)=>{
    const roll=req.params.rollno;
    let sql=`DELETE from students where rollno= ${roll}`;
    let query=mysqlconnection.query(sql,(err,result)=>{
        if(err) throw err;
        res.redirect('/');
    });
});

app.listen(5501,()=>{
    console.log("server is running");
});
