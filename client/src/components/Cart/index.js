import React, {useEffect} from "react";
import CartItem from "../CartItem";
import Auth from "../../utils/auth";
import { useStoreContext } from "../../utils/GlobalState";
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";
import "./style.css";
import { idbPromise } from "../../utils/helpers";

const Cart = () => {
  const [state, dispatch] = useStoreContext();

  useEffect(() =>{
    async function getCart(){
      const cart = await idbPromise ('cart', 'get');
      dispatch({type: ADD_MULTIPLE_TO_CART, products: [...cart]});
    };
    
    if(!state.cart.length){
      getCart();
    }
    //the useEffect function is dependent on state.cart.length in the dependency array
    //only runs again if any value in the dependency array has changed since last time it ran.
  }, [state.cart.length, dispatch]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }

  function calculateTotal() {
    let sum= 0;
    state.cart.forEach(item=>{
        sum+= item.price * item.purchaseQuantity;
    });
    //toFixed: converts number to string
    return sum.toFixed(2);
  }

  if (!state.cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span role="img" aria-label="trash">
          🛒
        </span>
      </div>
    );
  }
  console.log(state);
  return (
    <div className="cart">
      <div className="close" onClick={toggleCart}>[close]</div>
      <h2>Shopping Cart</h2>

    {state.cart.length ? (
        <div>
            {state.cart.map(item => (
                <CartItem key={item.id} item={item} />
    ))}
        <div className="flex-row space-between">
          <strong>Total: ${calculateTotal()}</strong>
          {Auth.loggedIn() ? 
            <button>Checkout</button>
           : 
            <span>(log in to check out)</span>
          }
        </div>
    </div>
  ):(
    <h3>
        <span role="img" aria-label="shocked">
            😱
        </span>
        You haven't added anything to your cart yet!
    </h3>
  )}
</div>
)};

export default Cart;
