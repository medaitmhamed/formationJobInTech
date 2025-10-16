USE GadgetWorldDB;

-- 1. UPDATE: A shipment of 50 units of 'Product Y' arrives at 'Warehouse Z'.
-- Replace Product Y id and Warehouse Z id accordingly, example product_id=5, warehouse_id=2
UPDATE Inventory
SET quantity = quantity + 50
WHERE product_id = 5 AND warehouse_id = 2;

-- 2. UPDATE: An order has been shipped. Update the status and decrease stock from warehouses.
-- Example for order_id = 10
START TRANSACTION;

/* Update order status */
UPDATE Orders SET status = 'Shipped' WHERE order_id = 10;

/* Decrease stock: For each item in the order, find a warehouse that has sufficient stock (simple example using first warehouse) */
/* This example assumes we choose warehouse_id = 1 for deduction; in production you'd implement allocation logic */
UPDATE Inventory i
JOIN Order_Items oi ON i.product_id = oi.product_id
SET i.quantity = i.quantity - oi.quantity
WHERE oi.order_id = 10 AND i.warehouse_id = 1;

/* Commit if all OK */
COMMIT;

-- 3. DELETE: A customer's review flagged as spam (example review_id = 123)
DELETE FROM Reviews WHERE review_id = 123;
