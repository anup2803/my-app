import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      email: 'admin@restaurant.com',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  // Create worker user
  const workerPassword = await bcrypt.hash('worker123', 12);
  const worker = await prisma.user.upsert({
    where: { email: 'worker@restaurant.com' },
    update: {},
    create: {
      email: 'worker@restaurant.com',
      username: 'worker',
      password: workerPassword,
      firstName: 'Worker',
      lastName: 'User',
      role: 'WAITER',
    },
  });

  // Create kitchen staff
  const kitchenPassword = await bcrypt.hash('kitchen123', 12);
  const kitchen = await prisma.user.upsert({
    where: { email: 'kitchen@restaurant.com' },
    update: {},
    create: {
      email: 'kitchen@restaurant.com',
      username: 'kitchen',
      password: kitchenPassword,
      firstName: 'Kitchen',
      lastName: 'Staff',
      role: 'KITCHEN_STAFF',
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Appetizers' },
      update: {},
      create: {
        name: 'Appetizers',
        description: 'Start your meal with our delicious appetizers',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Main Course' },
      update: {},
      create: {
        name: 'Main Course',
        description: 'Our signature main dishes',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Desserts' },
      update: {},
      create: {
        name: 'Desserts',
        description: 'Sweet endings to your meal',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Beverages' },
      update: {},
      create: {
        name: 'Beverages',
        description: 'Refreshing drinks and beverages',
        sortOrder: 4,
      },
    }),
  ]);

  // Create menu items
  const menuItems = await Promise.all([
    prisma.menuItem.upsert({
      where: { name: 'Chicken Momo' },
      update: {},
      create: {
        name: 'Chicken Momo',
        description: 'Steamed dumplings filled with minced chicken and spices',
        price: 250.00,
        categoryId: categories[0].id,
        isVegetarian: false,
        isSpicy: true,
        preparationTime: 15,
      },
    }),
    prisma.menuItem.upsert({
      where: { name: 'Veg Spring Roll' },
      update: {},
      create: {
        name: 'Veg Spring Roll',
        description: 'Crispy spring rolls with fresh vegetables',
        price: 180.00,
        categoryId: categories[0].id,
        isVegetarian: true,
        isSpicy: false,
        preparationTime: 10,
      },
    }),
    prisma.menuItem.upsert({
      where: { name: 'Chicken Curry' },
      update: {},
      create: {
        name: 'Chicken Curry',
        description: 'Spicy chicken curry with aromatic spices',
        price: 450.00,
        categoryId: categories[1].id,
        isVegetarian: false,
        isSpicy: true,
        preparationTime: 25,
      },
    }),
    prisma.menuItem.upsert({
      where: { name: 'Dal Bhat' },
      update: {},
      create: {
        name: 'Dal Bhat',
        description: 'Traditional Nepali rice and lentil dish',
        price: 350.00,
        categoryId: categories[1].id,
        isVegetarian: true,
        isSpicy: false,
        preparationTime: 20,
      },
    }),
    prisma.menuItem.upsert({
      where: { name: 'Gulab Jamun' },
      update: {},
      create: {
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings in sugar syrup',
        price: 120.00,
        categoryId: categories[2].id,
        isVegetarian: true,
        isSpicy: false,
        preparationTime: 5,
      },
    }),
    prisma.menuItem.upsert({
      where: { name: 'Masala Tea' },
      update: {},
      create: {
        name: 'Masala Tea',
        description: 'Spiced Indian tea with milk',
        price: 80.00,
        categoryId: categories[3].id,
        isVegetarian: true,
        isSpicy: false,
        preparationTime: 5,
      },
    }),
  ]);

  // Create tables
  const tables = await Promise.all([
    prisma.table.upsert({
      where: { number: 1 },
      update: {},
      create: {
        number: 1,
        capacity: 4,
        status: 'AVAILABLE',
      },
    }),
    prisma.table.upsert({
      where: { number: 2 },
      update: {},
      create: {
        number: 2,
        capacity: 6,
        status: 'AVAILABLE',
      },
    }),
    prisma.table.upsert({
      where: { number: 3 },
      update: {},
      create: {
        number: 3,
        capacity: 2,
        status: 'AVAILABLE',
      },
    }),
    prisma.table.upsert({
      where: { number: 4 },
      update: {},
      create: {
        number: 4,
        capacity: 8,
        status: 'AVAILABLE',
      },
    }),
    prisma.table.upsert({
      where: { number: 5 },
      update: {},
      create: {
        number: 5,
        capacity: 4,
        status: 'AVAILABLE',
      },
    }),
  ]);

  // Create ingredients
  const ingredients = await Promise.all([
    prisma.ingredient.upsert({
      where: { name: 'Chicken' },
      update: {},
      create: {
        name: 'Chicken',
        description: 'Fresh chicken meat',
        unit: 'kg',
        currentStock: 50.0,
        minStock: 10.0,
        costPerUnit: 800.00,
        supplier: 'Local Butcher',
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Rice' },
      update: {},
      create: {
        name: 'Rice',
        description: 'Basmati rice',
        unit: 'kg',
        currentStock: 100.0,
        minStock: 20.0,
        costPerUnit: 120.00,
        supplier: 'Grain Supplier',
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Onions' },
      update: {},
      create: {
        name: 'Onions',
        description: 'Fresh onions',
        unit: 'kg',
        currentStock: 30.0,
        minStock: 5.0,
        costPerUnit: 60.00,
        supplier: 'Vegetable Market',
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`👥 Created ${3} users`);
  console.log(`📂 Created ${categories.length} categories`);
  console.log(`🍽️ Created ${menuItems.length} menu items`);
  console.log(`🪑 Created ${tables.length} tables`);
  console.log(`🥬 Created ${ingredients.length} ingredients`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('❌ Error seeding database:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 