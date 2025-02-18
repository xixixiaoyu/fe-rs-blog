## 事务的基本概念与操作
事务 是一组原子性的 SQL 命令集合，要么全部执行，要么全部不执行。<br />当更新多个相关表时，使用事务可以保证整体数据的一致性。

### 基本语法

- 开启事务： START TRANSACTION;
- 提交事务： COMMIT; 数据永久保存，不可回滚。
- 回滚事务： ROLLBACK; 数据回退到事务开始前的状态。

### 示例场景
假设需要更新订单详情表（order_items）和订单总金额表（orders）。<br />如果只更新了订单详情而未成功更新订单总金额，数据将不一致。此时，事务的应用非常关键。
```sql
START TRANSACTION;
UPDATE order_items SET quantity=1 WHERE order_id=3;
UPDATE orders SET total_amount=200 WHERE id=3;
COMMIT;
```
如果中途发现错误或执行失败，可以使用 ROLLBACK; 撤销所有更改。

## 事务的保存点（Savepoint）
在复杂的事务中，可能需要在特定步骤设置回滚点，以便在错误发生时只回滚到某个特定点：<br />设置保存点： SAVEPOINT savepoint_name;<br />回滚到保存点： ROLLBACK TO savepoint_name;
```sql
START TRANSACTION;
SAVEPOINT sp1;
UPDATE order_items SET quantity=1 WHERE order_id=3;
SAVEPOINT sp2;
UPDATE orders SET total_amount=200 WHERE id=3;
ROLLBACK TO sp2;  -- 回滚到 sp2 保存点
COMMIT;
```

## 事务的隔离级别
我们先来看看脏读、不可重复读和幻读，这三种通常在多个事务并发执行时发生，分别对应不同的隔离问题。

### 脏读（Dirty Read）
脏读发生在一个事务读取了另一个事务未提交的数据。如果这个未提交的事务最终被回滚（取消），那么第一个事务读到的数据就是“脏”的，因为这些数据从未被真正地保存过。<br />示例：

- 事务 A 修改一条记录，然后暂停。
- 事务 B 读取了事务 A 修改的同一条记录。
- 如果事务 A 回滚更改，事务 B 读到的数据实际上是不存在的。

### 不可重复读（Non-repeatable Read）
不可重复读是指在同一事务中，多次读取同一数据集合时，由于其他事务的修改操作，导致后续的读取结果与初次读取不一致。<br />示例：

- 事务 A 读取了一条记录。
- 事务 B 更新了事务 A 刚刚读取的记录，然后提交。
- 事务 A 再次读取同一记录时，发现数据已经改变。

不可重复读的问题主要由于更新（UPDATE）操作引起。

### 幻读（Phantom Read）
幻读问题涉及到在同一事务中执行相同的查询两次，但由于其他事务插入或删除了符合查询条件的记录，导致两次查询结果的行数不一致。<br />示例：

- 事务 A 根据某个条件查询表中的多行数据。
- 事务 B 在事务 A 的查询条件中插入新的行，然后提交。
- 事务 A 再次使用相同的条件查询数据时，发现多出了一些行。

幻读主要由插入（INSERT）或删除（DELETE）操作引起，与不可重复读类似，但更关注于整个数据集的一致性，而不仅仅是单条记录的一致性。

### 事务隔离级别
事务隔离级别定义了一个事务可能受其他并发事务影响的程度。<br />MySQL 支持四种隔离级别：

- READ UNCOMMITTED（未提交读）： 可以读取未提交的数据，存在脏读和不可重复读问题。
- READ COMMITTED（提交读）： 只能读取已提交的数据，避免脏读，但不可重复读和幻读问题仍然存在。
- REPEATABLE READ（可重复读）： 保证在同一事务中多次读取的数据一致，MySQL 默认级别，解决了不可重复读，但可能有幻读。
- SERIALIZABLE（可串行化）： 最高隔离级别，事务串行执行，避免了所有读取问题，但并发性能较差。

查询当前事务隔离级别：
```sql
SELECT @@transaction_isolation;
```
设置事务隔离级别：
```sql
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

