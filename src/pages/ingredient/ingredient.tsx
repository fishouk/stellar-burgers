import { FC } from 'react';
import { IngredientDetails } from '@components';
import styles from './ingredient.module.css';

export const Ingredient: FC = () => (
  <div className={styles.container}>
    <h1 className={`${styles.title} text text_type_main-large mt-30`}>
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </div>
);
