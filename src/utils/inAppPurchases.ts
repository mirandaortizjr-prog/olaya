import { Capacitor } from '@capacitor/core';
import { CapacitorPurchases } from '@capgo/capacitor-purchases';
import { supabase } from '@/integrations/supabase/client';

/**
 * In-App Purchase Product IDs
 * These must match your Google Play Console product IDs
 */
export const PRODUCT_IDS = {
  PREMIUM_MONTHLY: 'premium_monthly',
  PREMIUM_TRIAL: 'premium_trial_3day',
  COIN_PACK_100: 'coin_pack_100',
  COIN_PACK_500: 'coin_pack_500',
  COIN_PACK_1000: 'coin_pack_1000',
} as const;

export type ProductId = typeof PRODUCT_IDS[keyof typeof PRODUCT_IDS];

export interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  currency: string;
}

export interface PurchaseResult {
  success: boolean;
  productId: string;
  transactionId?: string;
  error?: string;
}

/**
 * Initialize the In-App Purchase system
 * Call this once when the app starts
 */
export const initializeIAP = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('IAP: Not on native platform, skipping initialization');
    return false;
  }

  try {
    // Configure the purchases plugin with your RevenueCat API key
    // You'll need to set this up at: https://app.revenuecat.com/
    await CapacitorPurchases.setDebugLogsEnabled({ enabled: true });
    
    console.log('IAP: Initialized successfully');
    return true;
  } catch (error) {
    console.error('IAP: Initialization failed:', error);
    return false;
  }
};

/**
 * Get available products from the store
 * Note: This is a simplified version. You'll need to configure products in RevenueCat
 */
export const getProducts = async (productIds: string[]): Promise<Product[]> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('IAP: Not on native platform, returning mock products');
    // Return mock products for web preview
    return [
      {
        productId: PRODUCT_IDS.PREMIUM_MONTHLY,
        title: 'Premium Monthly',
        description: 'Monthly premium subscription',
        price: '$12.99',
        priceValue: 12.99,
        currency: 'USD',
      },
      {
        productId: PRODUCT_IDS.PREMIUM_TRIAL,
        title: '3-Day Free Trial',
        description: 'Try premium free for 3 days',
        price: '$0.00',
        priceValue: 0,
        currency: 'USD',
      },
    ];
  }

  try {
    // Get offerings from RevenueCat
    const { offerings } = await CapacitorPurchases.getOfferings();
    
    if (offerings.current && offerings.current.availablePackages) {
      return offerings.current.availablePackages.map(pkg => ({
        productId: pkg.identifier,
        title: pkg.product.title,
        description: pkg.product.description,
        price: pkg.product.priceString,
        priceValue: pkg.product.price,
        currency: pkg.product.currencyCode,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('IAP: Failed to get products:', error);
    return [];
  }
};

/**
 * Purchase a product
 */
export const purchaseProduct = async (
  productId: string,
  userId: string
): Promise<PurchaseResult> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('IAP: Not on native platform, simulating purchase');
    return {
      success: false,
      productId,
      error: 'In-app purchases only available on mobile devices',
    };
  }

  try {
    // First, get the offerings
    const { offerings } = await CapacitorPurchases.getOfferings();
    
    if (!offerings.current) {
      return {
        success: false,
        productId,
        error: 'No offerings available',
      };
    }

    // Find the package to purchase
    const packageToPurchase = offerings.current.availablePackages.find(
      pkg => pkg.identifier === productId
    );

    if (!packageToPurchase) {
      return {
        success: false,
        productId,
        error: 'Product not found',
      };
    }

    // Make the purchase
    const result = await CapacitorPurchases.purchasePackage({
      identifier: packageToPurchase.identifier,
      offeringIdentifier: offerings.current.identifier,
    });

    if (result.customerInfo) {
      // Check if purchase was successful
      const entitlements = result.customerInfo.entitlements.active;
      
      if (Object.keys(entitlements).length > 0) {
        // Verify purchase on backend
        await verifyPurchase(userId, productId);
        
        return {
          success: true,
          productId,
          transactionId: Object.keys(entitlements)[0],
        };
      }
    }

    return {
      success: false,
      productId,
      error: 'Purchase completed but verification failed',
    };
  } catch (error: any) {
    console.error('IAP: Purchase failed:', error);
    return {
      success: false,
      productId,
      error: error.message || 'Purchase failed',
    };
  }
};

/**
 * Restore previous purchases
 */
export const restorePurchases = async (userId: string): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    const result = await CapacitorPurchases.restorePurchases();
    
    if (result.customerInfo) {
      const entitlements = result.customerInfo.entitlements.active;
      
      if (Object.keys(entitlements).length > 0) {
        // Restore access in database
        for (const entitlementId of Object.keys(entitlements)) {
          const entitlement = entitlements[entitlementId];
          await verifyPurchase(userId, entitlement.productIdentifier);
        }
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('IAP: Restore failed:', error);
    return false;
  }
};

/**
 * Verify a purchase on the backend
 */
const verifyPurchase = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  try {
    // Grant premium access in your database
    if (productId === PRODUCT_IDS.PREMIUM_MONTHLY || productId === PRODUCT_IDS.PREMIUM_TRIAL) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (productId === PRODUCT_IDS.PREMIUM_TRIAL ? 3 : 30));
      
      await supabase.from('user_subscriptions').upsert({
        user_id: userId,
        product_id: productId,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      });
    } else if (productId.startsWith('coin_pack_')) {
      // Grant coins
      const coinAmount = parseInt(productId.split('_')[2]);
      
      // Add coins via transaction
      await supabase.from('coin_transactions').insert({
        user_id: userId,
        amount: coinAmount,
        transaction_type: 'purchase',
        description: `Purchased ${coinAmount} coin pack`,
      });
    }

    return true;
  } catch (error) {
    console.error('IAP: Verification failed:', error);
    return false;
  }
};

/**
 * Check if user has an active subscription
 */
export const checkSubscriptionStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('user_subscriptions')
      .select('status, expires_at')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (!data) return false;

    // Check if subscription is still valid
    const expiresAt = new Date(data.expires_at);
    return expiresAt > new Date();
  } catch (error) {
    console.error('IAP: Failed to check subscription:', error);
    return false;
  }
};

/**
 * Handle purchase success - grant premium access or coins
 */
export const handlePurchaseSuccess = async (
  userId: string,
  productId: string,
  transactionId: string
): Promise<void> => {
  await verifyPurchase(userId, productId);
};
