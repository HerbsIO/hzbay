const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const adminRoutes = require('./admin/admin'); // Import your admin routes
const app = express();
const port = process.env.PORT || 3000;
const uuidv4 = require('uuid');
const isValidUSZip = require('is-valid-us-zip');
const writeOrder = require('./database/writeOrder');

// Middleware to parse JSON data and URL-encoded data for all routes except the webhook


app.use(express.urlencoded({ extended: true }));


// Define products array
const listings = require('./listings_categorized.json');
const products = Object.values(listings).flat();


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URI;
// Create MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Function to verify items price
function verifyItemsPrice(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    const dbItem = products.find(p => p.id === items[i].id);
    if (dbItem) {
      total += Number(dbItem.price.replace('US $', '')) * items[i].quantity;
    } else {
      throw new Error(`Product with id ${items[i].id} not found`);
    }
  }
  return total * 100; // Amount in cents
}
app.use(express.static(path.join(__dirname, 'web', 'build')));

// Admin routes
app.use('/admin', express.json(), adminRoutes);
app.use((req, res, next) => {
  if (req.hostname === 'hz-bay.com') {
    res.redirect(301, `https://www.hz-bay.com${req.originalUrl}`);
  } else {
    next();
  }
});
app.get('/defaultsite', (req, res) => {
  res.redirect(301, `https://www.hz-bay.com`);
})

// Stripe payment endpoint

const zipError = new Error("Invalid US Zip code");

app.post('/create-payment-intent', express.json(), async (req, res) => {
  const amount = req.body.amount == 0 ? 2000 : req.body.amount.toFixed(0);
  const items = req.body.items.map(({ description, title, images, ...item }) => item);;

  const email = req.body.email === '' ? "john@email.com" : req.body.email;
  const deliveryDetails = req.body.address;
  console.log(req.body);
  try {

    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { items: JSON.stringify(items) },
      receipt_email: email,
      shipping: {
        name: deliveryDetails.name,
        address: {
          line1: deliveryDetails.address,
          city: deliveryDetails.city,
          state: deliveryDetails.state,
          postal_code: deliveryDetails.zip,
        }
      }
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    //console.error('Error creating payment intent:', error.message);
    res.status(500).send({ error: error.message });
  }
});

// Stripe webhook endpoint for handling payment events
const endpointSecret = process.env.ENDPOINT_SECRET;
app.post('/stripe_webhooks', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const items = JSON.parse(paymentIntent.metadata.items);
      console.log('PaymentIntent was successful!');
      console.log('Purchased items:', items);
      try {
        // Connect the client to the server
        const order = {
          id: uuidv4(),
          items: items,
          amount: paymentIntent.amount,
          deliveryDetails: paymentIntent.shipping
        }
        writeOrder(order)

        const allProducts = Object.values(listings).flat();
      
        const emailData = cartItems.map(item => {
          const matchedProduct = allProducts.find(product => product.id === item.id);
          return matchedProduct ? {
            title: matchedProduct.title,
            price: matchedProduct.price,
            quantity: item.quantity
          } : null;
        }).filter(item => item !== null);
      
        //Send confirmation email:
        //sendEmail(receiptEmail,deliveryDetails.name, emailData, paymentIntent.id)
        // Send a ping to confirm a successful connection
        console.log("Order Placed: ");
        res.send(200).send('Order Placed');
      }
      catch (err) {
        res.status(400).send(`Error finalizing order: ${err.message}`);
      }

      // TODO: Handle successful payment and store order details in your database
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      console.log(`PaymentIntent ${paymentIntentFailed.id} failed.`);

      break;
    case 'payment_intent.canceled':
      const paymentIntentCanceled = event.data.object;
      console.log(`PaymentIntent ${paymentIntentCanceled.id} was canceled.`);

      break;
    case 'payment_intent.processing':
      const paymentIntentProcessing = event.data.object;
      console.log(`PaymentIntent ${paymentIntentProcessing.id} is processing.`);
      break;
    case 'payment_intent.created':
      const paymentIntentCreated = event.data.object;
      console.log(`PaymentIntent ${paymentIntentCreated.id} requires action.`);
      res.send(200)
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

app.post('/update-payment-intent', express.json(), async (req, res) => {
  const paymentIntentId = req.body.paymentIntentId;
  const amount = Number(req.body.amount).toFixed(0);
  const items = req.body.items;
  const deliveryDetails = req.body.address;
  const email = req.body.email;


  try {
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      amount: String(amount),
      metadata: { items: JSON.stringify(items) },
      receipt_email: email,
      shipping: {
        name: deliveryDetails.name,
        address: {
          line1: deliveryDetails.address,
          city: deliveryDetails.city,
          state: deliveryDetails.state,
          postal_code: deliveryDetails.zip,
        }
      }

    })

    res.json({ paymentIntent });
  } catch (error) {
    console.error('Error updating payment intent:' + error);
    res.status(500).send({ error: error.message });
  }
});

app.use('/images', express.static(path.join(__dirname, 'web', 'build', 'images'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif')) {
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days in seconds
      console.log("nono this one")
    }
  }
}));

// Serve index.html for all other routes (SPA support)
app.get('*', express.json(), (req, res) => {
  if (req.path === '/products.json') {
    res.sendFile(path.join(__dirname, 'listings_categorized.json'));
  } else if (req.path === '/privacy') {
    res.sendFile(path.join(__dirname, 'privacy.txt'));
  } else if (req.path.includes('images')) {
    res.setHeader('Cache-Control', 'public, max-age=2592000');
    console.log("usingg this one")
  } else {
    res.sendFile(path.join(__dirname, './web/build', 'index.html'));
  }
});

app.get('/products.json', (req, res) => {

  res.sendFile(path.join(__dirname, 'listings_categorized.json'));
});


app.get('/favicon.ico', (req, res) => {

  res.sendStatus(200)
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
