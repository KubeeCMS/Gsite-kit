/**
 * Tag Manager Account Create component.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
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
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import ErrorNotice from './ErrorNotice';
import Link from '../../../../components/link';
import Button from '../../../../components/button';
import ProgressBar from '../../../../components/progress-bar';
import { STORE_NAME } from '../../datastore/constants';
import { STORE_NAME as CORE_USER } from '../../../../googlesitekit/datastore/user';
import { escapeURI } from '../../../../util/escape-uri';
const { useSelect, useDispatch } = Data;

export default function AccountCreate() {
	const accounts = useSelect( ( select ) => select( STORE_NAME ).getAccounts() );
	const isDoingGetAccounts = useSelect( ( select ) => select( STORE_NAME ).isDoingGetAccounts() );
	const userEmail = useSelect( ( select ) => select( CORE_USER ).getEmail() );

	const { resetAccounts } = useDispatch( STORE_NAME );
	const refetchAccountsHandler = useCallback( () => {
		resetAccounts();
	} );

	const createAccountHandler = useCallback( () => {
		// Need to use window.open for this to allow for stubbing in E2E.
		global.window.open( escapeURI`https://tagmanager.google.com/?authuser=${ userEmail }#/admin/accounts/create`, '_blank' );
	}, [ userEmail ] );

	if ( undefined === accounts || isDoingGetAccounts || ! userEmail ) {
		return <ProgressBar />;
	}

	return (
		<div>
			<ErrorNotice />

			<p>
				{ __( 'To create a new account, click the button below which will open the Google Tag Manager account creation screen in a new window.', 'google-site-kit' ) }
			</p>
			<p>
				{ __( 'Once completed, click the link below to re-fetch your accounts to continue.', 'google-site-kit' ) }
			</p>

			<div className="googlesitekit-setup-module__action">
				<Button onClick={ createAccountHandler }>
					{ __( 'Create an account', 'google-site-kit' ) }
				</Button>

				<div className="googlesitekit-setup-module__sub-action">
					<Link onClick={ refetchAccountsHandler }>
						{ __( 'Re-fetch My Account', 'google-site-kit' ) }
					</Link>
				</div>
			</div>
		</div>
	);
}
