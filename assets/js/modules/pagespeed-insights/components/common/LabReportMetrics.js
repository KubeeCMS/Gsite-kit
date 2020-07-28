/**
 * PageSpeed Insights Lab Data report metrics component.
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
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ReportMetric from './ReportMetric';
import ReportDetailsLink from './ReportDetailsLink';
import MetricsLearnMoreLink from './MetricsLearnMoreLink';
import { getScoreCategory } from '../../util';

export default function LabReportMetrics( { data } ) {
	const totalBlockingTime = data?.lighthouseResult?.audits?.[ 'total-blocking-time' ];
	const largestContentfulPaint = data?.lighthouseResult?.audits?.[ 'largest-contentful-paint' ];
	const cumulativeLayoutShift = data?.lighthouseResult?.audits?.[ 'cumulative-layout-shift' ];

	if ( ! totalBlockingTime || ! largestContentfulPaint || ! cumulativeLayoutShift ) {
		return null;
	}

	return (
		<div className="googlesitekit-pagespeed-insights-web-vitals-metrics">
			<div className="googlesitekit-pagespeed-report__row googlesitekit-pagespeed-report__row--first">
				<p>
					{ __( 'Lab data is a snapshot of how your page performs right now, measured in tests we run in a controlled environment.', 'google-site-kit' ) }
					{ ' ' }
					<MetricsLearnMoreLink />
				</p>
			</div>
			<table
				className={ classnames(
					'googlesitekit-table',
					'googlesitekit-table--with-list'
				) }
			>
				<thead>
					<tr>
						<th>
							{ __( 'Metric Name', 'google-site-kit' ) }
						</th>
						<th>
							{ __( 'Metric Value', 'google-site-kit' ) }
						</th>
					</tr>
				</thead>
				<tbody>
					<ReportMetric
						title={ __( 'Total Blocking Time', 'google-site-kit' ) }
						description={ __( 'How long people had to wait after the page loaded before they could click something', 'google-site-kit' ) }
						displayValue={ totalBlockingTime.displayValue }
						category={ getScoreCategory( totalBlockingTime.score ) }
					/>
					<ReportMetric
						title={ __( 'Largest Contentful Paint', 'google-site-kit' ) }
						description={ __( 'Time it takes for the page to load', 'google-site-kit' ) }
						displayValue={ largestContentfulPaint.displayValue }
						category={ getScoreCategory( largestContentfulPaint.score ) }
					/>
					<ReportMetric
						title={ __( 'Cumulative Layout Shift', 'google-site-kit' ) }
						description={ __( 'How stable the elements on the page are', 'google-site-kit' ) }
						displayValue={ cumulativeLayoutShift.displayValue }
						category={ getScoreCategory( cumulativeLayoutShift.score ) }
					/>
				</tbody>
			</table>
			<div className="googlesitekit-pagespeed-report__row googlesitekit-pagespeed-report__row--last">
				<ReportDetailsLink />
			</div>
		</div>
	);
}

LabReportMetrics.propTypes = {
	data: PropTypes.object.isRequired,
};
