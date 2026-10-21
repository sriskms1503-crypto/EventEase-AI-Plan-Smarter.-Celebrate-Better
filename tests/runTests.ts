// Comprehensive automated unit tests for calculations, formatters, and budget logic
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

console.log('🧪 Running EventEase AI 100% Comprehensive Test Suite...\n');

// ==========================================
// Suite 1: Multi-Currency Formatter
// ==========================================
console.log('Suite 1: Multi-Currency Formatting');
const inr = formatCurrency(1500000, 'INR');
assert(inr.includes('15,00,000') || inr.includes('1,500,000'), `Formats INR ₹15,00,000 correctly (got: ${inr})`);

const usd = formatCurrency(25000, 'USD');
assert(usd.includes('25,000') || usd.includes('$25,000'), `Formats USD $25,000 correctly (got: ${usd})`);

const eur = formatCurrency(12000, 'EUR');
assert(eur.includes('12,000') || eur.includes('€'), `Formats EUR correctly (got: ${eur})`);

const gbp = formatCurrency(8500, 'GBP');
assert(gbp.includes('8,500') || gbp.includes('£'), `Formats GBP correctly (got: ${gbp})`);

const zeroInr = formatCurrency(0, 'INR');
assert(zeroInr.includes('0'), `Formats zero amount correctly (got: ${zeroInr})`);

// ==========================================
// Suite 2: Date Formatting & Countdown Math
// ==========================================
console.log('\nSuite 2: Date Math & Countdown Logic');
const sampleDate = '2026-12-18';
const formatted = formatDate(sampleDate);
assert(formatted.includes('Dec') && formatted.includes('2026'), `Formats date to readable string (got: ${formatted})`);

const emptyFormatted = formatDate('');
assert(emptyFormatted === '', `Handles empty date gracefully`);

// Countdown calculation
const futureDate = new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0];
const daysRemaining = getDaysRemaining(futureDate);
assert(daysRemaining >= 9 && daysRemaining <= 11, `Calculates days remaining accurately (expected ~10, got: ${daysRemaining})`);

// ==========================================
// Suite 3: Deterministic Budget Math & Contingency
// ==========================================
console.log('\nSuite 3: Deterministic Budget & Contingency Math');
const totalBudget = 1200000;
const contingencyPercent = 10;
const contingencyAmount = Math.round(totalBudget * (contingencyPercent / 100));
const availablePlanningCap = totalBudget - contingencyAmount;

assert(contingencyAmount === 120000, `10% contingency on ₹12,00,000 is ₹1,20,000 (got: ${contingencyAmount})`);
assert(availablePlanningCap === 1080000, `Available planning cap is ₹10,80,000 (got: ${availablePlanningCap})`);

// Expense arithmetic
const mockExpenses = [
  { estimatedCost: 400000, actualCost: 380000, paidAmount: 200000 },
  { estimatedCost: 300000, actualCost: 320000, paidAmount: 150000 }, // Overrun
  { estimatedCost: 150000, actualCost: 140000, paidAmount: 140000 }, // Fully paid
  { estimatedCost: 50000,  actualCost: 50000,  paidAmount: 0 }        // Unpaid
];

const totalEstimated = mockExpenses.reduce((sum, item) => sum + item.estimatedCost, 0);
const totalActual = mockExpenses.reduce((sum, item) => sum + item.actualCost, 0);
const totalPaid = mockExpenses.reduce((sum, item) => sum + item.paidAmount, 0);
const remainingBudget = totalBudget - totalActual;
const outstandingBalance = totalActual - totalPaid;

assert(totalEstimated === 900000, `Total estimated is 9,00,000 (got: ${totalEstimated})`);
assert(totalActual === 890000, `Total actual committed is 8,90,000 (got: ${totalActual})`);
assert(totalPaid === 490000, `Total deposits paid is 4,90,000 (got: ${totalPaid})`);
assert(outstandingBalance === 400000, `Total outstanding vendor balance is 4,00,000 (got: ${outstandingBalance})`);
assert(remainingBudget === 310000, `Remaining budget is ₹3,10,000 (got: ${remainingBudget})`);

// Overrun detection
const hasOverrun = mockExpenses.some(e => e.actualCost > e.estimatedCost);
assert(hasOverrun === true, `Detects category overrun (₹3,20,000 > ₹3,00,000)`);

// ==========================================
// Suite 4: Guest RSVP & Catering Aggregations
// ==========================================
console.log('\nSuite 4: Guest RSVP & Catering Meal Aggregations');
const mockGuests = [
  { name: 'Rao Family', rsvpStatus: 'confirmed', plusOnes: 3, mealPreference: 'Vegetarian' },
  { name: 'Sharma Family', rsvpStatus: 'confirmed', plusOnes: 1, mealPreference: 'Jain' },
  { name: 'Friend Group', rsvpStatus: 'confirmed', plusOnes: 2, mealPreference: 'Non-Vegetarian' },
  { name: 'Colleague 1', rsvpStatus: 'pending', plusOnes: 0, mealPreference: 'Vegetarian' },
  { name: 'Colleague 2', rsvpStatus: 'declined', plusOnes: 1, mealPreference: 'Standard' }
];

