import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const cartProducts = await AsyncStorage.getItem('@CartProducts');
      if (cartProducts) {
        setProducts(JSON.parse(cartProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const duplicated = products.filter(
        chartItem => chartItem.id === product.id,
      );

      if (duplicated.length) {
        const nonDuplicateItems = products.filter(
          productItem => productItem.id !== duplicated[0].id,
        );
        duplicated[0].quantity += 1;
        setProducts([...nonDuplicateItems, duplicated[0]]);
        await AsyncStorage.setItem('@CartProducts', JSON.stringify(products));
      } else {
        const newProduct = { ...product, quantity: 1 };
        setProducts([...products, newProduct]);
        await AsyncStorage.setItem('@CartProducts', JSON.stringify(products));
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const incrementedItens = products.map(product => {
        product.id === id && (product.quantity += 1);

        return product;
      });
      setProducts(incrementedItens);
      await AsyncStorage.setItem(
        '@CartProducts',
        JSON.stringify(incrementedItens),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const decrementItem = products.filter(product => product.id === id);
      if (decrementItem[0].quantity === 1) {
        const newCartItens = products.filter(
          product => product.id !== decrementItem[0].id,
        );
        setProducts(newCartItens);
        await AsyncStorage.setItem(
          '@CartProducts',
          JSON.stringify(newCartItens),
        );
      } else {
        const incrementedItens = products.map(product => {
          product.id === id && (product.quantity -= 1);
          return product;
        });

        setProducts(incrementedItens);
        await AsyncStorage.setItem(
          '@CartProducts',
          JSON.stringify(incrementedItens),
        );
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
