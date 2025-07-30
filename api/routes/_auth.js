import jwt from 'jsonwebtoken';
export const SECRET = 'superSecret';


export const sign = (payload) => {
  // BigInt → Number (или String)
  if (typeof payload.id === 'bigint') payload.id = Number(payload.id);
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};



export const authMw = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const user = jwt.verify(token, SECRET);
    if (roles.length && !roles.includes(user.role)) throw 'forbidden';
    req.user = user;
    next();
  } catch (_) {
    res.status(401).json({ error: 'unauthorized' });
  }
};
