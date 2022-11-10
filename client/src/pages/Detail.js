import React, { useEffect, useState } from 'react';
import Cart from '../components/Cart';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {useStoreContext } from '../utils/GlobalState';
import {REMOVE_FROM_CART, UPDATE_PRODUCTS, UPDATE_CART_QUANTITY, ADD_TO_CART} from '../utils/actions';

import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';
import {idbPromise} from '../utils/helpers';

function Detail() {
  const [state, dispatch] = useStoreContext();
  //useParams hook returns an object of key/value pair of the dynamic params from the current URL that matched by the <Route path>
  //Get the product id from the url
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const {products, cart} = state;

  const addToCart = () =>{
    const itemInCart = cart.find((cartItem)=> cartItem._id === id);
    
    if(itemInCart){
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) +1
      });

      //if we're updating quantity, use existing item data and increment purchase quantity value by one.
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: {...currentProduct, purchaseQuantity: 1}
      });

      //if product isn't in the cart, add it to the current shopping cart in indexedDB
      idbPromise('cart', 'put', {...currentProduct, purchaseQuantity: 1});
    }
  }
  console.log(state);

  const removeFromCart = () =>{
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id
    });

    //upon removal from cart, delete the item from indexedDB using the 'currentProduct._id' to locate what to remove
    idbPromise('cart', 'delete',{...currentProduct});
  };
  //useEffect will will constantly check the dependency array for a change in any of the values listed in it and continue to run the useEffect() Hook's callback function until that data stops changing 
  useEffect(() => {
    //First check if there is data in our global state's products array
    if (products.length) {
      //If there is, figure out which product is the current one that we want to display.
      //Match the _id value with the id we grabbed from the useParams hook.
      setCurrentProduct(products.find((product) => product._id === id));
    } //If we don't have any products in our global state(someone just sent you this url and first time you load this app.)
    // Use the "data" returned from the useQuery hook tos set product data to the global state.
    else if(data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      data.products.forEach((product) =>{
        idbPromise('products','put', product);
      });
    }
    // get cache from idb
    else if (!loading) {
      //first get from indexDB and then update the global product state.
      idbPromise('products','get').then((indexedProducts)=>{
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts
        });
      });
    }
    //second arg: the dependency array (Hook's functionality is dependent on them to work and only runs when it detects that they've changed in value)
  }, [products,data,dispatch,id]); //hook only trigger when the dependency array changes

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cart.find(product=>product._id===currentProduct._id)}
              onClick={removeFromCart}
            >Remove from Cart</button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div> 
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
