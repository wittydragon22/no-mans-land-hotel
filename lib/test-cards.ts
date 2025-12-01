/**
 * Test credit card numbers for development and testing
 * These are standard test card numbers that pass Luhn algorithm validation
 * but will not charge real money
 */

export interface TestCard {
  name: string
  number: string
  expiryMonth: number
  expiryYear: number
  cvv: string
  type: 'visa' | 'mastercard' | 'amex' | 'discover'
}

export const TEST_CARDS: TestCard[] = [
  {
    name: 'Visa (Success)',
    number: '4242 4242 4242 4242',
    expiryMonth: 12,
    expiryYear: new Date().getFullYear() + 2,
    cvv: '123',
    type: 'visa'
  },
  {
    name: 'Visa Debit',
    number: '4000 0566 5566 5556',
    expiryMonth: 12,
    expiryYear: new Date().getFullYear() + 2,
    cvv: '123',
    type: 'visa'
  },
  {
    name: 'Mastercard (Success)',
    number: '5555 5555 5555 4444',
    expiryMonth: 12,
    expiryYear: new Date().getFullYear() + 2,
    cvv: '123',
    type: 'mastercard'
  },
  {
    name: 'American Express',
    number: '3782 822463 10005',
    expiryMonth: 12,
    expiryYear: new Date().getFullYear() + 2,
    cvv: '1234',
    type: 'amex'
  },
  {
    name: 'Discover',
    number: '6011 1111 1111 1117',
    expiryMonth: 12,
    expiryYear: new Date().getFullYear() + 2,
    cvv: '123',
    type: 'discover'
  }
]

/**
 * Get a test card by name or index
 */
export function getTestCard(nameOrIndex?: string | number): TestCard {
  if (nameOrIndex === undefined) {
    return TEST_CARDS[0] // Default to first card
  }
  
  if (typeof nameOrIndex === 'number') {
    return TEST_CARDS[nameOrIndex] || TEST_CARDS[0]
  }
  
  const card = TEST_CARDS.find(c => c.name.toLowerCase().includes(nameOrIndex.toLowerCase()))
  return card || TEST_CARDS[0]
}

/**
 * Get billing address for testing
 */
export function getTestBillingAddress() {
  return {
    street: '123 Test Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  }
}

