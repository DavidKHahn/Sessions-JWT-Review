const jwt = require('jsonwebtoken');
const redis = require('redis');

// Setup Redis:
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // return res.status(400).json('incorrect form submission');
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
       // .then(user => {res.json(user[0])})
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
          // .catch(err => res.status(400).json('unable to get user'))
      } else {
        Promise.reject('Wrong credentials')
        // res.status(400).json('wrong credentials')
      }
    })
    // .catch(err => res.status(400).json('Wrong credentials'))
    .catch(Promise.reject('Wrong credentials'))
}

const getAuthTokenId = () => {
  console.log('Auth okay');
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'process.env.JWT_SECRET', { expiresIn: '2 days'});
}

const createSessions = (user) => {
  // JWT TOKEN, return user data
  const { email, id } = user;
  const token = signToken(email);
  return { success: 'true', userId: id, token }
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ?
    getAuthTokenId() :
    handleSignin(db, bcrypt, req, res)
      .then(data => {
        return data.id && data.email ? createSessions(data) : Promise.reject(data)
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err))
}

module.exports = {
  signinAuthentication:signinAuthentication
  // handleSignin: handleSignin
}