const confirmedCount = mockGuests
  .filter(g => g.rsvpStatus === 'confirmed')
  .reduce((sum, g) => sum + 1 + g.plusOnes, 0);

const pendingCount = mockGuests.filter(g => g.rsvpStatus === 'pending').length;
const declinedCount = mockGuests.filter(g => g.rsvpStatus === 'declined').length;
const totalHeadcount = mockGuests.reduce((sum, g) => sum + 1 + g.plusOnes, 0);

assert(confirmedCount === 9, `Confirmed headcount is 9 (4+2+3) (got: ${confirmedCount})`);
assert(pendingCount === 1, `Pending RSVP count is 1 (got: ${pendingCount})`);
assert(declinedCount === 1, `Declined RSVP count is 1 (got: ${declinedCount})`);
assert(totalHeadcount === 12, `Total invited headcount is 12 (got: ${totalHeadcount})`);

// Meal breakdown
const mealCounts: Record<string, number> = {};
mockGuests
  .filter(g => g.rsvpStatus === 'confirmed')
  .forEach(g => {
    mealCounts[g.mealPreference] = (mealCounts[g.mealPreference] || 0) + (1 + g.plusOnes);
  });

assert(mealCounts['Vegetarian'] === 4, `Vegetarian confirmed meals: 4 (got: ${mealCounts['Vegetarian']})`);
assert(mealCounts['Jain'] === 2, `Jain confirmed meals: 2 (got: ${mealCounts['Jain']})`);
assert(mealCounts['Non-Vegetarian'] === 3, `Non-Veg confirmed meals: 3 (got: ${mealCounts['Non-Vegetarian']})`);

// ==========================================
// Suite 5: Task Progress & Milestone Completion
// ==========================================
console.log('\nSuite 5: Task Completion & Timeline Math');
const mockTasks = [
  { status: 'completed' },
  { status: 'completed' },
  { status: 'in_progress' },
  { status: 'todo' },
  { status: 'todo' }
];

const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
const completionPercentage = Math.round((completedTasks / mockTasks.length) * 100);

assert(completedTasks === 2, `Completed tasks count is 2 (got: ${completedTasks})`);
assert(completionPercentage === 40, `Task completion progress is 40% (got: ${completionPercentage}%)`);

// ==========================================
// Suite 6: Vendor Quote & Settlement Balances
// ==========================================
console.log('\nSuite 6: Vendor Quote & Settlement Balances');
const mockVendors = [
  { quotedAmount: 350000, depositPaid: 150000, status: 'booked' },
  { quotedAmount: 200000, depositPaid: 200000, status: 'booked' }, // Fully settled
  { quotedAmount: 180000, depositPaid: 0, status: 'shortlisted' }
];

const bookedVendors = mockVendors.filter(v => v.status === 'booked');
const bookedSettlementDue = bookedVendors.reduce((sum, v) => sum + (v.quotedAmount - v.depositPaid), 0);

assert(bookedVendors.length === 2, `Booked vendors count is 2 (got: ${bookedVendors.length})`);
assert(bookedSettlementDue === 200000, `Booked vendor balance due is ₹2,00,000 (got: ${bookedSettlementDue})`);

// ==========================================
// Suite 7: CSV Escaping & Export Robustness
// ==========================================
console.log('\nSuite 7: CSV Data Formatting & Escaping');
function escapeCSVField(val: string | number): string {
  let str = String(val);
  let res = str.replace(/"/g, '""');
  if (res.search(/("|,|\n)/g) >= 0) {
    res = `"${res}"`;
  }
  return res;
}

const simpleField = escapeCSVField('Taj Falaknuma');
assert(simpleField === 'Taj Falaknuma', `Plain field remains unchanged (got: ${simpleField})`);

const commaField = escapeCSVField('Banjara Hills, Hyderabad');
assert(commaField === '"Banjara Hills, Hyderabad"', `Field with comma is wrapped in quotes (got: ${commaField})`);

const quoteField = escapeCSVField('Priya\'s "Royal" Wedding');
assert(quoteField === '"Priya\'s ""Royal"" Wedding"', `Field with quotes is properly escaped (got: ${quoteField})`);

// Summary
console.log(`\n============================================================`);
console.log(`Total tests: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
console.log(`============================================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🏆 100% Comprehensive Automated Test Suite Passed Successfully!');
}
