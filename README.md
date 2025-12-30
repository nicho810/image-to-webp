# PNG to WebP

一个纯前端的 PNG → WebP 转换工具：所有处理都在浏览器本地完成，不会上传文件到任何服务器。

## Features

- 拖拽/点击导入 PNG（支持多文件）
- 选择压缩 `profile`（本质是预设 `quality`，用于控制体积/画质平衡）
- 支持自定义 `quality`（0–100）
- 预览转换结果、查看压缩比、逐个下载或一键清空

## Local Development

```bash
bun install
bun run dev
```

```bash
bun run build
bun run preview
```
