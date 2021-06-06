import { createRoute } from "./history/base"

export function createMatcher(routes) {
	// 用户当前传入的配置
	// 扁平化用户传入的数据 创建路由映射表

	// [/,/abourt,/about/a,/about/b]
	//{ /: 记录, /about: 记录, /about/a: 记录, /about/b: 记录}
	let { pathList, pathMap } = createRouteMap(routes) // 初始化配置

	// 动态添加的方法
	// 添加新的配置
	function addRoutes(routes) {
		createRouteMap(routes, pathList, pathMap)
	}

	// 用来匹配的方法
	function match(location) {
		// 找到对应的记录
		// 1.需要找到对应的记录 并且要根据记录产生一个匹配数组
		let record = pathMap[location]
		let local = {
			path: location,
		}
		if (record) {
			return createRoute(record, local)
		}

		return createRoute(null, local)
	}
	return {
		match,
		addRoutes,
	}
}

function createRouteMap(routes, oldPathList, oldPathMap) {
	// 将用户传入的数据进行格式化
	let pathList = oldPathList || []
	let pathMap = oldPathMap || Object.create(null)
	routes.forEach((route) => {
		addRouteRecord(route, pathList, pathMap)
	})
	return {
		pathList,
		pathMap,
	}
}

function addRouteRecord(route, pathList, pathMap, parent) {
	path = parent ? `${parent.path}/${route.papth}` : route.path
	let record = {
		path: parent + path,
		component: route.component,
	}
	if (pathMap[path]) {
		//将路径添加到pathList中
		pathList.push(path)
		pathMap[path] = record
	}

	if (route.children) {
		route.children.forEach((child) => {
			// 每次循环儿子时，将父路径传入
			addRouteRecord(child, pathList, pathMap, path)
		})
	}
}
