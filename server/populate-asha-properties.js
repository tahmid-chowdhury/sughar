import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Import models
import User from "./models/User.js";
import Property from "./models/Property.js";
import Unit from "./models/Unit.js";
import ServiceRequest from "./models/ServiceRequest.js";
import RentalApplication from "./models/RentalApplication.js";
import LeaseAgreement from "./models/LeaseAgreement.js";
import Payment from "./models/Payment.js";
import Document from "./models/Document.js";
import Contractor from "./models/Contractor.js";
import Rating from "./models/Rating.js";

const uri = process.env.ATLAS_URI || "";

async function populateAshaProperties() {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas!");

        // Clear existing data
        console.log("Clearing existing data...");
        await User.deleteMany({});
        await Property.deleteMany({});
        await Unit.deleteMany({});
        await ServiceRequest.deleteMany({});
        await RentalApplication.deleteMany({});
        await LeaseAgreement.deleteMany({});
        await Payment.deleteMany({});
        await Document.deleteMany({});
        await Contractor.deleteMany({});
        await Rating.deleteMany({});

        // Create password hash
        const passwordHash = await bcrypt.hash("password123", 10);

        console.log("Creating Asha Properties organization...");

        // Create landlord (Monir Rahman - Owner of Asha Properties)
        const landlord = await User.create({
            firstName: "Monir",
            lastName: "Rahman",
            email: "monir@ashaproperties.com",
            phoneNumber: "+880-1711-111111",
            role: "landlord",
            passwordHash
        });

        // Create tenants
        console.log("Creating tenants...");
        const tenantData = [
            // Current tenants
            { firstName: "Farzana", lastName: "Akhter", email: "farzana.akhter@example.com", phone: "+880-1711-222222" },
            { firstName: "Shahriar", lastName: "Karim", email: "shahriar.karim@example.com", phone: "+880-1711-333333" },
            { firstName: "Tania", lastName: "Akter", email: "tania.akter@example.com", phone: "+880-1711-444444" },
            { firstName: "Imran", lastName: "Chowdhury", email: "imran.chowdhury@example.com", phone: "+880-1711-555555" },
            { firstName: "Sumi", lastName: "Akhter", email: "sumi.akhter@example.com", phone: "+880-1711-666666" },
            { firstName: "Hasan", lastName: "Mahmud", email: "hasan.mahmud@example.com", phone: "+880-1711-777777" },
            { firstName: "Shuvo", lastName: "Islam", email: "shuvo.islam@example.com", phone: "+880-1711-888888" },
            { firstName: "Maruf", lastName: "Khan", email: "maruf.khan@example.com", phone: "+880-1711-999999" },
            { firstName: "Mahin", lastName: "Alam", email: "mahin.alam@example.com", phone: "+880-1712-111111" },
            { firstName: "Saima", lastName: "Binte Noor", email: "saima.noor@example.com", phone: "+880-1712-222222" },
            { firstName: "Javed", lastName: "Rahman", email: "javed.rahman@example.com", phone: "+880-1712-333333" },
            { firstName: "Sadia", lastName: "Hossain", email: "sadia.hossain@example.com", phone: "+880-1712-444444" },
            { firstName: "Kamal", lastName: "Uddin", email: "kamal.uddin@example.com", phone: "+880-1712-555555" },
            { firstName: "Mehnaz", lastName: "Sultana", email: "mehnaz.sultana@example.com", phone: "+880-1712-666666" },
            { firstName: "Tanvir", lastName: "Ahmed", email: "tanvir.ahmed@example.com", phone: "+880-1712-777777" },
            { firstName: "Nasrin", lastName: "Akter", email: "nasrin.akter@example.com", phone: "+880-1712-888888" },
            { firstName: "Mithun", lastName: "Das", email: "mithun.das@example.com", phone: "+880-1712-999999" },
            { firstName: "Zahid", lastName: "Hasan", email: "zahid.hasan@example.com", phone: "+880-1713-111111" },
            { firstName: "Roksana", lastName: "Begum", email: "roksana.begum@example.com", phone: "+880-1713-222222" },
            { firstName: "Shila", lastName: "Rahman", email: "shila.rahman@example.com", phone: "+880-1713-333333" },
            { firstName: "Arefin", lastName: "Chowdhury", email: "arefin.chowdhury@example.com", phone: "+880-1713-444444" },
            { firstName: "Rezaul", lastName: "Karim", email: "rezaul.karim@example.com", phone: "+880-1713-555555" },
            { firstName: "Nadia", lastName: "Islam", email: "nadia.islam@example.com", phone: "+880-1713-666666" },
            { firstName: "Selina", lastName: "Yasmin", email: "selina.yasmin@example.com", phone: "+880-1713-777777" },
            { firstName: "Abdul", lastName: "Malek", email: "abdul.malek@example.com", phone: "+880-1713-888888" },
            { firstName: "Rafsan", lastName: "Chowdhury", email: "rafsan.chowdhury@example.com", phone: "+880-1713-999999" },
            // Former tenant who needs rating
            { firstName: "Amrul", lastName: "Hoque", email: "amrul.hoque@example.com", phone: "+880-1714-111111" }
        ];

        const tenants = [];
        for (const tenant of tenantData) {
            const createdTenant = await User.create({
                firstName: tenant.firstName,
                lastName: tenant.lastName,
                email: tenant.email,
                phoneNumber: tenant.phone,
                role: "tenant",
                passwordHash
            });
            tenants.push(createdTenant);
        }

        // Create rental applicants
        console.log("Creating rental applicants...");
        const applicantData = [
            { firstName: "Raiyan", lastName: "Rahman", email: "raiyan.rahman@example.com", phone: "+880-1715-111111", income: 120000, rating: 4.8 },
            { firstName: "Niloy", lastName: "Hossain", email: "niloy.hossain@example.com", phone: "+880-1715-222222", income: 45000, rating: null },
            { firstName: "Arif", lastName: "Mahmud", email: "arif.mahmud@example.com", phone: "+880-1715-333333", income: 95000, rating: 4.5 },
            { firstName: "Zarin", lastName: "Tasnim", email: "zarin.tasnim@example.com", phone: "+880-1715-444444", income: 70000, rating: 4.9 },
            { firstName: "Ayaan", lastName: "Chowdhury", email: "ayaan.chowdhury@example.com", phone: "+880-1715-555555", income: 65000, rating: null },
            { firstName: "Nusrat", lastName: "Jahan", email: "nusrat.jahan@example.com", phone: "+880-1715-666666", income: 150000, rating: 4.7 }
        ];

        const applicants = [];
        for (const applicant of applicantData) {
            const createdApplicant = await User.create({
                firstName: applicant.firstName,
                lastName: applicant.lastName,
                email: applicant.email,
                phoneNumber: applicant.phone,
                role: "tenant",
                passwordHash
            });
            applicants.push({ ...createdApplicant.toObject(), income: applicant.income, rating: applicant.rating });
        }

        // Create properties
        console.log("Creating properties...");
        const properties = await Property.insertMany([
            {
                userID: landlord._id,
                address: "Lalmatia Court, Lalmatia, Dhaka",
                propertyType: "Residential Apartment Complex"
            },
            {
                userID: landlord._id,
                address: "Banani Heights, Banani, Dhaka",
                propertyType: "Residential Apartment Complex"
            },
            {
                userID: landlord._id,
                address: "Dhanmondi Residency, Dhanmondi, Dhaka",
                propertyType: "Residential Apartment Complex"
            },
            {
                userID: landlord._id,
                address: "Uttara Gardens, Uttara, Dhaka",
                propertyType: "Residential Apartment Complex"
            }
        ]);

        // Create units
        console.log("Creating units...");
        const unitData = [
            // Building 1 – Lalmatia Court (12 Units)
            { propertyIndex: 0, unitNumber: "1A", tenant: "Farzana Akhter", leaseEnd: "2026-01-14", status: "occupied", rent: 45000 },
            { propertyIndex: 0, unitNumber: "2A", tenant: "Amrul Hoque", leaseEnd: "2025-09-27", status: "vacant", rent: 45000 }, // Lease ending TODAY
            { propertyIndex: 0, unitNumber: "3A", tenant: "Shahriar Karim", leaseEnd: "2026-03-02", status: "occupied", rent: 45000 },
            { propertyIndex: 0, unitNumber: "4A", tenant: "Tania Akter", leaseEnd: "2026-03-03", status: "occupied", rent: 45000 },
            { propertyIndex: 0, unitNumber: "1B", tenant: "Imran Chowdhury", leaseEnd: "2026-05-11", status: "occupied", rent: 48000 },
            { propertyIndex: 0, unitNumber: "2B", tenant: "Sumi Akhter", leaseEnd: "2026-04-28", status: "occupied", rent: 48000 },
            { propertyIndex: 0, unitNumber: "3B", tenant: "Hasan Mahmud", leaseEnd: "2026-06-17", status: "occupied", rent: 48000 },
            { propertyIndex: 0, unitNumber: "4B", tenant: "Shuvo Islam", leaseEnd: "2026-02-09", status: "occupied", rent: 48000 },
            { propertyIndex: 0, unitNumber: "1C", tenant: "Maruf Khan", leaseEnd: "2025-11-22", status: "occupied", rent: 52000 },
            { propertyIndex: 0, unitNumber: "2C", tenant: "Mahin Alam", leaseEnd: "2026-08-15", status: "occupied", rent: 52000 },
            { propertyIndex: 0, unitNumber: "3C", tenant: "Saima Binte Noor", leaseEnd: "2026-07-05", status: "occupied", rent: 52000 },
            { propertyIndex: 0, unitNumber: "4C", tenant: "Javed Rahman", leaseEnd: "2025-12-19", status: "occupied", rent: 52000 },

            // Building 2 – Banani Heights (8 Units)
            { propertyIndex: 1, unitNumber: "1A", tenant: "Sadia Hossain", leaseEnd: "2026-10-03", status: "occupied", rent: 55000 },
            { propertyIndex: 1, unitNumber: "2A", tenant: "Kamal Uddin", leaseEnd: "2026-09-02", status: "occupied", rent: 55000 },
            { propertyIndex: 1, unitNumber: "3A", tenant: "Mehnaz Sultana", leaseEnd: "2026-05-23", status: "occupied", rent: 55000 },
            { propertyIndex: 1, unitNumber: "4A", tenant: "Tanvir Ahmed", leaseEnd: "2026-04-11", status: "occupied", rent: 55000 },
            { propertyIndex: 1, unitNumber: "1B", tenant: "Nasrin Akter", leaseEnd: "2026-03-29", status: "occupied", rent: 58000 },
            { propertyIndex: 1, unitNumber: "2B", tenant: "Mithun Das", leaseEnd: "2026-08-20", status: "occupied", rent: 58000 },
            { propertyIndex: 1, unitNumber: "3B", tenant: "Zahid Hasan", leaseEnd: "2026-06-08", status: "occupied", rent: 58000 },
            { propertyIndex: 1, unitNumber: "4B", tenant: "Roksana Begum", leaseEnd: "2025-12-30", status: "occupied", rent: 58000 },

            // Building 3 – Dhanmondi Residency (5 Units)
            { propertyIndex: 2, unitNumber: "1A", tenant: null, leaseEnd: null, status: "vacant", rent: 42000 },
            { propertyIndex: 2, unitNumber: "2A", tenant: "Shila Rahman", leaseEnd: "2026-02-13", status: "occupied", rent: 42000 },
            { propertyIndex: 2, unitNumber: "3A", tenant: "Arefin Chowdhury", leaseEnd: "2025-11-09", status: "occupied", rent: 42000 },
            { propertyIndex: 2, unitNumber: "4A", tenant: "Rezaul Karim", leaseEnd: "2026-01-18", status: "occupied", rent: 42000 },
            { propertyIndex: 2, unitNumber: "5A", tenant: "Nadia Islam", leaseEnd: "2026-07-27", status: "occupied", rent: 42000 },

            // Building 4 – Uttara Gardens (3 Units)
            { propertyIndex: 3, unitNumber: "1", tenant: "Selina Yasmin", leaseEnd: "2026-01-12", status: "occupied", rent: 38000 },
            { propertyIndex: 3, unitNumber: "2", tenant: "Abdul Malek", leaseEnd: "2025-10-30", status: "occupied", rent: 38000 },
            { propertyIndex: 3, unitNumber: "3", tenant: "Rafsan Chowdhury", leaseEnd: "2026-09-19", status: "occupied", rent: 38000 }
        ];

        const units = [];
        for (const unitInfo of unitData) {
            const unit = await Unit.create({
                propertyID: properties[unitInfo.propertyIndex]._id,
                unitNumber: unitInfo.unitNumber,
                squareFootage: 1000 + Math.floor(Math.random() * 400),
                bedrooms: unitInfo.unitNumber.includes('C') ? 3 : unitInfo.unitNumber.includes('B') ? 2 : 2,
                bathrooms: unitInfo.unitNumber.includes('C') ? 2 : 2,
                monthlyRent: unitInfo.rent,
                status: unitInfo.status
            });
            units.push({ ...unit.toObject(), tenantName: unitInfo.tenant, leaseEnd: unitInfo.leaseEnd });
        }

        // Create lease agreements
        console.log("Creating lease agreements...");
        const leaseAgreements = [];
        for (const unit of units) {
            if (unit.tenantName && unit.status === "occupied") {
                const tenant = tenants.find(t => `${t.firstName} ${t.lastName}` === unit.tenantName);
                if (tenant) {
                    const startDate = new Date(unit.leaseEnd);
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    
                    const lease = await LeaseAgreement.create({
                        userID: tenant._id,
                        unitID: unit._id,
                        startDate,
                        endDate: new Date(unit.leaseEnd),
                        documentURL: `https://storage.ashaproperties.com/lease-${unit.unitNumber}.pdf`
                    });
                    leaseAgreements.push(lease);
                }
            }
        }

        // Create service requests
        console.log("Creating service requests...");
        const serviceRequestData = [
            { unitNumber: "4A", building: "Lalmatia Court", description: "Leak under kitchen sink", date: "2025-09-20", details: "Tenant reports water pooling under sink; cabinet getting damaged." },
            { unitNumber: "2B", building: "Lalmatia Court", description: "Bathroom faucet dripping", date: "2025-09-22", details: "Constant dripping, wasting water and raising bill." },
            { unitNumber: "1C", building: "Lalmatia Court", description: "AC not cooling properly", date: "2025-09-19", details: "AC blows warm air even after filter cleaning." },
            { unitNumber: "2A", building: "Banani Heights", description: "Electrical outage in living room", date: "2025-09-18", details: "Circuit breaker keeps tripping, no power in living room." },
            { unitNumber: "4A", building: "Banani Heights", description: "Window glass cracked", date: "2025-09-23", details: "Small crack in bedroom window, risk of shattering." },
            { unitNumber: "3B", building: "Banani Heights", description: "Clogged kitchen drain", date: "2025-09-24", details: "Water not draining; possible grease buildup." },
            { unitNumber: "2A", building: "Dhanmondi Residency", description: "Bedroom light fixture sparking", date: "2025-09-21", details: "Sparks seen when switching light on/off." },
            { unitNumber: "4A", building: "Dhanmondi Residency", description: "Pest infestation (cockroaches)", date: "2025-09-15", details: "Cockroaches in kitchen; needs pest control service." },
            { unitNumber: "1", building: "Uttara Gardens", description: "Water heater not working", date: "2025-09-25", details: "Tenant reports no hot water for past two days." }
        ];

        for (let i = 0; i < serviceRequestData.length; i++) {
            const srData = serviceRequestData[i];
            const unit = units.find(u => u.unitNumber === srData.unitNumber);
            const tenant = tenants.find(t => `${t.firstName} ${t.lastName}` === unit.tenantName);
            
            if (unit && tenant) {
                await ServiceRequest.create({
                    userID: tenant._id,
                    unitID: unit._id,
                    description: `${srData.description} | ${srData.details}`,
                    status: "new",
                    requestDate: new Date(srData.date),
                    priority: "medium"
                });
            }
        }

        // Create rental applications
        console.log("Creating rental applications...");
        const vacantUnits = units.filter(u => u.status === "vacant");
        for (let i = 0; i < Math.min(applicants.length, vacantUnits.length + 2); i++) {
            const applicant = applicants[i];
            const targetUnit = i < vacantUnits.length ? vacantUnits[i] : units[Math.floor(Math.random() * units.length)];
            
            // Create detailed application data based on the provided examples
            const employmentData = [
                { occupation: "Software Engineer", employer: "Grameenphone IT Division", years: 3 },
                { occupation: "Freelance Graphic Designer", employer: "Self-employed (Upwork/Fiverr)", years: 2 },
                { occupation: "Senior Accountant", employer: "BRAC Bank", years: 5 },
                { occupation: "Lecturer (Economics)", employer: "University of Dhaka", years: 4 },
                { occupation: "Junior Doctor (Resident)", employer: "Square Hospital", years: 1 },
                { occupation: "Fashion Entrepreneur", employer: "Owns boutique \"Nusrat Styles\"", years: 6 }
            ];

            const employment = employmentData[i];
            
            await RentalApplication.create({
                userID: applicant._id,
                unitID: targetUnit._id,
                status: "pending",
                monthlyIncome: applicant.income,
                employmentStatus: `${employment.occupation} at ${employment.employer} (${employment.years} years)`,
                references: [
                    {
                        name: "Previous Landlord",
                        phone: "+880-1700-000000",
                        relationship: "Landlord"
                    }
                ],
                notes: `Tenant Rating: ${applicant.rating ? applicant.rating : 'None (new renter)'}`
            });
        }

        // Create ratings for tenants who have previous ratings
        console.log("Creating tenant ratings...");
        for (const applicant of applicants) {
            if (applicant.rating) {
                await Rating.create({
                    raterUserID: landlord._id,
                    rateeUserID: applicant._id,
                    ratingValue: Math.round(applicant.rating),
                    comment: `Previous tenant rating: ${applicant.rating}/5.0`,
                    ratingDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
                });
            }
        }

        // Create some payment records for current tenants
        console.log("Creating payment records...");
        for (const lease of leaseAgreements) {
            const unit = units.find(u => u._id.equals(lease.unitID));
            if (unit) {
                // Create last 3 months of payments
                for (let month = 0; month < 3; month++) {
                    const paymentDate = new Date();
                    paymentDate.setMonth(paymentDate.getMonth() - month);
                    paymentDate.setDate(1); // First of the month
                    
                    await Payment.create({
                        userID: lease.userID,
                        leaseID: lease._id,
                        amount: unit.monthlyRent,
                        paymentDate,
                        paymentMethod: "bank_transfer",
                        status: "completed",
                        transactionID: `ASH-${Date.now()}-${Math.floor(Math.random() * 1000)}`
                    });
                }
            }
        }

        console.log("Asha Properties database populated successfully!");
        console.log(`
Organization: Asha Properties
Owner: Monir Rahman
Portfolio: 4 buildings | 28 total units | ~90% occupied

Created:
- 1 landlord (Monir Rahman)
- ${tenants.length} tenants (current and former)
- ${applicants.length} rental applicants
- ${properties.length} properties
- ${units.length} units
- ${leaseAgreements.length} active lease agreements
- ${serviceRequestData.length} service requests
- Rental applications and ratings
- Payment records for current tenants
        `);

    } catch (error) {
        console.error("Error populating Asha Properties database:", error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

populateAshaProperties();