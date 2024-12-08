# 深入理解 MySQL 查询：从基础到进阶

在上节课中，我们学习了 MySQL 数据库和表的创建、删除，以及单表的增删改查操作。这些操作是数据库管理的基础，但 SQL 语法的世界远不止于此。今天，我们将深入探讨 SQL 查询的更多技巧和语法，帮助你更高效地操作数据库。

## 1. 使用 Docker 运行 MySQL

首先，我们通过 Docker 来运行 MySQL 容器。上次我们已经将数据保存在了一个目录下，这次我们将这个目录挂载到新容器的 `/var/lib/mysql`，这样即使容器被删除，数据也能保留下来。

```bash
docker run --name mysql-container -v /path/to/data:/var/lib/mysql -p 3306:3306 -d mysql:latest
```

挂载数据卷的好处是显而易见的：即使你重新创建了容器，只要挂载了相同的数据卷，数据依然存在。

## 2. 创建表并插入数据

接下来，我们通过 SQL 语句创建一个 `student` 表，并插入一些数据。

```sql
CREATE TABLE student(
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Id',
    name VARCHAR(50) NOT NULL COMMENT '学生名',
    gender VARCHAR(10) NOT NULL COMMENT '性别',
    age INT NOT NULL COMMENT '年龄',
    class VARCHAR(50) NOT NULL COMMENT '班级名',
    score INT NOT NULL COMMENT '分数'
) CHARSET=utf8mb4;
```

插入一些学生数据：

```sql
INSERT INTO student (name, gender, age, class, score)
    VALUES
        ('张三', '男',18, '一班',90),
        ('李四', '女',19, '二班',85),
        ('王五', '男',20, '三班',70),
        ('赵六', '女',18, '一班',95);
```

通过 `SELECT * FROM student;` 可以查看插入的数据。

## 3. 基础查询操作

### 3.1 查询指定列

我们可以通过 `SELECT` 语句指定查询的列：

```sql
SELECT name, score FROM student;
```

这将只返回学生的名字和分数。

### 3.2 使用别名

通过 `AS` 关键字，我们可以为查询结果中的列指定别名：

```sql
SELECT name AS 名字, score AS 分数 FROM student;
```

### 3.3 条件查询

使用 `WHERE` 语句可以为查询添加条件：

```sql
SELECT name AS 名字, class AS 班级 FROM student WHERE age >= 19;
```

你还可以使用 `AND` 来连接多个条件：

```sql
SELECT name AS 名字, class AS 班级 FROM student WHERE gender = '男' AND score >= 90;
```

### 3.4 模糊查询

使用 `LIKE` 进行模糊查询，例如查找名字以“王”开头的学生：

```sql
SELECT * FROM student WHERE name LIKE '王%';
```

### 3.5 集合查询

使用 `IN` 来指定一个集合：

```sql
SELECT * FROM student WHERE class IN ('一班', '二班');
```

同样，你可以使用 `NOT IN` 来排除某些集合：

```sql
SELECT * FROM student WHERE class NOT IN ('一班', '二班');
```

### 3.6 区间查询

使用 `BETWEEN AND` 来指定一个区间：

```sql
SELECT * FROM student WHERE age BETWEEN 18 AND 20;
```

### 3.7 分页查询

通过 `LIMIT` 实现分页查询：

```sql
SELECT * FROM student LIMIT 0, 5;  -- 查询前 5 条数据
SELECT * FROM student LIMIT 5, 5;  -- 查询第 6 到第 10 条数据
```

### 3.8 排序查询

使用 `ORDER BY` 来指定排序的列：

```sql
SELECT name, score, age FROM student ORDER BY score ASC, age DESC;
```

这将根据分数升序排列，如果分数相同，则根据年龄降序排列。

## 4. 分组与聚合

### 4.1 分组统计

通过 `GROUP BY` 可以对数据进行分组统计。例如，统计每个班级的平均成绩：

```sql
SELECT class AS 班级, AVG(score) AS 平均成绩
FROM student
GROUP BY class
ORDER BY 平均成绩 DESC;
```

### 4.2 计数

使用 `COUNT` 函数统计每个班级的学生数量：

```sql
SELECT class, COUNT(*) AS 人数 FROM student GROUP BY class;
```

### 4.3 分组过滤

在分组之后进行过滤时，使用 `HAVING` 而不是 `WHERE`：

```sql
SELECT class, AVG(score) AS avg_score
FROM student
GROUP BY class
HAVING avg_score > 90;
```

## 5. 内置函数

SQL 提供了丰富的内置函数，帮助我们更高效地处理数据。

### 5.1 聚合函数

- `AVG()`：计算平均值
- `COUNT()`：统计数量
- `SUM()`：求和
- `MIN()`：最小值
- `MAX()`：最大值

```sql
SELECT AVG(score) AS 平均成绩, COUNT(*) AS 人数, SUM(score) AS 总成绩, MIN(score) AS 最低分, MAX(score) AS 最高分 FROM student;
```

### 5.2 字符串函数

- `CONCAT()`：拼接字符串
- `SUBSTR()`：截取字符串
- `LENGTH()`：计算字符串长度
- `UPPER()`：转为大写
- `LOWER()`：转为小写

```sql
SELECT CONCAT('学生：', name), SUBSTR(name, 1, 2), LENGTH(name), UPPER(name), LOWER(name) FROM student;
```

### 5.3 数值函数

- `ROUND()`：四舍五入
- `CEIL()`：向上取整
- `FLOOR()`：向下取整
- `ABS()`：绝对值
- `MOD()`：取模

```sql
SELECT ROUND(1.234567, 2), CEIL(1.234567), FLOOR(1.234567), ABS(-1.234567), MOD(5, 2);
```

### 5.4 日期函数

- `YEAR()`：提取年份
- `MONTH()`：提取月份
- `DAY()`：提取日期
- `DATE()`：提取日期部分
- `TIME()`：提取时间部分

```sql
SELECT YEAR('2023-06-01 22:06:03'), MONTH('2023-06-01 22:06:03'), DAY('2023-06-01 22:06:03'), DATE('2023-06-01 22:06:03'), TIME('2023-06-01 22:06:03');
```

### 5.5 条件函数

- `IF()`：条件判断
- `CASE`：多条件判断

```sql
SELECT name, IF(score >= 60, '及格', '不及格') FROM student;
SELECT name, score, CASE WHEN score >= 90 THEN '优秀' WHEN score >= 60 THEN '良好' ELSE '差' END AS 档次 FROM student;
```

### 5.6 系统函数

- `VERSION()`：获取 MySQL 版本
- `DATABASE()`：当前数据库
- `USER()`：当前用户

```sql
SELECT VERSION(), DATABASE(), USER();
```

### 5.7 类型转换函数

- `CAST()` 和 `CONVERT()`：类型转换
- `DATE_FORMAT()`：格式化日期
- `STR_TO_DATE()`：将字符串转换为日期

```sql
SELECT GREATEST(1, CAST('123' AS SIGNED), 3);
SELECT DATE_FORMAT('2022-01-01', '%Y年%m月%d日');
SELECT STR_TO_DATE('2023-06-01', '%Y-%m-%d');
```

## 6. 总结

通过这节课的学习，我们掌握了 MySQL 中更为复杂的查询语法和函数。无论是条件查询、分组统计，还是使用内置函数处理数据，SQL 都为我们提供了强大的工具。灵活运用这些语法和函数，你将能够编写出高效、复杂的查询语句，轻松应对各种数据处理需求。

SQL 的世界很大，今天我们只是触及了冰山一角。希望你能通过不断的练习，逐步掌握这些技巧，成为数据库操作的高手。
