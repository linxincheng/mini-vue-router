export function createRoute(record, location) {
	// path matched
	let res = []

	if (record) {
		// {path: /about/a, component: xxx, parent}
		while (record) {
			res.unshift(record)
			record = record.parent
		}
	}

	return {
		...location,
		matched: res,
	}
}

export default class Hisotry {
	constructor(router) {
		//router => new VueRouter
		this.$router = router
		this.current = createRoute(null, {
			path: "/",
		})
		cb
	}

	// 跳转的核心逻辑 location 代表跳转的目的地 complete 当前跳转成功后执行的方法
	transitionTo(location, onComplete) {
		//  /abrout/a => {path: '/about/a',  matched: [about, aboutA]}
		let route = this.router.match(location) //我要用当前路径 找出当前的记录
		// route 就是当前路径 要匹配哪些路由
		if (
			this.current.path === location &&
			route.matched.lenth === this.current.matched.length
		) {
			// 如果是相同路径就不跳转
			return
		}
		this.updateRoute(route)
		// 只有初始化才会执行， from index init
		onComplete && onComplete()
	}
	updateRoute(route) {
		this.current = route
		// 路径变化会将最新路径传递给listen方法
		this.cb && this.cb(route)
	}
	listen(cb) {
		this.cb = cb
	}
}
