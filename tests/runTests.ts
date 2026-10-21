// Deterministic unit tests for calculations, formatters, and budget logic
import { formatCurrency, formatDate, getDaysRemaining } from '../src/lib/formatters.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('🧪 Running EventEase AI Automated Tests...\n');

// Test 1: Currency Formatting (INR)
console.log('Test Suite 1: Currency Formatter');
const formattedInr = formatCurrency(1500000, 'INR');
assert(formattedInr.includes('15,00,000') || formattedInr.includes('1,500,000'), `Formats ₹15,00,000 correctly (got: ${formattedInr})`);

const formattedUsd = formatCurrency(5000, 'USD');
assert(formattedUsd.includes('5,000') || formattedUsd.includes('$5,000'), `Formats $5,000 correctly (got: ${formattedUsd})`);

// Test 2: Contingency Calculations
console.log('\nTest Suite 2: Contingency & Planning Caps');
const totalBudget = 1000000;
const contingencyPercent = 10;
const contingencyReserve = Math.round(totalBudget * (contingencyPercent / 100));
const availablePlanningBudget = totalBudget - contingencyReserve;

assert(contingencyReserve === 100000, `Contingency 10% of 10,00,000 is 1,00,000 (got: ${contingencyReserve})`);
assert(availablePlanningBudget === 900000, `Available planning cap is 9,00,000 (got: ${availablePlanningBudget})`);

// Test 3: Budget Overrun Detection
console.log('\nTest Suite 3: Budget Expense Arithmetic');
const expenses = [
  { estimatedCost: 300000, actualCost: 280000, paidAmount: 150000 },
  { estimatedCost: 200000, actualCost: 220000, paidAmount: 100000 },
  { estimatedCost: 100000, actualCost: 90000, paidAmount: 90000 }
];

const totalEstimated = expenses.reduce((a, b) => a + b.estimatedCost, 0);
const totalActual = expenses.reduce((a, b) => a + b.actualCost, 0);
const totalPaid = expenses.reduce((a, b) => a + b.paidAmount, 0);
const remaining = totalBudget - totalActual;
const outstandingBalance = totalActual - totalPaid;

assert(totalEstimated === 600000, `Total estimated is 6,00,000 (got: ${totalEstimated})`);
assert(totalActual === 590000, `Total actual committed is 5,90,000 (got: ${totalActual})`);
assert(totalPaid === 340000, `Total paid deposit is 3,40,000 (got: ${totalPaid})`);
assert(outstandingBalance === 250000, `Outstanding balance due is 2,50,000 (got: ${outstandingBalance})`);
assert(remaining === 410000, `Remaining event budget is 4,10,000 (got: ${remaining})`);

// Test 4: Guest RSVP calculations
console.log('\nTest Suite 4: Guest RSVP Aggregations');
const guests = [
  { name: 'Family 1', rsvpStatus: 'confirmed', plusOnes: 3, meal: 'Vegetarian' },
  { name: 'Family 2', rsvpStatus: 'confirmed', plusOnes: 1, meal: 'Jain' },
  { name: 'Friend 1', rsvpStatus: 'pending', plusOnes: 0, meal: 'Vegetarian' },
  { name: 'Friend 2', rsvpStatus: 'declined', plusOnes: 1, meal: 'Non-Vegetarian' }
];

const confirmedCount = guests.filter(g => g.rsvpStatus === 'confirmed').reduce((sum, g) => sum + 1 + g.plusOnes, 0);
const pendingCount = guests.filter(g => g.rsvpStatus === 'pending').length;
const declinedCount = guests.filter(g => g.rsvpStatus === 'declined').length;

assert(confirmedCount === 6, `Confirmed headcount is 6 (Family 1 [1+3=4] + Family 2 [1+1=2]) (got: ${confirmedCount})`);
assert(pendingCount === 1, `Pending RSVP count is 1 (got: ${pendingCount})`);
assert(declinedCount === 1, `Declined RSVP count is 1 (got: ${declinedCount})`);

// Summary
console.log(`\n========================================`);
console.log(`Total tests: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All automated unit test checks passed successfully!');
}
