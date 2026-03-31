import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  isOpen: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, cantidad } = action.payload;
      const key = variant ? `${product.id}-${variant.id}` : `${product.id}`;
      const existing = state.items.find((item) => item.key === key);

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.key === key
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          ),
        };
      }

      const precioBase = product.precioFinal || product.precio;
      const precioExtra = variant?.precioExtra || 0;
      const precioUnitario = Number(precioBase) + Number(precioExtra);

      return {
        ...state,
        isOpen: true,
        items: [
          ...state.items,
          {
            key,
            productId: product.id,
            variantId: variant?.id || null,
            nombre: product.nombre,
            marca: product.marca,
            sabor: variant?.sabor || null,
            imagenUrl: product.imagenUrl,
            precioUnitario,
            cantidad,
          },
        ],
      };
    }

    case 'UPDATE_CANTIDAD': {
      const { key, cantidad } = action.payload;
      if (cantidad <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.key !== key),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.key === key ? { ...item, cantidad } : item
        ),
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.key !== action.payload),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((product, variant = null, cantidad = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, cantidad } });
  }, []);

  const updateCantidad = useCallback((key, cantidad) => {
    dispatch({ type: 'UPDATE_CANTIDAD', payload: { key, cantidad } });
  }, []);

  const removeItem = useCallback((key) => {
    dispatch({ type: 'REMOVE_ITEM', payload: key });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: 'OPEN_CART' });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' });
  }, []);

  const totalItems = state.items.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.precioUnitario * item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        totalPrice,
        addItem,
        updateCantidad,
        removeItem,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
