/**
 * AdSense module initialization.
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
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import './datastore';
import { fillFilterWithComponent } from '../../util';
import { SetupMain } from './components/setup';
import {
	SettingsMain,
	SettingsSetupIncomplete,
} from './components/settings';
import { AdBlockerWarning } from './components/common';
import { DashboardZeroData } from './components/dashboard';

addFilter(
	'googlesitekit.ModuleSetup-adsense',
	'googlesitekit.AdSenseModuleSetup',
	fillFilterWithComponent( SetupMain )
);

addFilter(
	'googlesitekit.ModuleSettingsDetails-adsense',
	'googlesitekit.AdSenseModuleSettings',
	fillFilterWithComponent( SettingsMain )
);

addFilter(
	'googlesitekit.ModuleSetupIncomplete',
	'googlesitekit.AdSenseModuleSettingsSetupIncomplete',
	fillFilterWithComponent( ( props ) => {
		const { slug, OriginalComponent } = props;
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

addFilter(
	'googlesitekit.ModuleSettingsWarning',
	'googlesitekit.adsenseSettingsWarning',
	fillFilterWithComponent( ( props ) => {
		const { slug, context, OriginalComponent } = props;
		if ( 'adsense' !== slug ) {
			return <OriginalComponent { ...props } />;
		}
		return <AdBlockerWarning context={ context } />;
	} )
);

addFilter(
	'googlesitekit.AdSenseDashboardZeroData',
	'googlesitekit.AdSenseDashboardZeroDataRefactored',
	fillFilterWithComponent( DashboardZeroData )
);
