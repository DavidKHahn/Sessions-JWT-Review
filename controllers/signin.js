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

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply ) {
// returns error if no reply or error
      return res.status(400).json('Unauthorized');
    }
// returns string of 'id'
      return res.json({ id: reply })
  })
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'process.env.JWT_SECRET', { expiresIn: '2 days'});
}

const setToken = (key, value) => {
// sets token in redis and returns a promise
  return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
  // JWT TOKEN, return user data
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token }
    })
    .catch(console.log)
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
// checks if user already has authorization
  return authorization ? getAuthTokenId(req, res) :
// direct user to sign if auth does not exist
    handleSignin(db, bcrypt, req, res)
      .then(data => {
// if id, email exists then stores information in redis server otherwise reject with error
        return data.id && data.email ? createSessions(data) : Promise.reject(data)
      })
// returns session information
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err))
}

module.exports = {
  signinAuthentication:signinAuthentication,
  redisClient: redisClient
  // handleSignin: handleSignin
}