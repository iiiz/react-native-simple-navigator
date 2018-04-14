import React, { Component } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { connect } from 'react-redux';

import NavState from './reducer';

import {
	configureRoutes,
	navigate,
	push,
	pop,
	popN,
	resetStack
} from './actions';

class Nav extends Component {
	props;

	constructor ( props ) {
		super(props);
		const { onConfigureRoutes, config } = this.props;
		onConfigureRoutes(config.routes, config.defaultRoute, config.DefaultNavController);
	}

	navigate ( routeName, passProps ) {
		this.props.onNavigate( routeName, passProps );
	}

	push ( component ) {
		this.props.onPush( component );
	}

	pop ( ) {
		this.props.onPop( );
	}

	popN ( n ){
		this.props.onPopN( n );
	}

	resetStack ( ) {
		this.props.onResetStack( );
	}

	handleBackAction ( ) {
		const { index, stack, routes, currentRoute } = this.props;
		if(index >= 0) {
			if (stack[index].backAction) {
				stack[index].backAction();
				return true;
			} else {
				this.pop();
				return true;
			}
		} else if (routes[currentRoute].backRoute) {
			const backRoute = routes[currentRoute].backRoute;
			this.navigate(backRoute.routeName, backRoute.passProps);
			return true;
		} else {
			return false;
		}
	}

	shouldComponentUpdate ( nextProps, nextState ) {
		const {
			stack,
			currentRoute,
			defaultRoute,
			configured
		} = nextProps;
		
		// there is a route or component to go to
		if(currentRoute || stack.length > 0){
			return true;
		}
		// default fallback
		if(configured && (stack.length === 0) && !currentRoute && defaultRoute) {
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
		const { stack, index, routes, defaultRoute, DefaultNavController, currentRoute, passProps, configured } = this.props;
		if(!configured) {
			return ([]);
		}
		let Next;
		let _passProps;
		let Controller = false;

		// Is a route
		if (currentRoute && index < 0) {
			Next = routes[currentRoute];

			// set props
			if (Next.defaultProps) {
				_passProps = { ...Next.defaultProps, ...passProps };
			} else {
				_passProps = passProps;
			}

			// set nav controller
			if (DefaultNavController && !Next.NavController) {
				Controller = DefaultNavController;
			} else if (Next.NavController) {
				Conroller = Next.NavController;
			}
		
		//is a stacked component
		} else if (index >= 0) {
			Next = stack[index];
			_passProps = Next.passProps;
			if (Next.NavController) {
				Controller = Next.NavController
			} else if (Next.useNav) {
				Controller = DefaultNavController;
			}
		} else {
			console.error("Navigator Error: no current route or stack index out of bounds.");
		}

		if (Controller && Next) {
			return (
				<Controller
					Navigator={this}
					Yield={Next}
					passProps={_passProps}
				/>);
		} else if (Next) {
			return (<Next.component Navigator={this} {..._passProps} />);
		} else {
			console.warn("No component provided to Navigator.");
			return ([]);
		}
	}
}

function mapStateToProps(state) {
	return { ...state.NavState };
}

function mapDispatchToProps(dispatch) {
	return {
		onConfigureRoutes: (routes, defaultRoute, DefaultNavController) => dispatch(configureRoutes(routes, defaultRoute, DefaultNavController)),
		onNavigate: (routeName, passProps) => dispatch(navigate(routeName, passProps)),
		onPush: (component ) => dispatch(push( component )),
		onPop: () => dispatch(pop()),
		onPopN: ( n ) => dispatch(popN(n)),
		onResetStack: () => dispatch(resetStack()),
	};
}

const Navigator = connect(mapStateToProps, mapDispatchToProps)(Nav);
export { Navigator, NavState };
