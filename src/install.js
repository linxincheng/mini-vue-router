let Vue
export const install = (_Vue) => {
	Vue = _Vue
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
				this._routerRoot = this
				this._router = this.$options.router
				// init();
				this._router.init(this) // 初始化方法

				Vue.prototype.$router = this.$options.router

				// 响应式数据变化 只要_route变化 就会更新视图
				Vue.util.defineReactive(this, "_route", this._router.history.current)
			} else {
				this._routerRoot = this.$parent && this.$parent._routerRoot
				// this._routerRoot/_router
			}
		},
	})

	Object.defineProperty(Vue.prototype, "$route", {
		get() {
			return this._routerRoot
		},
	})
	Object.defineProperty(Vue.prototype, "$router", {
		get() {
			return thsi._routerRoot._router
		},
	})

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
	})
	Vue.component("router-view", {
		render(h) {
			let component = null
			// 获取当前路由并将他渲染出来

			const current = this.$router.current
			const route = this.$router.$options.routes.find((route) => {
				// 源码中使用的match进行正则匹配
				route.path === current
			})

			if (route) {
				component = route.component
			}
			return h(component)
		},
	})
}
