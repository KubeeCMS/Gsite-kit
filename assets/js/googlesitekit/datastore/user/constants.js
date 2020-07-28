/**
 * core/user data store: constants.
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

export const STORE_NAME = 'core/user';

// Permissions list.
export const PERMISSION_AUTHENTICATE = 'googlesitekit_authenticate';
export const PERMISSION_SETUP = 'googlesitekit_setup';
export const PERMISSION_VIEW_POSTS_INSIGHTS = 'googlesitekit_view_posts_insights';
export const PERMISSION_VIEW_DASHBOARD = 'googlesitekit_view_dashboard';
export const PERMISSION_VIEW_MODULE_DETAILS = 'googlesitekit_view_module_details';
export const PERMISSION_MANAGE_OPTIONS = 'googlesitekit_manage_options';
export const PERMISSION_PUBLISH_POSTS = 'googlesitekit_publish_posts';

// Error code returned when scopes are missing.
export const ERROR_MISSING_REQUIRED_SCOPE = 'missing_required_scopes';
