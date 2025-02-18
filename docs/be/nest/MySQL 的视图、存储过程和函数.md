在 MySQL 数据库系统中，连接到服务器后，可以访问其管理的多个数据库。<br />每个数据库可能包括以下组成部分：

1. 表：用于存储数据的基本结构。
2. 视图：基于表的查询结果集，用于简化和定制数据访问。
3. 存储过程：用于执行一系列 SQL 语句的预编译代码块，可以接受参数并在数据库服务器上执行。
4. 函数：执行运算并返回一个值的 SQL 语句集。

## 视图的创建与应用
视图是基于 SQL 查询创建的虚拟表，主要用于简化复杂的 SQL 查询。<br />例如，使用以下 SQL 语句基于 customers 和 orders 表创建一个视图 customer_orders：
```sql
-- 创建一个名为customer_orders的视图
CREATE VIEW customer_orders AS 
    -- 选择以下列来定义视图的内容
    SELECT 
        c.name AS customer_name,  -- 从customers表中选择name列，并将其重命名为customer_name
        o.id AS order_id,         -- 从orders表中选择id列，并将其重命名为order_id
        o.order_date,             -- 选择orders表中的order_date列
        o.total_amount            -- 选择orders表中的total_amount列
    FROM customers c              -- 指定从customers表中选择数据，给这个表指定一个别名c
    JOIN orders o                 -- 与orders表进行连接操作，给这个表指定一个别名o
    ON c.id = o.customer_id;      -- 定义连接条件，即customers表的id列与orders表的customer_id列相匹配
```
优点：

- 简化查询：用户可以通过简单的 SELECT * FROM customer_orders 查询复杂的数据集。
- 权限控制：通过视图可以限制对基础数据的访问，只展示必要的数据。

限制：

- 视图主要用于数据查询，对于数据的增删改操作有限制，通常只适用于包含单一数据表的视图。

## 存储过程的创建与调用
存储过程是一种在数据库中保存的程序，可以优化常用的或复杂的操作。<br />下面是一个名为 get_customer_orders 的存储过程，用于查询特定客户的所有订单：
```sql
-- 设置SQL语句的分隔符为美元符号$
DELIMITER $

-- 创建一个名为get_customer_orders的存储过程
CREATE PROCEDURE get_customer_orders(IN customer_id INT)
BEGIN
    -- 存储过程的内容是执行一个SELECT查询
    SELECT o.id AS order_id,       -- 选择orders表的id列，并将其重命名为order_id
           o.order_date,           -- 选择orders表中的order_date列
           o.total_amount          -- 选择orders表中的total_amount列
    FROM orders o                  -- 指定从orders表中选择数据，并给这个表指定一个别名o
    WHERE o.customer_id = customer_id;  -- 查询条件是orders表中的customer_id列等于传入的customer_id参数
END $
-- 恢复SQL语句的分隔符为分号;
DELIMITER ;
```
使用方法：

- 存储过程通过 CALL get_customer_orders(5); 调用，其中 5 是客户 ID。

## 函数的创建与应用
函数是可以返回单个值的 SQL 程序。例如，创建一个计算平方的函数 square：
```sql
DELIMITER $ 
-- 设置语句的分隔符为$，这是为了将整个CREATE FUNCTION语句作为一个整体执行，特别是当函数体内有多条语句时。

CREATE FUNCTION square(x INT) RETURNS INT
-- 创建一个名为square的函数，这个函数接收一个整型参数x，并返回一个整型值。这个返回值是参数x的平方。

BEGIN
    -- BEGIN和END之间是函数的主体部分。

    DECLARE result INT;
    -- 声明一个名为result的整型变量，用于存储计算结果。

    SET result = x * x;
    -- 计算参数x的平方，并将结果赋值给变量result。

    RETURN result;
    -- 返回变量result的值，即x的平方。

END $
-- 函数主体结束。

DELIMITER ;
-- 将语句的分隔符重置为默认的分号(;)。
```
在 MySQL 中，默认情况下不允许创建函数，需要先设置：
```sql
SET GLOBAL log_bin_trust_function_creators = 1;
```
实际应用：

- 函数可以用于查询，例如 SELECT product_name, square(price) FROM order_items_view;。
- 创建复杂函数，如 get_order_total，用于计算订单的总金额：
```sql
-- 设置语句结束符为 $，这是为了在创建函数时，可以把整个函数体看作是一个语句
DELIMITER $

-- 创建一个名为 get_order_total 的函数，这个函数接收一个整型参数 order_id
CREATE FUNCTION get_order_total(order_id INT) RETURNS DECIMAL(10,2)
BEGIN
    -- 声明一个名为 total 的变量，用于存储计算出的订单总额，数据类型为 DECIMAL(10,2)，即最多10位数，其中小数点后2位
    DECLARE total DECIMAL(10,2);
    
    -- 从 order_items 表中选择与传入的 order_id 相匹配的所有条目，计算它们的 quantity（数量）与 price（价格）之积的总和
    -- 并将这个总和赋值给之前声明的 total 变量
    SELECT SUM(quantity * price) INTO total FROM order_items WHERE order_id = order_id;
    
    -- 返回计算出的订单总额
    RETURN total;
END $

-- 恢复语句结束符为 ;，即将 DELIMITER 设置回默认的 ;
DELIMITER ;
```
调用方法：

- 通过 SELECT id, get_order_total(id) FROM orders; 来获取订单的总金额。

## 存储过程和函数的区别
### **目的和用途**

- 存储过程：主要用于执行动作，如数据插入、更新、删除等。它可以执行一系列复杂的 SQL 语句，并进行事务管理。
- 函数：主要用于计算并返回一个值。函数通常用于在 SQL 语句中进行计算，如转换数据、计算数值等。
### **返回值**

- 存储过程：可以返回零个、一个或多个值（通常通过输出参数或结果集），也可以不返回任何值。
- 函数：必须返回一个值，这是其定义的一部分。
### **调用方式**

- 存储过程：使用 CALL 语句调用。
- 函数：可以直接在 SQL 语句中调用，如在 SELECT、WHERE 或 CASE 等语句中。
### **使用场景**

- 存储过程：适用于需要执行多个步骤的业务逻辑，或当需要使用循环、条件语句等复杂控制结构时。
- 函数：适用于需要在查询中重复使用的计算。由于函数必须是确定性的或不依赖于外部状态，它们在数据处理中非常有用。
### **事务处理**

- 存储过程：可以控制事务（即事务的开始和结束）。这使得存储过程适合处理复杂的业务逻辑，其中可能需要回滚操作或提交多个步骤作为一个整体。
- 函数：通常不处理事务。在函数中进行事务控制可能会导致不可预测的结果。

