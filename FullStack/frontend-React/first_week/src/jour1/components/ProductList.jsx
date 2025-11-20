import Product from "./Product"

const ProductList = () => {
    const products = [
        {name: 'Product 1', price: 100},
        {name: 'Product 2', price: 200},
        {name: 'Product 3', price: 300},
        {name: 'Product 4', price: 400},
        {name: 'Product 5', price: 500},
        {name: 'Product 6', price: 600},
    ]
  return (
    <div id="product-list">
        {products.map((product) => (
            <Product key={product.name} name={product.name} price={product.price} />
        ))}
    </div>
  )
}

export default ProductList