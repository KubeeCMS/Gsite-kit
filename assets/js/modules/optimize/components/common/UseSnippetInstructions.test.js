/**
 * UseSnippetInstructions component tests.
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
import UseSnippetInstructions from './UseSnippetInstructions';
import { render } from '../../../../../../tests/js/test-utils';
import { STORE_NAME } from '../../datastore/constants';
import { STORE_NAME as CORE_MODULE } from '../../../../googlesitekit/modules/datastore/constants';
import { STORE_NAME as MODULES_ANALYTICS } from '../../../analytics/datastore/constants';
import { STORE_NAME as MODULES_TAGMANAGER } from '../../../tagmanager/datastore/constants';
import fixtures from '../../../../googlesitekit/modules/datastore/fixtures.json';

describe( 'UseSnippetInstructions', () => {
	it( 'should render with analytics active and no useSnippet', () => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).setOptimizeID( 'OPT-1234567' );
			registry.dispatch( CORE_MODULE ).receiveGetModules( fixtures );
		};

		const { container } = render( <UseSnippetInstructions />, { setupRegistry } );

		const selectedText = container.querySelector( 'p' );
		expect( selectedText ).toHaveTextContent( 'You disabled analytics auto insert snippet. If You are using Google Analytics code snippet, add the code below:' );
	} );

	it( 'should render with analytics message if analytics is inactive', () => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).setOptimizeID( 'OPT-1234567' );
		};

		const { container } = render( <UseSnippetInstructions />, { setupRegistry } );

		const selectedText = container.querySelector( 'p' );
		expect( selectedText ).toHaveTextContent( 'Google Analytics must be active to use Optimize' );
	} );

	it( 'should not render with analytics active and a useSnippet', () => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).setOptimizeID( 'OPT-1234567' );
			registry.dispatch( CORE_MODULE ).receiveGetModules( fixtures );
			registry.dispatch( MODULES_ANALYTICS ).setUseSnippet( true );
		};

		const { container } = render( <UseSnippetInstructions />, { setupRegistry } );

		expect( container.querySelector( 'p' ) ).toEqual( null );
	} );

	it( 'should render with analytics active and no analytics useSnippet, also with tagmanager active and a gtm useSnippet', () => {
		const newFixtures = fixtures.map( ( fixture ) => {
			if ( fixture.slug !== 'tagmanager' && fixture.slug !== 'optimize' ) {
				return fixture;
			}
			return { ...fixture, active: true, connected: true };
		} );

		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).setOptimizeID( 'OPT-1234567' );
			registry.dispatch( CORE_MODULE ).receiveGetModules( newFixtures );
			registry.dispatch( MODULES_TAGMANAGER ).setUseSnippet( true );
		};

		const { container } = render( <UseSnippetInstructions />, { setupRegistry } );

		const selectedText = container.querySelector( 'p' );
		expect( selectedText ).toHaveTextContent( 'You are using auto insert snippet with Tag Manager' );
	} );
} );
