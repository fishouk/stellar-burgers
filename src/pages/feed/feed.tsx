import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/slices/feedsSlice';
import { getIngredients } from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.feeds);
  const { ingredients, loading: ingredientsLoading } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(getFeeds());
    if (!ingredients.length) {
      dispatch(getIngredients());
    }
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  if (
    loading ||
    ingredientsLoading ||
    orders.length === 0 ||
    ingredients.length === 0
  ) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
