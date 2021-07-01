const jwt = require('jsonwebtoken');
const emailRegex = /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/;
const pwdRegex =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

module.exports = (req, res, next) => {
    try {
        if(emailRegex.test(req.body.email)==true && pwdRegex.test(req.body.password)==true)
        {
            next();
        }
        else {
            return res.status(403).json({ error: 'Bad request' });
        }
    }
    catch
    {
        res.status(401).json({error: new Error('Invalid request!')});
    }
};
