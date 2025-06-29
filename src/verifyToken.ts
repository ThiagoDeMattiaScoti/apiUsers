import {Request, Response, NextFunction} from "express"
import jwt, { TokenExpiredError } from "jsonwebtoken"
const JWT_SECRET = '327mo'
declare global { namespace Express { interface Request {user?: PayloadInterface}}}

//#region codigo antigo
// const authenticateJWT = (req: Request, res: Response, next: NextFunction)=>{
//     const authHeader = req.headers.authorization
//     if (authHeader){
//         const tokenParts = authHeader.split(' ')
//         if (tokenParts[0].toLowerCase() === 'bearer'){
//             const token = tokenParts[1]
//             jwt.verify(token, JWT_SECRET, (err, decoded)=>{
//                 if (err){
//                     if(err.name === 'TokenExpiredError'){
//                         res.status(401).json({message: 'Token expirado'})
//                         return
//                     }
//                     res.status(403).json({message: 'Token inválido na verificação'})
//                     return
//                 }
//                 req.user = decoded as PayloadInterface
//                 next()
//             })
//         } else {
//             res.status(401).send('Token inválido')
//             return
//         }
//     } else {
//         res.status(401).send('Token não fornecido')
//     }
// }

// export default authenticateJWT
//#endregion

function authenticateJWT(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization
    if (authHeader){
        const tokenParts = authHeader.split(' ')
        const token = tokenParts[1]
        jwt.verify(token, JWT_SECRET, (err, decoded)=>{
            if (err){
                if (err.name === 'TokenExpiredError'){
                    res.status(404).json({message: 'Expired token'})
                    return
                }
                res.status(404).json({message: 'Token inválido na verifficação'})
                return
            }
            req.user = decoded as PayloadInterface
            next()
        }) 
    } else{
        res.status(404).json({message: 'Token não fornecido'})
        return
    }
}

export default authenticateJWT