// server.js
const express = require('express');
const stripe = require('stripe')('sk_test_51RAYHoIoIfHXZGbriHa1WIgfpKPD4q0FPtF7uyEhlgc6mxmEHoDrE4HHeJPc1bIGoALvvqcoWIs3Ux91BSFeknSD00cAZ2Tgvg'); // Replace with your Stripe secret key
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const YOUR_DOMAIN = 'https://prototype-3-ovdq.onrender.com'; // Adjust this for production

// Endpoint to create a Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { items, totalPrice } = req.body; // Get items and totalPrice from frontend

  try {
    // Create the checkout session with the items and total price
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'sgd',  // Use the correct currency for your business
          product_data: {
            name: item.name,  // Item name
          },
          unit_amount: item.price * 100,  // Convert price to cents
        },
        quantity: 1,
      })),
      mode: 'payment', // This means the user is paying for the items
      success_url: `${YOUR_DOMAIN}/payment-success`, // Redirect URL after success
      cancel_url: `${YOUR_DOMAIN}/payment-failed`,  // Redirect URL after canceling
    });

    // Send the session id to the frontend
    res.json({ id: session.id });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({ error: error.message });
  }
});

const PORT = 3000;
//app.get('/success', (req, res) => {
 // res.send('Success!');
//});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.get('/payment-success', (req, res) => {
  res.send(`
    <h1>Payment Successful!</h1>
    <p>Thank you for your purchase. You will be redirected shortly...</p>
    <script>
      setTimeout(function() {
        window.location.href = "C:\Users\Neo\Desktop\PROTOTYPE\PROTOTYPE with payment.html";  // Redirect to homepage or another page
      }, 3000);  // Redirect after 3 seconds
    </script>
  `);
});

// Failure route to handle failed payment
app.get('/payment-failed', (req, res) => {
  res.send(`
    <h1>Payment Failed!</h1>
    <p>Something went wrong. Your payment could not be processed. You will be redirected shortly...</p>
    <script>
      setTimeout(function() {
        window.location.href = "C:\Users\Neo\Desktop\PROTOTYPE\PROTOTYPE with payment.html";  // Redirect to homepage or another page
      }, 3000);  // Redirect after 3 seconds
    </script>
  `);
});

