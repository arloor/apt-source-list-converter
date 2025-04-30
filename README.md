# My Note

## 项目初始化

```bash
# 从模版创建react-ts项目
pnpm create vite vite-react-ts-tailwindcss --template react-ts
cd vite-react-ts-tailwindcss
# 安装tailwindcss
pnpm add -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

初始化 tailwindcss 配置，并导入:

```javascript
# vim tailwind.config.js
# 修改content部分

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

在 `src/index.css`中增加：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

确保 `src/main.tsx` 导入了 `src/index.css`

还可以安装 [tailwindcss 的 vscode 插件](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) 实现 className 的补全

## prettier

```bash
# 安装 prettier 和 tailwindcss 插件
pnpm add -D prettier prettier-plugin-tailwindcss
cat > .prettierrc <<'EOF'
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
EOF
cat > .prettierignore <<'EOF'
node_modules
dist
EOF
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
