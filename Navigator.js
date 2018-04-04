import React, { Component } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { connect } from 'react-redux';

import NavState from './reducer';

import {
	configureRoutes,
	navigate,
	push,
	pop,
	resetStack
} from './actions';

class Nav extends Component {
	props;

	constructor(props) {
		super(props);
		const { onConfigureRoutes, config } = this.props;
		onConfigureRoutes(config.routes, config.defaultRoute);
	}

	navigate(routeName, passProps) {
		this.props.onNavigate(routeName, passProps);
	}

	push(component, passProps) {
		this.props.onPush(component, passProps);
	}

	pop() {
		this.props.onPop();
	}

	resetStack() {
		this.props.onResetStack();
	}

	handleBackAction() {
		const { index, stack, routes, currentScreen } = this.props;
		if(index >= 0) {
			if (stack[index].backAction) {
				stack[index].backAction();
				return true;
			} else {
				this.pop();
				return true;
			}
		} else if (routes[currentScreen].backRoute) {
			const backRoute = routes[currentScreen].backRoute;
			this.navigate(backRoute.routeName, backRoute.passProps);
			return true;
		} else {
			return false;
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		const {stack, currentScreen, defaultRoute, configured } = nextProps;
		
		// there is a route to go to
		if(currentScreen || stack.length > 0){
			return true;
		}
		// default fallback
		if(configured && (stack.length === 0) && !currentScreen && defaultRoute) {
			this.navigate(defaultRoute);
			return false;
		} else {
			throw "Navigator config error: No default or route(s) defined.";
		}
	}

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', (self = this) => {
		 return self.handleBackAction();
		});
	}

	componentWillUpdate(newProps) {
		const { passProps } = newProps;
		if(typeof passProps !== "object") {
			throw "Navigator error: Passed props must be null or of type object.";
		}
	}

	render() {
		const { stack, index, routes, defaultRoute, NavComponent, currentScreen, passProps, configured } = this.props;
		if(!configured) {
			return ([]);
		}

		if(currentScreen && index < 0) {
			const CurrentComponent = routes[currentScreen];
			if(CurrentComponent.backAction){
				CurrentComponent.backAction();
			}
			if ( !NavComponent ) {
				return (<CurrentComponent.screen Navigator={this} {...passProps} />);
			} else {
				return (
					< NavComponent
						Navigator={this}
						Yield={CurrentComponent}
						passProps={passProps}
					/>);

			}
		}

		if (index >= 0) {
			const PushedScreen = stack[index];
			return (<PushedScreen.component Navigator={this} {...PushedScreen.passProps} />);
		}		
	}
}

function mapStateToProps(state) {
	return { ...state.NavState };
}

function mapDispatchToProps(dispatch) {
	return {
		onConfigureRoutes: (routes, defaultRoute) => dispatch(configureRoutes(routes, defaultRoute)),
		onNavigate: (routeName, passProps) => dispatch(navigate(routeName, passProps)),
		onPush: (component, passProps) => dispatch(push(component, passProps)),
		onPop: () => dispatch(pop()),
		onResetStack: () => dispatch(resetStack()),
	};
}

const Navigator = connect(mapStateToProps, mapDispatchToProps)(Nav);
export { Navigator, NavState };
