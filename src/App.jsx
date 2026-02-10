import Header from "./components/Header.jsx";
import Shop from "./components/Shop.jsx";

import Product from "./components/Product.jsx";
import StoreContextProvider from "./store/store-context.jsx";
import { DUMMY_PRODUCTS } from "./dummy-products.js";

function App() {
  return (
    <>
      <StoreContextProvider >
        <Header />
        <Shop>
          {DUMMY_PRODUCTS.map((product) => (
            <li key={product.id}>
              <Product {...product} />
            </li>
          ))}
        </Shop>
      </StoreContextProvider>
    </>
  );
}

export default App;
