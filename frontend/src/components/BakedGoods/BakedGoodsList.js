import { useEffect, useState } from "react";

function BakedGoodsList() {
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/baked_goods`)
      .then((res) => res.json())
      .then(setGoods)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Baked Goods</h2>
      <ul>
        {goods.map((item) => (
          <li key={item.id}>
            {item.name} — Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BakedGoodsList;
