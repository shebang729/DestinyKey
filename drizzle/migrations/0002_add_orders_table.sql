-- 創建訂單表
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `stripe_session_id` VARCHAR(255) UNIQUE,
  `stripe_payment_status` VARCHAR(50),
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_email` VARCHAR(255),
  `phone_number` VARCHAR(20) NOT NULL,
  `birth_date` VARCHAR(20),
  `birth_time` VARCHAR(20),
  `id_last_four` VARCHAR(10),
  `goals` TEXT,
  `amount_total` DECIMAL(10, 2),
  `currency` VARCHAR(10),
  `service_status` VARCHAR(50) DEFAULT 'pending',
  `recommended_numbers` JSON,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP NULL
);

-- 創建索引以提升查詢效能
CREATE INDEX idx_customer_name ON orders(customer_name);
CREATE INDEX idx_phone_number ON orders(phone_number);
CREATE INDEX idx_service_status ON orders(service_status);
CREATE INDEX idx_created_at ON orders(created_at);
