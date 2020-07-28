/**
 * External dependencies
 */
import { storiesOf } from '@storybook/react';

/**
 * WordPress dependencies
 */
import { addFilter, doAction, removeAllFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { GoogleSitekitAdminbar } from '../assets/js/googlesitekit-adminbar';
import { googlesitekit as wpAdminBarData } from '../.storybook/data/blog---googlesitekit';
import AnalyticsAdminbarWidget from '../assets/js/modules/analytics/components/adminbar/AnalyticsAdminbarWidget';
import GoogleSitekitSearchConsoleAdminbarWidget from '../assets/js/modules/search-console/components/adminbar/GoogleSitekitSearchConsoleAdminbarWidget';
import { createAddToFilter } from '../assets/js/util/helpers';

storiesOf( 'Global', module )
	.add( 'Admin Bar', () => {
		global._googlesitekitLegacyData = wpAdminBarData;
		const addGoogleSitekitSearchConsoleAdminbarWidget = createAddToFilter( <GoogleSitekitSearchConsoleAdminbarWidget /> );
		const addAnalyticsAdminbarWidget = createAddToFilter( <AnalyticsAdminbarWidget /> );

		removeAllFilters( 'googlesitekit.AdminbarModules' );
		addFilter( 'googlesitekit.AdminbarModules',
			'googlesitekit.Analytics',
			addAnalyticsAdminbarWidget, 11 );

		addFilter( 'googlesitekit.AdminbarModules',
			'googlesitekit.SearchConsole',
			addGoogleSitekitSearchConsoleAdminbarWidget );

		// Load the datacache with data.
		setTimeout( () => {
			doAction(
				'googlesitekit.moduleLoaded',
				'Adminbar'
			);
		}, 1250 );

		return (
			<div id="wpadminbar">
				<div className="googlesitekit-plugin">
					<div id="js-googlesitekit-adminbar" className="ab-sub-wrapper googlesitekit-adminbar" style={ { display: 'block' } }>
						<section id="js-googlesitekit-adminbar-modules" className="googlesitekit-adminbar-modules">
							<GoogleSitekitAdminbar />
						</section>
					</div>
				</div>
			</div>
		);
	}, {
		options: {
			readySelector: '.googlesitekit-data-block',
		},
	} );
