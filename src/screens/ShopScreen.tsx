import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../state/appStore';
import BackgroundImage from '../components/BackgroundImage';
import PaymentService from '../services/paymentService';

const shopCategories = ['All', 'Services', 'Digital', 'Physical'];

export default function ShopScreen() {
  const navigation = useNavigation();
  const { products, user } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'services' | 'digital' | 'physical'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // Default popular sort
    });

  const [cart, setCart] = useState<any[]>([]);
  const [checkoutModal, setCheckoutModal] = useState(false);

  // Sample products if none exist
  useEffect(() => {
    if (products.length === 0) {
      // Add sample products for demo
      const sampleProducts = [
        {
          id: '1',
          title: 'Tarot Card Reading - Full Spread',
          price: 45.99,
          image: '🔮',
          category: 'services',
          description: 'Comprehensive 10-card tarot reading with detailed interpretation',
          seller: 'Luna Moonwhisper'
        },
        {
          id: '2',
          title: 'Crystal Energy Healing Session',
          price: 65.00,
          image: '💎',
          category: 'services',
          description: 'Remote crystal healing session for chakra alignment',
          seller: 'Crystal Starlight'
        },
        {
          id: '3',
          title: 'Digital Oracle Cards PDF',
          price: 12.99,
          image: '📱',
          category: 'digital',
          description: 'Downloadable set of 44 oracle cards with guidebook',
          seller: 'Spiritual Downloads'
        },
        {
          id: '4',
          title: 'Blessed Sage Bundle',
          price: 18.50,
          image: '🌿',
          category: 'physical',
          description: 'Hand-picked white sage bundle for cleansing rituals',
          seller: 'Earth Elements'
        }
      ];
      // Note: In production, these would be loaded from the database
    }
  }, [products]);

  const addToCart = (product: any) => {
    if (!user.isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please sign in to purchase ' + product.title,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth' as never) }
        ]
      );
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    Alert.alert('Added to Cart', `"${product.title}" has been added to your cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checking out');
      return;
    }

    try {
      const totalAmount = getTotalPrice();
      const productIds = cart.map(item => item.id);
      
      // Create payment intent
      const paymentIntent = await PaymentService.createShopPaymentIntent(totalAmount, productIds);
      
      // For demo purposes, simulate successful payment
      Alert.alert(
        'Purchase Successful!',
        `Your order for ${totalAmount.toFixed(2)} has been processed. You will receive a confirmation email shortly.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setCart([]);
              setCheckoutModal(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Checkout Failed', 'Unable to process your order. Please try again.');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'services': return 'person';
      case 'digital': return 'download';
      case 'physical': return 'cube';
      default: return 'storefront';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'services': return 'bg-blue-100 text-blue-700';
      case 'digital': return 'bg-green-100 text-green-700';
      case 'physical': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <BackgroundImage>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 bg-black/40 backdrop-blur-sm border-b border-white/10">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-2xl font-bold">Spiritual Shop</Text>
              <Text className="text-white/80 text-sm">Discover tools for your journey</Text>
            </View>
            <Pressable
              onPress={() => setCheckoutModal(true)}
              className="relative bg-black/40 backdrop-blur-sm rounded-full p-3 border border-white/20"
            >
              <Ionicons name="bag" size={24} color="white" />
              {cart.length > 0 && (
                <View className="absolute -top-1 -right-1 bg-purple-600 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-bold">{cart.length}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

      {/* Search Bar */}
      <View className="px-4 py-3 bg-gray-50">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search products, services, and more..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-gray-900"
          />
          {searchQuery !== '' && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <View className="py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {shopCategories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category.toLowerCase() as any)}
              className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
                (selectedCategory === 'All' && category === 'All') || 
                (selectedCategory !== 'All' && category.toLowerCase() === selectedCategory)
                  ? 'bg-indigo-600'
                  : 'bg-gray-100'
              }`}
            >
              <Ionicons 
                name={getCategoryIcon(category.toLowerCase())} 
                size={16} 
                color={(selectedCategory === 'All' && category === 'All') || 
                      (selectedCategory !== 'All' && category.toLowerCase() === selectedCategory)
                      ? 'white' : '#666'} 
              />
              <Text className={`font-medium ml-1 ${
                (selectedCategory === 'All' && category === 'All') || 
                (selectedCategory !== 'All' && category.toLowerCase() === selectedCategory) 
                  ? 'text-white' : 'text-gray-700'
              }`}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Sort and Results */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-gray-50">
        <Text className="text-gray-600 font-medium">
          {filteredProducts.length} items found
        </Text>
        <View className="flex-row items-center">
          <Text className="text-gray-600 text-sm mr-2">Sort by:</Text>
          <Pressable
            onPress={() => setSortBy(
              sortBy === 'popular' ? 'price-low' : 
              sortBy === 'price-low' ? 'price-high' : 'popular'
            )}
            className="flex-row items-center bg-white px-3 py-1 rounded-lg"
          >
            <Text className="text-indigo-600 font-medium text-sm">
              {sortBy === 'popular' ? 'Popular' : 
               sortBy === 'price-low' ? 'Price: Low' : 'Price: High'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#4F46E5" />
          </Pressable>
        </View>
      </View>

      {/* Products Grid */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          <View className="flex-row flex-wrap justify-between">
            {filteredProducts.map((product) => (
              <Pressable
                key={product.id}
                onPress={() => addToCart(product)}
                className="w-[48%] mb-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Product Image */}
                <View className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center">
                  <Text className="text-4xl">{product.image}</Text>
                </View>

                {/* Product Info */}
                <View className="p-3">
                  <View className={`self-start rounded-full px-2 py-1 mb-2 ${getCategoryColor(product.category)}`}>
                    <Text className="text-xs font-medium capitalize">{product.category}</Text>
                  </View>
                  
                  <Text className="font-bold text-gray-900 text-sm mb-1" numberOfLines={2}>
                    {product.title}
                  </Text>
                  
                  <Text className="text-xs text-gray-600 mb-2" numberOfLines={2}>
                    {product.description}
                  </Text>
                  
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-bold text-indigo-600">
                      ${product.price}
                    </Text>
                    <View className="bg-indigo-600 rounded-lg px-3 py-1">
                      <Text className="text-white text-xs font-medium">Add to Cart</Text>
                    </View>
                  </View>
                  
                  <Text className="text-xs text-gray-500 mt-1">
                    by {product.seller}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {filteredProducts.length === 0 && (
          <View className="items-center justify-center py-12">
            <Ionicons name="storefront" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg font-medium mt-4">No products found</Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              Try adjusting your search or category filters
            </Text>
          </View>
        )}

        {/* Featured Sellers Section */}
        <View className="mx-4 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Featured Sellers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Luna Moonwhisper', 'Crystal Starlight', 'Zen Master', 'Crystal Shop'].map((seller, index) => (
              <Pressable
                key={seller}
                className="mr-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4 w-32 items-center"
              >
                <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center mb-2">
                  <Text className="text-lg">
                    {index === 0 ? '🌙' : index === 1 ? '🔮' : index === 2 ? '🧘' : '💎'}
                  </Text>
                </View>
                <Text className="font-medium text-gray-900 text-center text-sm" numberOfLines={2}>
                  {seller}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={12} color="#FFA500" />
                  <Text className="text-xs text-gray-600 ml-1">4.{8 + index}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Promotion Banner */}
        <View className="mx-4 mb-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4">
          <Text className="text-white text-lg font-bold">Seller Program</Text>
          <Text className="text-white/90 text-sm mt-1">
            Share your spiritual products and services with our community.
          </Text>
          <Pressable className="bg-white/20 rounded-lg px-4 py-2 mt-3 self-start">
            <Text className="text-white font-medium">Become a Seller</Text>
          </Pressable>
        </View>
        </ScrollView>

        {/* Checkout Modal */}
        <Modal visible={checkoutModal} animationType="slide" presentationStyle="pageSheet">
          <BackgroundImage>
            <SafeAreaView className="flex-1">
              <View className="flex-1 px-6">
                {/* Header */}
                <View className="flex-row items-center justify-between py-4">
                  <Text className="text-white text-xl font-bold">Shopping Cart</Text>
                  <Pressable
                    onPress={() => setCheckoutModal(false)}
                    className="w-8 h-8 bg-black/40 rounded-full items-center justify-center"
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </Pressable>
                </View>

                {cart.length === 0 ? (
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="bag-outline" size={64} color="rgba(255,255,255,0.5)" />
                    <Text className="text-white/70 text-lg font-medium mt-4">Your cart is empty</Text>
                    <Text className="text-white/50 text-center mt-2">
                      Add some items to get started
                    </Text>
                  </View>
                ) : (
                  <>
                    <ScrollView className="flex-1 mb-6">
                      {cart.map((item, index) => (
                        <View key={item.id} className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-3">
                          <View className="flex-row">
                            <View className="w-16 h-16 bg-purple-100 rounded-lg items-center justify-center mr-4">
                              <Text className="text-2xl">{item.image}</Text>
                            </View>
                            <View className="flex-1">
                              <Text className="text-white font-bold text-base" numberOfLines={2}>
                                {item.title}
                              </Text>
                              <Text className="text-white/70 text-sm">by {item.seller}</Text>
                              <Text className="text-purple-300 font-bold text-lg">
                                ${item.price.toFixed(2)}
                              </Text>
                            </View>
                            <View className="items-end">
                              <Pressable
                                onPress={() => removeFromCart(item.id)}
                                className="w-8 h-8 bg-red-500/20 rounded-full items-center justify-center mb-2"
                              >
                                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                              </Pressable>
                              <View className="flex-row items-center bg-black/30 rounded-lg">
                                <Pressable
                                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 items-center justify-center"
                                >
                                  <Ionicons name="remove" size={16} color="white" />
                                </Pressable>
                                <Text className="text-white px-3 font-medium">{item.quantity}</Text>
                                <Pressable
                                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 items-center justify-center"
                                >
                                  <Ionicons name="add" size={16} color="white" />
                                </Pressable>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </ScrollView>

                    {/* Total and Checkout */}
                    <View className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-4">
                      <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-lg font-bold">Total:</Text>
                        <Text className="text-purple-300 text-2xl font-bold">
                          ${getTotalPrice().toFixed(2)}
                        </Text>
                      </View>
                      
                      <Pressable
                        onPress={handleCheckout}
                        className="bg-purple-600/80 backdrop-blur-sm rounded-xl py-4 items-center border border-purple-400/50"
                      >
                        <Text className="text-white text-lg font-bold">
                          Checkout - ${getTotalPrice().toFixed(2)}
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            </SafeAreaView>
          </BackgroundImage>
        </Modal>
      </SafeAreaView>
    </BackgroundImage>
  );
}