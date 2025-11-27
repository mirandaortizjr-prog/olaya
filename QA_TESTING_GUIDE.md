# QA Testing Guide: Premium Content, Payments & Onboarding

## 🎯 Testing Overview

This guide covers comprehensive QA testing for:
1. Premium content locks
2. Payment & subscription flows
3. Onboarding walkthrough experience

---

## 1. Premium Content Lock Testing

### Test Scenarios

#### A. Free User Experience
**Test Case**: Verify premium features are properly locked for free users

**Steps**:
1. Sign out and create a new account
2. Navigate to Dashboard → Private/Vault section
3. Observe premium feature cards

**Expected Behavior**:
- ✅ Lock icon appears on each premium feature card
- ✅ Premium features show in grayscale/muted colors
- ✅ "Upgrade to Premium" banner displays at bottom
- ✅ Clicking any locked feature redirects to `/in-app-purchase` page

**Premium Features to Test**:
- Desire Vault
- Desire Timeline
- Love Languages
- Calming Tools
- Private Photos & Videos
- Games (How Well Do You Know Me, Truth or Tender, etc.)
- Biometric Lock

#### B. Premium User Experience
**Test Case**: Verify premium users have full access

**Steps**:
1. Purchase premium subscription (see section 2)
2. Navigate to all premium feature areas

**Expected Behavior**:
- ✅ No lock icons on premium features
- ✅ All features are fully interactive
- ✅ No "Upgrade to Premium" prompts
- ✅ Features display in full color
- ✅ "Active" badge shows on subscription page

#### C. Daily Love Action Premium Lock
**Test Case**: Verify daily action respects subscription status

**Steps**:
1. As FREE user: Check Daily Love Action box on dashboard
2. As PREMIUM user: Check Daily Love Action box on dashboard

**Expected Behavior - Free Users**:
- ✅ Shows basic daily love action
- ✅ Displays "Basic" badge
- ✅ Shows upgrade prompt: "Upgrade to Premium for actions tailored to your partner's love language"
- ✅ "Unlock Tailored Actions" button redirects to premium page

**Expected Behavior - Premium Users**:
- ✅ Shows tailored action based on partner's love language
- ✅ No "Basic" badge
- ✅ No upgrade prompts
- ✅ Shows partner's love language info

---

## 2. Payment & Subscription Flow Testing

### Platform Detection Test

#### Test Case: Verify correct payment method shows based on platform

**Despia Native App**:
1. Open app in Despia on iOS or Android
2. Navigate to premium plans page

**Expected Behavior**:
- ✅ Shows "Running in Despia on iOS/Android" banner
- ✅ Displays In-App Purchase buttons
- ✅ Shows "Restore" button in header
- ✅ Product prices loaded from RevenueCat

**Web Browser**:
1. Open app in Chrome/Safari/Firefox
2. Navigate to premium plans page

**Expected Behavior**:
- ✅ Shows "Web version - Stripe checkout enabled" banner
- ✅ Displays "Subscribe with Stripe" buttons
- ✅ No "Restore" button visible

### In-App Purchase Flow (Despia)

#### Test Case: Complete purchase in native app

**Prerequisites**:
- Must be running in Despia app
- Test user account with sandbox payment method

**Steps**:
1. Go to `/in-app-purchase` page
2. Select "Premium" plan ($12.99/month)
3. Click "Get Premium Now"
4. Complete payment in native dialog
5. Wait for confirmation

**Expected Behavior**:
- ✅ Native payment sheet appears
- ✅ Correct product and price shown
- ✅ After purchase: Success toast appears
- ✅ Page updates to show "Active" status
- ✅ Green "✅ You have an active Premium subscription" banner appears
- ✅ Database `user_subscriptions` table updated with new entry
- ✅ Premium features immediately unlock

**Error Cases to Test**:
- ❌ Payment cancelled → Shows "Purchase cancelled" message
- ❌ Payment failed → Shows error toast
- ❌ Network error → Shows "Failed to verify purchase" message

#### Test Case: 3-Day Free Trial

**Steps**:
1. Select "3-Day Free Trial" option
2. Complete purchase
3. Verify trial start date and expiration

**Expected Behavior**:
- ✅ Trial starts immediately
- ✅ Premium features unlock
- ✅ Subscription shows expiration in 3 days
- ✅ No charge during trial period

