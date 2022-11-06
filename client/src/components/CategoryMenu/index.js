import React, {useEffect} from 'react';
import {UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY} from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import {useStoreContext} from "../../utils/GlobalState";

function CategoryMenu() {
  //call the useStoreContext hook to retrieve the current state from the global state object
  //dispatch to update state
  const [state,dispatch] =useStoreContext();
  //destructure the categories array out of the global state
  const {categories} = state;
  const {data: categoryData} = useQuery(QUERY_CATEGORIES);
  //useQuery is a async function, so we cannot call dispatch on it as categoryData will not exist on load.
  //useEffect hook is created specifically for this. As it not only runs on component load, but also when some form of state changes in that component.
  useEffect(() => {
    //if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if(categoryData){
       //execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
       dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
       });
    }
  }, [categoryData, dispatch]);

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };
  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu; 
