/**
 * Optimize Settings stories.
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
import { SettingsMain as OptimizeSettings } from '../assets/js/modules/optimize/components/settings';
import { fillFilterWithComponent } from '../assets/js/util';
import { STORE_NAME as CORE_MODULES } from '../assets/js/googlesitekit/modules/datastore/constants';
import { STORE_NAME as CORE_SITE } from '../assets/js/googlesitekit/datastore/site/constants';
import { STORE_NAME as MODULES_ANALYTICS } from '../assets/js/modules/analytics/datastore/constants';
import { STORE_NAME } from '../assets/js/modules/optimize/datastore';
import { WithTestRegistry } from '../tests/js/utils';
import fixtures from '../assets/js/googlesitekit/modules/datastore/fixtures.json';

const analyticsFixture = fixtures.filter( ( fixture ) => fixture.slug === 'analytics' );

function filterOptimizeSettings() {
	removeAllFilters( 'googlesitekit.ModuleSettingsDetails-optimize' );
	addFilter(
		'googlesitekit.ModuleSettingsDetails-optimize',
		'googlesitekit.OptimizeModuleSettingsDetails',
		fillFilterWithComponent( OptimizeSettings )
	);
}

const completeModuleData = {
	...global._googlesitekitLegacyData.modules.optimize,
	active: true,
	setupComplete: true,
};

function Settings( props ) {
	const {
		callback,
		module = global._googlesitekitLegacyData.modules.optimize,
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
					isEditing={ isEditing ? { 'optimize-module': true } : {} }
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

storiesOf( 'Optimize Module/Settings', module )
	.add( 'View, closed', () => {
		filterOptimizeSettings();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveGetSettings( {} );
		};

		return <Settings isOpen={ false } module={ completeModuleData } callback={ setupRegistry } />;
	} )
	.add( 'View, open with all settings', () => {
		filterOptimizeSettings();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveGetSettings( {
				optimizeID: 'OPT-1234567',
			} );
		};

		return <Settings module={ completeModuleData } callback={ setupRegistry } />;
	} )
	.add( 'Edit, open with all settings', () => {
		filterOptimizeSettings();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( CORE_MODULES ).receiveGetModules( analyticsFixture );
			dispatch( MODULES_ANALYTICS ).setUseSnippet( true );
			dispatch( STORE_NAME ).receiveGetSettings( {
				optimizeID: 'OPT-1234567',
				ampExperimentJSON: '{"experimentName":{"sticky":true,"variants":{"0":33.4,"1":33.3,"2":33.3}}}',
			} );
		};

		return <Settings isEditing={ true } module={ completeModuleData } callback={ setupRegistry } />;
	} )
	.add( 'Edit, open with no optimize ID', () => {
		filterOptimizeSettings();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( CORE_MODULES ).receiveGetModules( analyticsFixture );
			dispatch( MODULES_ANALYTICS ).setUseSnippet( true );
			dispatch( STORE_NAME ).receiveGetSettings( {} );
		};

		return <Settings isEditing={ true } module={ completeModuleData } callback={ setupRegistry } />;
	} )
	.add( 'Edit, open with all settings and AMP Experiment JSON Field', () => {
		filterOptimizeSettings();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( CORE_SITE ).receiveSiteInfo( { ampMode: 'standard' } );
			dispatch( CORE_MODULES ).receiveGetModules( analyticsFixture );
			dispatch( MODULES_ANALYTICS ).setUseSnippet( true );
			dispatch( STORE_NAME ).receiveGetSettings( {
				optimizeID: 'OPT-1234567',
				ampExperimentJSON: '{"experimentName":{"sticky":true,"variants":{"0":33.4,"1":33.3,"2":33.3}}}',
			} );
		};

		return <Settings isEditing={ true } module={ completeModuleData } callback={ setupRegistry } />;
	} )
;
