# 亲心宠

一个基于 `Vite + React + TypeScript + Tailwind CSS` 的宠物领养应用，现已整理为可直接接入 `Supabase Auth + Postgres` 的前端直连结构，并保留本地 mock 回退，方便没有真实后端时继续开发与演示。

## 本地运行

1. 安装依赖：`npm install`
2. 复制环境变量：`cp .env.example .env.local`
3. 二选一完成配置：
   - 仅本地演示：保留 `VITE_ENABLE_SUPABASE_MOCK=true`
   - 使用真实 Supabase：填写 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
4. 启动开发环境：`npm run dev`

## Supabase 接入

1. 在 Supabase 新建项目。
2. 进入 SQL Editor，执行 `supabase/schema.sql`。
3. 在项目设置中获取 `Project URL` 和 `anon public key`，填入 `.env.local`。
4. 如开启邮箱确认，注册后需先完成邮件验证再登录。

当前应用会优先使用 Supabase；当缺少 `VITE_SUPABASE_URL` 或 `VITE_SUPABASE_ANON_KEY` 时，会自动回退到浏览器本地 mock 数据。

## Vercel 部署

1. 将仓库导入 Vercel。
2. Framework Preset 选择 `Vite`。
3. 在 Vercel 环境变量中配置：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ENABLE_SUPABASE_MOCK=false`（正式环境建议关闭）
4. 直接部署，Vercel 会执行 `npm run build`。

项目已包含 `vercel.json`，用于支持前端单页路由刷新。

## 验证命令

- 类型检查：`npm run lint`
- 生产构建：`npm run build`
