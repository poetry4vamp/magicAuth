const express = require ('express')
const nodemailer = require ('nodemailer')
const uuid = require ('uuid')

//for the access token part, paste your own access token provided on the OAuth playground
//also make sure to use the gmail account you used when you accessed the OAuth playground
const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user: 'oshisoffline@gmail.com',
        accessToken: 'ya29.a0AfB_byBFzODXnBhUmmlOMFfDgttEPWUkJmkqocZdHXv5j8oUhWdCieWwoTrqH7YTxPjq9atGjh9pI4r8BnSbLtpFB-8_A2mR4UzkuWuZfi5POIKI-adxABmC3xp3nIA7qiraMbOEakfrQSPQyCvio5PeRTs3vumCjCIougaCgYKAfsSARISFQHsvYlsrSN99oikc4LHNpci4e7ISQ0173'
    }
})

//for this part, as of now naka-indicate muna 'yong emails kung saan s-send 'yong email na may magic link solely for testing, but i will edit this
//you can add your email, just change the id number
const users = [
    {
        id:1,email:'allanaubaldo01@gmail.com',magicCode:null

    },
    {
        id:2,email:'acernliya@gmail.com',magicCode:null
        
    }
]

const app = express()

app.use(express.json())

app.get('/', (req,res) => {
    res.sendFile(__dirname + "/index.ejs")
})

app.post('/login',async (req,res) => {
    const {email} = req.body
    const user = users.find((u) => u.email === email)
    if(!user){
        return res.send("User not found!")
    }

    const magicCode = uuid.v4().substr(0,8)
    user.magicCode = magicCode
    const mailOptions = {
        from:'vsmpofficial@gmail.com',
        to:email,
        subject:'Magic Auth Link',
        html: `
        <p>Click link below to access VSMP Official Web Page.<p>
        <a href="http://localhost:5000/homepage?email=${encodeURIComponent(
            email
        )}&code=${encodeURIComponent(magicCode)}">VSMP Official</a>
        `,
    };
    try{
        await transport.sendMail(mailOptions)
        res.send("Magic Auth Link has been sent to your gmail.")
    }catch(err){
        console.log(err)
        res.send("Error sending email...")
    }
});

//the purpose of this code is to make sure isang beses lang available or pwede ma-access 'yong link
app.get('/homepage',(req,res) => {
    const {email,code} = req.query
    const user = users.find((u) => u.email === email && u.magicCode === code);

    if(!user){
        res.send("Invalid link!")
    }

    //for this part, dapat mag redirect siya sa homepage, sa ngayon sa index pa rin siya nag d-direct
    user.magicCode = null;
    res.redirect('/')
});

app.listen(5000,() => {
    console.log("App listening on port 5000.")
})

