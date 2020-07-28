/**
 * Dashboard component.
 *
 * Site Kit by Google, Copyright 2019 Google LLC
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
import domReady from '@wordpress/dom-ready';
import { render, Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { clearWebStorage, loadTranslations } from './util';
import Root from './components/root';
import './modules';
import Setup from './components/setup/setup-wrapper';
import DashboardApp from './components/dashboard/dashboard-app';
import NotificationCounter from './components/notifications/notification-counter';
import './components/notifications';

const GoogleSitekitDashboard = () => {
	const { showModuleSetupWizard } = global._googlesitekitLegacyData.setup;

	if ( showModuleSetupWizard ) {
		return <Setup />;
	}

	return (
		<Fragment>
			<NotificationCounter />
			<DashboardApp />
		</Fragment>
	);
};

// Initialize the app once the DOM is ready.
domReady( () => {
	if ( global._googlesitekitLegacyData.admin.resetSession ) {
		clearWebStorage();
	}

	const renderTarget = document.getElementById( 'js-googlesitekit-dashboard' );

	if ( renderTarget ) {
		loadTranslations();

		render( <Root dataAPIContext="Dashboard"><GoogleSitekitDashboard /></Root>, renderTarget );
	}
} );
