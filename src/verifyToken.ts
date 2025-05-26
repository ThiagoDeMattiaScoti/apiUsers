import {Request, Response, NextFunction} from "express"
import jwt, { TokenExpiredError } from "jsonwebtoken"
const JWT_SECRET = '327mo'
declare global { namespace Express { interface Request { user?: LoginPayload}}}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization

    if(authHeader) {
        const tokenParts = authHeader.split(' ')

        if (tokenParts.length === 2 && tokenParts[0].toLowerCase() === 'bearer'){
            const token = tokenParts[1]

            jwt.verify(token, JWT_SECRET, (err, decodedPayload)=>{
                if(err){
                    if (err.name === 'TokenExpiredError'){
                        res.status(401).json({erro: 'Seu Token expirou'})
                        return;
                    }
                    res.status(403).json({erro: 'Token inválido'})
                    return;
                }

                req.user = decodedPayload as LoginPayload
                next()
            })
        } else {
            res.status(401).json({erro: 'Token Inválido'})
            return;
        }
    }
}