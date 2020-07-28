/**
 * Utility for switching the current date range.
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
 * Internal dependencies
 */
import { pageWait } from '../utils';

/**
 * Changes the currently selected date range.
 *
 * Currently only identifiable by the option values.
 *
 * @param {string} fromRange The currently selected date range.
 * @param {string} toRange The new date range to select.
 */
export async function switchDateRange( fromRange, toRange ) {
	await pageWait();
	await Promise.all( [
		expect( page ).toClick( '.mdc-select__selected-text', { text: new RegExp( fromRange, 'i' ) } ),
		page.waitForSelector( '.mdc-select.mdc-select--focused' ),
		page.waitForSelector( '.mdc-menu-surface--open .mdc-list-item' ),
	] );
	// Intentionally left off the '--open' suffix here as it proved problematic for stability.
	await expect( page ).toClick( '.mdc-menu-surface .mdc-list-item', { text: new RegExp( toRange, 'i' ) } );
}
