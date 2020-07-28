/**
 * core/site data store: reset connection tests.
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
import {
	createTestRegistry,
	muteConsole,
	subscribeUntil,
	unsubscribeFromAll,
} from 'tests/js/utils';
import { STORE_NAME } from './constants';

describe( 'core/site reset', () => {
	let registry;

	beforeEach( () => {
		registry = createTestRegistry();
	} );

	afterEach( () => {
		unsubscribeFromAll( registry );
	} );

	describe( 'actions', () => {
		describe( 'fetchReset', () => {
			it( 'sets isDoingReset ', async () => {
				const response = true;
				fetchMock.postOnce(
					/^\/google-site-kit\/v1\/core\/site\/data\/reset/,
					{ body: JSON.stringify( response ), status: 200 }
				);

				registry.dispatch( STORE_NAME ).fetchReset();
				expect( registry.select( STORE_NAME ).isDoingReset() ).toEqual( true );
			} );
		} );

		describe( 'reset', () => {
			it( 'does not require any params', () => {
				expect( async () => {
					const response = true;
					fetchMock.postOnce(
						/^\/google-site-kit\/v1\/core\/site\/data\/reset/,
						{ body: JSON.stringify( response ), status: 200 }
					);

					await registry.dispatch( STORE_NAME ).reset();
				} ).not.toThrow();
			} );

			it( 'resets connection ', async () => {
				const response = true;
				fetchMock.postOnce(
					/^\/google-site-kit\/v1\/core\/site\/data\/reset/,
					{ body: JSON.stringify( response ), status: 200 }
				);

				registry
					.dispatch( STORE_NAME )
					.receiveGetConnection( { connected: true, resettable: true }, {} );

				await registry.dispatch( STORE_NAME ).reset();
				expect( fetchMock ).toHaveFetchedTimes( 1 );

				fetchMock.getOnce(
					/^\/google-site-kit\/v1\/core\/site\/data\/connection/,
					{ body: { connected: false, resettable: false }, status: 200 }
				);

				// After a successful reset, `connection` should be `undefined` again.
				const connection = await registry.select( STORE_NAME ).getConnection();
				expect( connection ).toEqual( undefined );
			} );

			it( 'does not reset local connection if reset request fails', async () => {
				// Make sure there is existing data in the store so we can ensure
				// it isn't reset.
				registry.dispatch( STORE_NAME ).receiveGetConnection(
					{ connected: true, resettable: true },
					{}
				);

				const response = {
					code: 'internal_server_error',
					message: 'Internal server error',
					data: { status: 500 },
				};
				fetchMock.postOnce(
					/^\/google-site-kit\/v1\/core\/site\/data\/reset/,
					{ body: JSON.stringify( response ), status: 500 }
				);

				muteConsole( 'error' );
				registry.dispatch( STORE_NAME ).reset();
				await subscribeUntil( registry, () => registry.select( STORE_NAME ).isDoingReset() === false );

				expect( fetchMock ).toHaveFetchedTimes( 1 );

				// After a failed reset, `connection` should still exist.
				const connection = registry.select( STORE_NAME ).getConnection();
				expect( connection ).toEqual( { connected: true, resettable: true } );
			} );
		} );
	} );
} );
