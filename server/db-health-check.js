// Database Health Check Script for Lease Agreements
// Run this to identify data integrity issues

import mongoose from 'mongoose';
import LeaseAgreement from './models/LeaseAgreement.js';
import Unit from './models/Unit.js';
import Property from './models/Property.js';
import User from './models/User.js';

async function checkDatabaseHealth() {
    try {
        console.log('🔍 Starting database health check...');
        console.log('=' .repeat(50));
        
        // Get all lease agreements
        const leases = await LeaseAgreement.find();
        console.log(`📋 Total lease agreements: ${leases.length}`);
        
        let issuesFound = 0;
        let healthyLeases = 0;
        
        for (const lease of leases) {
            console.log(`\n🔎 Checking lease ${lease._id}...`);
            let leaseHasIssues = false;
            
            // Check if userID exists
            if (!lease.userID) {
                console.log('❌ Missing userID');
                leaseHasIssues = true;
            } else {
                const user = await User.findById(lease.userID);
                if (!user) {
                    console.log(`❌ userID ${lease.userID} not found in Users collection`);
                    leaseHasIssues = true;
                } else {
                    console.log(`✅ User: ${user.firstName} ${user.lastName}`);
                }
            }
            
            // Check if unitID exists
            if (!lease.unitID) {
                console.log('❌ Missing unitID');
                leaseHasIssues = true;\n            } else {\n                const unit = await Unit.findById(lease.unitID);\n                if (!unit) {\n                    console.log(`❌ unitID ${lease.unitID} not found in Units collection`);\n                    leaseHasIssues = true;\n                } else {\n                    console.log(`✅ Unit: ${unit.unitNumber}`);\n                    \n                    // Check if property exists\n                    if (!unit.propertyID) {\n                        console.log('❌ Unit missing propertyID');\n                        leaseHasIssues = true;\n                    } else {\n                        const property = await Property.findById(unit.propertyID);\n                        if (!property) {\n                            console.log(`❌ propertyID ${unit.propertyID} not found in Properties collection`);\n                            leaseHasIssues = true;\n                        } else {\n                            console.log(`✅ Property: ${property.address}`);\n                            \n                            // Check if property owner exists\n                            if (!property.userID) {\n                                console.log('❌ Property missing userID (owner)');\n                                leaseHasIssues = true;\n                            } else {\n                                const owner = await User.findById(property.userID);\n                                if (!owner) {\n                                    console.log(`❌ Property owner ${property.userID} not found in Users collection`);\n                                    leaseHasIssues = true;\n                                } else {\n                                    console.log(`✅ Owner: ${owner.firstName} ${owner.lastName}`);\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n            \n            // Check lease dates\n            if (!lease.startDate || !lease.endDate) {\n                console.log('❌ Missing lease dates');\n                leaseHasIssues = true;\n            } else if (lease.startDate >= lease.endDate) {\n                console.log('❌ Invalid lease dates (start >= end)');\n                leaseHasIssues = true;\n            } else {\n                console.log(`✅ Dates: ${lease.startDate.toDateString()} to ${lease.endDate.toDateString()}`);\n            }\n            \n            if (leaseHasIssues) {\n                issuesFound++;\n                console.log('🚨 This lease has issues!');\n            } else {\n                healthyLeases++;\n                console.log('✅ This lease is healthy!');\n            }\n        }\n        \n        console.log('\\n' + '=' .repeat(50));\n        console.log('📊 HEALTH CHECK SUMMARY');\n        console.log('=' .repeat(50));\n        console.log(`✅ Healthy leases: ${healthyLeases}`);\n        console.log(`🚨 Leases with issues: ${issuesFound}`);\n        console.log(`📋 Total leases: ${leases.length}`);\n        \n        if (issuesFound > 0) {\n            console.log('\\n🔧 RECOMMENDED ACTIONS:');\n            console.log('1. Fix or remove lease agreements with missing references');\n            console.log('2. Ensure all units have valid propertyID references');\n            console.log('3. Ensure all properties have valid userID (owner) references');\n            console.log('4. Validate lease date ranges');\n        } else {\n            console.log('\\n🎉 All lease agreements are healthy!');\n        }\n        \n    } catch (error) {\n        console.error('❌ Health check failed:', error);\n    }\n}\n\n// Quick fix function to remove broken leases\nasync function cleanupBrokenLeases() {\n    try {\n        console.log('🧹 Starting cleanup of broken leases...');\n        \n        const leases = await LeaseAgreement.find();\n        const brokenLeases = [];\n        \n        for (const lease of leases) {\n            let isBroken = false;\n            \n            if (!lease.userID || !lease.unitID) {\n                isBroken = true;\n            } else {\n                const user = await User.findById(lease.userID);\n                const unit = await Unit.findById(lease.unitID);\n                \n                if (!user || !unit) {\n                    isBroken = true;\n                } else if (unit.propertyID) {\n                    const property = await Property.findById(unit.propertyID);\n                    if (!property) {\n                        isBroken = true;\n                    }\n                }\n            }\n            \n            if (isBroken) {\n                brokenLeases.push(lease._id);\n            }\n        }\n        \n        if (brokenLeases.length > 0) {\n            console.log(`🗑️  Found ${brokenLeases.length} broken leases to remove`);\n            console.log('Broken lease IDs:', brokenLeases);\n            \n            // Uncomment the following line to actually delete the broken leases\n            // await LeaseAgreement.deleteMany({ _id: { $in: brokenLeases } });\n            \n            console.log('⚠️  To actually delete them, uncomment the deleteMany line in this script');\n        } else {\n            console.log('✅ No broken leases found!');\n        }\n        \n    } catch (error) {\n        console.error('❌ Cleanup failed:', error);\n    }\n}\n\nexport { checkDatabaseHealth, cleanupBrokenLeases };