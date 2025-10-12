const express = require("express");
const router = express.Router();

const {
  getProductos,
  postProductos,
  putProductos,
  deleteProductos,
} = require("../controllers/productosController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getProductos);
router.post("/", authMiddleware, postProductos);
router.put("/:id", authMiddleware, putProductos);
router.delete("/:id", authMiddleware, deleteProductos);

module.exports = router;
