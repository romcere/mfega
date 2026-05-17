# mfega

> **MFEGA — Make Front End Great Again**
>
> 一套完整、可复用、可扩展的前端工程化架构。
> 目标是实现：**拿来即用 · 拿来即开发 · 拿来即规范**

## 项目结构

项目采用`Monorepo`架构：

- `apps/`：应用项目目录，每个子文件夹是独立应用
- `libs/`：工具库 / 公共函数 / 配置封装
- `packages/`：公共组件 / SDK / 可复用模块

```
mfega/
├── .husky/                # Git 钩子（提交前/后脚本）
├── .vscode/               # VS Code 项目设置与扩展配置
├── apps/                  
├── libs/                  
├── packages/              
├── .editorconfig          # 编辑器统一配置文件
├── .gitignore             
├── .gitmodules            # Git 子模块配置文件
├── .npmrc                 # npm / pnpm 配置文件
├── .prettierignore        # Prettier 忽略文件配置
├── commitlint.config.js   # Commitlint 提交规范配置
├── eslint.config.js       # ESLint 配置文件
├── LICENSE                
├── package.json           
├── pnpm-workspace.yaml    # pnpm Monorepo 配置文件
├── prettier.config.js     # Prettier 配置文件
└── README.md              
```

## 环境要求

```shell
# 安装 Node.js（推荐使用 nvm）
nvm install v22.22.2
nvm use v22.22.2

# 安装 pnpm
npm install -g pnpm@10.33.3
```

> 项目已限制 npm 版本，**必须使用 pnpm**，以避免包管理混乱。

## 快速开始

1. 安装依赖：`pnpm i`

2. 创建子项目并链接远程仓库：

   ```shell
   # 添加子模块
   git submodule add <子模块远程链接> <相对路径>
   # 示例
   git submodule add https://github.com/romcere/becoming.git apps/becoming
   
   # 下载指定子模块
   git submodule update --init <相对路径>
   git submodule update --init apps/becoming
   ```

3. 在子项目中启用 Git 工具链

   **安装依赖：**

   ```shell
   pnpm -F=<项目名> add -D husky lint-staged commitlint commitizen cz-git
   ```

   **将根目录以下文件复制到子项目：**

   - `.husky/`
   - `commitlint.config.js`

   **在子项目 `package.json` 添加配置：**

   ```json
   {
     "scripts": {
       "lint:eslint": "eslint . --fix",
       "lint:prettier": "prettier --write .",
       "prepare": "husky",
       "lint:lint-staged": "lint-staged",
       "commit": "git-cz"
     },
     "config": {
       "commitizen": {
         "path": "node_modules/cz-git"
       }
     },
     "lint-staged": {
       "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
       "*.{cjs,json}": ["prettier --write"],
       "*.{vue,html}": ["eslint --fix", "prettier --write"],
       "*.{scss,css}": ["prettier --write"]
     }
   }
   ```

4. 添加依赖：

   ```shell
   # 向指定项目添加生产 / 开发依赖
   pnpm -F=<项目名> add -P <package>   # 生产环境
   pnpm -F=<项目名> add -D <package>   # 开发环境
   
   # 向工作区根目录添加依赖
   pnpm add -D <package> -w
   ```

   > **注意：** 安装依赖时必须明确区分生产环境（`-P`）和开发环境（`-D`）。

## Git工作流

工具链：`husky`（Git 钩子） + `lint-staged`（暂存区 Lint） + `commitlint`（提交规范校验） + `commitizen` + `cz-git`（交互式提交辅助）

### 提交规范

格式：`<type>(<scope>): <subject>`

> **注意：** 冒号为英文半角，冒号后需跟一个空格，例如：`feat: 新增登录页面`

| type       | 说明                       |
| ---------- | -------------------------- |
| `feat`     | 新增功能                   |
| `fix`      | 修复 Bug                   |
| `docs`     | 文档变更                   |
| `style`    | 代码格式优化（不影响逻辑） |
| `refactor` | 代码重构                   |
| `perf`     | 性能优化                   |
| `test`     | 测试相关改动               |
| `build`    | 构建/依赖变更              |
| `ci`       | CI 配置修改                |
| `revert`   | 回滚 commit                |
| `chore`    | 辅助工具或库的更改         |
| `init`     | 初始化项目（非标准 type）  |

**使用交互式提交**

```shell
# 需先全局安装 commitizen
pnpm i -g commitizen

# 任选其一
git cz
cz
pnpm run commit # 在package.json中配置
```

### 版本回退

请使用 `revert` 回退，避免不可挽回的错误。

```shell
# 查看提交记录
git log --oneline
# 回退到指定版本（保留记录）
git revert <版本号>
# 取消回退
git revert --abort

# 回退最近一次提交到暂存区
git reset --soft HEAD~1
```

## 常见问题

> 项目中使用 `@rom:error` 标记已知问题，便于快速定位。

**Q1：`pnpm add xxx` 报错`Cannot destructure property 'manifest' of 'manifestsByPath[rootDir]' as it is undefined.`**

原因：pnpm 无法确定安装目录（Monorepo 特有问题）

解决：指定目标项目或工作区根目录：

```shell
pnpm -F=<项目名> add <package>
# 或安装到根目录
pnpm add <package> -w
```

**Q2：`.husky/pre-commit: .husky/pre-commit: cannot execute binary file`**

原因：`pre-commit` 文件编码为 `UTF-16`，无法被正确解码。

解决：将 `pre-commit` 文件编码改为 `UTF-8`。

参考：[Stack Overflow 相关讨论](https://stackoverflow.com/questions/77364609/cannot-execute-binary-file-exec-format-error-code-126)

**Q3：git 提交时提示 `lint:lint-staged` 错误**

原因：提交信息不符合规范。

解决：点击「显示命令输出」查看具体错误，按照[提交规范](#提交规范)修改 commit message。

## 展望

**可引入的依赖**

- `@antfu/eslint-config`、`stylelint`、`lodash-es`

**可使用的技术**

- `vueUse`、`turbo`、[`rimraf`](https://github.com/isaacs/rimraf)、[`del`](https://www.npmjs.com/package/del)、`consola`、`rollup-plugin-visualizer`

**可引入的语言**

- `TypeScript`
