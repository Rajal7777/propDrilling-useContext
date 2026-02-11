import { createContext, useState } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

//createContext returns a context object
export const StoreContext = createContext({
  items: [],
  //   this is only for autosuggestion
  addItemToCart: () => {},
  updateItemQuality: () => {},
});

//{ children } means:-->It will wrap other components inside it.
export default function StoreContextProvider({ children }) {
  const [shoppingCart, setShoppingCart] = useState({
    items: [],
  });
  console.log(shoppingCart);

  function handleAddItemToCart(id) {
    //use the prev state to update the shopping cart
    setShoppingCart((prevShoppingCart) => {
      //copy the previous items in the cart
      // prevShoppingCart.items = [item1, item2]
      // updatedItems = [item1, item2]

      const updatedItems = [...prevShoppingCart.items];


      //look for same item in the cart if exist
      //returns  index of the item found
      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === id,
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        //replace the old item with the updated item
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        updatedItems.push({
          id: id,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        items: updatedItems,
      };
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === productId,
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
    });
  }

  //usecontext
  // the value that will be provided to all components wrapped by StoreContextProvider
  const ctxValue = {
    items: shoppingCart.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  //return the renderable value
  //children props wrapes all the logic above
  // when we use CartContextProvider it will wrap the component used + all the logic in store-cart
  return (
    <StoreContext.Provider value={ctxValue}>{children}</StoreContext.Provider>
  );
}
