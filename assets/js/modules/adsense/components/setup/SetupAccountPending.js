/**
 * AdSense Setup Account Pending component.
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
import { getAccountSiteURL } from '../../util/url';
import { STORE_NAME } from '../../datastore/constants';
import { STORE_NAME as siteStoreName } from '../../../../googlesitekit/datastore/site/constants';
import { STORE_NAME as userStoreName } from '../../../../googlesitekit/datastore/user/constants';
import { ErrorNotice } from '../common';
const { useSelect } = Data;

export default function SetupAccountPending() {
	const accountID = useSelect( ( select ) => select( STORE_NAME ).getAccountID() );
	const siteURL = useSelect( ( select ) => select( siteStoreName ).getReferenceSiteURL() );
	const userEmail = useSelect( ( select ) => select( userStoreName ).getEmail() );

	if ( ! siteURL || ! userEmail ) {
		return null;
	}

	const accountSiteURL = getAccountSiteURL( { accountID, siteURL, userEmail } );

	return (
		<Fragment>
			<h3 className="googlesitekit-heading-4 googlesitekit-setup-module__title">
				{ __( 'Your account is getting ready', 'google-site-kit' ) }
			</h3>

			<ErrorNotice />

			<p>
				{ __( 'Site Kit has placed AdSense code on every page across your site.', 'google-site-kit' ) }
				{ ' ' }
				{ __( 'After you’ve finished setting up your account, we’ll let you know when your site is ready to show ads. This usually takes less than a day, but it can sometimes take a bit longer.', 'google-site-kit' ) }
			</p>

			<div className="googlesitekit-setup-module__action">
				<Link
					href={ accountSiteURL }
					external
				>
					{ __( 'Go to your AdSense account to check on your site’s status or to complete setting up', 'google-site-kit' ) }
				</Link>
			</div>
		</Fragment>
	);
}
