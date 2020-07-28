/**
 * Switch component.
 *
 * Site Kit by Google, Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { withInstanceId } from '@wordpress/compose';
import { Component, Fragment, createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MDCSwitch } from '../material-components';

class Switch extends Component {
	constructor( props ) {
		super( props );
		this.switchRef = createRef();
	}

	componentDidMount() {
		new MDCSwitch( this.switchRef.current );
	}

	render() {
		const {
			id = `googlesitekit-switch-${ this.props.instanceId }`,
			onClick,
			label,
			checked,
			disabled,
			hideLabel,
		} = this.props;

		const onKeyPress = ( event ) => {
			if ( typeof onClick === 'function' && event.code === 'Enter' ) {
				onClick( event );
			}
		};

		return (
			<Fragment>
				<div
					aria-checked={ checked ? 'true' : 'false' }
					className={ classnames(
						'mdc-switch',
						{
							'mdc-switch--checked': checked,
							'mdc-switch--disabled': disabled,
						}
					) }
					onClick={ onClick }
					onKeyPress={ onKeyPress }
					role="switch"
					ref={ this.switchRef }
					tabIndex={ 0 }
				>
					<div className="mdc-switch__track">&nbsp;</div>
					<div className="mdc-switch__thumb-underlay">
						<div className="mdc-switch__thumb">
							<input
								type="checkbox"
								id={ id }
								className="mdc-switch__native-control"
								role="switch"
								checked={ checked }
								disabled={ disabled }
								onChange={ () => {} }
							/>
						</div>
					</div>
				</div>
				<label
					className={ classnames( { 'screen-reader-only': hideLabel } ) }
					htmlFor={ id }>
					{ label }
				</label>
			</Fragment>
		);
	}
}

Switch.propTypes = {
	id: PropTypes.string,
	onClick: PropTypes.func,
	label: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	disabled: PropTypes.bool,
	hideLabel: PropTypes.bool,
	instanceId: PropTypes.number.isRequired,
};

Switch.defaultProps = {
	checked: false,
	disabled: false,
	hideLabel: true,
};

export default withInstanceId( Switch );
