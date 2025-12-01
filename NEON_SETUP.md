# Neon Database Setup Guide

## 当前情况

你提供的是 Neon REST API endpoint:
```
https://ep-nameless-feather-a4xlggyz.apirest.us-east-1.aws.neon.tech/neondb/rest/v1
```

## 我们需要什么

Prisma 需要的是 **PostgreSQL 连接字符串**，而不是 REST API endpoint。

## 如何获取 PostgreSQL 连接字符串

### 方法 1: 从 Neon Console 获取（推荐）

1. **登录 Neon Console**: https://console.neon.tech
2. **选择你的项目**: "neondb"
3. **点击 "Connection Details"** 或 **"Connection String"**
4. **复制连接字符串**，格式类似：
   ```
   postgresql://username:password@ep-nameless-feather-a4xlggyz.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### 方法 2: 根据 REST API endpoint 推断

基于你提供的 REST API endpoint，PostgreSQL 连接字符串格式应该是：
```
postgresql://[username]:[password]@ep-nameless-feather-a4xlggyz.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**注意**: 你需要替换 `[username]` 和 `[password]` 为你的实际 Neon 数据库用户名和密码。

## 配置步骤

1. **创建 `.env.local` 文件**（如果不存在）：
   ```bash
   cp env.example .env.local
   ```

2. **编辑 `.env.local` 文件**，添加你的 DATABASE_URL：
   ```bash
   DATABASE_URL="postgresql://your-username:your-password@ep-nameless-feather-a4xlggyz.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```

3. **运行数据库迁移**：
   ```bash
   npx prisma migrate dev
   ```

4. **生成 Prisma Client**：
   ```bash
   npx prisma generate
   ```

5. **（可选）运行 seed 脚本**：
   ```bash
   npm run db:seed
   ```

## 已完成的更改

✅ 已更新 `prisma/schema.prisma` 使用 PostgreSQL
✅ 已添加 `confirmationCode` 字段到 Reservation 模型
✅ 已更新字段类型以支持 PostgreSQL（Json 类型）

## 下一步

请提供：
1. **完整的 PostgreSQL 连接字符串**（从 Neon Console 获取），或
2. **你的 Neon 数据库用户名和密码**（我可以帮你构造连接字符串）

然后我们就可以运行数据库迁移并开始使用 Neon 数据库了！

