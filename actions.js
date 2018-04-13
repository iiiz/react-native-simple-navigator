import { 
	NAVIGATOR_CONFIG_ROUTES,
	NAVIGATOR_NAVIGATE,
	NAVIGATOR_PUSH,
	NAVIGATOR_POP,
	NAVIGATOR_POP_N,
	NAVIGATOR_RESET_STACK
} from './constants';

export function configureRoutes(routes, defaultRoute, DefaultNavController) {
	return {
		type: NAVIGATOR_CONFIG_ROUTES,
		routes,
		defaultRoute,
		DefaultNavController
	};
}

export function navigate(routeName, passProps = null) {
	return {
		type: NAVIGATOR_NAVIGATE,
		routeName,
		passProps,
	};
}

export function push( component ) {
	return {
		type: NAVIGATOR_PUSH,
		component
	}
}

export function pop() {
	return { type: NAVIGATOR_POP };
}

export function popN(n) {
	return {
		type: NAVIGATOR_POP_N,
		number: n,
	};
}

export function resetStack() {
	return { type: resetStack };
}
