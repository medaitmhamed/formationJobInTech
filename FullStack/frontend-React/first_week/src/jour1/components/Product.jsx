const Product = ({name, price}) => {
  return (
    <div id="product">
      <h2>{name}</h2>
      <p>{price} DH</p>
    </div>
  )
}

export default Product