import jwt from "jsonwebtoken"

export const generateAcessToken = (id:string) =>{
    try{
        return jwt.sign({userId:id}, process.env.JWT_SECRET!, {expiresIn:"1h"})
    }catch(error){
        console.log(error)
    }
}

export const generateRefreshToken = (id:string) =>{
    try{
        return jwt.sign({userId:id}, process.env.JWT_SECRET!, {expiresIn:"7d"})
    }catch(error){
        console.log(error)
    }
}


export const verifyAcessToken = (token:string) =>{
    try{
        return jwt.verify(token, process.env.JWT_SECRET!)
    }catch(error){
        console.log(error)
    }
}

export const verifyRefreshToken = (token:string) =>{
    try{
        return jwt.verify(token, process.env.JWT_SECRET!)
    }catch(error){
        console.log(error)
    }
}
