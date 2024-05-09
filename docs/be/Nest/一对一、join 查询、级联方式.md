## 数据库表的基本概念与关系
数据库通常包含多个表，每个表存储特定类型的信息。例如：

- 学生表：存储学生信息。
- 老师表：存储老师信息。
- 班级表：存储班级信息。

这些表通过各种关系连接，形成一个结构化的数据管理系统。主要的关系类型包括：

- 一对多关系：如一个班级包含多名学生。
- 多对多关系：如一个老师可教授多个班级，一个班级也可由多名老师教授。
- 一对一关系：如一个用户对应一个身份证信息。

## 外键与表关联
外键是实现表之间关系的关键工具。通过外键，可以将两个表连接起来，实现数据的整合查询。

示例：用户表与身份证表的一对一关系：

- 用户表（`user`）：
   - `id`：主键，自动递增。
   - `name`：用户名，字符串类型。
- 身份证表（`id_card`）：
   - `id`：主键，自动递增。
   - `card_name`：身份证号，字符串类型。
   - `user_id`：外键，引用用户表的id。
```sql
CREATE TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `id_card` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `card_name` VARCHAR(45) NOT NULL,
  `user_id` INT,
  PRIMARY KEY (`id`),
  INDEX `card_id_idx` (`user_id`),
  CONSTRAINT `user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);
```
我们也可以选择可视化方式场景，选择 hello-mysql 数据库，点击建表按钮：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687492509128-e00299d8-9fb7-476e-a76e-3421c51a2ec5.png#averageHue=%23e2e2df&clientId=ud587c824-5038-4&from=paste&height=359&id=u6aa6bf7c&originHeight=794&originWidth=1406&originalType=binary&ratio=2&rotation=0&showTitle=false&size=185749&status=done&style=none&taskId=ubd2a5669-a00d-410e-8209-5ac79a5b8b2&title=&width=636)<br />分别添加 id、name 列：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687493456717-fed1dfe0-945c-4485-9b6d-1f20e1a57fc6.png#averageHue=%23f0efed&clientId=ud587c824-5038-4&from=paste&height=367&id=u0bbae1b1&originHeight=978&originWidth=1838&originalType=binary&ratio=2&rotation=0&showTitle=false&size=182321&status=done&style=none&taskId=u5aef8815-fc80-4879-a755-50ac75a153c&title=&width=689)<br />id_card 表：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687493750841-e67a1236-fcda-4049-83e6-333db5b5de4c.png#averageHue=%23f0f0f0&clientId=ud587c824-5038-4&from=paste&height=343&id=xJaFT&originHeight=960&originWidth=1826&originalType=binary&ratio=2&rotation=0&showTitle=false&size=189295&status=done&style=none&taskId=ubfa5d9a2-763c-404d-980d-e7b3e2fd710&title=&width=653)<br />指定外键 user_id 关联 user 表的 id：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687493144763-498cbef1-f48b-436c-9818-5a6c62f5d720.png#averageHue=%23f6f5f5&clientId=ud587c824-5038-4&from=paste&height=347&id=IuVLk&originHeight=968&originWidth=1834&originalType=binary&ratio=2&rotation=0&showTitle=false&size=135437&status=done&style=none&taskId=ubef68d59-90ca-49d8-b25e-3add076ae1d&title=&width=658)<br />还要选择主表数据 update 或者 delete 的时候，从表怎么办，这里我们先用默认的：<br />![image.png](https://cdn.nlark.com/yuque/0/2023/png/21596389/1687493229108-7e225809-b401-4970-8c76-f956a437954f.png#averageHue=%23f8f8f8&clientId=ud587c824-5038-4&from=paste&height=302&id=ABnmY&originHeight=810&originWidth=1798&originalType=binary&ratio=2&rotation=0&showTitle=false&size=85934&status=done&style=none&taskId=u9c58023c-d654-4b79-b5ea-932378a2ec5&title=&width=670)


## 数据操作与查询
插入数据后，可以通过多表关联查询来查看关联数据：
```sql
-- 插入数据
INSERT INTO `user` (`name`)
	VALUES
		('张三'),
		('李四'),
		('王五');
INSERT INTO id_card (card_name, user_id) 
  VALUES
  ('110101199001011234',1),
	('310101199002022345',2),
	('440101199003033456',3);

