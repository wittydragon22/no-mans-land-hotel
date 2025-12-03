# Test Credit Cards for Payment Testing

This document lists the test credit card numbers you can use to test the payment flow without charging real money.

## 🧪 Quick Test Card (Recommended)

**Visa - Success**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/2027)
- CVV: `123`
- Billing Address: Any valid address

## 📋 All Available Test Cards

### Visa Cards

1. **Visa (Success)**
   - Number: `4242 4242 4242 4242`
   - CVV: `123`
   - Use for: Successful payment processing

2. **Visa Debit**
   - Number: `4000 0566 5566 5556`
   - CVV: `123`
   - Use for: Testing debit card processing

### Mastercard

3. **Mastercard (Success)**
   - Number: `5555 5555 5555 4444`
   - CVV: `123`
   - Use for: Testing Mastercard processing

### American Express

4. **American Express**
   - Number: `3782 822463 10005`
   - CVV: `1234` (4 digits for Amex)
   - Use for: Testing Amex processing

### Discover

5. **Discover**
   - Number: `6011 1111 1111 1117`
   - CVV: `123`
   - Use for: Testing Discover card processing

## 🎯 How to Use

### Option 1: Use the "Use Test Card" Button
1. Navigate to the payment page during booking
2. Click the **"Use Test Card"** button in the top right
3. All fields will be automatically filled with test data
4. Submit the form to proceed

### Option 2: Manual Entry
1. Enter any of the test card numbers above
2. Use any future expiry date (e.g., 12/2027)
3. Enter the corresponding CVV
4. Fill in any billing address
5. Submit the form

## ✅ Validation

All test cards:
- ✅ Pass Luhn algorithm validation
- ✅ Are recognized as valid card numbers
- ✅ Will not charge real money
- ✅ Work in test/development mode

## 📝 Notes

- **Expiry Date**: Use any future date (current year + 1 or later)
- **CVV**: Use `123` for most cards, `1234` for American Express
- **Billing Address**: Any valid address will work
- **Payment Processing**: Currently uses mock processing (90% success rate)

## 🔒 Security

These are standard test card numbers used across the payment industry. They:
- Cannot be used for real transactions
- Are safe to use in development
- Will be rejected by real payment processors
- Are only valid in test/development environments



