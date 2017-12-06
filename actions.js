import { NAVIGATOR_CONFIG_ROUTES, NAVIGATOR_NAVIGATE, NAVIGATOR_PUSH, NAVIGATOR_POP, NAVIGATOR_RESET_STACK } from './constants';

export function configureRoutes(routes, defaultRoute = false) {
	return {
		type: NAVIGATOR_CONFIG_ROUTES,
		routes,
		defaultRoute,
	};
}

export function navigate(routeName, passProps = null) {
	return {
		type: NAVIGATOR_NAVIGATE,
		routeName,
		passProps,
	};
}

export function push(component) {
	return {
		type: NAVIGATOR_PUSH,
		component,
	}
}

export function pop() {
	return { type: NAVIGATOR_POP };
}

export function resetStack() {
	return { type: resetStack };
}