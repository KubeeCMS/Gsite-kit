/**
 * core/user data store
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
import Data from 'googlesitekit-data';
import authentication from './authentication';
import dateRange from './date-range';
import disconnect from './disconnect';
import error from './error';
import notifications from './notifications';
import permissions from './permissions';
import userInfo from './user-info';
import { STORE_NAME } from './constants';

export { STORE_NAME };

const store = Data.combineStores(
	Data.commonStore,
	authentication,
	dateRange,
	disconnect,
	error,
	notifications,
	permissions,
	userInfo,
);

export const {
	INITIAL_STATE,
	actions,
	controls,
	reducer,
	resolvers,
	selectors,
} = store;

// Register this store on the global registry.
Data.registerStore( STORE_NAME, store );

export default store;
