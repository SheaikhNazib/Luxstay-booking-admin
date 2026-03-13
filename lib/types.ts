export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingItem {
  id: string;
  userName: string;
  email: string;
  serviceId: string;
  checkInDate: string;
  checkOutDate: string;
  price: number;
  stripeSessionId?: string | null;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  service?: ServiceItem | null;
}