# SafeLens AI Sample Test Cases

For the hackathon demo, you can test the application using the following specific scenarios designed to show off the multimodal and storyteller capabilities.

## Test Case 1: Text-Based Phishing Attempt
**Method:** Voice to Text (simulated) or Chat Box Input
**Input Data:** "Hey, this is Netflix Support. Your payment failed and your account is suspended. Click here to update your billing details immediately: http://netflixx-update-user.com"
**Expected Output:**
- **Risk Score**: 85-95 (Critical)
- **Top 3 Reasons**:
  1. Urgency/Threatening language
  2. Suspicious sender name formatting
  3. Lookalike URL domain
- **Recommended Action**: Do not click the link and navigate to netflix.com natively.
- **Storyteller Explanation**: "Imagine someone knocking on your door saying your house is on fire and you need to hand them your keys immediately to fix it. That's what this message is doing to panic you."

## Test Case 2: Deepfake Identity Spoofing (Image)
**Method:** Image Upload
**Input Data:** Upload a screenshot of an Instagram or WhatsApp message from a "family member" asking for urgent iTunes or Google Play gift cards to pay a sudden hospital bill.
**Expected Output:**
- **Risk Score**: 90+ (Critical)
- **Top 3 Reasons**:
  1. Unconventional payment request (Gift cards)
  2. Extreme urgency/Emotional manipulation
  3. Abrupt out-of-character request
- **Recommended Action**: Call the family member directly on their phone. Do not send gift cards.
- **Storyteller Explanation**: "If a stranger approached you in a hospital and said they'd only perform surgery for Target gift cards, you'd know it was a scam. Real emergencies don't use retail gift cards as currency."

## Test Case 3: Bogus QR Code
**Method:** Live Camera Scan
**Input Data:** Point the camera at a printed QR code resembling a parking meter payment sticker that has been placed over the real one. (The QR code text hidden beneath returns: "http://pay-park-secure.ru/checkout")
**Expected Output:**
- **Risk Score**: 80 (High)
- **Top 3 Reasons**:
  1. Hidden URL redirects
  2. Suspicious TLD (.ru)
  3. Unknown payment processor
- **Recommended Action**: Do not scan. Pay physically or use the official city parking App.
- **Storyteller Explanation**: "Think of a QR code like a blindfold. It points your phone somewhere without you seeing the destination. This one is pointing you down a dark alley instead of the official parking meter."

## Test Case 4: Benign Authentic Notification
**Method:** Image Upload
**Input Data:** A genuine screenshot of a push notification from the official Chase Banking App saying your monthly statement is ready to view.
**Expected Output:**
- **Risk Score**: 5-15 (Low)
- **Top 3 Reasons**:
  1. Standard informational tone
  2. No links to click
  3. Recognizable official source notification format
- **Recommended Action**: Log in to your banking app securely to check your statement.
- **Storyteller Explanation**: "This is just like getting a regular piece of mail from your bank. There are no sudden demands or strange requested payments, just standard information."
