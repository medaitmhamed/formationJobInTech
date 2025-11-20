import { useState } from "react";

const Panier = () => {
  const [cart, setCart] = useState([
    { id: 1, name: "Laptop", qty: 1 },
    { id: 2, name: "Phone", qty: 2 },
  ]);

  const incrementQty = (id) => {
    setCart(
      cart.map((p) => {
        if (p.id === id) {
          return { ...p, qty: p.qty + 1 };
        }
        return p;
      })
    );
  };

  const decrementQty = (id) => {
    setCart(
      cart.map((p) => {
        if (p.id === id) {
          return { ...p, qty: Math.max(1, p.qty - 1) };
        }
        return p;
      })
    );
  };
  const removeItem = (id) => {
    setCart(cart.filter((p) => p.id !== id));
  };
  return (
    <section className="panier">
      <div className="cart">
        <h2>Panier</h2>
        <div className="products-list">
          {cart.map((p) => {
            return (
              <div className="product" key={p.id}>
                <div>
                  <p>{p.name}</p>
                  <p>{`Quantité: ${p.qty}`}</p>
                </div>
                <div className="button-container">
                  <button className="button" onClick={() => incrementQty(p.id)}>
                    +
                  </button>
                  <button className="button" onClick={() => decrementQty(p.id)}>
                    -
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => removeItem(p.id)}
                  >
                    X
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Panier;
