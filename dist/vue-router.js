let Vue;
const install = (_Vue) => {
	Vue = _Vue;
	// Vue.mixin 主要干了一件事 在所有组件都增加了_routerRoot
	// 1.挂载$router属性
	// this.$router.push();
	// 全局的混入(延迟下面的逻辑到router创建完毕并且附加到选项中时才执行)
	Vue.mixin({
		beforeCreate() {
			// 注意此钩子在每个组件创建实例的时候都会被调用
			// 根实例才有这个选项
			if (this.$options.router) {
				// 深度优先
				this._routerRoot = this;
				this._router = this.$options.router;
				// init();
				this._router.init(this); // 初始化方法

				Vue.prototype.$router = this.$options.router;
			} else {
				this._routerRoot = this.$parent && this.$parent._routerRoot;
				// this._routerRoot/_router
			}
		},
	});

	// 实现两个组件 router-link、router-view
	// <router-link to="/">Home</router-link> => <a href="/">Home</a>
	Vue.component("router-link", {
		props: {
			to: {
				type: String,
				required: true,
			},
		},
		render(h) {
			return h(
				"a",
				{
					attr: {
						href: `#${this.to}`,
					},
				},
				this.$slots.default
			)
		},
	});
	Vue.component("router-view", {
		render(h) {
			let component = null;
			// 获取当前路由并将他渲染出来

			const current = this.$router.current;
			const route = this.$router.$options.routes.find((route) => {
				// 源码中使用的match进行正则匹配
				route.path === current;
			});

			if (route) {
				component = route.component;
			}
			return h(component)
		},
	});
};

function createMatcher(routes) {
	// 用户当前传入的配置
	// 扁平化用户传入的数据 创建路由映射表

	// [/,/abourt,/about/a,/about/b]
	//{ /: 记录, /about: 记录, /about/a: 记录, /about/b: 记录}
	let { pathList, pathMap } = createRouteMap(routes); // 初始化配置

	// 动态添加的方法
	// 添加新的配置
	function addRoutes(routes) {
		createRouteMap(routes, pathList, pathMap);
	}

	// 用来匹配的方法
	function match() {}
	return {
		match,
		addRoutes,
	}
}

class VueRouter {
	constructor(options) {
		// 1. 什么叫路由 核心根据不同的路径跳转不同的组件
		// 将用户传递的routes 转化成好维护的结构
		// match 负责配置路径 {'/': "记录", 'about': '记录'}
		// addRoutes 动态添加路由配置
		this.matcher = createMatcher(options.routes || []);

		// 创建路由系统 this.$router.push
		this.mode = options.mode || "hash";

		// History 类 基类
		this.history = new HashHistory(this);
		// this.history = new H5History()

		// this.$options = options
		// 把this.current变为响应式的数据
		// 将来数据一旦发生变化，router-view的render函数能够重新执行
		// let initial = window.location.hash.slice(1)
		// Vue.util.defineReactive(this, "current", initial)

		// this.current = "/"

		// // 监听的事件
		// const listenEvent = this.mode === "history" ? "hashchange" : "popState"
		// window.addEventListener(listenEvent, () => {
		// 	this.current = window.location.hash.slice(1) || "/"
		// })
	}

	// new Vue app指代的根实例
	init(app) {}

	push(path) {
		if (this.$options.mode === "hash") {
			// 如果是hash模式就window.location.hash 跳转
			window.location.hash = path;
		} else {
			// 如果是html5 history 就使用pushState
			window.history.pushState(path);
		}
	}
}

VueRouter.install = install;

export default VueRouter;
