-- Migration: Add missing columns to sync production DB with schema.prisma
-- Safe migration: only ADDs new columns, never drops existing data

-- Step 1: Add ProductType ENUM and productType column to products
ALTER TABLE `products`
  ADD COLUMN IF NOT EXISTS `productType` ENUM('LENS', 'GLASSES', 'ACCESSORY') NOT NULL DEFAULT 'LENS',
  ADD COLUMN IF NOT EXISTS `enableAddons` BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS `disposability` VARCHAR(191) NOT NULL DEFAULT 'ONE_DAY';

-- Step 2: Change images from JSON to LONGTEXT (safe: JSON is valid text)
ALTER TABLE `products` MODIFY COLUMN `images` LONGTEXT NOT NULL;

-- Step 3: Change color from ENUM to VARCHAR (if it exists as ENUM)
ALTER TABLE `products` MODIFY COLUMN `color` VARCHAR(191) NULL;

-- Step 4: Add missing columns to reviews table
ALTER TABLE `reviews`
  ADD COLUMN IF NOT EXISTS `heading` VARCHAR(191) NULL,
  ADD COLUMN IF NOT EXISTS `text` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `image` LONGTEXT NULL,
  ADD COLUMN IF NOT EXISTS `isFeatured` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS `customerMeta` VARCHAR(191) NULL;

-- Step 5: Update enums safely
ALTER TABLE `orders` MODIFY COLUMN `paymentStatus` ENUM('UNPAID', 'PAID', 'PARTIALLY_PAID', 'REFUNDED', 'COD_PENDING', 'CANCELLED') NOT NULL DEFAULT 'UNPAID';

ALTER TABLE `orders` MODIFY COLUMN `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

ALTER TABLE `orders` MODIFY COLUMN `fulfillmentStatus` ENUM('UNFULFILLED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'SHIPPED', 'RETURNED', 'RESTOCKED', 'CANCELLED') NOT NULL DEFAULT 'UNFULFILLED';

-- Step 6: Change shippingAddress from JSON to LONGTEXT (stored as stringified JSON now)
ALTER TABLE `orders` MODIFY COLUMN `shippingAddress` LONGTEXT NOT NULL;

-- Step 7: Add brandId to categories table
ALTER TABLE `categories`
  ADD COLUMN IF NOT EXISTS `brandId` VARCHAR(191) NULL;

-- Step 8: Add logo column as LONGTEXT for brands
ALTER TABLE `brands` MODIFY COLUMN `logo` LONGTEXT NULL;

-- Step 9: Add missing Testimonials table if not exists
CREATE TABLE IF NOT EXISTS `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `heading` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `authorName` VARCHAR(191) NOT NULL,
    `authorMeta` VARCHAR(191) NULL,
    `image` LONGTEXT NULL,
    `productName` VARCHAR(191) NULL,
    `productLink` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
