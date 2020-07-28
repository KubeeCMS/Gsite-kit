/**
 * AdSense Setup Account Disapproved component.
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
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import Link from '../../../../components/link';
import { getAccountURL } from '../../util/url';
import { STORE_NAME } from '../../datastore/constants';
import { STORE_NAME as userStoreName } from '../../../../googlesitekit/datastore/user/constants';
import { ErrorNotice } from '../common';
const { useSelect } = Data;

export default function SetupAccountDisapproved() {
	const accountID = useSelect( ( select ) => select( STORE_NAME ).getAccountID() );
	const userEmail = useSelect( ( select ) => select( userStoreName ).getEmail() );

	if ( undefined === accountID || ! userEmail ) {
		return null;
	}

	const accountURL = getAccountURL( { accountID, userEmail } );

	return (
		<Fragment>
			<h3 className="googlesitekit-heading-4 googlesitekit-setup-module__title">
				{ __( 'Your site isn’t ready to show ads yet', 'google-site-kit' ) }
			</h3>

			<ErrorNotice />

			<p>
				{ __( 'You need to fix some things before we can connect Site Kit to your AdSense account.', 'google-site-kit' ) }
			</p>

			<div className="googlesitekit-setup-module__action">
				<Link
					href={ accountURL }
					external
				>
					{ __( 'Go to AdSense to find out how to fix the issue', 'google-site-kit' ) }
				</Link>
			</div>
		</Fragment>
	);
}
