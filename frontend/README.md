# Wearits - Modern E-commerce Platform

A full-stack MERN e-commerce application with Stripe payment integration, built with modern technologies and best practices.

## 🚀 Features

### 🛍️ E-commerce Core
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add, remove, and manage items with persistent storage
- **Secure Checkout**: Stripe-powered payment processing
- **Order Management**: Track orders and payment status
- **User Authentication**: Secure login/register system

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Real-time Updates**: Dynamic cart updates and notifications
- **Loading States**: Professional loading indicators throughout the app
- **Error Handling**: Comprehensive error management and user feedback

### 🔧 Technical Features
- **Redux State Management**: Centralized state with Redux Toolkit
- **Protected Routes**: Role-based access control (Admin/User)
- **Cart Persistence**: LocalStorage integration for cart state
- **Image Handling**: Fallback images and error handling
- **Toast Notifications**: Real-time user feedback with Sonner

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - Efficient Redux state management
- **React Router Dom** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Slick** - Carousel component for hero sections

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Payment & Authentication
- **Stripe** - Payment processing platform
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### UI Components
- **Shadcn/ui** - High-quality, accessible UI components
- **Sonner** - Toast notification system

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Stripe account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/wearits-ecommerce.git
cd wearits-ecommerce
```

### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Environment Variables

**Frontend (.env):**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxx
VITE_API_URL=http://localhost:5000
```

**Backend (.env):**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/wearits
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/wearits

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Server
PORT=5000
NODE_ENV=development
```

### 4. Run the Application

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 🎯 Usage

### Customer Flow
1. **Browse Products**: View product catalog with images, descriptions, and prices
2. **Add to Cart**: Select products and add them to shopping cart
3. **Checkout**: Secure payment processing with Stripe
4. **Order Confirmation**: Receive order confirmation and tracking information

### Admin Flow
1. **Dashboard**: View sales analytics and order statistics
2. **Product Management**: Add, edit, and delete products
3. **Order Management**: Track and manage customer orders
4. **User Management**: View and manage user accounts

## 🧪 Testing

### Test Cards (Stripe)
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Use any future expiry date and any 3-digit CVC.

### Running Tests
```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

## 📁 Project Structure

```
wearits-ecommerce/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   ├── shop/
│   │   │   ├── common/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── admin/
│   │   │   └── shop/
│   │   ├── store/
│   │   │   ├── features/
│   │   │   └── Shop/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id` - Update order status

### Stripe
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout
- `POST /api/stripe/webhook` - Stripe webhook handler
- `GET /api/stripe/payment-status/:id` - Get payment status

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### Backend (Heroku/Railway)
1. Set up MongoDB Atlas for production database
2. Configure environment variables
3. Set up Stripe webhooks for production domain

### Environment Variables for Production
```env
# Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
VITE_API_URL=https://your-api-domain.com

# Backend
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wearits
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Development Guidelines
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stripe](https://stripe.com) for payment processing
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Shadcn/ui](https://ui.shadcn.com) for UI components
- [Lucide](https://lucide.dev) for icons
- [React](https://reactjs.org) team for the amazing framework

## 🐛 Known Issues

- [ ] Mobile cart sheet occasionally doesn't close properly
- [ ] Product image lazy loading needs improvement
- [ ] Search functionality needs debouncing

## 🔮 Roadmap

- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Multi-language support
- [ ] Advanced filtering and search
- [ ] Inventory management
- [ ] Email notifications
- [ ] Social media integration
- [ ] Mobile app development

## 📞 Support

If you need help or have questions:
- Create an issue on GitHub
- Email: malikshehrozali16@gmail.com
- Documentation: [Link to docs]

## 📊 Performance

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: < 1MB (optimized with Vite)
- **Load Time**: < 3s on 3G networks
- **Mobile Responsive**: 100% mobile-friendly

---

**Built with ❤️ by Malik Shehroz Ali**

⭐ If you found this project helpful, please give it a star on GitHub!#   w e a r i s t  
 #   w e a r i s t  
 #   w e a r i s t  
 #   w e a r i s t  
 #   w e a r i s t  
 #   w e a r i s t  
 