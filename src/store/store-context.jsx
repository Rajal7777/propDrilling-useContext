import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";
import { use } from "react";

//createContext returns a context object
export const StoreContext = createContext({
  items: [],
  // used for autosuggestion
  addItemToCart: () => {},
  updateItemQuality: () => {},
});

//[(state)handle initial state](action) is for handeling custom function defined
function shoppingCartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    //cop the prev state eg:-> prevShoppingCart.items = [item1, item2]// updatedItems = [item1, item2]
    const updatedItems = [...state.items];

    //look for same item in the cart if exist [findIndex()] () => {returns  index of the item found}
    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload,
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      //replace the old item with the updated item + increased quantity
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload,
      );
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state, // we can add this line incase of more than 1 state in order not to lose other state
      items: updatedItems,
    };
  }

  if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId,
    );
   
    //get the selected item and its index/ID
    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  return state;
}

//{ children } means:-->It will wrap other components inside it.
export default function StoreContextProvider({ children }) {
  //useReducer returns 2 state initial state & dispatch to -->( handle custom logic / function)
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    {
      items: [],
    },
  );

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: {
        productId,
        amount,
      },
    });
  }

  //usecontext
  // the value that will be provided to all components wrapped by StoreContextProvider
  const ctxValue = {
    items: shoppingCartState.items,
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
