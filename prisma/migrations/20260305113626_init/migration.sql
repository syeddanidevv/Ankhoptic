/*
  Warnings:

  - You are about to drop the column `address1` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `address2` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `admin_users` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `selectedAxis` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `selectedColor` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `selectedCylinder` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `selectedEye` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `selectedPower` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `customers` table. All the data in the column will be lost.
  - The `emailVerified` column on the `customers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `appliesTo` on the `discounts` table. All the data in the column will be lost.
  - You are about to drop the column `minimumOrderAmount` on the `discounts` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `discounts` table. All the data in the column will be lost.
  - You are about to drop the column `usageCount` on the `discounts` table. All the data in the column will be lost.
  - You are about to drop the column `usageLimit` on the `discounts` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `packSize` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `selectedAxis` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `selectedColor` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `selectedCylinder` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `selectedEye` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `selectedPower` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `totalDiscount` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `variantTitle` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `billingAddress` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `cancelReason` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `closedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `financialStatus` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `subtotalPrice` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `totalDiscount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `totalShipping` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `totalTax` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `axisOptions` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `baseCurve` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `colorFamily` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `cylinderMax` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `cylinderMin` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `diameter` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `handlingTint` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `isColored` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `oxygenPerm` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `packSize` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `powerMax` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `powerMin` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `powerStep` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `prescriptionRequired` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `productType` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `replacement` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `uvProtection` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `vendor` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `waterContent` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `store_settings` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `store_settings` table. All the data in the column will be lost.
  - You are about to drop the `cart_discounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `collection_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `collections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fulfillments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_discounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wishlists` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `line1` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Made the column `province` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `productTitle` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `paymentMethod` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shippingAddress` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Made the column `modality` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `addresses` DROP FOREIGN KEY `addresses_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_discounts` DROP FOREIGN KEY `cart_discounts_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_items` DROP FOREIGN KEY `cart_items_productId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_items` DROP FOREIGN KEY `cart_items_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `collection_products` DROP FOREIGN KEY `collection_products_collectionId_fkey`;

-- DropForeignKey
ALTER TABLE `collection_products` DROP FOREIGN KEY `collection_products_productId_fkey`;

-- DropForeignKey
ALTER TABLE `collections` DROP FOREIGN KEY `collections_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `fulfillments` DROP FOREIGN KEY `fulfillments_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `order_discounts` DROP FOREIGN KEY `order_discounts_discountId_fkey`;

-- DropForeignKey
ALTER TABLE `order_discounts` DROP FOREIGN KEY `order_discounts_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_variantId_fkey`;

-- DropForeignKey
ALTER TABLE `product_images` DROP FOREIGN KEY `product_images_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product_reviews` DROP FOREIGN KEY `product_reviews_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product_variants` DROP FOREIGN KEY `product_variants_productId_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `transactions_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlists` DROP FOREIGN KEY `wishlists_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlists` DROP FOREIGN KEY `wishlists_productId_fkey`;

-- DropIndex
DROP INDEX `addresses_customerId_fkey` ON `addresses`;

-- DropIndex
DROP INDEX `cart_items_productId_fkey` ON `cart_items`;

-- DropIndex
DROP INDEX `cart_items_variantId_fkey` ON `cart_items`;

-- DropIndex
DROP INDEX `order_items_variantId_fkey` ON `order_items`;

-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `address1`,
    DROP COLUMN `address2`,
    DROP COLUMN `company`,
    DROP COLUMN `country`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    DROP COLUMN `zip`,
    ADD COLUMN `line1` VARCHAR(191) NOT NULL,
    ADD COLUMN `line2` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `province` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `admin_users` DROP COLUMN `avatar`;

-- AlterTable
ALTER TABLE `cart_items` DROP COLUMN `price`,
    DROP COLUMN `quantity`,
    DROP COLUMN `selectedAxis`,
    DROP COLUMN `selectedColor`,
    DROP COLUMN `selectedCylinder`,
    DROP COLUMN `selectedEye`,
    DROP COLUMN `selectedPower`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `variantId`,
    ADD COLUMN `aftercareName` VARCHAR(191) NULL,
    ADD COLUMN `aftercarePrice` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `leftEyePower` VARCHAR(191) NULL,
    ADD COLUMN `lensType` ENUM('PLAIN', 'EYESIGHT') NOT NULL DEFAULT 'PLAIN',
    ADD COLUMN `qty` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `rightEyePower` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `carts` DROP COLUMN `currency`,
    DROP COLUMN `note`;

-- AlterTable
ALTER TABLE `customers` DROP COLUMN `notes`,
    DROP COLUMN `tags`,
    MODIFY `password` VARCHAR(191) NULL,
    DROP COLUMN `emailVerified`,
    ADD COLUMN `emailVerified` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `discounts` DROP COLUMN `appliesTo`,
    DROP COLUMN `minimumOrderAmount`,
    DROP COLUMN `status`,
    DROP COLUMN `usageCount`,
    DROP COLUMN `usageLimit`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `appliesToAll` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `maxUsage` INTEGER NULL,
    ADD COLUMN `minOrderAmount` DOUBLE NULL,
    ADD COLUMN `perCustomerMax` INTEGER NULL,
    ADD COLUMN `usedCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `startsAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `order_items` DROP COLUMN `imageUrl`,
    DROP COLUMN `packSize`,
    DROP COLUMN `price`,
    DROP COLUMN `quantity`,
    DROP COLUMN `selectedAxis`,
    DROP COLUMN `selectedColor`,
    DROP COLUMN `selectedCylinder`,
    DROP COLUMN `selectedEye`,
    DROP COLUMN `selectedPower`,
    DROP COLUMN `sku`,
    DROP COLUMN `title`,
    DROP COLUMN `totalDiscount`,
    DROP COLUMN `variantId`,
    DROP COLUMN `variantTitle`,
    ADD COLUMN `aftercareName` VARCHAR(191) NULL,
    ADD COLUMN `aftercarePrice` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `leftEyePower` VARCHAR(191) NULL,
    ADD COLUMN `lensType` ENUM('PLAIN', 'EYESIGHT') NOT NULL DEFAULT 'PLAIN',
    ADD COLUMN `prescriptionUrl` VARCHAR(191) NULL,
    ADD COLUMN `productImage` VARCHAR(191) NULL,
    ADD COLUMN `productTitle` VARCHAR(191) NOT NULL,
    ADD COLUMN `qty` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `rightEyePower` VARCHAR(191) NULL,
    ADD COLUMN `total` DOUBLE NOT NULL,
    ADD COLUMN `unitPrice` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `billingAddress`,
    DROP COLUMN `cancelReason`,
    DROP COLUMN `cancelledAt`,
    DROP COLUMN `closedAt`,
    DROP COLUMN `currency`,
    DROP COLUMN `email`,
    DROP COLUMN `financialStatus`,
    DROP COLUMN `note`,
    DROP COLUMN `phone`,
    DROP COLUMN `processedAt`,
    DROP COLUMN `subtotalPrice`,
    DROP COLUMN `tags`,
    DROP COLUMN `totalDiscount`,
    DROP COLUMN `totalPrice`,
    DROP COLUMN `totalShipping`,
    DROP COLUMN `totalTax`,
    ADD COLUMN `discountAmount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `discountCode` VARCHAR(191) NULL,
    ADD COLUMN `discountId` VARCHAR(191) NULL,
    ADD COLUMN `guestEmail` VARCHAR(191) NULL,
    ADD COLUMN `guestName` VARCHAR(191) NULL,
    ADD COLUMN `guestPhone` VARCHAR(191) NULL,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `paymentStatus` ENUM('UNPAID', 'PAID', 'PARTIALLY_PAID', 'REFUNDED', 'COD_PENDING') NOT NULL DEFAULT 'UNPAID',
    ADD COLUMN `shippingCost` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `subtotal` DOUBLE NOT NULL,
    ADD COLUMN `total` DOUBLE NOT NULL,
    ADD COLUMN `trackingNumber` VARCHAR(191) NULL,
    MODIFY `fulfillmentStatus` ENUM('UNFULFILLED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'RETURNED', 'RESTOCKED') NOT NULL DEFAULT 'UNFULFILLED',
    MODIFY `paymentMethod` ENUM('COD', 'EASYPAISA', 'JAZZCASH', 'CARD', 'BANK_TRANSFER') NOT NULL DEFAULT 'COD',
    MODIFY `shippingAddress` JSON NOT NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `axisOptions`,
    DROP COLUMN `baseCurve`,
    DROP COLUMN `colorFamily`,
    DROP COLUMN `cylinderMax`,
    DROP COLUMN `cylinderMin`,
    DROP COLUMN `diameter`,
    DROP COLUMN `handlingTint`,
    DROP COLUMN `isColored`,
    DROP COLUMN `material`,
    DROP COLUMN `metaDescription`,
    DROP COLUMN `metaTitle`,
    DROP COLUMN `oxygenPerm`,
    DROP COLUMN `packSize`,
    DROP COLUMN `powerMax`,
    DROP COLUMN `powerMin`,
    DROP COLUMN `powerStep`,
    DROP COLUMN `prescriptionRequired`,
    DROP COLUMN `productType`,
    DROP COLUMN `replacement`,
    DROP COLUMN `tags`,
    DROP COLUMN `uvProtection`,
    DROP COLUMN `vendor`,
    DROP COLUMN `waterContent`,
    ADD COLUMN `brandId` VARCHAR(191) NULL,
    ADD COLUMN `categoryId` VARCHAR(191) NULL,
    ADD COLUMN `color` ENUM('BLUE', 'BROWN', 'GOLDEN', 'GRAY', 'GREEN', 'HAZEL', 'PURPLE', 'YELLOW', 'BLACK', 'OTHER') NULL,
    ADD COLUMN `comparePrice` DOUBLE NULL,
    ADD COLUMN `dia` VARCHAR(191) NULL,
    ADD COLUMN `discountPercent` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `images` JSON NOT NULL,
    ADD COLUMN `inStock` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `price` DOUBLE NOT NULL,
    ADD COLUMN `stockCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `description` TEXT NULL,
    MODIFY `status` ENUM('ACTIVE', 'DRAFT', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    MODIFY `modality` ENUM('ONE_DAY', 'MONTHLY', 'QUARTERLY', 'YEARLY') NOT NULL DEFAULT 'ONE_DAY';

-- AlterTable
ALTER TABLE `store_settings` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    MODIFY `value` TEXT NOT NULL;

-- DropTable
DROP TABLE `cart_discounts`;

-- DropTable
DROP TABLE `collection_products`;

-- DropTable
DROP TABLE `collections`;

-- DropTable
DROP TABLE `fulfillments`;

-- DropTable
DROP TABLE `order_discounts`;

-- DropTable
DROP TABLE `product_images`;

-- DropTable
DROP TABLE `product_reviews`;

-- DropTable
DROP TABLE `product_variants`;

-- DropTable
DROP TABLE `transactions`;

-- DropTable
DROP TABLE `wishlists`;

-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `parentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brands` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,

    UNIQUE INDEX `brands_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_power_options` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aftercare_addons` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `extraCharge` DOUBLE NOT NULL,
    `retailPrice` DOUBLE NOT NULL,
    `description` VARCHAR(191) NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `approved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_power_options` ADD CONSTRAINT `product_power_options_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_discountId_fkey` FOREIGN KEY (`discountId`) REFERENCES `discounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
