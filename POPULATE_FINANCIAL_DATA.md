# Financial Dashboard Data Population

## Quick Setup to Get Real Financial Data

You currently have zeros on your financial dashboard because there's missing financial data in your database. Here's how to populate it:

### Option 1: Run the Financial Data Script (Recommended)

1. **Navigate to your server directory:**
```bash
cd /path/to/your/sughar-project/server
```

2. **Run the financial data population script:**
```bash
node add-financial-data.js
```

This will:
- ✅ Set up to 15 units to "occupied" status with realistic rent amounts ($45,000-$52,000)
- ✅ Create lease agreements for occupied units
- ✅ Add September 2025 rent payments (current month)
- ✅ Add 5 service requests for cost calculations
- ✅ Show you the expected financial dashboard values

### Option 2: Manual Database Updates (Alternative)

If you prefer to manually update your database, you can run these MongoDB queries:

```javascript
// 1. Update some units to occupied status
db.units.updateMany(
  { status: "vacant" },
  { 
    $set: { 
      status: "occupied",
      monthlyRent: NumberDecimal("48000")
    }
  },
  { limit: 10 }
);

// 2. Add September 2025 payments
// (You'll need to get actual lease IDs from your database)
db.payments.insertMany([
  {
    userID: ObjectId("your-tenant-id"),
    leaseID: ObjectId("your-lease-id"), 
    amount: NumberDecimal("48000"),
    paymentDate: new Date("2025-09-05"),
    paymentMethod: "bank_transfer",
    status: "completed",
    transactionID: "TXN-SEP-2025-001"
  }
  // Add more payments for other leases...
]);
```

### Expected Results After Population:

Your financial dashboard should show approximately:

- **Revenue This Month**: ~$720,000 (15 units × $48,000 average rent)
- **Incoming Rent**: ~$720,000 (total monthly rent from occupied units)
- **Overdue Rent**: $0 (all payments current)
- **Service Costs**: $2,500 (5 service requests × $500 each)
- **Utilities/Misc**: $3,000 (15 occupied units × $200 each)

### Verification Steps:

1. **Run the script**
2. **Refresh your browser**
3. **Navigate to Financial Dashboard**
4. **Check browser console** - should show real data instead of zeros
5. **Verify calculations** match the expected values above

### Troubleshooting:

If you still see zeros after running the script:

1. **Check script output** for any error messages
2. **Verify database connection** in script
3. **Check user exists** with email "monir@ashaproperties.com"
4. **Look at browser console logs** for API errors

### Script Locations:

- **Main script**: `add-financial-data.js` (in project root)
- **Full population**: `populate-financial-data.js` (comprehensive data)
- **Server populate**: `server/populate-db.js` (original populate script)

Run the `add-financial-data.js` script and your financial dashboard will show realistic property management financial data! 🚀