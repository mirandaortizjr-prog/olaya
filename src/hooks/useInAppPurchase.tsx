import { useState, useEffect } from 'react';
import { 
  initializeIAP, 
  getProducts, 
  purchaseProduct, 
  restorePurchases,
  checkSubscriptionStatus,
  handlePurchaseSuccess,
  PRODUCT_IDS,
  type Product,
  type PurchaseResult,
  type ProductId
} from '@/utils/inAppPurchases';
import { useToast } from '@/hooks/use-toast';

export const useInAppPurchase = (userId: string) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize IAP on mount
  useEffect(() => {
    const init = async () => {
      const success = await initializeIAP();
      setIsInitialized(success);
      
      if (success && userId) {
        // Load products
        const allProducts = await getProducts([
          PRODUCT_IDS.PREMIUM_MONTHLY,
          PRODUCT_IDS.PREMIUM_TRIAL,
          PRODUCT_IDS.COIN_PACK_100,
          PRODUCT_IDS.COIN_PACK_500,
          PRODUCT_IDS.COIN_PACK_1000,
        ]);
        setProducts(allProducts);

        // Check subscription status
        const hasSubscription = await checkSubscriptionStatus(userId);
        setIsPremium(hasSubscription);
      }
    };

    init();
  }, [userId]);

  // Purchase a product
  const purchase = async (productId: ProductId): Promise<PurchaseResult> => {
    if (!isInitialized) {
      toast({
        title: 'Not Available',
        description: 'In-app purchases are only available on mobile devices',
        variant: 'destructive',
      });
      return { success: false, productId, error: 'Not initialized' };
    }

    setIsLoading(true);
    try {
      const result = await purchaseProduct(productId, userId);
      
      if (result.success && result.transactionId) {
        // Handle the successful purchase
        await handlePurchaseSuccess(userId, productId, result.transactionId);
        
        // Update premium status if it was a subscription
        if (productId === PRODUCT_IDS.PREMIUM_MONTHLY || productId === PRODUCT_IDS.PREMIUM_TRIAL) {
          setIsPremium(true);
        }

        toast({
          title: 'Purchase Successful! 🎉',
          description: 'Your purchase has been completed successfully',
        });
      } else {
        toast({
          title: 'Purchase Failed',
          description: result.error || 'Something went wrong',
          variant: 'destructive',
        });
      }

      return result;
    } catch (error: any) {
      toast({
        title: 'Purchase Error',
        description: error.message || 'Failed to complete purchase',
        variant: 'destructive',
      });
      return { success: false, productId, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Restore previous purchases
  const restore = async (): Promise<boolean> => {
    if (!isInitialized) {
      toast({
        title: 'Not Available',
        description: 'Restore is only available on mobile devices',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      const success = await restorePurchases(userId);
      
      if (success) {
        // Refresh subscription status
        const hasSubscription = await checkSubscriptionStatus(userId);
        setIsPremium(hasSubscription);

        toast({
          title: 'Restore Successful',
          description: 'Your purchases have been restored',
        });
      } else {
        toast({
          title: 'No Purchases Found',
          description: 'No previous purchases to restore',
        });
      }

      return success;
    } catch (error: any) {
      toast({
        title: 'Restore Failed',
        description: error.message || 'Failed to restore purchases',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isInitialized,
    isPremium,
    products,
    isLoading,
    purchase,
    restore,
  };
};
