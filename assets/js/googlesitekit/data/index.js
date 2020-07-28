/**
 * Site Kit @wordpress/data (eg Redux-style) data store.
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
import {
	createRegistry,
	createRegistryControl,
	createRegistrySelector,
	useSelect,
	useDispatch,
	useRegistry,
	withSelect,
	RegistryProvider,
} from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	combineStores,
	commonActions,
	commonControls,
	commonStore,
} from './utils';

const Data = createRegistry();

// Attach some of our utility functions to the registry so third-party
// developers can use them.
Data.combineStores = combineStores;
Data.commonActions = commonActions;
Data.commonControls = commonControls;
Data.commonStore = commonStore;
Data.createRegistryControl = createRegistryControl;
Data.createRegistrySelector = createRegistrySelector;
Data.useSelect = useSelect;
Data.useDispatch = useDispatch;
Data.useRegistry = useRegistry;
Data.withSelect = withSelect;
Data.RegistryProvider = RegistryProvider;

export default Data;
