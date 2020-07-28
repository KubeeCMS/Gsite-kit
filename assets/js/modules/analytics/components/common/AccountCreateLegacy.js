/**
 * Legacy Account Creation component.
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
import { Fragment, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import Button from '../../../../components/button';
import Link from '../../../../components/link';
import ProgressBar from '../../../../components/progress-bar';
import { trackEvent } from '../../../../util';
import { STORE_NAME, ACCOUNT_CREATE } from '../../datastore/constants';
import ErrorNotice from './ErrorNotice';
const { useSelect, useDispatch } = Data;

export default function AccountCreateLegacy() {
	const accounts = useSelect( ( select ) => select( STORE_NAME ).getAccounts() );
	const accountID = useSelect( ( select ) => select( STORE_NAME ).getAccountID() );
	const isDoingGetAccounts = useSelect( ( select ) => select( STORE_NAME ).isDoingGetAccounts() );
	const isCreateAccount = ACCOUNT_CREATE === accountID;

	const createAccountHandler = async ( event ) => {
		event.preventDefault();
		await trackEvent( 'analytics_setup', 'new_analytics_account' );
		global.open( 'https://analytics.google.com/analytics/web/?#/provision/SignUp', '_blank' );
	};

	const { resetAccounts } = useDispatch( STORE_NAME );
	const refetchAccountsHandler = useCallback( () => {
		resetAccounts();
	} );

	if ( isDoingGetAccounts ) {
		return <ProgressBar />;
	}

	return (
		<div>
			<ErrorNotice />

			{ ( ! isCreateAccount && ( accounts && accounts.length === 0 ) ) && (
				<p>
					{ __( 'Looks like you don\'t have an Analytics account yet. Once you create it, click on "Re-fetch my account" and Site Kit will locate it.', 'google-site-kit' ) }
				</p>
			) }

			{ isCreateAccount &&
				<Fragment>
					<p>{ __( 'To create a new account, click the button below which will open the Google Analytics account creation screen in a new window.', 'google-site-kit' ) }</p>
					<p>{ __( 'Once completed, click the link below to re-fetch your accounts to continue.', 'google-site-kit' ) }</p>
				</Fragment>
			}

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
