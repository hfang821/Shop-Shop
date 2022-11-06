//The actual functionality that carries out the emitted action to update state.
import {useReducer} from 'react';

import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART
} from "./actions"; 

export const reducer = (state,action) => {
    switch (action.type){
        //if action type is the value of `UPDATE_PRODUCTS`, return a new state object with an updated products array
        case UPDATE_PRODUCTS:
            return{
                //...: spread syntax that can copy the state object
                ...state,
                products: [...action.products],
            };
        
        case UPDATE_CATEGORIES:
            return {
                ...state, 
                categories: [...action.categories]
            };

        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            };
        
        case ADD_TO_CART:
            return{
                //...state to preserve everything else on state.
                ...state, 
                cartOpen: true,
                cart: [...state.cart, action.product]
            };
        
        case ADD_MULTIPLE_TO_CART:
            return {
                ...state,
                cart: [...state.cart, ...action.products],
            };

        case REMOVE_FROM_CART:
            //the use of filter() that only keeps the items that don't match the provided _id property
            let newState = state.cart.filter(product=> {
                return product._id !== action._id;
            });

            return {
                ...state,
                //set the cartOpen to false when length of array=0
                cartOpen: newState.length > 0,
                cart: newState
            };
        
        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartOpen: true,
                //use the map() method to create a new array as original state should be treated as immutable.
                cart: state.cart.map(product => {
                    if(action._id === product._id) {
                        product.purchaseQuantity = action.purchaseQuantity;
                    }
                    return product;
                })
            };
        
        case CLEAR_CART:
            return {
                ...state,
                cartOpen: false,
                cart: []
            };

        case TOGGLE_CART:
            return {
                ...state,
                //revert the cartOpen status
                cartOpen: !state.cartOpen
            };
        //if it's none of these actions, do not update state at all and keep things the same!
        default: 
            return state;    
    }
};

//this function will help initialize the global state object and provide with the functionality for updating that state by running custom reducer() function.
export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
}