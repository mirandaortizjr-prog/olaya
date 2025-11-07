# Rebuild Checklist for Olaya Together

## Pre-Rebuild Verification ✅

### Code Quality Check
- [x] All 13 native features implemented
- [x] No TypeScript errors
- [x] All utilities have proper error handling
- [x] Web fallbacks for all native features
- [x] Permission management for each feature

### Feature Implementation Status

#### Core Features (1-6)
- [x] Biometric Authentication - `src/utils/biometrics.ts`
- [x] Haptic Feedback - `src/utils/haptics.ts`  
- [x] Camera Integration - `src/utils/camera.ts`
- [x] Share Functionality - `src/utils/share.ts`
- [x] Local Notifications - `src/utils/localNotifications.ts`
- [x] Push Notifications - Enhanced with triggers

#### Advanced Features (7-13)
- [x] Voice Messages - `src/utils/voiceRecording.ts`
- [x] Video Messages - `src/utils/videoRecording.ts`
- [x] Location Sharing - `src/utils/location.ts`
- [x] Calendar Integration - `src/utils/calendar.ts`
- [x] Speech-to-Text - `src/utils/speechToText.ts`
- [x] Offline Support - `src/utils/offlineStorage.ts`
- [x] QR Code Scanner - `src/utils/qrScanner.ts`

## Rebuild Steps

### 1. Export to GitHub 📤
```bash
# Click "Export to GitHub" button in Lovable
# This creates/updates your GitHub repository
```

### 2. Clone & Setup 💻
```bash
# Clone your repository
git clone [your-repo-url]
cd [your-repo-name]

# Install dependencies
npm install
```

### 3. Add Native Platforms 📱
```bash
# Add iOS (requires Mac with Xcode)
npx cap add ios

# Add Android (requires Android Studio)
npx cap add android
```

### 4. Update Platform Dependencies 🔄
```bash
# For iOS
npx cap update ios

# For Android  
npx cap update android
```

### 5. Build the Project 🏗️
```bash
npm run build
```

### 6. Sync Native Code 🔄
```bash
# Sync web code to native platforms
npx cap sync

# Or individually:
npx cap sync ios
npx cap sync android
```

### 7. Run on Device/Emulator 🚀
```bash
# For iOS (Mac only)
npx cap run ios

# For Android
npx cap run android

# Or open in native IDEs:
npx cap open ios    # Opens Xcode
npx cap open android # Opens Android Studio
```

## Testing Checklist 📋

### Core Features Testing

#### Biometric Authentication
- [ ] Open Private page
- [ ] See biometric option (Face ID/Touch ID/Fingerprint)
- [ ] Test successful authentication
- [ ] Test fallback to PIN
- [ ] Test cancel action

#### Haptic Feedback
- [ ] Send a flirt (should feel vibration)
- [ ] Test buttons throughout app
- [ ] Verify different intensities work

#### Camera Integration
- [ ] Take photo with camera
- [ ] Pick photo from gallery
- [ ] Pick multiple photos
- [ ] Test photo editing
- [ ] Verify permissions prompt

#### Share Functionality
- [ ] Share a post/memory
- [ ] Verify native share sheet appears
- [ ] Test sharing to different apps
- [ ] Cancel share and verify no crash

#### Local Notifications
- [ ] Enable daily reminder in settings
- [ ] Set anniversary reminder
- [ ] Wait for notification (or change time to test)
- [ ] Tap notification - should open app
- [ ] Disable notifications and verify they stop

#### Push Notifications  
- [ ] Send message from partner
- [ ] Receive push notification
- [ ] Tap notification - should open messenger
- [ ] Check badge count updates
- [ ] Test notification preferences

### Advanced Features Testing

#### Voice Messages
- [ ] Start voice recording
- [ ] See recording indicator
- [ ] Stop and save recording
- [ ] Play back audio
- [ ] Test cancel recording
- [ ] Verify microphone permissions

#### Video Messages
- [ ] Start video recording
- [ ] See camera preview
- [ ] Record video with audio
- [ ] Stop and review video
- [ ] Test front/back camera switch
- [ ] Verify camera & mic permissions

#### Location Sharing
- [ ] Share current location
- [ ] Verify location accuracy
- [ ] Open location in maps
- [ ] Test location watching (real-time)
- [ ] Verify location permissions

#### Calendar Integration
- [ ] Create anniversary event
- [ ] Create date event
- [ ] Verify .ics file downloads (web)
- [ ] Verify calendar app opens (native)
- [ ] Check event appears in calendar

