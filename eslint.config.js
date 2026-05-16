// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
	{
		// 排除的文件(不检查的文件)
		ignores: ["node_modules", "dist", "public"],
	},
	// 配置：@eslint/js 推荐的配置
	js.configs.recommended,
	// 配置：eslint-plugin-vue 推荐的配置
	...pluginVue.configs["flat/recommended"],
	/* JavaScript规则 */
	{
		rules: {
			"no-unused-vars": "warn", // 未使用变量时: 警告
			// 组件名称应该以多个单词组成: 错误
			"vue/multi-word-component-names": [
				"error",
				{
					ignores: ["index"], // 允许 index 文件
				},
			],
			"no-useless-escape": "off", // 忽略转义字符的警告
		},
	},
	/* 全局变量规则 */
	{
		languageOptions: {
			globals: {
				...globals.browser, // 继承浏览器环境变量（如 window, document）
				process: true,
				/* 忽略 Vant 4 的 Toast 相关全局变量 */
				showToast: true,
				closeToast: true,
				showLoadingToast: true,
				showConfirmDialog: true,
				showImagePreview: true,
				/* 允许使用 uni-app 全局变量 */
				uni: true,
				// 追加一些其他自定义全局规则
			},
		},
	},
	/* vue 拓展规则 */
	{
		files: ["**/*.vue"],
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				// 允许在.vue 文件中使用 JSX
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			// 避免在组件内部修改 props
			"vue/no-mutating-props": [
				"error",
				{
					shallowOnly: true,
				},
			],
		},
	},
	/* prettier 配置：会合并根目录下的prettier.config.js 文件 */
	eslintConfigPrettier,
	eslintPluginPrettierRecommended,
];
