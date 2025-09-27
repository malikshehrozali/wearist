import { Router } from "express";
import { Order } from "../models/order.model.js";
import stripe from "stripe";
import express from "express";

const router = Router()
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, userId, customerEmail, successUrl, cancelUrl } = req.body;
    
    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order in database first
    const order = new Order({
      userId,
      items,
      totalAmount,
      customerEmail,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    await order.save();
    
    // Prepare line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || '',
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${cancelUrl}?order_id=${order._id}`,
      customer_email: customerEmail,
      metadata: {
        orderId: order._id.toString(),
        userId: userId
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'],
      },
      billing_address_collection: 'required',
    });

    // Update order with Stripe session ID
    order.stripeSessionId = session.id;
    await order.save();

    res.json({ 
      sessionId: session.id, 
      url: session.url,
      orderId: order._id 
    });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enhanced webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Update order in database
        await Order.findByIdAndUpdate(session.metadata.orderId, {
          status: 'paid',
          paymentStatus: 'succeeded',
          stripeSessionId: session.id
        });
        
        console.log('Order payment completed:', session.metadata.orderId);
        
        // Here you could:
        // - Send confirmation email
        // - Update inventory
        // - Trigger fulfillment process
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        
        if (failedPayment.metadata.orderId) {
          await Order.findByIdAndUpdate(failedPayment.metadata.orderId, {
            status: 'payment_failed',
            paymentStatus: 'failed'
          });
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).send('Webhook handler failed');
  }

  res.json({ received: true });
});


export default router