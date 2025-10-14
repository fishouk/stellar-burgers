import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { useParams, useLocation } from 'react-router-dom';
import { getFeeds } from '../../services/slices/feedsSlice';
import { getUserOrders } from '../../services/slices/userOrdersSlice';
import { getIngredients } from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  const { ingredients, loading: ingredientsLoading } = useSelector(
    (state) => state.ingredients
  );

  const isProfileOrders = location.pathname.includes('/profile/orders');
  const { orders: feedOrders, loading: feedLoading } = useSelector(
    (state) => state.feeds
  );
  const { orders: userOrders, loading: userOrdersLoading } = useSelector(
    (state) => state.userOrders
  );

  const orders = isProfileOrders ? userOrders : feedOrders;
  const ordersLoading = isProfileOrders ? userOrdersLoading : feedLoading;

  useEffect(() => {
    if (!ingredients.length && !ingredientsLoading) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients.length, ingredientsLoading]);

  useEffect(() => {
    if (!orders.length && !ordersLoading) {
      if (isProfileOrders) {
        dispatch(getUserOrders());
      } else {
        dispatch(getFeeds());
      }
    }
  }, [dispatch, orders.length, ordersLoading, isProfileOrders]);

  const orderData = orders.find((order) => order.number === Number(number));

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (ingredientsLoading || ordersLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
