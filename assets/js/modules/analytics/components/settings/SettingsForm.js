/**
 * Analytics Settings form.
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
	AccountSelect,
	AnonymizeIPSwitch,
	ErrorNotice,
	ExistingTagNotice,
	ProfileSelect,
	PropertySelect,
	TrackingExclusionSwitches,
	UseSnippetSwitch,
	ProfileNameTextField,
} from '../common';

export default function SettingsForm() {
	return (
		<div className="googlesitekit-analytics-settings-fields">
			<ErrorNotice />

			<ExistingTagNotice />

			<div className="googlesitekit-setup-module__inputs">
				<AccountSelect />

				<PropertySelect />

				<ProfileSelect />
			</div>

			<div className="googlesitekit-setup-module__inputs googlesitekit-setup-module__inputs--multiline">
				<ProfileNameTextField />

				<UseSnippetSwitch />

				<AnonymizeIPSwitch />

				<TrackingExclusionSwitches />
			</div>
		</div>
	);
}
