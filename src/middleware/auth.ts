import {Request, Response, NextFunction} from 'express'
import Account from '../models/Account'


const isAuth = async function (req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Invalid Authorization' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const user = await Account.findOne({ where: {username: username} });
    if (!user) {
        return res.status(403).json({ message: 'Invalid Authorization' });
    }

    if (user.auth_id !== password) {
        return res.status(403).json({message: 'Invalid Authorization'})
    }
    // attach user to request object
    req.user = user

    next();
}

export default isAuth