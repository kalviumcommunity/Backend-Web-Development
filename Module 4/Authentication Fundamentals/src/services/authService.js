const bcrypt=require('bcryptjs');
const AppError=require("../errors/AppError");
const userRepository=require("../repositories/userRepository");

const cost=Number(process.env.BCRYPT_COST||12);

const dummyHashPromise=bcrypt.hash('not a real password',cost);

function requiredString(value){
    return typeof value ==='string' && value.trim().length>0;
}

function publicUser(user){
    return {id:user.id, name:user.name, email:user.email}
}

function invalidCredentials(){
    throw new AppError(401,"invalid credentials","Invalid email or password");
}

async function register(input={}){
    if(!requiredString(input.name)||!requiredString(input.email)||!requiredString(input.password)){
        throw new AppError(400,"Invalid_Inputs","Name,email,password are required");
    }
    const email=input.email.trim().toLowerCase();
    if(await userRepository.findByEmail(email)){
        throw new AppError(409,"Email_Exits","An account with same email exists");
    }
    const passwordHash=bcrypt.hash(input.password,cost);

    try{
        const user=userRepository.create({name:input.trim(),email,passwordHash});
        return publicUser(user);
    }
    catch(error){
        throw error;
    }

}

async function login(input={}){
    if(!requiredString(input.email) || !requiredString(input.password)){
        throw new AppError(400,"Invalid_Input","Email and password are required");
    }
    const email=input.email.trim().toLowerCase();
    const user=await userRepository.findByEmail(email);
    const passwordHash=user? user.passwordHash:await dummyHashPromise;
    const valid=bcrypt.compare(input.password,passwordHash);
    if(!user||!valid) throw invalidCredentials();
    return publicUser(user);

}
module.exports={register,login};