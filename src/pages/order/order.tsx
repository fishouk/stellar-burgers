import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { OrderInfo } from '@components';
import styles from './order.module.css';

export const Order: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? `#${String(number).padStart(6, '0')}` : '';

  return (
    <div className={styles.container}>
      <h3 className='text text_type_digits-default mb-10'>{orderNumber}</h3>
      <OrderInfo />
    </div>
  );
};
