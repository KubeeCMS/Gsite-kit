/**
 * Metrics Learn More Link component.
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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Link from '../../../../components/link';
import { sanitizeHTML } from '../../../../util';

export default function MetricsLearnMoreLink() {
	return (
		<Link
			href="https://web.dev/user-centric-performance-metrics/#how-metrics-are-measured"
			external
			inherit
			dangerouslySetInnerHTML={ sanitizeHTML(
				__( 'Learn more<span class="screen-reader-text"> how metrics are measured.</span>', 'google-site-kit' ),
				{
					ALLOWED_TAGS: [ 'span' ],
					ALLOWED_ATTR: [ 'class' ],
				}
			) }
		/>
	);
}
