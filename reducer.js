import { NAVIGATOR_CONFIG_ROUTES, NAVIGATOR_NAVIGATE, NAVIGATOR_PUSH, NAVIGATOR_POP, NAVIGATOR_RESET_STACK } from './constants';
const initialState = {
	stack: [],
	index: -1, // required to register a state change
	routes: {},
	defaultRoute: false,
	currentScreen: false,
	passProps: null,
	configured: false,
};

export default function NavState(state = initialState, action) {
	switch (action.type) {
		case NAVIGATOR_CONFIG_ROUTES:
			return { ...state, routes: action.routes, defaultRoute: action.defaultRoute, configured: true };
		case NAVIGATOR_NAVIGATE:
			return { ...state, currentScreen: action.routeName, passProps: action.passProps, stack: [], index: -1 };
		case NAVIGATOR_PUSH:
			state.stack.push(action.component);
			state.index++;
			return { ...state  };
		case NAVIGATOR_POP:
			state.stack.pop();
			state.index--;
			return { ...state };
		case NAVIGATOR_RESET_STACK:
			return { ...state, stack: [], index: -1 };
		default:
			return { ...state };
	}
}