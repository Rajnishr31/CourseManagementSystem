const jwt = require('jsonwebtoken');
const UserModel = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const { isName, isEmail, isPassword, isRole } = require('../validator');

exports.createUser = async (req, res) => {
    try {
        const data = req.body;
        Object.keys(data).forEach(x => data[x] = data[x].toString().trim());
        let arr = ["name", "email", "password"];
        for (let i = 0; i < arr.length; i++) {
            if (!data[arr[i]]) return res.status(400).send({ status: false, message: `${arr[i]} is required.` });
        }

        if(!isName(data.name)) return res.status(400).send({ staus: false, message: "Please provide valid name."});
        if(!isEmail(data.email)) return res.status(400).send({ staus: false, message: "Please provide valid email."});
        if(!isPassword(data.password)) return res.status(400).send({ staus: false, message: "Please provide valid password."});
        if( data.role && !isRole(data.role)) return res.status(400).send({ staus: false, message: "Please provide valid role."});

        let user = await UserModel.findOne({email: data.email});

        if(user) return res.status(400).send({status: false, message: "This email is already in use."});

        data.password = await bcrypt.hash(data.password, 4);

        const newUser = await UserModel.create(data);
        res.status(201).send({ status: true, message: "User Created Successfully", data: newUser });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const data = req.body;
        Object.keys(data).forEach(x => data[x] = data[x].toString().trim());
        const { email, password } = data;
        if (!email) return res.status(400).send({ status: false, message: "Please provide valid email" });
        if (!password) return res.status(400).send({ status: false, message: "Please provide valid password" });

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).send({ status: false, message: "User not found." });
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).send({ status: false, message: "Please provide correct password." });
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            "security-key",
            { expiresIn: "1h" }
        );
        res.setHeader('x-api-key', token);
        res.status(200).send({ status: true, message: "Logged in successfully.", token });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}