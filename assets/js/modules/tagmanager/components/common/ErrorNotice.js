/**
 * Tag Manager Error component.
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
import { STORE_NAME } from '../../datastore/constants';
import ErrorText from '../../../../components/error-text';
import { isPermissionScopeError } from '../../../../googlesitekit/datastore/user/utils/is-permission-scope-error';
const { useSelect } = Data;

export default function ErrorNotice() {
	const error = useSelect( ( select ) => select( STORE_NAME ).getError() );

	// Do not display if no error, or if the error is for missing scopes.
	if ( ! error || isPermissionScopeError( error ) ) {
		return null;
	}

	return <ErrorText message={ error.message } reconnectURL={ error.data?.reconnectURL } />;
}
