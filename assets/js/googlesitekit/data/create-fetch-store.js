/**
 * API function to create fetch store.
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
import isPlainObject from 'lodash/isPlainObject';

/**
 * Internal dependencies
 */
import {
	camelCaseToPascalCase,
	camelCaseToConstantCase,
} from './transform-case';
import { stringifyObject } from '../../util';

const defaultReducerCallback = ( state ) => {
	return { ...state };
};

const defaultArgsToParams = () => {
	return {};
};

/**
 * Creates a store object implementing the necessary infrastructure for a
 * single fetch action.
 *
 * This function returns a partial store object with the following:
 * * action creators to fetch and to receive the data
 * * control to issue the API request
 * * reducer to set API request flag and receive the response
 * * selector to check whether the API request is in progress via a flag
 *
 * The names of the pieces are based on the baseName provided.
 * For example, if baseName is 'saveSettings':
 * * The fetch action creator is called 'fetchSaveSettings'.
 * * The receive action creator is called 'receiveSaveSettings'.
 * * The fetching selector is called 'isFetchingSaveSettings'.
 *
 * All parts of the returned store objects should be considered internal. A
 * public action or selector should be implemented to actually call the
 * fetch action included in the returned store object.
 *
 * For example, if the fetch store is intended for an API-based
 * action 'storeMySetting':
 * * The basename passed should be 'storeMySetting'.
 * * The action 'storeMySetting' should call 'fetchStoreMySetting'.
 *
 * Or, if the fetch store is intended for an API-based selector
 * 'getSomeData':
 * * The baseName passed should be 'getSomeData'.
 * * The resolver for 'getSomeData' should call 'fetchGetSomeData'.
 *
 * @since 1.10.0
 * @private
 *
 * @param {Object}   args                   Arguments for creating the fetch store.
 * @param {string}   args.baseName          The base name to use for all the created infrastructure.
 * @param {Function} args.controlCallback   Callback function to issue the API request. Will be used inside the
 *                                          control. The function receives a params object based on argsToParams,
 *                                          i.e. the respective values passed to the action.
 * @param {Function} [args.reducerCallback] Optional. Callback function to modify state based on the API response.
 *                                          Will be used inside the reducer. The function receives the store's state
 *                                          object as first parameter, the API response as second parameter, and the
 *                                          params object for the request (see above) as third parameter. If not
 *                                          provided, the default will return the unmodified state.
 * @param {Function} [args.argsToParams]    Optional. Function that should validate expected arguments for the
 *                                          internal fetch action and parse them into an named parameters object,
 *                                          with the argument names used as keys. If not provided, the default
 *                                          function will return an empty object, essentially indicating that no
 *                                          arguments are supported/required.
 * @return {Object} Partial store object with properties 'actions', 'controls', 'reducer', 'resolvers', and 'selectors'.
 */
export const createFetchStore = ( {
	baseName,
	controlCallback,
	reducerCallback = defaultReducerCallback,
	argsToParams = defaultArgsToParams,
} ) => {
	invariant( baseName, 'baseName is required.' );
	invariant( 'function' === typeof controlCallback, 'controlCallback is required and must be a function.' );
	invariant( 'function' === typeof reducerCallback, 'reducerCallback must be a function.' );
	invariant( 'function' === typeof argsToParams, 'argsToParams must be a function.' );

	// If argsToParams without any arguments does not result in an error, we
	// know params is okay to be empty.
	let requiresParams;
	try {
		argsToParams();
		requiresParams = false;
	} catch ( error ) {
		requiresParams = true;
	}

	const pascalCaseBaseName = camelCaseToPascalCase( baseName );
	const constantBaseName = camelCaseToConstantCase( baseName );

	const FETCH = `FETCH_${ constantBaseName }`;
	const START_FETCH = `START_${ FETCH }`;
	const FINISH_FETCH = `FINISH_${ FETCH }`;
	const CATCH_FETCH = `CATCH_${ FETCH }`;
	const RECEIVE = `RECEIVE_${ constantBaseName }`;

	const fetchCreator = `fetch${ pascalCaseBaseName }`;
	const receiveCreator = `receive${ pascalCaseBaseName }`;
	const isFetching = `isFetching${ pascalCaseBaseName }`;

	const INITIAL_STATE = {
		[ isFetching ]: {},
	};

	const actions = {
		*[ fetchCreator ]( ...args ) {
			let response;
			let error;
			let params;

			try {
				params = argsToParams( ...args );
			} catch ( err ) {
				// Parameters should never be invalid here, this needs to be
				// strict and inform the developer of the issue.
				global.console.error( err.message );
				error = err;
				return { response, error };
			}

			yield {
				payload: { params },
				type: START_FETCH,
			};

			try {
				response = yield {
					payload: { params },
					type: FETCH,
				};

				yield actions[ receiveCreator ]( response, params );

				yield {
					payload: { params },
					type: FINISH_FETCH,
				};
			} catch ( e ) {
				error = e;

				yield {
					payload: { error, params },
					type: CATCH_FETCH,
				};
			}

			return { response, error };
		},

		[ receiveCreator ]( response, params ) {
			invariant( response !== undefined, 'response is required.' );
			if ( requiresParams ) {
				invariant( isPlainObject( params ), 'params is required.' );
			} else {
				params = {};
			}

			return {
				payload: { response, params },
				type: RECEIVE,
			};
		},
	};

	const controls = {
		[ FETCH ]: ( { payload } ) => {
			return controlCallback( payload.params );
		},
	};

	const reducer = ( state, { type, payload } ) => {
		switch ( type ) {
			case START_FETCH: {
				const { params } = payload;
				return {
					...state,
					[ isFetching ]: {
						...state[ isFetching ],
						[ stringifyObject( params ) ]: true,
					},
				};
			}

			case RECEIVE: {
				const { response, params } = payload;
				return reducerCallback( state, response, params );
			}

			case FINISH_FETCH: {
				const { params } = payload;
				return {
					...state,
					[ isFetching ]: {
						...state[ isFetching ],
						[ stringifyObject( params ) ]: false,
					},
				};
			}

			case CATCH_FETCH: {
				const { error, params } = payload;
				return {
					...state,
					error,
					[ isFetching ]: {
						...state[ isFetching ],
						[ stringifyObject( params ) ]: false,
					},
				};
			}

			default: {
				return { ...state };
			}
		}
	};

	const selectors = {
		[ isFetching ]: ( state, ...args ) => {
			if ( state[ isFetching ] === undefined ) {
				return false;
			}

			let params;
			try {
				params = argsToParams( ...args );
			} catch ( err ) {
				// If parameters are invalid, fail silently here. It likely is
				// because some dependency selector is still resolving.
				return false;
			}

			return !! state[ isFetching ][ stringifyObject( params ) ];
		},
	};

	return {
		INITIAL_STATE,
		actions,
		controls,
		reducer,
		resolvers: {},
		selectors,
	};
};
