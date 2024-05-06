## 创建数据库表
首先，我在 test 数据库在创建一个 `student` 的表：
```sql
CREATE TABLE student (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Id',
    name VARCHAR(50) NOT NULL COMMENT '学生名',
    gender VARCHAR(10) NOT NULL COMMENT '性别',
    age INT NOT NULL COMMENT '年龄',
    class VARCHAR(50) NOT NULL COMMENT '班级名',
    score INT NOT NULL COMMENT '分数'
) CHARSET=utf8mb4;
```

- `id` 是主键，自动增长。
- `name` 存储学生名字，不能为空。
- `gender` 存储性别，不能为空。
- `age` 存储年龄，不能为空。
- `class` 存储班级名，不能为空。
- `score` 存储分数，不能为空。

![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714898590516-8e99683a-0f88-40e9-a799-4a3dab236fb9.png#averageHue=%23f5eada&clientId=ucd11f98b-9514-4&from=paste&height=224&id=u832be118&originHeight=414&originWidth=966&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=152443&status=done&style=none&taskId=u991be924-719c-449e-b8e6-00e8186d975&title=&width=523.75)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714898193130-0e78a3a1-902e-4f6a-be85-f3e814555d21.png#averageHue=%23f1f1f0&clientId=u48852428-cce5-4&from=paste&height=229&id=u44f42006&originHeight=366&originWidth=554&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=43378&status=done&style=none&taskId=u2d117972-1aa5-46ff-a495-7db7f672fd2&title=&width=346.249994840473)


## 数据操作
### 数据插入
向 `student` 表中插入数据：
```sql
INSERT INTO student (name, gender, age, class, score)
    VALUES 
        ('张三', '男', 18, '一班', 85),
        ('李四', '女', 19, '二班', 86),
        ('王五', '男', 20, '三班', 87),
        ('赵六', '女', 21, '一班', 88),
        ('钱七', '男', 22, '二班', 89),
        ('孙八', '女', 23, '三班', 90),
        ('周九', '男', 24, '一班', 91),
        ('吴十', '女', 25, '二班', 92);
```

### 数据查询
#### 查询所有数据
```sql
SELECT * FROM student;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714898504494-a5f6b36d-ae0c-40d6-8f79-9836072b1fa9.png#averageHue=%23f1f0ed&clientId=u48852428-cce5-4&from=paste&height=303&id=u35decc9d&originHeight=622&originWidth=572&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=110491&status=done&style=none&taskId=u3a59f479-9949-4f5c-95a0-4bd74a0e274&title=&width=278.5)

#### 查询指定列
```sql
SELECT name, score FROM student;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714898935477-83d81d2f-b5cd-42c8-85b8-02b4a0c2d8e7.png#averageHue=%23f5f5f2&clientId=u11b4ed12-0147-4&from=paste&height=304&id=ue87f0b26&originHeight=624&originWidth=616&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=83291&status=done&style=none&taskId=ua4fb9779-3b42-42f4-bec6-6f099946468&title=&width=300)

#### 查询并重命名返回列
```sql
SELECT name as "名字", score as "分数" FROM student;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714898966224-eadc9849-de50-4128-852b-2e6ca77c9592.png#averageHue=%23f5f3ed&clientId=u11b4ed12-0147-4&from=paste&height=392&id=u40459858&originHeight=628&originWidth=922&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=98055&status=done&style=none&taskId=ufde73b6b-5775-42fa-bd56-f5e9490ad33&title=&width=576.249991413206)


带条件的查询，通过 where：
```sql
-- 选择年龄大于或等于19岁的学生的名字和班级
SELECT name AS 名字, class AS 班级 FROM student WHERE age >= 19;

-- 选择性别为男且分数大于或等于90的学生的名字和班级
SELECT name AS 名字, class AS 班级 FROM student WHERE gender = '男' AND score >= 90;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714899039610-2826a2c6-f254-4672-94f1-4332658259c1.png#averageHue=%23f2eee7&clientId=u11b4ed12-0147-4&from=paste&height=249&id=ub5af7a56&originHeight=664&originWidth=1130&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=126709&status=done&style=none&taskId=u40f83739-4674-426e-b54c-8f615c93c4d&title=&width=424.25)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714899075648-8a28f03b-74ae-46eb-ae46-523f6d804af0.png#averageHue=%23f5f5f4&clientId=u11b4ed12-0147-4&from=paste&height=266&id=uc97e7fe5&originHeight=426&originWidth=1412&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=75657&status=done&style=none&taskId=u072fff72-ad42-4886-81cb-aa415a1e672&title=&width=882.4999868497255)

### 特殊查询
#### 模糊查询
```sql
-- 选择姓名以"张"开头的所有学生全部信息
SELECT * FROM student WHERE name LIKE '张%';
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714899300219-249673fc-d242-48a4-83ba-c8d1e7e46808.png#averageHue=%23f3f3f2&clientId=u11b4ed12-0147-4&from=paste&height=259&id=uebb0b9f5&originHeight=414&originWidth=802&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=60656&status=done&style=none&taskId=uf6bf7501-ea6a-41de-8c8a-9316af52f94&title=&width=501.24999253079307)

#### 列表查询
```sql
-- class列的值必须是'一班'或者'二班'中的一个
SELECT * FROM student WHERE class IN ('一班', '二班');

-- class列的值不是'一班'和'二班'
SELECT * FROM student WHERE class NOT IN ('一班', '二班');
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714899436683-914d183d-52a1-4fd5-a001-39c7785335d4.png#averageHue=%23f3f0e8&clientId=u11b4ed12-0147-4&from=paste&height=356&id=u3ff48680&originHeight=570&originWidth=974&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=111625&status=done&style=none&taskId=u7d659200-efa1-48ea-a633-be1964885d1&title=&width=608.7499909289182)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714899465133-2fee1ced-41b9-4367-bbb1-d53e5322a676.png#averageHue=%23f3f3f2&clientId=u11b4ed12-0147-4&from=paste&height=276&id=u53dcd20f&originHeight=442&originWidth=1020&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=78744&status=done&style=none&taskId=uaf77c876-7d59-472e-b938-3b554930614&title=&width=637.4999905005099)

#### 范围查询
```sql
SELECT * FROM student WHERE age BETWEEN 20 AND 22;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714899544617-9c79cd4e-5f1b-4940-9016-6a653c1ae153.png#averageHue=%23f3f3f2&clientId=u11b4ed12-0147-4&from=paste&height=296&id=u8b898f53&originHeight=474&originWidth=910&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=83067&status=done&style=none&taskId=u73a4e9c6-190f-4c6d-80de-eb4a54c753e&title=&width=568.7499915249647)

#### 分页查询
```sql
SELECT * FROM student LIMIT 0, 5;  -- 第一页
SELECT * FROM student LIMIT 5, 5;  -- 第二页
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714899600313-38f49d75-b403-4223-a5a3-01146dbd674a.png#averageHue=%23f5f3ef&clientId=u11b4ed12-0147-4&from=paste&height=274&id=u68476d69&originHeight=532&originWidth=668&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=88285&status=done&style=none&taskId=u74b060ff-ff38-4d66-90f4-c82ea48cf04&title=&width=344.5)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714899656921-55c78984-6662-4fdf-98a8-5fd81b36250f.png#averageHue=%23f2f2f2&clientId=u11b4ed12-0147-4&from=paste&height=297&id=ue66de1d4&originHeight=476&originWidth=654&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=70469&status=done&style=none&taskId=uabb114f5-ea69-41c7-8fc7-0747563f39e&title=&width=408.7499939091505)


### 数据排序和分组
#### 排序
```sql
-- 对结果进行排序，先按分数降序排列，分数相同则按年龄升序排列
SELECT name, score, age FROM student ORDER BY score DESC, age ASC;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714900015440-4ea0d8a4-020b-4a4a-a4e6-4f00c6b4ac4e.png#averageHue=%23f6f5f3&clientId=u11b4ed12-0147-4&from=paste&height=391&id=uc8d52f6c&originHeight=626&originWidth=1184&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=112876&status=done&style=none&taskId=uaa2bcc68-9f35-4922-82bd-7776130f55f&title=&width=739.9999889731408)

#### 分组统计
```sql
-- AVG 计算每个班级的平均分数，并将结果列名重命名为“平均成绩”,按照 class 列（班级）来分组数据，按照计算出的平均成绩降序排列
SELECT class AS 班级, AVG(score) AS 平均成绩 FROM student GROUP BY class ORDER BY 平均成绩 DESC;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714900043417-89bcb7ac-3d24-44da-9c51-5c3d09836dd0.png#averageHue=%23f5f5f5&clientId=u11b4ed12-0147-4&from=paste&height=297&id=ub8575097&originHeight=476&originWidth=1596&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=103094&status=done&style=none&taskId=ub69bb23e-79de-4a3f-9e18-a38f07c19ea&title=&width=997.4999851360919)


## 函数使用
### 聚合函数
```sql
-- 从student表中选择以下列
SELECT 
    AVG(score) AS 平均成绩,  -- 计算所有学生的平均分数
    COUNT(*) AS 人数,       -- 计算表中的总记录数，即学生总数
    SUM(score) AS 总成绩,   -- 计算所有学生的分数总和
    MIN(score) AS 最低分,   -- 找出所有学生中的最低分数
    MAX(score) AS 最高分    -- 找出所有学生中的最高分数
FROM student;               -- 指定查询的数据表为student
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714900234457-4f0d0553-02f6-4f0f-8178-122b797e870a.png#averageHue=%23f6f6f3&clientId=u11b4ed12-0147-4&from=paste&height=366&id=u765b0c28&originHeight=586&originWidth=1000&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=201115&status=done&style=none&taskId=ua3bc79a9-3ed6-4cec-a4cc-29b35dfd875&title=&width=624.9999906867744)

### 字符串函数
```sql
SELECT 
    CONCAT('xxx', name, 'yyy') AS 名字前后添加字符,
    SUBSTR(name, 2, 3) AS 名字中的一部分,
    LENGTH(name) AS 名字的长度,
    UPPER('aaa') AS 转换为大写,
    LOWER('BBB') AS 转换为小写
FROM student;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714900488044-87b45fd9-6a89-4d70-a54e-8b095a1d5d59.png#averageHue=%23f0ede6&clientId=u11b4ed12-0147-4&from=paste&height=403&id=u7ac0c5f9&originHeight=818&originWidth=890&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=216138&status=done&style=none&taskId=u1972b23e-247f-456c-b499-00822a4b4f4&title=&width=438.25)

### 数值和日期函数
```sql
-- 从student表中选择以下数值函数的结果
SELECT 
    ROUND(1.234567, 2) AS 四舍五入到两位小数,
    CEIL(1.234567) AS 向上取整,
    FLOOR(1.234567) AS 向下取整,
    ABS(-1.234567) AS 绝对值,
    MOD(5, 2) AS 取模运算
FROM student;

-- 从student表中选择以下日期函数的结果
SELECT 
    YEAR('2023-06-01 22:06:03') AS 年份,
    MONTH('2023-06-01 22:06:03') AS 月份,
    DAY('2023-06-01 22:06:03') AS 日,
    DATE('2023-06-01 22:06:03') AS 日期,
    TIME('2023-06-01 22:06:03') AS 时间
FROM student;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714908555901-5061c31c-cf55-43d1-a844-332a20bb31e9.png#averageHue=%23f1ebe1&clientId=u5fa2c889-6d50-4&from=paste&height=468&id=u1f029b2c&originHeight=814&originWidth=796&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=205528&status=done&style=none&taskId=u891d0d99-4793-4f1e-89e3-f4104076ebb&title=&width=457.5)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714908626353-bbccd82b-d414-43ee-b5be-69b62038b120.png#averageHue=%23f3e3cb&clientId=u5fa2c889-6d50-4&from=paste&height=490&id=u6f7ff96a&originHeight=812&originWidth=756&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=228510&status=done&style=none&taskId=ud6cb69e1-ddc0-4e79-9c13-69bb13f6c48&title=&width=456.5)

### 条件函数
```sql
-- 从student表中选择学生的名字和基于分数的简单条件评价
SELECT 
    name,  -- 学生的名字
    IF(score >= 60, '及格', '不及格') AS 成绩评价  -- 使用IF函数根据分数判断学生是否及格
FROM student;

-- 从student表中选择学生的名字、分数和基于分数的详细条件评价
SELECT 
    name,  -- 学生的名字
    score, -- 学生的分数
    CASE  -- 使用CASE表达式进行更详细的成绩评价
        WHEN score >= 90 THEN '优秀'  -- 分数大于等于90，评价为“优秀”
        WHEN score >= 60 THEN '良好'  -- 分数大于等于60且小于90，评价为“良好”
        ELSE '差'                     -- 分数小于60，评价为“差”
    END AS '档次'  -- 结果列的标题为“档次”
FROM student;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714908882649-d978790b-2bf1-468c-9800-a8c6dfc0aec0.png#averageHue=%23f9f7f3&clientId=u6bfc37de-7248-4&from=paste&height=358&id=uc2fa71bd&originHeight=816&originWidth=1384&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=175531&status=done&style=none&taskId=u273d7444-ac2b-4a81-9710-5156ba19222&title=&width=607)<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714908981079-fc863813-9461-4f93-8b7d-4e784a994758.png#averageHue=%23f8f5f0&clientId=u6bfc37de-7248-4&from=paste&height=400&id=u8681da6d&originHeight=874&originWidth=1258&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=261271&status=done&style=none&taskId=u1a363a67-5584-4195-b4b5-f5a6aa177cf&title=&width=576.25)

### 系统函数
用于获取系统信息：
```sql
select VERSION(), DATABASE(), USER()
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687489343263-2858db5d-231f-4948-a663-325d6dc32bf8.png#averageHue=%23ededed&clientId=u63dfacc2-7d3a-4&from=paste&height=50&id=u4a8f1ccc&originHeight=100&originWidth=464&originalType=binary&ratio=2&rotation=0&showTitle=false&size=17714&status=done&style=none&taskId=u910df4b3-3bf1-464c-b272-0537313a172&title=&width=232)

## 高级 SQL 技巧
### 使用 DISTINCT 去重
```sql
-- 查询 student 表中所有不同的班级
SELECT DISTINCT class FROM student;
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714909153247-3f0c0662-dd65-4566-96b6-352f79c5e2e1.png#averageHue=%23f5f5f4&clientId=u6bfc37de-7248-4&from=paste&height=295&id=ub5794402&originHeight=472&originWidth=680&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=67626&status=done&style=none&taskId=u41040c6a-7add-45df-bbe6-e3c57b37bb4&title=&width=424.9999936670066)

### 使用 HAVING 对分组结果进行过滤
```sql
-- 查询每个班级的平均分数，并筛选出平均分数超过 85 分的班级
SELECT class, AVG(score) AS avg_score  -- 选择班级和平均分数，平均分数命名为 avg_score
FROM student                           -- 从 student 表中获取数据
GROUP BY class                         -- 按班级分组，以便计算每个班级的平均分数
HAVING avg_score > 85;                 -- 筛选出平均分数超过 85 分的班级
```
![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714909234504-2d0ed98d-3d6c-4b0e-a8c8-39ce9fd91fe9.png#averageHue=%23f8f7f5&clientId=u6bfc37de-7248-4&from=paste&height=344&id=u2295c1d6&originHeight=550&originWidth=1368&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=191130&status=done&style=none&taskId=uefdca882-c13a-48d7-9264-63697a63e02&title=&width=854.9999872595074)
