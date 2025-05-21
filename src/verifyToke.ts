// import {Request, Response, NextFunction} from "express"
// import jwt from "jsonwebtoken"

// const SECRET = process.env.JWT_SECRET || "segredo"

// export function autenticateToken(req: Request, res: Response, next: NextFunction){
//     const authHeader = req.headers["authorization"] // pega o token que vem no header
//     const token = authHeader && authHeader.split(" ")[1]

//     try{
//         const decoded = jwt.verify(token, SECRET) as unknown

//         if (
//             typeof decoded === "object" &&
//             decoded !== null &&
//             "userId" in 
//         )
//         (req as any).usuario = payload
//     }
// }