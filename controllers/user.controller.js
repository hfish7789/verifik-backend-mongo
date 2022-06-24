require("../config/db.config").connect();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

dotenv.config();

exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone, countryCode, agreements } = req.body;
        const oldUser_email = await User.findOne({ email });
        const oldUser_phone = await User.findOne({ phone });

        if (oldUser_email || oldUser_phone) {
            res.status(409).send("User Already Exist. Please Login");
        } else {
            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email: email.toLowerCase(),
                password: encryptedPassword,
                phone,
                countryCode,
                agreements,
            });

            const token = jwt.sign(
                {
                    user_id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    phone: user.phone,
                    countryCode: user.countryCode,
                    agreements: user.agreements,
                },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;
            res.json({ user, accessToken: token });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.signin = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {
                    user_id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    phone: user.phone,
                    countryCode: user.countryCode,
                    agreements: user.agreements,
                },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;
            res.json({ user: user, accessToken: token });
        } else {
            res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
    }
};

exports.forgotPassword = async (req, res) => {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (user) {
        res.status(200).json({});
    } else {
        res.status(400).send("Not Found");
    }
};

exports.resetPassword = async (req, res) => {
    const { phone, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newvalues = { password: encryptedPassword };

    User.findOneAndUpdate(
        { phone: "+" + phone.toString() },
        newvalues,
        function (err) {
            if (err) throw err;
            res.status(200).json({});
        }
    );
};
