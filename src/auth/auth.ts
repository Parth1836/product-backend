import express, { Request, Response, NextFunction } from "express";
const authRouter = express.Router();
import { generateToken, verifyToken } from "./jwtHelper";
import fs from "fs";

// method to get user by email and password
function getUserData (userEmail:string, password:string): any {
  return new Promise((resolve, reject) => {
    fs.readFile("./users.json", (err: any, data: any) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
      try {
        data.toJSON;
        const usersData = JSON.parse(data);
        const user = usersData.find((ele: any) => ele.userEmail === userEmail);
        if (!user) reject("Invalid username or password.") ;
        if (password !== user.password) {
          reject("Invalid username or password.");
        }
        resolve(user);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        reject({
          error: true,
          msg: parseError,
        });
      }
    });
  })
  
}

// func to check valid token for every request from client
export function authenticateToken(req: any, res: any, next: any) {
  try {
    const excludedRoutes = ["/api/login", "/api/register"];
    if (excludedRoutes.includes(req.path)) {
      return next();
    }
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.sendStatus(401);
    }
    const user = verifyToken(token);
    if (!user) {
      return res.sendStatus(403);
    }
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(403).send(error);
  }
}

// api for login api 
authRouter.post("/login", async (req: any, res: any) => {
  try {
    const { userEmail, password } = req.body;

    fs.readFile("./users.json", (err: any, data: any) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
      try {
        data.toJSON;
        const usersData = JSON.parse(data);
        const user = usersData.find((ele: any) => ele.userEmail === userEmail);
        if (!user) return res.status(400).send("Invalid username or password.");
        if (password !== user.password) {
          return res.status(400).send("Invalid username or password.");
        }
        const signInPayload = {
          firstName: user?.firstName,
          email: user?.userEmail,
        };
        const token = generateToken(signInPayload);

        return res.send({ token, userName: `${user.firstName} ${user.lastName}`, id: user.id });
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.send({
          error: true,
          msg: parseError,
        });
      }
    });
  } catch (error) {
    console.log("error in login", error);
  }
});

// api for register api 
authRouter.post("/register", async (req: any, res: any) => {
  try {
    const body = req.body;
    if (
      !body.firstName ||
      !body?.lastName ||
      !body?.userEmail ||
      !body?.password
    ) {
      res.send({
        error: true,
        msg: "Argument is missing !",
      });
    }
    fs.readFile("./users.json", (err: any, data: any) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
      try {
        data.toJSON;
        const jsonData = JSON.parse(data);
        const idArr = jsonData.map((ele: any) => ele.id);
        const maxID = Math.max(...idArr);
        let final: any = [...jsonData, { id: maxID + 1, ...body }];
        final = JSON.stringify(final);
        fs.writeFile("./users.json", final, async (err: any) => {
          if (err) throw err;
          const userData = await getUserData(body.userEmail, body.password);
          const signInPayload = {
            firstName: userData?.firstName,
            email: userData?.userEmail,
          };
          const token = generateToken(signInPayload);
          return res.send({ token, userName: `${userData.firstName} ${userData.lastName}`, id: userData.id });
        });
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.send({
          error: true,
          msg: parseError,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default authRouter;
