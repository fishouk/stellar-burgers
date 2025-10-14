import { FC } from 'react';
import { OrderInfo } from '@components';
import styles from './order.module.css';

export const Order: FC = () => (
  <div className={styles.container}>
    <OrderInfo />
  </div>
);
