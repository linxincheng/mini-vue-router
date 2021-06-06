import { install } from "./install"
import { createMatcher } from "./create-matcher.js"
class VueRouter {
	constructor(options) {
		// 1. 什么叫路由 核心根据不同的路径跳转不同的组件
		// 将用户传递的routes 转化成好维护的结构
		// match 负责配置路径 {'/': "记录", 'about': '记录'}
		// addRoutes 动态添加路由配置
		this.matcher = createMatcher(options.routes || [])

		// 创建路由系统 this.$router.push
		this.mode = options.mode || "hash"

		// History 类 基类
		this.history = new HashHistory(this)
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
	init(app) {
		// 如何初始化 先根据当前路径 显示指定的组件
		const history = this.history
		const setupHashLister = () => {
			history.setupLister()
		}

		// 发布订阅
		history.listen(() => {
			// 视图就可以刷新了
			app._route = route
		})
		history.transitionTo(history.getCurrentLocation(), setupHashLister) // 后续要监听路径变化
	}

	match(location) {
		return this.matcher.match(location)
	}

	push(path) {
		if (this.$options.mode === "hash") {
			// 如果是hash模式就window.location.hash 跳转
			window.location.hash = path
		} else {
			// 如果是html5 history 就使用pushState
			window.history.pushState(path)
		}
	}
}

VueRouter.install = install

export default VueRouter
