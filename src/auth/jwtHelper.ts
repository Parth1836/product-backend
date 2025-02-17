const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "YOUR_SECRET_KEY";  // Store this securely!

// func for generating JWT token 
export function generateToken (user: any) {
    return jwt.sign({ id: user.firstName, email: user.email }, SECRET_KEY, {
        expiresIn: '1h'
    });
};

// func for verifying JWT token for valid user
export function verifyToken (token: string) {
    return jwt.verify(token, SECRET_KEY);
};