/**
 * External dependencies
 */
import { storiesOf } from '@storybook/react';
import { TextField, Input } from '../assets/js/material-components';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

storiesOf( 'Global', module )
	.add( 'Text Fields', () => (
		<div>
			<div style={ { marginBottom: '50px' } }>
				<TextField
					label={ __( 'Text Field', 'google-site-kit' ) }
					name="textfield"
					floatingLabelClassName="mdc-floating-label--float-above"
					outlined
				>
					<Input
						value="https://www.sitekitbygoogle.com"
					/>
				</TextField>
			</div>
			<div style={ { marginBottom: '50px' } }>
				<TextField
					label={ __( 'Disabled Text Field', 'google-site-kit' ) }
					name="textfield"
					floatingLabelClassName="mdc-floating-label--float-above"
					outlined
				>
					<Input
						value="https://www.sitekitbygoogle.com"
						disabled
					/>
				</TextField>
			</div>
		</div>
	) );
