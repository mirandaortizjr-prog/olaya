# Payment Setup Guide - Google Play Store

## Overview
Your app is now ready for Google Play Store In-App Purchases (IAP). The infrastructure is in place, but you'll need to complete the following steps to go live.

## 🏗️ What's Already Set Up

✅ **Database Tables**
- `user_subscriptions` - Tracks premium subscriptions with expiration dates
- `coin_transactions` - Tracks coin purchases and usage

✅ **Code Infrastructure**
- `/src/utils/inAppPurchases.ts` - IAP utility functions
- `/src/hooks/useInAppPurchase.tsx` - React hook for managing purchases
- `/src/pages/InAppPurchasePage.tsx` - Premium purchase page
- Capacitor Purchases plugin installed (`@capgo/capacitor-purchases`)

✅ **Routes**
- `/purchase` - Main IAP purchase page (mobile-optimized)
- `/premium-plans` - Web-friendly pricing page

## 📱 What You Need To Do

### 1. Set Up RevenueCat (Recommended)
RevenueCat simplifies IAP management across iOS and Android:

1. **Create Account**: https://app.revenuecat.com/
2. **Add Your App**:
   - iOS: Add your App Store Connect app
   - Android: Add your Google Play Console app
3. **Configure Products**: Create these product IDs in RevenueCat:
   - `premium_monthly` - Monthly subscription ($12.99)
   - `premium_trial_3day` - 3-day free trial
   - `coin_pack_100` - 100 coins pack
   - `coin_pack_500` - 500 coins pack
   - `coin_pack_1000` - 1000 coins pack

4. **Get API Keys**: 
   - Copy your RevenueCat API key
   - Update `src/utils/inAppPurchases.ts` line 47 with your API key

### 2. Configure Google Play Console

1. **Create Products** in Google Play Console:
   - Go to Monetize → Products → In-app products
   - Create products matching the IDs above
   - Set pricing (e.g., $12.99 for premium_monthly)

2. **Set Up Subscriptions**:
   - Go to Monetize → Products → Subscriptions
   - Create `premium_monthly` subscription
   - Add 3-day free trial option (`premium_trial_3day`)
   - Set renewal to monthly

3. **Add Test Users**:
   - Add your email as a license tester
   - This lets you test purchases without being charged

### 3. Update App Code

In `src/utils/inAppPurchases.ts`, update line 47:
```typescript
await CapacitorPurchases.setDebugLogsEnabled({ enabled: true });
// ADD THIS:
await CapacitorPurchases.configure({
  apiKey: 'YOUR_REVENUECAT_API_KEY_HERE', // From RevenueCat dashboard
  appUserID: userId, // Pass user ID when initializing
});
```

### 4. Build & Deploy

1. **Build your app**: `npm run build`
2. **Sync to native**: `npx cap sync`
3. **Test on device**: `npx cap run android` or `npx cap run ios`
4. **Upload to Play Store** when ready

## 🧪 Testing IAP

### Test Mode (Before Going Live)
1. Add yourself as a license tester in Google Play Console
2. Use the internal testing track for your app
3. Test purchases won't charge real money
4. Verify subscriptions show up in your database

### Production Checklist
- [ ] Products created in Google Play Console
- [ ] RevenueCat configured with correct API keys
- [ ] Test purchases work correctly
- [ ] Subscription renewal works
- [ ] Restore purchases works
- [ ] Database records purchases correctly
- [ ] Premium features unlock properly

## 🔐 Security Notes

- **Never hardcode API keys** in client code for production
- RevenueCat API key should be in environment variables
- All purchase verification happens server-side
- IAP only works on physical devices or emulators (not web preview)

## 📄 Database Schema

### user_subscriptions
Tracks active premium subscriptions:
- `user_id` - Links to user
- `product_id` - Which plan they purchased
- `status` - 'active' or 'expired'
- `expires_at` - When subscription ends

### coin_transactions
Already exists - tracks coin purchases and spending

## 🚀 Going Live

1. Complete app in Play Store Console
2. Submit for review
3. Once approved, IAP products go live
4. Users can purchase directly in the app
5. Monitor purchases in RevenueCat dashboard

## 📚 Resources

- [RevenueCat Docs](https://docs.revenuecat.com/)
- [Google Play Billing](https://developer.android.com/google/play/billing)
- [Capacitor Purchases Plugin](https://github.com/Cap-go/capacitor-purchases)

## ⚠️ Important Notes

- IAP only works on **native mobile apps** (iOS/Android)
- Web preview will show mock products
- You need a Google Play Developer account ($25 one-time fee)
- For iOS, you also need Apple Developer account ($99/year)
- Testing requires uploading to Play Store internal testing track

## 💡 Alternative: Keep Current Web Payments

If you prefer to avoid the complexity of mobile IAP setup, you can:
- Keep the current Stripe integration for web payments
- Users can purchase on your website
- Premium status syncs to mobile app
- Simpler to set up and maintain