#### Speech-to-Text
- [ ] Start voice typing
- [ ] Speak clearly
- [ ] See text transcribe in real-time
- [ ] Stop and verify accuracy
- [ ] Test different languages
- [ ] Verify microphone permissions

#### Offline Support
- [ ] Enable airplane mode
- [ ] Create message/post (should save as draft)
- [ ] Disable airplane mode
- [ ] Verify draft syncs automatically
- [ ] Check draft cleanup after 7 days

#### QR Code Scanner
- [ ] Open QR scanner
- [ ] Point at QR code
- [ ] Verify code scans correctly
- [ ] Test web fallback in browser
- [ ] Verify camera permissions

## Permission Testing 🔐

Test permission flow for each feature:

### First Time Permission Requests
- [ ] Camera - Take photo
- [ ] Microphone - Voice recording
- [ ] Location - Share location
- [ ] Notifications - Enable in settings
- [ ] Biometrics - Access private page

### Permission Denials
- [ ] Deny camera - should show helpful message
- [ ] Deny microphone - should show alternative
- [ ] Deny location - should gracefully handle
- [ ] Deny notifications - app should still work

### Permission Re-requests
- [ ] Test re-requesting after denial
- [ ] Verify proper messaging
- [ ] Test deep link to settings

## Platform-Specific Testing 📱

### iOS Testing
- [ ] Face ID works on compatible devices
- [ ] Touch ID works on compatible devices
- [ ] Haptic feedback feels appropriate
- [ ] Notifications display correctly
- [ ] Share sheet shows iOS apps
- [ ] Calendar integration works
- [ ] All permissions work correctly

### Android Testing
- [ ] Fingerprint authentication works
- [ ] Face unlock works (if available)
- [ ] Haptic patterns work correctly
- [ ] Notifications display correctly  
- [ ] Share sheet shows Android apps
- [ ] Calendar integration works
- [ ] All permissions work correctly

## Performance Testing ⚡

- [ ] App launches quickly (< 3 seconds)
- [ ] Voice recording has no lag
- [ ] Video recording is smooth (30fps)
- [ ] QR scanning is responsive
- [ ] Location updates are accurate
- [ ] Offline mode switches seamlessly
- [ ] No memory leaks during extended use

## Edge Cases Testing 🔍

- [ ] Background app and return - state persists
- [ ] Low battery - features still work
- [ ] Low storage - graceful handling
- [ ] Poor network - offline mode kicks in
- [ ] Interrupted recording - data saves
- [ ] Multiple rapid actions - no crashes

## Known Limitations 🚧

1. **Calendar Events**: Native integration requires additional plugin, currently uses ICS files
2. **Web Platform**: Some features (biometrics, haptics) only work on native
3. **Location Accuracy**: Varies by device and environment
4. **QR Code Web**: Requires good lighting for best results

## Post-Rebuild Steps 🎯

### After Successful Build
1. [ ] Test on multiple devices (iOS & Android)
2. [ ] Test in production environment
3. [ ] Monitor crash reports
4. [ ] Gather user feedback
5. [ ] Iterate based on findings

### Deployment Checklist
- [ ] Update app version in capacitor.config.ts
- [ ] Generate release builds
- [ ] Test release builds thoroughly
- [ ] Submit to App Store (iOS)
- [ ] Submit to Play Store (Android)

## Troubleshooting 🔧

### Common Issues

**Build Fails**
```bash
# Clean and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
npx cap sync
```

**Native Features Not Working**
```bash
# Ensure platforms are updated
npx cap update ios
npx cap update android
npx cap sync
```

**Permissions Not Requesting**
- Check Info.plist (iOS) has permission descriptions
- Check AndroidManifest.xml (Android) has permissions
- Verify capacitor.config.ts is correct

**Xcode Build Errors** (iOS)
- Update Xcode to latest version
- Clean build folder (Cmd+Shift+K)
- Update CocoaPods: `cd ios && pod update`

**Android Studio Errors**
- Sync Gradle files
- Clean project
- Invalidate caches and restart

## Resources 📚

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Lovable Blog - Capacitor](https://lovable.dev/blog/capacitor)
- [Native Features Documentation](./NATIVE_FEATURES.md)
- [Capacitor Community Plugins](https://github.com/capacitor-community)

## Support 💬

If you encounter issues:
1. Check console logs for errors
2. Review native platform logs (Xcode/Android Studio)
3. Search Capacitor community forums
4. Contact Lovable support

---

**Ready to rebuild?** Make sure you've checked off all items in the Pre-Rebuild Verification section! 🚀
