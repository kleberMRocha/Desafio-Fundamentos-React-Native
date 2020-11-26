import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const price = products.map(product => {
      return product.quantity * product.price;
    });
    let total = 0;
    if (price.length) {
      total = price.reduce(
        (totalPrice, ProductPrice) => totalPrice + ProductPrice,
      );
    }

    return formatValue(total);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    let totalItens = 0;
    if (products.length) {
      totalItens = products
        .map(product => product.quantity)
        .reduce((total, quantity) => total + quantity);
    }

    return totalItens;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
