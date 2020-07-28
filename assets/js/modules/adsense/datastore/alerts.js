/**
 * modules/adsense data store: alerts.
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
import invariant from 'invariant';

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import Data from 'googlesitekit-data';
import { STORE_NAME } from './constants';
import { isValidAccountID } from '../util';
import { createFetchStore } from '../../../googlesitekit/data/create-fetch-store';

// Actions
const RESET_ALERTS = 'RESET_ALERTS';

const fetchGetAlertsStore = createFetchStore( {
	baseName: 'getAlerts',
	controlCallback: ( { accountID } ) => {
		return API.get( 'modules', 'adsense', 'alerts', { accountID }, {
			useCache: false,
		} );
	},
	reducerCallback: ( state, alerts, { accountID } ) => {
		return {
			...state,
			alerts: {
				...state.alerts,
				[ accountID ]: [ ...alerts ],
			},
		};
	},
	argsToParams: ( accountID ) => {
		invariant( accountID, 'accountID is required.' );
		return { accountID };
	},
} );

const BASE_INITIAL_STATE = {
	alerts: {},
};

const baseActions = {
	*resetAlerts() {
		const { dispatch } = yield Data.commonActions.getRegistry();

		yield {
			payload: {},
			type: RESET_ALERTS,
		};

		return dispatch( STORE_NAME )
			.invalidateResolutionForStoreSelector( 'getAlerts' );
	},
};

const baseReducer = ( state, { type } ) => {
	switch ( type ) {
		case RESET_ALERTS: {
			const {
				accountStatus,
				siteStatus,
				accountSetupComplete,
				siteSetupComplete,
			} = state.savedSettings || {};
			return {
				...state,
				alerts: INITIAL_STATE.alerts,
				settings: {
					...( state.settings || {} ),
					accountStatus,
					siteStatus,
					accountSetupComplete,
					siteSetupComplete,
				},
			};
		}

		default: {
			return { ...state };
		}
	}
};

const baseResolvers = {
	*getAlerts( accountID ) {
		if ( undefined === accountID || ! isValidAccountID( accountID ) ) {
			return;
		}

		const registry = yield Data.commonActions.getRegistry();
		const existingAlerts = registry.select( STORE_NAME ).getAlerts( accountID );

		// If there are already alerts loaded in state, consider it fulfilled
		// and don't make an API request.
		if ( existingAlerts ) {
			return;
		}

		yield fetchGetAlertsStore.actions.fetchGetAlerts( accountID );
	},
};

const baseSelectors = {
	/**
	 * Gets all Google AdSense alerts for this account.
	 *
	 * @since 1.9.0
	 *
	 * @param {Object} state     Data store's state.
	 * @param {string} accountID The AdSense Account ID to fetch alerts for.
	 * @return {(Array.<Object>|undefined)} An array of AdSense alerts; `undefined` if not loaded.
	 */
	getAlerts( state, accountID ) {
		if ( undefined === accountID ) {
			return undefined;
		}

		const { alerts } = state;

		return alerts[ accountID ];
	},
};

const store = Data.combineStores(
	fetchGetAlertsStore,
	{
		INITIAL_STATE: BASE_INITIAL_STATE,
		actions: baseActions,
		reducer: baseReducer,
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
