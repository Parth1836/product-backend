import express, { Request, Response } from "express";
import fs from "fs";
import { Product } from "../models/product";

const productRouter = express.Router();

function getFinalProductList(productData: Product[]) {
  return productData?.map((product: Product) => {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      rating: product.rating,
      thumbnail: product.thumbnail,
    };
  });
}

// api for getting product list by pagination
productRouter.get("/get-product-list-by-page/:page", (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.params.page, 10);
    fs.readFile("./productsList.json", (err: any, data: any) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
      try {
        data.toJSON;
        const jsonData = getFinalProductList(JSON.parse(data));
        const start = (page - 1) * 10 + 1;
        const end = start + 10;
        const temp = jsonData.slice(start, end);
        res.status(200).send({ data: temp, total: jsonData?.length });
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.send({
          error: true,
          msg: parseError,
        });
      }
    });
  } catch (error) {
    res.send({
      error: true,
      msg: error,
    });
    console.log("error", error);
  }
});

// api for updating product data
productRouter.put("/update-product/:id", (req: Request, res: Response) => {
  try {
    const prodId = parseInt(req.params.id, 10);
    fs.readFile("./productsList.json", (err: any, data: any) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
      try {
        data.toJSON;
        const jsonData = getFinalProductList(JSON.parse(data));
        const product: any =
          jsonData.find((prod: any) => prod.id === prodId) || null;
        const otherProducts = jsonData.filter(
          (prod: any) => prod.id !== prodId
        );
        product.title = req.body.title;
        const final = JSON.stringify([product, ...otherProducts]);
        fs.writeFile("./productsList.json", final, (err: any) => {
          if (err) throw err;
          return res.send("Product Update successfully");
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
    res.send({
      error: true,
      msg: error,
    });
    console.log("error", error);
  }
});

// api for deleting product data
productRouter.delete("/delete-product/:id", (req:Request, res: Response) => {
  try {
    const prodId = parseInt(req.params.id, 10);
    fs.readFile("./productsList.json", (err: any, data: any) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
      try {
        data.toJSON;
        const jsonData = getFinalProductList(JSON.parse(data));
        let final: any = jsonData.filter((prod: any) => prod.id !== prodId);
        console.log("---133", final[0]);
        final = JSON.stringify(final);
        fs.writeFile("./productsList.json", final, (err: any) => {
          if (err) throw err;
          console.log("Deleted!");
          return res.send("Deleted successfully");
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
    res.send({
      error: true,
      msg: error,
    });
    console.log("error", error);
  }
});

// api for adding product data
productRouter.post("/add-product", (req:Request, res: Response) => {
  try {
    const body = req.body;
    fs.readFile("./productsList.json", (err: any, data: any) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
      try {
        data.toJSON;
        const jsonData = getFinalProductList(JSON.parse(data));
        const idArr = jsonData.map((ele: any) => ele.id);
        const maxID = Math.max(...idArr);
        let final: any = [...jsonData, { id: maxID + 1, ...body }];
        final = JSON.stringify(final);
        fs.writeFile("./productsList.json", final, (err: any) => {
          if (err) throw err;
          console.log("Added!");
          return res.send("Added successfully");
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
    res.send({
      error: true,
      msg: error,
    });
    console.log("error", error);
  }
});

export default productRouter;
