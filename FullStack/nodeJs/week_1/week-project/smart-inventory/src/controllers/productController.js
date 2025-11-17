// controllers/productsController.js

// import dyal function (readproducts)
// fonction li katrd liste dyal produits ==> had function hya li kat9ra products.json
const { getAllProducts } = require("../services/productsService");

// getProducts: 3parametre
//req: talab li ja mn luser(http request)
//res: ljawab li ghadi nrej3o (http response)
//logger: log bach nsejlo l a7date 

function getProducts(req, res, logger) {
  // kan3yto 3la readproducts dakchi li 9rat kan7toh f products
  const products = getAllProducts();
//hna kanwejdo response f 7alat 200=ok ,ghadi yjawb b json w format utf8
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  // hna kansaliw response w kan3tiw l client la liste dyal les produits b JSON
  res.end(JSON.stringify(products)); //stringify : kat7wel array/object l txt JSON
  // mn be3d ma jawebna client kansjlo f logger had l event
//   logger.log({ event: "response:sent", statusCode: 200, route: "/api/products" }); //route :lmasar li ja mno talab

}

// fonction li katrd produit wahd b id
function getProductById(req, res, logger) {
  // kanakhdo l id mn URL
  const id = req.url.split("/").pop();
  const products = readProducts();
  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    // ila ma tlach produit → Erreur 404
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Product not found" }));
    logger.log({ event: "response:sent", statusCode: 404, route: req.url }); //sjlo f logger  404
    return; //bach w9fo lkhedma
  }

  // ila l9ah → rdo
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" }); //200=ok
  res.end(JSON.stringify(product)); //kat afficher le produit li id dyalo == id.url 
  logger.log({ event: "response:sent", statusCode: 200, route: req.url }); // kansjlo f logger had event(ok)
}
//exportation dyal had les fonctions
module.exports = { getProducts, getProductById };
