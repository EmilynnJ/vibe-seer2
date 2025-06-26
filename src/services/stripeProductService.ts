import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  images: string[];
  metadata: Record<string, string>;
  created: number;
  updated: number;
  active: boolean;
  default_price?: {
    id: string;
    unit_amount: number;
    currency: string;
  };
}

export interface LocalProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: 'services' | 'digital' | 'physical';
  seller: string;
  stripeProductId?: string;
  stripePriceId?: string;
}

export class StripeProductService {
  private static instance: StripeProductService;
  private apiUrl = 'https://soulseer-api.herokuapp.com/api';

  private constructor() {}

  static getInstance(): StripeProductService {
    if (!StripeProductService.instance) {
      StripeProductService.instance = new StripeProductService();
    }
    return StripeProductService.instance;
  }

  // Sync all products with Stripe
  async syncProductsWithStripe(): Promise<{ 
    success: boolean; 
    syncedCount: number; 
    createdCount: number; 
    updatedCount: number; 
    error?: string; 
  }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.apiUrl}/admin/sync-stripe-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Product sync error:', error);
      return {
        success: false,
        syncedCount: 0,
        createdCount: 0,
        updatedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Create product in Stripe
  async createStripeProduct(product: LocalProduct): Promise<{ success: boolean; stripeProduct?: StripeProduct; error?: string }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.apiUrl}/admin/create-stripe-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: product.title,
          description: product.description,
          images: [product.image],
          metadata: {
            localProductId: product.id,
            category: product.category,
            seller: product.seller,
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        throw new Error(`Product creation failed: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, stripeProduct: result.product };
    } catch (error) {
      console.error('Create Stripe product error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Update product in Stripe
  async updateStripeProduct(
    stripeProductId: string, 
    updates: Partial<LocalProduct>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const updateData: any = {};
      
      if (updates.title) updateData.name = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.image) updateData.images = [updates.image];
      
      if (updates.category || updates.seller) {
        updateData.metadata = {};
        if (updates.category) updateData.metadata.category = updates.category;
        if (updates.seller) updateData.metadata.seller = updates.seller;
      }

      const response = await fetch(`${this.apiUrl}/admin/update-stripe-product/${stripeProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Product update failed: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Update Stripe product error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Delete product from Stripe
  async deleteStripeProduct(stripeProductId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.apiUrl}/admin/delete-stripe-product/${stripeProductId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Product deletion failed: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Delete Stripe product error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get all Stripe products
  async getStripeProducts(): Promise<{ success: boolean; products?: StripeProduct[]; error?: string }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.apiUrl}/admin/stripe-products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, products: result.products };
    } catch (error) {
      console.error('Get Stripe products error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Update product price in Stripe
  async updateStripePrice(
    stripeProductId: string, 
    newPrice: number
  ): Promise<{ success: boolean; stripePriceId?: string; error?: string }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.apiUrl}/admin/update-stripe-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: stripeProductId,
          unit_amount: Math.round(newPrice * 100), // Convert to cents
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        throw new Error(`Price update failed: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, stripePriceId: result.priceId };
    } catch (error) {
      console.error('Update Stripe price error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Batch sync operations
  async batchSyncProducts(products: LocalProduct[]): Promise<{
    success: boolean;
    results: Array<{
      productId: string;
      success: boolean;
      stripeProductId?: string;
      error?: string;
    }>;
  }> {
    const results = [];
    
    for (const product of products) {
      try {
        let result;
        
        if (product.stripeProductId) {
          // Update existing product
          result = await this.updateStripeProduct(product.stripeProductId, product);
          results.push({
            productId: product.id,
            success: result.success,
            stripeProductId: product.stripeProductId,
            error: result.error
          });
        } else {
          // Create new product
          result = await this.createStripeProduct(product);
          results.push({
            productId: product.id,
            success: result.success,
            stripeProductId: result.stripeProduct?.id,
            error: result.error
          });
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        results.push({
          productId: product.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    return {
      success: successCount === products.length,
      results
    };
  }

  // Check sync status
  async checkSyncStatus(): Promise<{
    totalProducts: number;
    syncedProducts: number;
    unsyncedProducts: number;
    lastSyncDate?: string;
  }> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${this.apiUrl}/admin/sync-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get sync status: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Check sync status error:', error);
      return {
        totalProducts: 0,
        syncedProducts: 0,
        unsyncedProducts: 0
      };
    }
  }
}

export default StripeProductService.getInstance();