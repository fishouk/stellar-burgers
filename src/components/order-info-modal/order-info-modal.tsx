import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';

type OrderInfoModalProps = {
  onClose: () => void;
};

export const OrderInfoModal: FC<OrderInfoModalProps> = ({ onClose }) => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? `#${String(number).padStart(6, '0')}` : '';

  return (
    <Modal title={orderNumber} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};
