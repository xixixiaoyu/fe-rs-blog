## 子查询的概念与应用
子查询（即一个查询嵌套在另一个查询中）为 SQL 提供了更高的灵活性和强大的数据处理能力。<br />例如，我们可以在一个 SELECT 语句的 WHERE 子句中嵌套另一个 SELECT 语句。
### 示例 1：查询最高分学生的姓名和班级
```sql
SELECT name, class FROM student WHERE score = (SELECT MAX(score) FROM student);
```

### 示例 2：查询成绩高于平均成绩的学生
```sql
SELECT * FROM student WHERE score > (SELECT AVG(score) FROM student);
```

## EXISTS 和 NOT EXISTS 子句
EXISTS 和 NOT EXISTS 是特殊的 SQL 操作符，用于测试子查询是否返回结果。
### 示例 1：查询有员工的部门
```sql
SELECT name FROM department WHERE EXISTS (SELECT * FROM employee WHERE department.id = employee.department_id);
```

### 示例 2：查询没有员工的部门
```sql
SELECT name FROM department WHERE NOT EXISTS (SELECT * FROM employee WHERE department.id = employee.department_id);
```


## 子查询在 DML 操作中的应用
子查询不仅可以在 SELECT 语句中使用，还可以在数据修改语句（如 INSERT、UPDATE、DELETE）中使用。
### 示例 1：插入平均价格数据
```sql
-- 向 avg_price_by_category 表插入数据
INSERT INTO avg_price_by_category (category, avg_price) 

-- 从 product 表中选择 category 和平均 price
SELECT category, AVG(price) 

-- 从 product 表中获取数据
FROM product 

-- 按照 category 字段分组
GROUP BY category;
```

### 示例 2：更新技术部员工的名称
```sql
-- 更新 employee 表中的数据
UPDATE employee 

-- 设置 name 字段的值，将 '技术-' 添加到原有 name 前
SET name = CONCAT('技术-', name) 

-- 指定更新条件：部门必须是 '技术部'
WHERE department_id = (SELECT id FROM department WHERE name = '技术部');
```

### 示例 3：删除技术部所有员工
```sql
DELETE FROM employee WHERE department_id = (SELECT id FROM department WHERE name = '技术部');
```

