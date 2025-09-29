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
        console.log('='.repeat(50));
        
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
                leaseHasIssues = true;
            } else {
                const unit = await Unit.findById(lease.unitID);
                if (!unit) {
                    console.log(`❌ unitID ${lease.unitID} not found in Units collection`);
                    leaseHasIssues = true;
                } else {
                    console.log(`✅ Unit: ${unit.unitNumber}`);
                    
                    // Check if property exists
                    if (!unit.propertyID) {
                        console.log('❌ Unit missing propertyID');
                        leaseHasIssues = true;
                    } else {
                        const property = await Property.findById(unit.propertyID);
                        if (!property) {
                            console.log(`❌ propertyID ${unit.propertyID} not found in Properties collection`);
                            leaseHasIssues = true;
                        } else {
                            console.log(`✅ Property: ${property.address}`);
                            
                            // Check if property owner exists
                            if (!property.userID) {
                                console.log('❌ Property missing userID (owner)');
                                leaseHasIssues = true;
                            } else {
                                const owner = await User.findById(property.userID);
                                if (!owner) {
                                    console.log(`❌ Property owner ${property.userID} not found in Users collection`);
                                    leaseHasIssues = true;
                                } else {
                                    console.log(`✅ Owner: ${owner.firstName} ${owner.lastName}`);
                                }
                            }
                        }
                    }
                }
            }
            
            // Check lease dates
            if (!lease.startDate || !lease.endDate) {
                console.log('❌ Missing lease dates');
                leaseHasIssues = true;
            } else if (lease.startDate >= lease.endDate) {
                console.log('❌ Invalid lease dates (start >= end)');
                leaseHasIssues = true;
            } else {
                console.log(`✅ Dates: ${lease.startDate.toDateString()} to ${lease.endDate.toDateString()}`);
            }
            
            if (leaseHasIssues) {
                issuesFound++;
                console.log('🚨 This lease has issues!');
            } else {
                healthyLeases++;
                console.log('✅ This lease is healthy!');
            }
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 HEALTH CHECK SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Healthy leases: ${healthyLeases}`);
        console.log(`🚨 Leases with issues: ${issuesFound}`);
        console.log(`📋 Total leases: ${leases.length}`);
        
        if (issuesFound > 0) {
            console.log('\n🔧 RECOMMENDED ACTIONS:');
            console.log('1. Fix or remove lease agreements with missing references');
            console.log('2. Ensure all units have valid propertyID references');
            console.log('3. Ensure all properties have valid userID (owner) references');
            console.log('4. Validate lease date ranges');
        } else {
            console.log('\n🎉 All lease agreements are healthy!');
        }
        
    } catch (error) {
        console.error('❌ Health check failed:', error);
    }
}

export { checkDatabaseHealth };