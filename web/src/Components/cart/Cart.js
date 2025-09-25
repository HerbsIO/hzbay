import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Cookies from 'js-cookie';
import './Cart.css';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';


const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true,
};
const stripePromise = loadStripe('pk_live_51Pc1vG2N1dHg91tD6g74gJOkFRcRqA9QKMTCs3rOF6LmzGaINAyTa6Omt8vpFnIOvdCyGT4oqR2LHiiY3oAEbgOd00ZXHH3KNS');
const uid = uuidv4();
const CheckoutForm = ({
  clientSecret,
  onClose,
  total,
  shipping,
  totalPrice,
  deliveryDetails,
  email,
  handleInputChange,
  setEmail,
  setPaymentComplete,
  clearCart
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: deliveryDetails.name,
            email: email,
            address: {
              line1: deliveryDetails.address,
              city: deliveryDetails.city,
              state: deliveryDetails.state,
              postal_code: deliveryDetails.zip,
            },
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        console.log('Payment successful:', paymentIntent);
        try {
          clearCart(); // Clear the cart on successful payment
        } catch(e) {
          console.log('failed to clear cart')
        }
        
        setPaymentComplete(true); // Set payment complete status
        navigate('/order');
        onClose();
      }
    } catch (error) {
      console.error('Error confirming payment:', error.message);
      setError('Failed to process payment');
    }

    setPaymentProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form p-4 border rounded bg-white">
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          name="name"
          value={deliveryDetails.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Address</label>
        <input
          type="text"
          className="form-control"
          placeholder="1234 Main St"
          name="address"
          value={deliveryDetails.address}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="row mb-3">
        <div className="col-md-6 mb-3 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="City"
            name="city"
            value={deliveryDetails.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="State"
            name="state"
            value={deliveryDetails.state}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Zip Code"
          name="zip"
          value={deliveryDetails.zip}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Card details</label>
        <div className="form-control p-2 stripe-element-container">
        <CardElement className="form-control" options={cardElementOptions}/>
        </div>
      </div>
      {error && <div className="text-danger mb-3">{error}</div>}
      <hr className="my-4" />
      <div className="d-flex justify-content-between mb-3">
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-between mb-3">
        <span>Total (Incl. taxes)</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      <button
        className="btn btn-primary w-100"
        type="submit"
        disabled={!stripe || paymentProcessing || !clientSecret}
      >
        Buy now
      </button>
      {paymentProcessing && <div className="text-center mt-3">Processing...</div>}
    </form>
  );
};
const Cart = ({ isOpen, onClose }) => {
  const [intentId, setIntentId] = useState('');
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState(null);
  const [email, setEmail] = useState(Cookies.get('email') || '');
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: Cookies.get('deliveryName') || '',
    address: Cookies.get('deliveryAddress') || '',
    city: Cookies.get('deliveryCity') || '',
    state: Cookies.get('deliveryState') || '',
    zip: Cookies.get('deliveryZip') || ''
  });
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails({
      ...deliveryDetails,
      [name]: value
    });
    Cookies.set(`delivery${name.charAt(0).toUpperCase() + name.slice(1)}`, value, { expires: 7 });
  };

  const getPriceValue = (priceString) => {
    if (!priceString) return 0;
    const match = priceString.toString().match(/\d+\.\d+/);
    return match ? parseFloat(match[0]) : parseFloat(priceString);
  };

  const total = cartItems.reduce((sum, item) => sum + getPriceValue(item.price) * item.quantity, 0);
  const shipping = 0;
  const totalPrice = total + shipping;


//Update payment-intent
useEffect(() => {
  fetch('/update-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      paymentIntentId: intentId,
      amount: (totalPrice * 100).toFixed(2), // Amount should be in cents
      items: cartItems.map(item => `${item.title.slice(0, 30)}, ${item.price}, (${item.quantity})`).join(', '),
      email: email,
      address: deliveryDetails // Include address details here
    }),
  }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error fetching client secret:', error);
    });
}, [totalPrice]);


  useEffect(() => {
    // Store cart items and delivery details in cookies
    Cookies.set('cartItems', JSON.stringify(cartItems), { expires: 7 });
    Cookies.set('email', email, { expires: 7 });
    Cookies.set('deliveryName', deliveryDetails.name, { expires: 7 });
    Cookies.set('deliveryAddress', deliveryDetails.address, { expires: 7 });
    Cookies.set('deliveryCity', deliveryDetails.city, { expires: 7 });
    Cookies.set('deliveryState', deliveryDetails.state, { expires: 7 });
    Cookies.set('deliveryZip', deliveryDetails.zip, { expires: 7 });

    fetch('/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        orderId: uid,
        amount: totalPrice * 100, // Amount should be in cents
        items: cartItems,
        email: email,
        address: deliveryDetails // Include address details here
      }),
    }).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then((data) => {
        console.log('Client Secret:', data.clientSecret);
        setIntentId(data.paymentIntentId)
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Error fetching client secret:', error);
      });
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Shopping Cart</h5>
          <button type="button" className="close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="container p-8 rounded cart">
            <div className="row no-gutters">
              <div className="col-md-8">
                <div className="product-details mr-2">
                  <p style={{"fontSize": "0.75em"}}>We only deliver to the US</p>
                  <div className="d-flex flex-row align-items-center">
                    <button className="btn btn-link" onClick={onClose}>
                      <i className="fa fa-long-arrow-left"></i> Continue Shopping
                    </button>
                  </div>
                  <hr />
                  <h6 className="mb-0">Shopping cart</h6>
                  <div className="d-flex justify-content-between">
                    <span>You have {cartItems.length} items in your cart</span>

                  </div>
                  {cartItems.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mt-3 p-2 items rounded">
                      <div className="d-flex flex-row align-items-center">
                        <div style={{ width: '60px', height: '60px', overflow: 'hidden' }}>
                          <img 
                            className="rounded" 
                            src={'/images/' + item.imgSrc} 
                            alt={item.title}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'contain'
                            }} 
                          />
                        </div>
                        <div className="ml-2" style={{width: '100%'}}>
                          <p className="font-weight-bold d-block cart-title">{item.title}</p>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center">
                        <span className="d-block">{item.quantity} - </span>
                        <span className="d-block ml-5 font-weight-bold">${(getPriceValue(item.price) * item.quantity).toFixed(2)}</span>
                        <i className="fa fa-trash-o ml-3 text-black-50" onClick={() => removeFromCart(item.id)}></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col">
                <h3>Checkout</h3>
                <div>
                  {paymentComplete ? (
                    <div className="alert alert-success">Payment Complete!</div>
                  ) : clientSecret ? (
                    <Elements stripe={stripePromise}>
                      <CheckoutForm 
                        clientSecret={clientSecret} 
                        onClose={onClose} 
                        total={total} 
                        shipping={shipping} 
                        totalPrice={totalPrice} 
                        deliveryDetails={deliveryDetails} 
                        email={email} 
                        handleInputChange={handleInputChange} 
                        setEmail={setEmail} 
                        clearCart={clearCart}
                        setPaymentComplete={setPaymentComplete}
                      />
                    </Elements>
                  ) : (
                    <div>Loading payment form...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
