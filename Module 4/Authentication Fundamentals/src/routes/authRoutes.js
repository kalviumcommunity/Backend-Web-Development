const express = require('express');
const authServices=require("../services/authService");

const router = express.Router();

router.post('/register', async (req, res, next) => {
  // TODO: validate, hash, persist, and return a safe 201 response.
  try{
   const user=await authServices.register(req.body);
   res.status(201).json({data:user});
  }
  catch(error){
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  // TODO: verify credentials and return the required generic failure response.
   try {
    const user = await authService.login(req.body);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
