import { useBasket, useSaveBasket, useDeleteBasket } from './useBasket';
import type { BasketItemDto } from '../types/basket.types';

interface AddItemInput {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export function useBasketActions() {
  const { data: basket, isLoading } = useBasket();
  const saveBasket = useSaveBasket();
  const deleteBasket = useDeleteBasket();

  function addItem(item: AddItemInput) {
    const currentItems = basket?.items ?? [];
    const existing = currentItems.find((i) => i.productId === item.productId);

    const nextItems: BasketItemDto[] = existing
      ? currentItems.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        )
      : [...currentItems, { ...item }];

    return saveBasket.mutateAsync({ id: basket?.id ?? 0, items: nextItems });
  }

  function updateQuantity(productId: number, quantity: number) {
    const currentItems = basket?.items ?? [];
    const nextItems = currentItems.map((i) =>
      i.productId === productId ? { ...i, quantity } : i,
    );

    return saveBasket.mutateAsync({ id: basket?.id ?? 0, items: nextItems });
  }

  function removeItem(productId: number) {
    const currentItems = basket?.items ?? [];
    const nextItems = currentItems.filter((i) => i.productId !== productId);

    return saveBasket.mutateAsync({ id: basket?.id ?? 0, items: nextItems });
  }

  function clearBasket() {
    return deleteBasket.mutateAsync();
  }

  return {
    basket,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    clearBasket,
    isSaving: saveBasket.isPending,
    isClearing: deleteBasket.isPending,
  };
}