#### Test Case: Restore Purchases

**Steps**:
1. Purchase premium on device A
2. Sign in to same account on device B
3. Click "Restore" button

**Expected Behavior**:
- ✅ "Restore" button visible in Despia only
- ✅ Previous purchases detected
- ✅ Premium status restored
- ✅ Database synced with restored subscription

### Stripe Checkout Flow (Web)

#### Test Case: Complete web checkout

**Prerequisites**:
- Must be in web browser (not Despia)
- Valid email address

**Steps**:
1. Go to `/in-app-purchase` page
2. Click "Subscribe with Stripe" on Premium plan
3. Complete Stripe checkout form
4. Return to app after payment

**Expected Behavior**:
- ✅ Redirects to Stripe hosted checkout
- ✅ Stripe form shows correct price ($12.99/month)
- ✅ After payment: Redirects back to dashboard
- ✅ Premium status updates automatically
- ✅ Database `subscriptions` table updated via webhook

**Webhook Test**:
- ✅ Stripe webhook receives payment confirmation
- ✅ Subscription record created in database
- ✅ User's premium status updates in real-time

### Subscription Status Updates

#### Test Case: Real-time subscription monitoring

**Steps**:
1. Open app in two browser tabs as same user
2. Purchase premium in tab 1
3. Observe tab 2

**Expected Behavior**:
- ✅ Tab 2 automatically detects premium status change
- ✅ No page refresh needed
- ✅ Premium features unlock immediately in tab 2

#### Test Case: Subscription expiration

**Steps**:
1. Use a subscription set to expire
2. Wait for expiration time
3. Refresh app

**Expected Behavior**:
- ✅ Premium status reverts to free
- ✅ Premium features lock again
- ✅ Upgrade prompts reappear

---

## 3. Onboarding Walkthrough Testing

### Creator Mode Testing

#### Test Case: QA Preview Mode with `?creator=true`

**Steps**:
1. Add `?creator=true` to URL: `https://[your-app].lovableproject.com/dashboard?creator=true`
2. Observe onboarding behavior

**Expected Behavior**:
- ✅ Onboarding walkthrough appears immediately
- ✅ All 12 steps display in order
- ✅ Progress is NOT saved to database (verified by refreshing)
- ✅ Can replay infinitely by refreshing page
- ✅ Toast shows "Creator preview mode - progress not saved" on completion

**12 Steps to Verify**:
1. ✅ Splash & Title Customization (logo fade-in)
2. ✅ Picture Slideshow & Profile Setup (photo upload demo)
3. ✅ Mood & Anniversary (selector with bounce animation)
4. ✅ Gift Box (sparkle animation, demo gift)
5. ✅ Music Player (song choice, background fade)
6. ✅ Flirts & Desires (bubble pop, card flip animations)
7. ✅ Feed (timeline post demo)
8. ✅ Private Vault (premium preview, lock icon)
9. ✅ Games (demo trivia card)
10. ✅ Messages & Journal (envelope animation)
11. ✅ Settings (gear icon spin)
12. ✅ Fonts & Skins (theme ripple preview)

### End User Onboarding

#### Test Case: First-time user experience

**Steps**:
1. Create completely new account
2. Complete auth flow
3. Arrive at dashboard

**Expected Behavior**:
- ✅ Onboarding walkthrough starts automatically
- ✅ Shows "Step 1 of 12" in progress header
- ✅ Animated icon bounces on current step
- ✅ "Try It Now" buttons navigate to relevant sections
- ✅ Progress bar updates with each step
- ✅ Completed steps show green checkmark dots
- ✅ Can click "Skip Tour" to exit
- ✅ On completion: Shows premium teaser toast

#### Test Case: Progress persistence

**Steps**:
1. Complete first 5 steps of onboarding
2. Close browser/app
3. Reopen and sign in

**Expected Behavior**:
- ✅ Onboarding resumes at step 6
- ✅ First 5 steps show as completed (green dots)
- ✅ Progress bar reflects 5/12 completion

#### Test Case: Replay from Settings

**Steps**:
1. Complete onboarding once (status: `ftue_completed: true`)
2. Go to Settings dialog
3. Find "Help & Support" section
4. Click "Replay Onboarding Walkthrough" button

