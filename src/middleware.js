const jwt = require('jsonwebtoken');

exports.authentication = async function(req,res,next){
    try {
        let token = req.headers["x-api-key"];
        if(!token) return res.status(400).send({status: false, message: "Login first."});

        jwt.verify(token, "security-key", (err,decoded)=>{
            if(err) return res.status(401).send({status: false, message: err.message});
            req.decoded = decoded;
            next();
        })
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
}