// // scripts/seed.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */




// import * as dotenv from "dotenv";

// import Category from "../models/Category";
// import Product from "../models/Product";
// import mongoose from "mongoose";


// // Load environment variables
// dotenv.config({ path: ".env.local" });

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable");
// }

// // --- DATA SETS FOR RANDOMIZATION ---

// const BRANDS = [
//   "Bosch", "Denso", "Brembo", "NGK", "Michelin", "Bridgestone", 
//   "Castrol", "Mobil 1", "K&N", "Bilstein", "Monroe", "Delphi", "Valeo"
// ];

// const CAR_MODELS = [
//   "Toyota Corolla", "Toyota Hilux", "Toyota Vitz", "Ford F-150", 
//   "Honda Civic", "Nissan Patrol", "Hyundai Tucson", "Kia Sportage", 
//   "BMW 3 Series", "Mercedes C-Class", "Isuzu NPR"
// ];

// const ADJECTIVES = [
//   "Premium", "Heavy-Duty", "High-Performance", "OEM Standard", 
//   "Durable", "Economy", "Racing Edition", "Reinforced"
// ];

// const CONDITIONS = ["New", "Refurbished", "Used - Like New"];

// // --- CATEGORY STRUCTURE (The Blueprint) ---
// // This defines the hierarchy and the attributes for the filters to work
// const TAXONOMY = [
//   {
//     name: "Brake System",
//     image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=300&q=80",
//     children: [
//       { 
//         name: "Brake Pads", 
//         attributes: [
//           { name: "Material", type: "select", options: ["Ceramic", "Semi-Metallic", "Organic"] },
//           { name: "Position", type: "select", options: ["Front", "Rear", "All Wheels"] }
//         ],
//         image: "https://images.unsplash.com/photo-1600706432502-77b000dc2939?auto=format&fit=crop&w=300&q=80"
//       },
//       { 
//         name: "Brake Rotors", 
//         attributes: [
//           { name: "Type", type: "select", options: ["Drilled", "Slotted", "Solid", "Vented"] },
//           { name: "Diameter", type: "number" } // e.g. 280mm
//         ],
//         image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=300&q=80"
//       }
//     ]
//   },
//   {
//     name: "Engine Parts",
//     image: "https://images.unsplash.com/photo-1580273916550-e323be2ed5d6?auto=format&fit=crop&w=300&q=80",
//     children: [
//       { 
//         name: "Spark Plugs", 
//         attributes: [
//           { name: "Electrode Material", type: "select", options: ["Iridium", "Platinum", "Copper"] },
//           { name: "Gap Size", type: "number" }
//         ],
//         image: "https://images.unsplash.com/photo-1635784063228-c172d56121b6?auto=format&fit=crop&w=300&q=80"
//       },
//       { 
//         name: "Oil Filters", 
//         attributes: [
//           { name: "Filter Type", type: "select", options: ["Spin-on", "Cartridge"] },
//           { name: "Micron Rating", type: "number" }
//         ],
//         image: "https://images.unsplash.com/photo-1626125454229-20c3b0734a9b?auto=format&fit=crop&w=300&q=80"
//       }
//     ]
//   },
//   {
//     name: "Suspension",
//     image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=300&q=80",
//     children: [
//       { 
//         name: "Shock Absorbers", 
//         attributes: [
//           { name: "Type", type: "select", options: ["Gas Charged", "Hydraulic"] },
//           { name: "Position", type: "select", options: ["Front", "Rear"] }
//         ],
//         image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=300&q=80"
//       }
//     ]
//   },
//   {
//     name: "Electrical",
//     image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=300&q=80",
//     children: [
//       {
//         name: "Car Batteries",
//         attributes: [
//           { name: "Voltage", type: "select", options: ["12V"] },
//           { name: "Amperage", type: "number" }, // 60Ah, 70Ah
//           { name: "Technology", type: "select", options: ["AGM", "Lead Acid", "Gel"] }
//         ],
//         image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=300&q=80"
//       }
//     ]
//   },
//   {
//     name: "Tires & Wheels",
//     image: "https://images.unsplash.com/photo-1578844251758-2f71da645217?auto=format&fit=crop&w=300&q=80",
//     children: [
//       {
//         name: "All-Season Tires",
//         attributes: [
//           { name: "Rim Size", type: "select", options: ["15", "16", "17", "18", "19", "20"] },
//           { name: "Width", type: "number" }, // 205, 215
//           { name: "Aspect Ratio", type: "number" } // 55, 60
//         ],
//         image: "https://images.unsplash.com/photo-1578844251758-2f71da645217?auto=format&fit=crop&w=300&q=80"
//       }
//     ]
//   }
// ];

