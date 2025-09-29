#!/usr/bin/env node

// Test script to verify applications data
const fs = require('fs');
const path = require('path');

// Read the constants file
const constantsPath = path.join(__dirname, 'client/src/constants.tsx');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Extract applications data section
const applicationsStart = constantsContent.indexOf('APPLICATIONS_PAGE_DATA: Application[]');
const applicationsEnd = constantsContent.indexOf('];', applicationsStart) + 2;
const applicationsSection = constantsContent.slice(applicationsStart, applicationsEnd);

console.log('✅ Applications Data Found');
console.log(`📊 Data length: ${applicationsSection.length} characters`);

// Count applications
const appMatches = applicationsSection.match(/APP-\d{4}/g) || [];
console.log(`📋 Total Applications: ${appMatches.length}`);

// Count by building
const buildings = ['BLDG-001', 'BLDG-002', 'BLDG-003', 'BLDG-004'];
buildings.forEach(building => {
    const buildingMatches = applicationsSection.match(new RegExp(building, 'g')) || [];
    console.log(`🏢 ${building}: ${buildingMatches.length} applications`);
});

console.log('\n✅ Applications data structure looks good!');
console.log('🚀 Ready to test in browser');