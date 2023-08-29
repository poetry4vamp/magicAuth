const express = require ('express')
const nodemailer = require ('nodemailer')
const uuid = require ('uuid')

//for the access token part, paste your own access token provided on the gmail API in google OAuth playground
const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user: 'VSMP Official Account',
        accessToken: 'ya29.a0AfB_byBT6O4B4m245Vm7yxnCcr4r6iqu1Y1eFQb7FOdhN9upLgGPlE6f1YcOTcD8bQ8NHe11_IiUOk2cRZwZqiO5AqF0l4bYEYxBz1QuZwWS98BExPZbDSVLFH3BS8Yckxo7TK6qbHOMRuS-XgLawKBm9dEBtZhToEHiRAaCgYKAckSARISFQHsvYls6UX-_uFcEhkYeVCC5XRe0A0173'
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
    res.sendFile(__dirname + "/index.html")
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

app.get('/homepage',(req,res) => {
    const {email,code} = req.query
    const user = users.find((u) => u.email === email && u.magicCode === code);

    if(!user){
        res.send("Invalid link!")
    }

    user.magicCode = null;
    res.redirect('/')
});

app.listen(5000,() => {
    console.log("App listening on port 5000.")
})

