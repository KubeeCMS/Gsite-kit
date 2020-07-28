/**
 * Tag Manager Account Select component.
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
import ProgressBar from '../../../../components/progress-bar';
import { Select, Option } from '../../../../material-components';
import { STORE_NAME, ACCOUNT_CREATE } from '../../datastore/constants';
const { useSelect, useDispatch } = Data;

export default function AccountSelect() {
	const accounts = useSelect( ( select ) => select( STORE_NAME ).getAccounts() );
	const accountID = useSelect( ( select ) => select( STORE_NAME ).getAccountID() );
	const hasExistingTag = useSelect( ( select ) => select( STORE_NAME ).hasExistingTag() );
	const isDoingGetAccounts = useSelect( ( select ) => select( STORE_NAME ).isDoingGetAccounts() );

	const { selectAccount } = useDispatch( STORE_NAME );
	const onChange = useCallback( ( index, item ) => {
		const newAccountID = item.dataset.value;
		if ( accountID !== newAccountID ) {
			selectAccount( newAccountID );
		}
	}, [ accountID ] );

	if ( accounts === undefined || isDoingGetAccounts ) {
		return <ProgressBar small />;
	}

	return (
		<Select
			className="googlesitekit-tagmanager__select-account"
			label={ __( 'Account', 'google-site-kit' ) }
			value={ accountID }
			onEnhancedChange={ onChange }
			disabled={ hasExistingTag }
			enhanced
			outlined
		>
			{ ( accounts || [] )
				.concat( {
					accountId: ACCOUNT_CREATE,
					name: __( 'Set up a new account', 'google-site-kit' ),
				} )
				.map( ( { accountId, name } ) => (
					<Option
						key={ accountId }
						value={ accountId }
					>
						{ name }
					</Option>
				) ) }
		</Select>
	);
}
