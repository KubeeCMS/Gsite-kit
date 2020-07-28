/**
 * Optimize SettingsMain tests.
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
import { render, fireEvent, waitFor } from '../../../../../../tests/js/test-utils';
import { STORE_NAME } from '../../datastore/constants';
import SettingsMain from './SettingsMain';

describe( 'SettingsMain', () => {
	const initialSettings = {
		optimizeID: 'OPT-1234567',
	};

	const newSettings = {
		optimizeID: 'OPT-2222222',
	};

	it( 'rolls back settings if settings have changed and is not editing', async () => {
		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveGetSettings( initialSettings );
		};

		const { rerender, registry, container } = render( <SettingsMain isOpen={ true } isEditing={ false } />, { setupRegistry } );
		const { select } = registry;

		expect( select( STORE_NAME ).getSettings() ).toEqual( initialSettings );

		rerender( <SettingsMain isOpen={ true } isEditing={ true } /> );

		await waitFor( () => container.querySelector( '.mdc-text-field__input' ) );
		fireEvent.change( container.querySelector( '.mdc-text-field__input' ), { target: { value: 'OPT-2222222' } } );
		expect( select( STORE_NAME ).haveSettingsChanged() ).toBe( true );

		rerender( <SettingsMain isOpen={ true } isEditing={ false } /> );

		expect( select( STORE_NAME ).getSettings() ).toEqual( initialSettings );
	} );

	it( 'does not roll back settings if settings have changed and is editing', async () => {
		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveGetSettings( initialSettings );
		};

		const { rerender, registry, container } = render( <SettingsMain isOpen={ true } isEditing={ false } />, { setupRegistry } );
		const { select } = registry;

		expect( select( STORE_NAME ).getSettings() ).toEqual( initialSettings );

		rerender( <SettingsMain isOpen={ true } isEditing={ true } /> );

		await waitFor( () => container.querySelector( '.mdc-text-field__input' ) );
		fireEvent.change( container.querySelector( '.mdc-text-field__input' ), { target: { value: 'OPT-2222222' } } );
		expect( select( STORE_NAME ).haveSettingsChanged() ).toBe( true );

		rerender( <SettingsMain isOpen={ false } isEditing={ true } /> );

		expect( select( STORE_NAME ).getSettings() ).toEqual( newSettings );
	} );
} );
