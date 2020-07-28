/**
 * core/user Data store: Authentication info.
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
import Data from 'googlesitekit-data';
import { STORE_NAME } from './constants';
import { createFetchStore } from '../../data/create-fetch-store';

const { createRegistrySelector } = Data;

const fetchGetAuthenticationStore = createFetchStore( {
	baseName: 'getAuthentication',
	controlCallback: () => {
		return API.get( 'core', 'user', 'authentication', undefined, {
			useCache: false,
		} );
	},
	reducerCallback: ( state, authentication ) => {
		return {
			...state,
			authentication,
		};
	},
} );

const BASE_INITIAL_STATE = {
	authentication: undefined,
};

const baseResolvers = {
	*getAuthentication() {
		const { select } = yield Data.commonActions.getRegistry();

		if ( ! select( STORE_NAME ).getAuthentication() ) {
			yield fetchGetAuthenticationStore.actions.fetchGetAuthentication();
		}
	},
};

const baseSelectors = {
	/**
	 * Gets the authentication info for this user.
	 *
	 * Returns `undefined` if the authentication info is not available/loaded.
	 *
	 * Returns an object with the shape when successful:
	 * ```
	 * {
	 *   authenticated: <Boolean>,
	 *   grantedScopes: <Array>,
	 *   requiredScopes: <Array>
	 * }
	 * ```
	 *
	 * @private
	 * @since 1.9.0
	 *
	 * @param {Object} state Data store's state.
	 * @return {(Object|undefined)} User authentication info.
	 */
	getAuthentication( state ) {
		const { authentication } = state;
		return authentication;
	},

	/**
	 * Checks to see if the current user has granted a particular scope.
	 *
	 * Returns `undefined` if the scope info is not available/loaded.
	 *
	 * @since 1.11.0
	 * @private
	 *
	 * @param {Object} state Data store's state.
	 * @param {string} scope The scope constant to check for.
	 * @return {(boolean|undefined)} `true` if scope is present; `false` if not.
	 */
	hasScope: createRegistrySelector( ( select ) => ( state, scope ) => {
		const grantedScopes = select( STORE_NAME ).getGrantedScopes( state );

		if ( grantedScopes === undefined ) {
			return undefined;
		}

		return grantedScopes.includes( scope );
	} ),

	/**
	 * Gets the Site Kit authentication status for this user.
	 *
	 * Returns `true` if the user is authenticated, `false` if
	 * not. Returns `undefined` if the authentication info is not available/loaded.
	 *
	 * @since 1.9.0
	 *
	 * @param {Object} state Data store's state.
	 * @return {(boolean|undefined)} User authentication status.
	 */
	isAuthenticated: createRegistrySelector( ( select ) => () => {
		const { authenticated } = select( STORE_NAME ).getAuthentication() || {};
		return authenticated;
	} ),

	/**
	 * Gets the granted scopes for the user.
	 *
	 * Returns an array of granted scopes or undefined
	 * if authentication info is not available/loaded.
	 *
	 * @since 1.9.0
	 *
	 * @param {Object} state Data store's state.
	 * @return {(Array|undefined)} Array of granted scopes
	 */
	getGrantedScopes: createRegistrySelector( ( select ) => () => {
		const { grantedScopes } = select( STORE_NAME ).getAuthentication() || {};
		return grantedScopes;
	} ),

	/**
	 * Gets the required scopes for the user.
	 *
	 * Returns an array of required scopes or undefined
	 * if authentication info is not available/loaded.
	 *
	 * @since 1.9.0
	 *
	 * @param {Object} state Data store's state.
	 * @return {(Array|undefined)} Array of required scopes
	 */
	getRequiredScopes: createRegistrySelector( ( select ) => () => {
		const { requiredScopes } = select( STORE_NAME ).getAuthentication() || {};
		return requiredScopes;
	} ),

	/**
	 * Gets the unsatisfied scopes for the user.
	 *
	 * Returns an array of unsatisfied scopes (required but not granted)
	 * or undefined if authentication info is not available/loaded.
	 *
	 * @since 1.9.0
	 *
	 * @param {Object} state Data store's state.
	 * @return {(Array|undefined)} Array of scopes
	 */
	getUnsatisfiedScopes: createRegistrySelector( ( select ) => () => {
		const { unsatisfiedScopes } = select( STORE_NAME ).getAuthentication() || {};
		return unsatisfiedScopes;
	} ),

	/**
	 * Checks reauthentication status for this user.
	 *
	 * Returns true if any required scopes are not satisfied or undefined
	 * if reauthentication info is not available/loaded.
	 *
	 * @since 1.10.0
	 *
	 * @param {Object} state Data store's state.
	 * @return {(boolean|undefined)} User reauthentication status.
	 */
	needsReauthentication: createRegistrySelector( ( select ) => () => {
		const { needsReauthentication } = select( STORE_NAME ).getAuthentication() || {};
		return needsReauthentication;
	} ),
};

const store = Data.combineStores(
	fetchGetAuthenticationStore,
	{
		INITIAL_STATE: BASE_INITIAL_STATE,
		resolvers: baseResolvers,
		selectors: baseSelectors,
	}
);

export const INITIAL_STATE = store.INITIAL_STATE;
export const actions = store.actions;
export const controls = store.controls;
export const reducer = store.reducer;
export const resolvers = store.resolvers;
export const selectors = store.selectors;

export default store;
