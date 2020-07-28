/**
 * Optimize Setup stories.
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
import SetupWrapper from '../assets/js/components/setup/setup-wrapper';
import { SetupMain as OptimizeSetup } from '../assets/js/modules/optimize/components/setup/index';
import { fillFilterWithComponent } from '../assets/js/util';
import { STORE_NAME as CORE_MODULES } from '../assets/js/googlesitekit/modules/datastore/constants';
import { STORE_NAME as CORE_SITE } from '../assets/js/googlesitekit/datastore/site/constants';
import { STORE_NAME as MODULES_ANALYTICS } from '../assets/js/modules/analytics/datastore/constants';
import { STORE_NAME } from '../assets/js/modules/optimize/datastore/constants';
import { WithTestRegistry } from '../tests/js/utils';
import fixtures from '../assets/js/googlesitekit/modules/datastore/fixtures.json';

const analyticsFixture = fixtures.filter( ( fixture ) => fixture.slug === 'analytics' );

function filterOptimizeSetup() {
	global._googlesitekitLegacyData.setup.moduleToSetup = 'optimize';

	removeAllFilters( 'googlesitekit.ModuleSetup-optimize' );
	addFilter(
		'googlesitekit.ModuleSetup-optimize',
		'googlesitekit.OptimizeModuleSetupWizard',
		fillFilterWithComponent( OptimizeSetup )
	);
}

function Setup( props ) {
	return (
		<WithTestRegistry { ...props }>
			<SetupWrapper />
		</WithTestRegistry>
	);
}

storiesOf( 'Optimize Module/Setup', module )
	.add( 'Start', () => {
		filterOptimizeSetup();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( CORE_MODULES ).receiveGetModules( analyticsFixture );
			dispatch( MODULES_ANALYTICS ).setUseSnippet( true );
			dispatch( STORE_NAME ).receiveGetSettings( {} );
		};

		return <Setup callback={ setupRegistry } />;
	} )
	.add( 'Start with AMP Experiment JSON Field', () => {
		filterOptimizeSetup();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( CORE_SITE ).receiveSiteInfo( { ampMode: 'standard' } );
			dispatch( CORE_MODULES ).receiveGetModules( analyticsFixture );
			dispatch( MODULES_ANALYTICS ).setUseSnippet( true );
			dispatch( STORE_NAME ).receiveGetSettings( {} );
		};
		return <Setup callback={ setupRegistry } />;
	} )
	.add( 'Start with invalid values', () => {
		filterOptimizeSetup();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( CORE_SITE ).receiveSiteInfo( { ampMode: 'standard' } );
			dispatch( CORE_MODULES ).receiveGetModules( analyticsFixture );
			dispatch( MODULES_ANALYTICS ).setUseSnippet( true );
			dispatch( STORE_NAME ).receiveGetSettings( {
				optimizeID: '1234567',
				ampExperimentJSON: 'invalid AMP experiment',
			} );
		};
		return <Setup callback={ setupRegistry } />;
	} )
;