-- 多表关联查询
-- 选择 user 表的 id 和 name 字段，以及 id_card 表的 id 和 card_name 字段
SELECT user.id, name, id_card.id AS card_id, card_name 
-- 从 user 表开始查询
FROM user
-- 与 id_card 表进行内连接，连接条件是 user 表的 id 字段等于 id_card 表的 user_id 字段
JOIN id_card ON user.id = id_card.user_id;
```
关联查询到的结果：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714911293733-826d8fa7-5833-4103-ad36-b10a5dedfdc9.png#averageHue=%23ededed&clientId=u6136bac3-25fb-4&from=paste&height=97&id=u66f6adf8&originHeight=156&originWidth=506&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=34620&status=done&style=none&taskId=u21747aee-1af3-4684-934e-1b28cc866af&title=&width=316.24999528750783)<br />这就是多表关联查询，语法是 JOIN ON。

## JOIN 类型解析

- INNER JOIN（默认）: 只返回两个表中能关联上的数据。
- LEFT JOIN: 返回左表（`FROM` 语句之后的表）的所有记录，即使右表中没有匹配的记录。
- RIGHT JOIN: 返回右表（`JOIN` 语句之后的表）的所有记录，即使左表中没有匹配的记录。

例如，使用 `RIGHT JOIN` 的查询如下：
```sql
-- 选择 user 表的 id 和 name 字段，以及 id_card 表的 id 和 card_name 字段
SELECT user.id, name, id_card.id AS card_id, card_name
-- 从 user 表开始查询
FROM user
-- 通过 RIGHT JOIN 右连接 id_card 表，连接条件是 user 表的 id 字段等于 id_card 表的 user_id 字段
RIGHT JOIN id_card ON user.id = id_card.user_id;
```
此查询将返回所有 `id_card` 的数据，对于没有关联的 `user` 数据，其对应字段会显示为 `null`。<br />我们更新下 id_card 表的级联方式：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714912553777-4e7dd1f0-db4b-4a81-8b7c-cc9c18f1b2b0.png#averageHue=%23f6f6f6&clientId=u6136bac3-25fb-4&from=paste&height=659&id=u8019a707&originHeight=1054&originWidth=1756&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=134305&status=done&style=none&taskId=uc0f2dd30-2ac4-469c-bb5a-6784a6a0f65&title=&width=1097.4999836459758)<br />删除条 `user` 数据：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714912606786-dd7bf743-d6a3-49bc-84b8-7b5c7ffa6133.png#averageHue=%23ecebea&clientId=u6136bac3-25fb-4&from=paste&height=191&id=uc6eeef7d&originHeight=306&originWidth=784&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=59164&status=done&style=none&taskId=u520dd8e5-dadb-4e7a-a6f6-b9ff16b0537&title=&width=489.99999269843113)<br />再执行上面的右查询代码：<br />![image.png](https://cdn.nlark.com/yuque/0/2024/png/21596389/1714912661832-c947205e-1bda-4a12-9656-05949b382cc8.png#averageHue=%23ededed&clientId=u6136bac3-25fb-4&from=paste&height=95&id=ud1e64205&originHeight=152&originWidth=578&originalType=binary&ratio=1.600000023841858&rotation=0&showTitle=false&size=35110&status=done&style=none&taskId=u6c932d33-52ad-49c5-b2f4-3e10b3f3c4f&title=&width=361.2499946169556)

## 外键约束与级联操作
外键约束用于维护数据库表之间的完整性。常见的外键约束处理方式包括：

- `RESTRICT` / `NO ACTION`:（通常是默认行为） 只有当从表没有关联记录时，才允许删除或更新主表的记录。
- `CASCADE`: 如果主表（外键指向的表）的记录被删除或更新，从表（有外键的表）的相应记录也会被级联删除或更新。
- `SET NULL`: 如果主表的记录被删除或其关键字段被更新，从表的外键字段会被设置为 `null`。

例如，如果设置外键约束为 `CASCADE`，并且更新了 `user` 表中某个 `id`，则 `id_card` 表中相应的 `user_id` 也会更新。如果删除了 `user` 表中的记录，所有关联的 `id_card` 记录也会被删除。

注意：在外键关系中，主表是被外键引用的表，而从表是包含外键的表。因此，当主表中的记录发生变更时，从表中依赖于这些记录的外键字段会受到影响。
