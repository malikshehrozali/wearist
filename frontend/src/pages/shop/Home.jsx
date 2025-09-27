import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/Shop/productSlice";
import { addToCart } from "../../store/features/cartSlice";

export default function Home() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const { productList, loading: productsLoading, error: productsError } = useSelector(state => state.products);

  const handleCart = async (product) => {
    try {
      setLoading(true);
      // Pass the product directly, not wrapped in an object
      dispatch(addToCart({product}));
      
      // Optional: Show success feedback
      console.log(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setError("Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await dispatch(fetchProducts()).unwrap();
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to load products");
      }
    };

    loadProducts();
  }, [dispatch]);

  // Show loading state
  if (productsLoading) {
    return (
      <div className="bg-gray-50 md:px-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (productsError || error) {
    return (
      <div className="bg-gray-50 md:px-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{productsError || error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 md:px-20 min-h-screen">
      {/* Hero Slider */}
      <div className="w-full pt-10 mb-10 h-[50vh] md:rounded-lg">
        <Slider {...settings}>
          <div>
            <img
              src="https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhlc3xlbnwwfHwwfHx8MA%3D%3D"
              alt="Fashion Collection Banner"
              className="w-full object-cover h-[50vh] md:rounded-lg"
            />
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2xvdGhlc3xlbnwwfHwwfHx8MA%3D%3D"
              alt="Latest Trends Banner"
              className="w-full object-cover h-[50vh] md:rounded-lg"
            />
          </div>
          <div>
            <img
              src="https://plus.unsplash.com/premium_photo-1700056214664-4bd97cec12b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xvdGhlc3xlbnwwfDB8MHx8fDA%3D"
              alt="Premium Collection Banner"
              className="w-full object-cover h-[50vh] md:rounded-lg"
            />
          </div>
        </Slider>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Products</h2>
        
        {Array.isArray(productList) && productList.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productList.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="overflow-hidden rounded-md mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                </div>

                {/* Product Info */}
                <h3 className="text-gray-800 text-xl font-semibold mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                {product.description && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Description</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {product.description.length > 80 
                        ? `${product.description.substring(0, 80)}...` 
                        : product.description
                      }
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-red-500">
                    ${product.price?.toFixed(2) || '0.00'}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={() => handleCart(product)} 
                  disabled={loading}
                  className="w-full bg-black text-white py-2 px-4 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}