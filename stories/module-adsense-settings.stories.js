/**
 * AdSense Settings stories.
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
 * External dependencies
 */
import { storiesOf } from '@storybook/react';

/**
 * WordPress dependencies
 */
import { removeAllFilters, addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import SettingsModule from '../assets/js/components/settings/settings-module';
import {
	SettingsMain,
	SettingsSetupIncomplete,
} from '../assets/js/modules/adsense/components/settings';
import { fillFilterWithComponent } from '../assets/js/util';
import * as fixtures from '../assets/js/modules/adsense/datastore/__fixtures__';

import { STORE_NAME } from '../assets/js/modules/adsense/datastore';
import {
	ACCOUNT_STATUS_PENDING,
	ACCOUNT_STATUS_APPROVED,
	SITE_STATUS_ADDED,
} from '../assets/js/modules/adsense/util/status';
import { WithTestRegistry } from '../tests/js/utils';

function filterAdSenseSettings() {
	removeAllFilters( 'googlesitekit.ModuleSettingsDetails-adsense' );
	addFilter(
		'googlesitekit.ModuleSettingsDetails-adsense',
		'googlesitekit.AdSenseModuleSettings',
		fillFilterWithComponent( SettingsMain )
	);
}

function filterAdSenseSettingsSetupIncomplete() {
	removeAllFilters( 'googlesitekit.ModuleSetupIncomplete' );
	addFilter(
		'googlesitekit.ModuleSetupIncomplete',
		'googlesitekit.AdSenseModuleSettingsSetupIncomplete',
		fillFilterWithComponent( ( props ) => {
			const {
				slug,
				OriginalComponent,
			} = props;
			if ( 'adsense' !== slug ) {
				return <OriginalComponent { ...props } />;
			}
			return (
				<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
					<SettingsSetupIncomplete />
				</div>
			);
		} )
	);
}

const incompleteModuleData = {
	...global._googlesitekitLegacyData.modules.adsense,
	active: true,
	setupComplete: false,
};

const completeModuleData = {
	...global._googlesitekitLegacyData.modules.adsense,
	active: true,
	setupComplete: true,
};

const completeSettings = {
	accountID: fixtures.accounts[ 0 ].id,
	clientID: fixtures.clients[ 0 ].id,
	accountStatus: ACCOUNT_STATUS_APPROVED,
	siteStatus: SITE_STATUS_ADDED,
	useSnippet: true,
	accountSetupComplete: true,
	siteSetupComplete: true,
};

function Settings( props ) {
	const {
		callback,
		module = global._googlesitekitLegacyData.modules.adsense,
		isEditing = false,
		isOpen = true,
		isSaving = false,
		error = false,
		// eslint-disable-next-line no-console
		handleAccordion = ( ...args ) => console.log( 'handleAccordion', ...args ),
		// eslint-disable-next-line no-console
		handleDialog = ( ...args ) => console.log( 'handleDialog', ...args ),
		// eslint-disable-next-line no-console
		updateModulesList = ( ...args ) => console.log( 'updateModulesList', ...args ),
		// eslint-disable-next-line no-console
		handleButtonAction = ( ...args ) => console.log( 'handleButtonAction', ...args ),
	} = props;

	return (
		<WithTestRegistry callback={ callback }>
			<div style={ { background: 'white' } }>
				<SettingsModule
					key={ module.slug + '-module' }
					slug={ module.slug }
					name={ module.name }
					description={ module.description }
					homepage={ module.homepage }
					learnmore={ module.learnMore }
					active={ module.active }
					setupComplete={ module.setupComplete }
					hasSettings={ true }
					autoActivate={ module.autoActivate }
					updateModulesList={ updateModulesList }
					handleEdit={ handleButtonAction }
					handleConfirm
					isEditing={ isEditing ? { 'adsense-module': true } : {} }
					isOpen={ isOpen }
					handleAccordion={ handleAccordion }
					handleDialog={ handleDialog }
					provides={ module.provides }
					isSaving={ isSaving }
					screenID={ module.screenID }
					error={ error }
				/>
			</div>
		</WithTestRegistry>
	);
}

storiesOf( 'AdSense Module/Settings', module )
	.add( 'View, closed', () => {
		filterAdSenseSettings();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveGetSettings( {} );
		};

		return <Settings isOpen={ false } module={ completeModuleData } callback={ setupRegistry } />;
	} )
	.add( 'View, open with setup incomplete', () => {
		filterAdSenseSettingsSetupIncomplete();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveIsAdBlockerActive( false );
			dispatch( STORE_NAME ).receiveGetExistingTag( null );
			dispatch( STORE_NAME ).receiveGetSettings( {
				...completeSettings,
				accountStatus: ACCOUNT_STATUS_PENDING,
				accountSetupComplete: false,
				siteSetupComplete: false,
			} );
		};

		return <Settings module={ incompleteModuleData } callback={ setupRegistry } />;
	} )
	.add( 'View, open with all settings', () => {
		filterAdSenseSettings();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveGetExistingTag( null );
			dispatch( STORE_NAME ).receiveGetSettings( completeSettings );
		};

		return <Settings module={ completeModuleData } callback={ setupRegistry } />;
	} )
	.add( 'Edit, open', () => {
		filterAdSenseSettings();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveGetExistingTag( null );
			dispatch( STORE_NAME ).receiveGetSettings( completeSettings );
		};

		return <Settings isEditing={ true } module={ completeModuleData } callback={ setupRegistry } />;
	} )
	.add( 'Edit, open with existing tag (same account)', () => {
		filterAdSenseSettings();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveGetExistingTag( completeSettings.clientID );
			dispatch( STORE_NAME ).receiveGetSettings( completeSettings );
		};

		return <Settings isEditing={ true } module={ completeModuleData } callback={ setupRegistry } />;
	} )
	.add( 'Edit, open with existing tag (different account)', () => {
		filterAdSenseSettings();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveGetExistingTag( 'ca-pub-12345678' );
			dispatch( STORE_NAME ).receiveGetSettings( completeSettings );
		};

		return <Settings isEditing={ true } module={ completeModuleData } callback={ setupRegistry } />;
	} )
;
