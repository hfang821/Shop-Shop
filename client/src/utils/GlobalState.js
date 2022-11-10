import React, {createContext, useContext} from 'react';
import {useProductReducer} from './reducers';

const StoreContext = createContext();
const {Provider} = StoreContext;

//create our own functionality to manage state globally and make it available to all our other components using provider component
const StoreProvider = ({value=[], ...props}) => {
    //dispatch: the method we execute to update our state.
    // it will go to look for an action object passed in as its argument
    const [state, dispatch] = useProductReducer({
        products: [],
        cart: [],
        cartOpen: false,
        categories: [],
        currentCategory: ''
      });
    //to make sure it works
    console.log(state);
    return <Provider value={[state,dispatch]} {...props} />;
};

const useStoreContext=()=> {
    //useContext hook to be used by the components that need the data our storeProvider provides
    return useContext(StoreContext);
};

export {StoreProvider, useStoreContext};