import React from 'react';
import { useState } from 'react';
import { useQuery } from 'react-query';
//Components
import Item from './Item/Item';
import Cart from './Cart/Cart'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
//syles
import { Wrapper, StyledButton } from './App.styles';
//types
export type CartItemType = {
  id:number;
  category:string;
  description:string;
  image:string;
  price:number;
  title:string;
  amount:number;
}


const getProducts = async (): Promise<CartItemType[]> => 
  await (await fetch('https://fakestoreapi.com/products')).json()

const App = () =>{
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data,isLoading,error } = useQuery<CartItemType[]>(
    'products',
     getProducts
     );
    console.log(data);

  const getTotalItems = (items: CartItemType[]) => 
    items.reduce((ack:number, item) => ack + item.amount, 0);
  ;

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      //1. Is the item already added in the cart?
      const isItemCart = prev.find(item => item.id === clickedItem.id)
      if (isItemCart){
        return prev.map(item => 
          item.id === clickedItem.id 
          ? {...item,amount: item.amount + 1} 
          : item
          );
      };
      // Frist time is added
      return [...prev, {...clickedItem, amount: 1}];

    })
  };
  
  const handleRemoveFromCart = (id:number) =>{
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id){
          if (item.amount === 1 ) return ack;
          return [...ack, {...item,amount: item.amount - 1}]
        }else {
          return [...ack, item]
        }
      },[] as CartItemType[]) 
    )
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong...</div>;

  return (
    <Wrapper>
    <SwipeableDrawer anchor="right" open={cartOpen} onOpen={() => setCartOpen(true)} onClose={() => setCartOpen(false)}>
    <Cart 
      cartItems={cartItems} 
      addToCart={handleAddToCart}
      removeFromCart={handleRemoveFromCart}
      />
    </SwipeableDrawer>
    <StyledButton onClick={() => setCartOpen(true)}>
      <Badge badgeContent={getTotalItems(cartItems)} color='error'>
        <AddShoppingCartIcon/>
        </Badge>
    </StyledButton>
      <Grid container spacing={3}>
      {data?.map(item =>(
        <Grid item key={item.id}
        xs={12}
        sm={6}
        md={4}
        >
        <Item item={item} handleAddToCart={handleAddToCart} />
        </Grid>
      ))}
      </Grid>
    </Wrapper>
  )
}


export default App
