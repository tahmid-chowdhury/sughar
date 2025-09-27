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

async function populateDatabase() {
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

        // Create users
        console.log("Creating users...");
        const passwordHash = await bcrypt.hash("password123", 10);

        // Landlords
        const landlords = await User.insertMany([
            {
                firstName: "Ahmed",
                lastName: "Rahman",
                email: "ahmed.rahman@example.com",
                phoneNumber: "+880-1711-123456",
                role: "landlord",
                passwordHash
            },
            {
                firstName: "Fatima",
                lastName: "Khan",
                email: "fatima.khan@example.com",
                phoneNumber: "+880-1712-234567",
                role: "landlord",
                passwordHash
            },
            {
                firstName: "Mohammad",
                lastName: "Ali",
                email: "mohammad.ali@example.com",
                phoneNumber: "+880-1713-345678",
                role: "landlord",
                passwordHash
            }
        ]);

        // Tenants
        const tenants = await User.insertMany([
            {
                firstName: "Rashida",
                lastName: "Begum",
                email: "rashida.begum@example.com",
                phoneNumber: "+880-1714-456789",
                role: "tenant",
                passwordHash
            },
            {
                firstName: "Karim",
                lastName: "Hassan",
                email: "karim.hassan@example.com",
                phoneNumber: "+880-1715-567890",
                role: "tenant",
                passwordHash
            },
            {
                firstName: "Nasir",
                lastName: "Ahmed",
                email: "nasir.ahmed@example.com",
                phoneNumber: "+880-1716-678901",
                role: "tenant",
                passwordHash
            },
            {
                firstName: "Salma",
                lastName: "Khatun",
                email: "salma.khatun@example.com",
                phoneNumber: "+880-1717-789012",
                role: "tenant",
                passwordHash
            },
            {
                firstName: "Ibrahim",
                lastName: "Sheikh",
                email: "ibrahim.sheikh@example.com",
                phoneNumber: "+880-1718-890123",
                role: "tenant",
                passwordHash
            },
            {
                firstName: "Ayesha",
                lastName: "Rahman",
                email: "ayesha.rahman@example.com",
                phoneNumber: "+880-1719-901234",
                role: "tenant",
                passwordHash
            }
        ]);

        // Contractors
        const contractorUsers = await User.insertMany([
            {
                firstName: "Abdul",
                lastName: "Karim",
                email: "abdul.karim@example.com",
                phoneNumber: "+880-1720-012345",
                role: "contractor",
                passwordHash
            },
            {
                firstName: "Shahid",
                lastName: "Islam",
                email: "shahid.islam@example.com",
                phoneNumber: "+880-1721-123456",
                role: "contractor",
                passwordHash
            },
            {
                firstName: "Ruma",
                lastName: "Akter",
                email: "ruma.akter@example.com",
                phoneNumber: "+880-1722-234567",
                role: "contractor",
                passwordHash
            }
        ]);

        // Create contractor profiles
        const contractors = await Contractor.insertMany([
            {
                userID: contractorUsers[0]._id,
                companyName: "Dhaka Plumbing Services",
                serviceSpecialty: "Plumbing",
                licenseNumber: "PL-001-2024",
                description: "Professional plumbing services for residential and commercial properties",
                website: "https://dhakaplumbing.com",
                businessAddress: "123 Dhanmondi, Dhaka"
            },
            {
                userID: contractorUsers[1]._id,
                companyName: "Elite Electrical Works",
                serviceSpecialty: "Electrical",
                licenseNumber: "EL-002-2024",
                description: "Licensed electrical contractor with 15 years experience",
                website: "https://eliteelectrical.com",
                businessAddress: "456 Gulshan, Dhaka"
            },
            {
                userID: contractorUsers[2]._id,
                companyName: "Clean & Fresh Services",
                serviceSpecialty: "Cleaning",
                licenseNumber: "CL-003-2024",
                description: "Professional cleaning and maintenance services",
                website: "https://cleanfresh.com",
                businessAddress: "789 Uttara, Dhaka"
            }
        ]);

        // Create properties
        console.log("Creating properties...");
        const properties = await Property.insertMany([
            {
                userID: landlords[0]._id,
                address: "Gulshan Heights, Plot 15, Road 11, Gulshan-1, Dhaka",
                propertyType: "High-rise Apartment Complex"
            },
            {
                userID: landlords[0]._id,
                address: "Dhanmondi Towers, House 32, Road 7, Dhanmondi, Dhaka",
                propertyType: "Mid-rise Residential Building"
            },
            {
                userID: landlords[1]._id,
                address: "Banani Commercial Complex, Plot 25, Banani C/A, Dhaka",
                propertyType: "Commercial Building"
            },
            {
                userID: landlords[1]._id,
                address: "Uttara Garden City, Sector 7, Uttara, Dhaka",
                propertyType: "Residential Complex"
            },
            {
                userID: landlords[2]._id,
                address: "Bashundhara R/A, Block E, Road 3, Dhaka",
                propertyType: "Luxury Apartment Complex"
            }
        ]);

        // Create units
        console.log("Creating units...");
        const units = [];
        
        // Units for Gulshan Heights
        for (let floor = 1; floor <= 12; floor++) {
            for (let unit of ['A', 'B']) {
                units.push({
                    propertyID: properties[0]._id,
                    unitNumber: `${floor}${unit}`,
                    squareFootage: unit === 'A' ? 1200 : 1400,
                    bedrooms: unit === 'A' ? 2 : 3,
                    bathrooms: unit === 'A' ? 2 : 3,
                    monthlyRent: unit === 'A' ? 45000 : 55000,
                    status: Math.random() > 0.3 ? 'occupied' : 'vacant'
                });
            }
        }

        // Units for Dhanmondi Towers
        for (let floor = 1; floor <= 8; floor++) {
            for (let unit of ['A', 'B', 'C']) {
                units.push({
                    propertyID: properties[1]._id,
                    unitNumber: `${floor}${unit}`,
                    squareFootage: 900 + Math.floor(Math.random() * 400),
                    bedrooms: Math.floor(Math.random() * 3) + 1,
                    bathrooms: Math.floor(Math.random() * 2) + 1,
                    monthlyRent: 35000 + Math.floor(Math.random() * 25000),
                    status: Math.random() > 0.25 ? 'occupied' : 'vacant'
                });
            }
        }

        // Units for other properties
        for (let i = 2; i < properties.length; i++) {
            const numUnits = Math.floor(Math.random() * 20) + 10;
            for (let j = 1; j <= numUnits; j++) {
                units.push({
                    propertyID: properties[i]._id,
                    unitNumber: `${Math.floor(j/4) + 1}${String.fromCharCode(65 + (j % 4))}`,
                    squareFootage: 800 + Math.floor(Math.random() * 600),
                    bedrooms: Math.floor(Math.random() * 4) + 1,
                    bathrooms: Math.floor(Math.random() * 3) + 1,
                    monthlyRent: 30000 + Math.floor(Math.random() * 40000),
                    status: Math.random() > 0.2 ? 'occupied' : 'vacant'
                });
            }
        }

        const createdUnits = await Unit.insertMany(units);
        console.log(`Created ${createdUnits.length} units`);

        // Create lease agreements for occupied units
        console.log("Creating lease agreements...");
        const occupiedUnits = createdUnits.filter(unit => unit.status === 'occupied');
        const leaseAgreements = [];
        
        for (let i = 0; i < Math.min(occupiedUnits.length, tenants.length); i++) {
            const startDate = new Date(2024, Math.floor(Math.random() * 12), 1);
            const endDate = new Date(startDate);
            endDate.setFullYear(endDate.getFullYear() + 1);
            
            leaseAgreements.push({
                userID: tenants[i]._id,
                unitID: occupiedUnits[i]._id,
                startDate,
                endDate,
                documentURL: `https://storage.example.com/lease-${occupiedUnits[i].unitNumber}.pdf`
            });
        }

        const createdLeases = await LeaseAgreement.insertMany(leaseAgreements);

        // Create service requests
        console.log("Creating service requests...");
        const serviceRequests = [
            {
                userID: tenants[0]._id,
                unitID: occupiedUnits[0]._id,
                assignedContractorID: contractorUsers[0]._id,
                description: "Kitchen faucet is leaking and needs repair",
                status: "in progress",
                priority: "medium"
            },
            {
                userID: tenants[1]._id,
                unitID: occupiedUnits[1]._id,
                description: "Air conditioning not working properly",
                status: "new",
                priority: "high"
            },
            {
                userID: tenants[2]._id,
                unitID: occupiedUnits[2]._id,
                assignedContractorID: contractorUsers[1]._id,
                description: "Electrical outlet in bedroom not working",
                status: "completed",
                priority: "medium"
            },
            {
                userID: tenants[3]._id,
                unitID: occupiedUnits[3]._id,
                description: "Bathroom tiles need replacement",
                status: "new",
                priority: "low"
            },
            {
                userID: tenants[4]._id,
                unitID: occupiedUnits[4]._id,
                assignedContractorID: contractorUsers[2]._id,
                description: "Deep cleaning required after previous tenant",
                status: "in progress",
                priority: "medium"
            }
        ];

        await ServiceRequest.insertMany(serviceRequests);

        // Create rental applications for vacant units
        console.log("Creating rental applications...");
        const vacantUnits = createdUnits.filter(unit => unit.status === 'vacant');
        const applications = [];
        
        for (let i = 0; i < Math.min(vacantUnits.length, 10); i++) {
            applications.push({
                userID: tenants[Math.floor(Math.random() * tenants.length)]._id,
                unitID: vacantUnits[i]._id,
                status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
                monthlyIncome: 80000 + Math.floor(Math.random() * 120000),
                employmentStatus: ['Full-time Employee', 'Business Owner', 'Freelancer'][Math.floor(Math.random() * 3)],
                references: [
                    {
                        name: "Previous Landlord",
                        phone: "+880-1700-000000",
                        relationship: "Landlord"
                    }
                ],
                notes: "Excellent credit score, no pets, non-smoker"
            });
        }

        await RentalApplication.insertMany(applications);

        // Create payments
        console.log("Creating payments...");
        const payments = [];
        
        for (const lease of createdLeases) {
            // Create 6 months of payment history
            for (let month = 0; month < 6; month++) {
                const paymentDate = new Date(lease.startDate);
                paymentDate.setMonth(paymentDate.getMonth() + month);
                
                if (paymentDate <= new Date()) {
                    payments.push({
                        userID: lease.userID,
                        leaseID: lease._id,
                        amount: createdUnits.find(u => u._id.equals(lease.unitID)).monthlyRent,
                        paymentDate,
                        paymentMethod: ['bank_transfer', 'online', 'check'][Math.floor(Math.random() * 3)],
                        status: Math.random() > 0.1 ? 'completed' : 'pending',
                        transactionID: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
                    });
                }
            }
        }

        await Payment.insertMany(payments);

        // Create documents
        console.log("Creating documents...");
        const documents = [];
        
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i];
            
            // Property documents
            documents.push({
                userID: property.userID,
                propertyID: property._id,
                documentName: `Property Deed - ${property.address.split(',')[0]}`,
                documentType: 'property_deed',
                fileURL: `https://storage.example.com/deed-${property._id}.pdf`,
                fileSize: 2048000,
                mimeType: 'application/pdf'
            });
            
            // Insurance documents
            documents.push({
                userID: property.userID,
                propertyID: property._id,
                documentName: `Insurance Policy - ${property.address.split(',')[0]}`,
                documentType: 'insurance_document',
                fileURL: `https://storage.example.com/insurance-${property._id}.pdf`,
                fileSize: 1024000,
                mimeType: 'application/pdf'
            });
        }

        // Unit-specific documents
        for (const lease of createdLeases) {
            documents.push({
                userID: lease.userID,
                unitID: lease.unitID,
                documentName: `Lease Agreement - Unit ${createdUnits.find(u => u._id.equals(lease.unitID)).unitNumber}`,
                documentType: 'lease_agreement',
                fileURL: lease.documentURL,
                fileSize: 512000,
                mimeType: 'application/pdf'
            });
        }

        await Document.insertMany(documents);

        // Create ratings
        console.log("Creating ratings...");
        const ratings = [];
        
        // Tenants rating landlords
        for (let i = 0; i < Math.min(tenants.length, landlords.length * 2); i++) {
            ratings.push({
                raterUserID: tenants[i % tenants.length]._id,
                rateeUserID: landlords[Math.floor(i / 2)]._id,
                ratingValue: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                comment: "Great landlord, responsive to maintenance requests",
                ratingDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
            });
        }

        // Landlords rating contractors
        for (let i = 0; i < contractorUsers.length; i++) {
            ratings.push({
                raterUserID: landlords[0]._id,
                rateeUserID: contractorUsers[i]._id,
                ratingValue: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                comment: "Professional service, completed work on time",
                ratingDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
            });
        }

        await Rating.insertMany(ratings);

        console.log("Database populated successfully!");
        console.log(`Created:
        - ${landlords.length} landlords
        - ${tenants.length} tenants  
        - ${contractorUsers.length} contractors
        - ${properties.length} properties
        - ${createdUnits.length} units
        - ${createdLeases.length} lease agreements
        - ${serviceRequests.length} service requests
        - ${applications.length} rental applications
        - ${payments.length} payments
        - ${documents.length} documents
        - ${ratings.length} ratings`);

    } catch (error) {
        console.error("Error populating database:", error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

populateDatabase();