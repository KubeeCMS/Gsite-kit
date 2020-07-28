/**
 * core/site data store: HTML for URL tests.
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
import API from 'googlesitekit-api';
import {
	createTestRegistry,
	unsubscribeFromAll,
	untilResolved,
} from 'tests/js/utils';
import { STORE_NAME } from './constants';

describe( 'core/site html', () => {
	let registry;

	beforeAll( () => {
		API.setUsingCache( false );
	} );

	beforeEach( () => {
		registry = createTestRegistry();
	} );

	afterAll( () => {
		API.setUsingCache( true );
	} );

	afterEach( () => {
		unsubscribeFromAll( registry );
	} );

	describe( 'actions', () => {
		describe( 'resetHTMLForURL', () => {
			it( 'invalidates the resolver for getHTMLForURL', async () => {
				const html = '<html><head><title>Example HTML</title></head><body><h1>Example HTML H1</h1></body></html>';
				const url = 'https://example.com';
				registry.dispatch( STORE_NAME ).receiveGetHTMLForURL( html, { url } );
				registry.select( STORE_NAME ).getHTMLForURL( url );

				await untilResolved( registry, STORE_NAME ).getHTMLForURL( url );

				registry.dispatch( STORE_NAME ).resetHTMLForURL( url );

				expect( registry.select( STORE_NAME ).hasFinishedResolution( 'getHTMLForURL', [ url ] ) ).toStrictEqual( false );
			} );
		} );

		describe( 'receiveGetHTMLForURL', () => {
			it( 'requires the htmlForURL response', () => {
				expect( () => {
					registry.dispatch( STORE_NAME ).receiveGetHTMLForURL();
				} ).toThrow( 'response is required.' );
			} );

			it( 'requires the params', () => {
				expect( () => {
					registry.dispatch( STORE_NAME ).receiveGetHTMLForURL( '<html>' );
				} ).toThrow( 'params is required.' );
			} );

			it( 'receives and sets HTML for a URL ', () => {
				const html = '<html><head><title>Example HTML</title></head><body><h1>Example HTML H1</h1></body></html>';
				const url = 'https://example.com';
				registry.dispatch( STORE_NAME ).receiveGetHTMLForURL( html, { url } );
				expect( registry.stores[ STORE_NAME ].store.getState().htmlForURL[ url ] ).toBe( html );
			} );
		} );

		describe( 'waitForHTMLForURL', () => {
			it( 'supports asynchronous waiting for HTML', async () => {
				const url = 'https://example.com';
				const html = '<html><head><title>Example HTML</title></head><body><h1>Example HTML H1</h1></body></html>';

				fetchMock.getOnce(
					{ query: { tagverify: '1' } },
					{ body: html, status: 200 }
				);
				const promise = registry.dispatch( STORE_NAME ).waitForHTMLForURL( url );

				expect( registry.select( STORE_NAME ).getHTMLForURL( url ) ).toBe( undefined );

				await promise;

				expect( fetchMock ).toHaveFetchedTimes( 1 );

				expect( registry.select( STORE_NAME ).getHTMLForURL( url ) ).toBe( html );
			} );
		} );
	} );

	describe( 'selectors', () => {
		describe( 'getHTMLForURL', () => {
			it( 'uses a resolver to make a network request', async () => {
				const html = '<html><head><title>Example HTML</title></head><body><h1>Example HTML H1</h1></body></html>';
				const url = 'https://example.com';

				fetchMock.getOnce(
					{ query: { tagverify: '1' } },
					{ body: html, status: 200 }
				);

				const initialHTML = registry.select( STORE_NAME ).getHTMLForURL( url );
				// The initialHTML info will be its initial value while the HTML is fetched.
				expect( initialHTML ).toEqual( undefined );
				await untilResolved( registry, STORE_NAME ).getHTMLForURL( url );

				const selectedHTML = registry.select( STORE_NAME ).getHTMLForURL( url );

				expect( fetchMock ).toHaveFetchedTimes( 1 );
				expect( selectedHTML ).toEqual( html );
			} );

			it( 'does not make a network request if data is already in state', () => {
				const html = '<html><head><title>Example HTML</title></head><body><h1>Example HTML H1</h1></body></html>';
				const url = 'https://example.com';
				registry.dispatch( STORE_NAME ).receiveGetHTMLForURL( html, { url } );

				const selectedHTML = registry.select( STORE_NAME ).getHTMLForURL( url );

				expect( fetchMock ).not.toHaveFetched();
				expect( selectedHTML ).toEqual( html );
			} );

			it( 'returns null if request fails', async () => {
				const url = 'https://example.com';

				fetchMock.getOnce(
					{ query: { tagverify: '1' } },
					{ body: undefined, status: 500 }
				);

				// `muteConsole` is not needed since `fetchGetHTMLForURL` uses `fetch` internally instead of `apiFetch`.
				registry.select( STORE_NAME ).getHTMLForURL( url );

				await untilResolved( registry, STORE_NAME ).getHTMLForURL( url );

				const selectedHTML = registry.select( STORE_NAME ).getHTMLForURL( url );

				expect( fetchMock ).toHaveFetchedTimes( 1 );
				expect( selectedHTML ).toEqual( null );
			} );
		} );
	} );
} );
