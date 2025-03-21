// passcodeAuth.js
const PASSCODE = '1234';

const checkPasscode = (req, res, next) => {
  const passcode = req.query.passCode || req.body.passCode;
  if (PASSCODE) {
    if(PASSCODE === passcode)
      next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

module.exports = checkPasscode;