**Expected Behavior**:
- ✅ Settings dialog closes
- ✅ Onboarding restarts from step 1
- ✅ All 12 steps accessible again
- ✅ Progress saved normally (not creator mode)

### Premium Lock Integration

#### Test Case: Premium feature tease in onboarding completion

**Steps**:
1. Complete all 12 onboarding steps as free user
2. Read completion toast message

**Expected Behavior**:
- ✅ Toast shows: "✨ Your sanctuary is ready! You've personalized your shared space. Want to go deeper? Unlock your Private Vault and emotional games with Premium."
- ✅ Toast duration: 8 seconds
- ✅ Message includes call-to-action for premium

#### Test Case: Vault step shows premium lock

**Steps**:
1. During onboarding, reach step 8 (Private Vault)
2. Observe vault preview content

**Expected Behavior**:
- ✅ Shows lock door animation
- ✅ Displays "Premium Preview" badge
- ✅ Explains what vault contains
- ✅ Shows upgrade CTA if user clicks

---

## 🐛 Common Issues & Debug Tips

### Issue: Premium status not updating
**Check**:
- Verify `is_premium_user` RPC function working
- Check `subscriptions` or `user_subscriptions` table
- Confirm webhook receiving Stripe events
- Check real-time subscription channel

### Issue: Onboarding not appearing
**Check**:
- Verify `ftue_completed` = false in profiles table
- Check if `?creator=true` parameter is set
- Confirm `coupleId` exists (onboarding requires it)

### Issue: Payment failing
**Check**:
- Verify platform detection logic
- Check product IDs match RevenueCat/Stripe config
- Confirm secrets are set (STRIPE_SECRET_KEY, etc.)
- Test with sandbox credentials first

### Issue: Premium features still locked after purchase
**Check**:
- Force refresh browser
- Check subscription status endpoint
- Verify RLS policies allow access
- Check real-time channel subscribed correctly

---

## 📊 Test Data Requirements

### Test Accounts Needed
1. **Free User** - No subscription, for testing locks
2. **Premium User** - Active subscription, full access
3. **Trial User** - 3-day trial, test expiration
4. **Expired User** - Had premium, now expired

### Database Verification Queries

```sql
-- Check user premium status
SELECT * FROM public.user_subscriptions WHERE user_id = 'USER_ID';

-- Check Stripe subscriptions
SELECT * FROM public.subscriptions WHERE user_id = 'USER_ID';

-- Check onboarding status
SELECT ftue_completed, ftue_progress FROM profiles WHERE id = 'USER_ID';

-- Verify webhook received
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 10;
```

---

## ✅ QA Checklist

### Premium Lock
- [ ] Lock icons show on all premium features for free users
- [ ] Premium users see no locks
- [ ] Clicking locked features redirects to payment page
- [ ] Daily Love Action respects subscription tier

### Payment Flow
- [ ] Platform detection works (Despia vs Web)
- [ ] IAP purchases complete successfully
- [ ] Stripe checkout redirects correctly
- [ ] Subscription status updates in real-time
- [ ] Restore purchases works on multiple devices
- [ ] Trial period activates correctly
- [ ] Payment errors handled gracefully

### Onboarding
- [ ] Creator mode works with `?creator=true`
- [ ] First-time users see walkthrough automatically
- [ ] Progress persists across sessions
- [ ] Replay button works in Settings
- [ ] All 12 steps display with correct animations
- [ ] Premium teaser appears on completion
- [ ] Skip functionality works
- [ ] Navigation buttons work correctly

---

## 🚀 Quick Test Commands

```bash
# Test Creator Mode
https://[your-app].com/dashboard?creator=true

# Check Premium Status (Browser Console)
const { data } = await supabase.rpc('is_premium_user', { _user_id: 'USER_ID' });
console.log('Is Premium:', data);

# Force Onboarding Reset (Browser Console)
await supabase.from('profiles')
  .update({ ftue_completed: false, ftue_progress: [] })
  .eq('id', 'USER_ID');
```

---

## 📞 Support

If you encounter issues during QA:
1. Check browser console for errors
2. Verify database state
3. Test in incognito/private browsing
4. Try different devices/platforms
5. Check Stripe dashboard for webhook logs