// // --- HELPER FUNCTIONS ---

// const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
// const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
// const getRandomFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

// async function seed() {
//   console.log("🌱 Starting Seed Script...");

//   // 1. Connect
//   await mongoose.connect(MONGODB_URI as string);
//   console.log("✅ Connected to MongoDB");

//   // 2. Clear DB (Optional - comment out if you want to keep existing)
//   console.log("🧹 Clearing existing data...");
//   await Product.deleteMany({});
//   await Category.deleteMany({});

//   const productsToCreate: any[] = [];
//   const TOTAL_PRODUCTS_TARGET = 250;
//   let productsCreatedCount = 0;

//   // 3. Generate Categories & Products
//   for (const rootData of TAXONOMY) {
//     // Create Root Category
//     const rootCategory = await Category.create({
//       name: rootData.name,
//       image: rootData.image,
//       description: `All kinds of ${rootData.name} for your vehicle.`,
//       parentCategory: null,
//       isActive: true,
//     });

//     console.log(`📁 Created Root: ${rootCategory.name}`);

//     if (rootData.children) {
//       for (const childData of rootData.children) {
//         // Create Child Category
//         const childCategory = await Category.create({
//           name: childData.name,
//           image: childData.image,
//           description: `High quality ${childData.name}.`,
//           parentCategory: rootCategory._id,
//           attributes: childData.attributes, // Save the specific attributes
//           isActive: true
//         });

//         // How many products for this specific subcategory?
//         // Distribute the 250 roughly evenly across the leaf categories
//         const numProductsForCat = Math.floor(TOTAL_PRODUCTS_TARGET / 10) + getRandomInt(-2, 5);

//         for (let i = 0; i < numProductsForCat; i++) {
//           const brand = getRandomElement(BRANDS);
//           const model = getRandomElement(CAR_MODELS);
//           const adjective = getRandomElement(ADJECTIVES);
          
//           // Generate Name
//           const productName = `${brand} ${adjective} ${childData.name} for ${model}`;
          
//           // Generate SKU
//           const baseSku = `${brand.substring(0,3).toUpperCase()}-${childCategory.name.substring(0,3).toUpperCase()}-${getRandomInt(1000, 9999)}`;

//           // Generate Specs based on Category Attributes
//           const specs = childData.attributes.map(attr => {
//             let value;
//             if (attr.type === 'select') value = getRandomElement(attr.options!);
//             if (attr.type === 'number') value = getRandomInt(10, 500); // Simplified number gen
//             // Refine numbers for specific types for realism
//             if (attr.name === 'Rim Size') value = getRandomElement(["15", "16", "17", "18"]);
//             if (attr.name === 'Width') value = getRandomElement(["195", "205", "215", "225"]);
//             if (attr.name === 'Voltage') value = "12V";
            
//             return { name: attr.name, value: value.toString() };
//           });

//           // Generate Variants
//           const numVariants = getRandomInt(1, 3);
//           const variants = [];
          
//           for (let v = 0; v < numVariants; v++) {
//             const condition = getRandomElement(CONDITIONS);
//             variants.push({
//               sku: `${baseSku}-${v + 1}`,
//               price: getRandomFloat(20, 500), // Random price
//               stock: getRandomInt(0, 50), // Random stock (some 0)
//               attributes: [{ name: "Condition", value: condition }]
//             });
//           }

//           // Calculate Display Price (lowest variant)
//           const displayPrice = Math.min(...variants.map(v => v.price));

//           productsToCreate.push({
//             name: productName,
//             description: `Experience superior performance with the ${productName}. Designed to meet or exceed OEM specifications. Perfect for ${model} owners looking for reliability.`,
//             category: childCategory._id,
//             brand: brand,
//             modelCompatibility: [model, getRandomElement(CAR_MODELS)], // Fits 1 or 2 models
//             yearRange: { start: 2015, end: 2024 },
//             specs: specs,
//             displayPrice: displayPrice,
//             variants: variants,
//             images: [childData.image], // Use category image as placeholder
//             isActive: true,
//           });
          
//           productsCreatedCount++;
//         }
//       }
//     }
//   }

//   // 4. Bulk Insert Products
//   console.log(`📦 Generating ${productsToCreate.length} products...`);
//   await Product.insertMany(productsToCreate);
  
//   console.log("✨ Seed Complete!");
//   console.log(`   - Categories: ${TAXONOMY.reduce((acc, r) => acc + 1 + (r.children?.length || 0), 0)}`);
//   console.log(`   - Products: ${productsCreatedCount}`);

//   await mongoose.disconnect();
// }

// seed().catch((err) => {
//   console.error("❌ Seed Error:", err);
//   process.exit(1);
// });