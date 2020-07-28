/**
 * Tag Manager Module Settings Stories.
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
import { storiesOf } from '@storybook/react';

/**
 * Internal dependencies
 */
import { STORE_NAME as CORE_SITE, AMP_MODE_PRIMARY, AMP_MODE_SECONDARY } from '../assets/js/googlesitekit/datastore/site/constants';
import { STORE_NAME as CORE_USER } from '../assets/js/googlesitekit/datastore/user';
import { SettingsMain as TagManagerSettings } from '../assets/js/modules/tagmanager/components/settings';
import * as fixtures from '../assets/js/modules/tagmanager/datastore/__fixtures__';
import { STORE_NAME, ACCOUNT_CREATE } from '../assets/js/modules/tagmanager/datastore/constants';
import { createTestRegistry, freezeFetch } from '../tests/js/utils';
import createLegacySettingsWrapper from './utils/create-legacy-settings-wrapper';

const Settings = createLegacySettingsWrapper( 'tagmanager', TagManagerSettings );

const defaultSettings = {
	accountID: '',
	containerID: '',
	internalContainerID: '',
	ampContainerID: '',
	internalAMPContainerID: '',
	useSnippet: true,
};

storiesOf( 'Tag Manager Module/Settings', module )
	.addDecorator( ( storyFn ) => {
		const registry = createTestRegistry();
		registry.dispatch( STORE_NAME ).receiveGetSettings( defaultSettings );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
		registry.dispatch( CORE_USER ).receiveGetAuthentication( {} );

		return storyFn( registry );
	} )
	.add( 'View, closed', ( registry ) => {
		return <Settings isOpen={ false } registry={ registry } />;
	} )
	.add( 'View, open with all settings', ( registry ) => {
		registry.dispatch( STORE_NAME ).receiveGetSettings( {
			accountID: '123456789',
			containerID: 'GTM-S1T3K1T',
			internalContainerID: '54321',
			useSnippet: true,
		} );

		return <Settings isOpen={ true } registry={ registry } />;
	} )
	.add( 'View, open with all settings, with existing tag (with access)', ( registry ) => {
		const accountID = '123456789';
		registry.dispatch( STORE_NAME ).receiveGetSettings( {
			accountID,
			containerID: 'GTM-S1T3K1T',
			internalContainerID: '54321',
			useSnippet: true,
		} );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( 'GTM-G000GL3' );
		registry.dispatch( STORE_NAME ).receiveGetTagPermission( { accountID, permission: true }, { containerID: 'GTM-G000GL3' } );

		return <Settings isOpen={ true } registry={ registry } />;
	} )
	.add( 'View, open with all settings, with existing tag (no access)', ( registry ) => {
		const accountID = '123456789';
		registry.dispatch( STORE_NAME ).receiveGetSettings( {
			accountID,
			containerID: 'GTM-S1T3K1T',
			internalContainerID: '54321',
			useSnippet: true,
		} );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( 'GTM-G000GL3' );
		registry.dispatch( STORE_NAME ).receiveGetTagPermission( { accountID, permission: false }, { containerID: 'GTM-G000GL3' } );

		return <Settings isOpen={ true } registry={ registry } />;
	} )
	.add( 'Edit, Loading', ( registry ) => {
		freezeFetch( /^\/google-site-kit\/v1\/modules\/tagmanager\/data\/accounts/ );

		return <Settings isOpen={ true } isEditing={ true } registry={ registry } />;
	} )
	.add( 'Edit, with all settings', ( registry ) => {
		const accountID = fixtures.accounts[ 0 ].accountId;
		registry.dispatch( STORE_NAME ).setAccountID( accountID );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( fixtures.accounts );
		registry.dispatch( STORE_NAME ).receiveGetContainers( fixtures.getContainers.all, { accountID } );
		const [ container ] = registry.select( STORE_NAME ).getWebContainers( accountID );
		registry.dispatch( STORE_NAME ).setContainerID( container.publicId );
		registry.dispatch( STORE_NAME ).setInternalContainerID( container.containerId );

		return <Settings isOpen={ true } isEditing={ true } registry={ registry } />;
	} )
	.add( 'Edit, with no accounts', ( registry ) => {
		registry.dispatch( STORE_NAME ).receiveGetAccounts( [] );

		return <Settings isOpen={ true } isEditing={ true } registry={ registry } />;
	} )
	.add( 'Edit, with "Set up a new account"', ( registry ) => {
		registry.dispatch( STORE_NAME ).setAccountID( ACCOUNT_CREATE );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( fixtures.accounts );

		return <Settings isOpen={ true } isEditing={ true } registry={ registry } />;
	} )
	.add( 'Edit, with all settings, with existing tag (with access)', ( registry ) => {
		const accountID = fixtures.accounts[ 0 ].accountId;
		registry.dispatch( STORE_NAME ).setAccountID( accountID );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( fixtures.accounts );
		registry.dispatch( STORE_NAME ).receiveGetContainers( fixtures.getContainers.all, { accountID } );
		const [ container ] = registry.select( STORE_NAME ).getWebContainers( accountID );
		registry.dispatch( STORE_NAME ).setContainerID( container.publicId );
		registry.dispatch( STORE_NAME ).setInternalContainerID( container.containerId );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( 'GTM-G000GL3' );
		registry.dispatch( STORE_NAME ).receiveGetTagPermission( { accountID, permission: true }, { containerID: 'GTM-G000GL3' } );

		return <Settings isOpen={ true } isEditing={ true } registry={ registry } />;
	} )
	.add( 'Edit, with all settings, with existing tag (no access)', ( registry ) => {
		const accountID = fixtures.accounts[ 0 ].accountId;
		registry.dispatch( STORE_NAME ).setAccountID( accountID );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( fixtures.accounts );
		registry.dispatch( STORE_NAME ).receiveGetContainers( fixtures.getContainers.all, { accountID } );
		const [ container ] = registry.select( STORE_NAME ).getWebContainers( accountID );
		registry.dispatch( STORE_NAME ).setContainerID( container.publicId );
		registry.dispatch( STORE_NAME ).setInternalContainerID( container.containerId );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( 'GTM-GXXXGL3' );
		registry.dispatch( STORE_NAME ).receiveGetTagPermission( { accountID, permission: false }, { containerID: 'GTM-GXXXGL3' } );

		return <Settings isOpen={ true } isEditing={ true } registry={ registry } />;
	} )
;

storiesOf( 'Tag Manager Module/Settings/Primary AMP', module )
	.addDecorator( ( storyFn ) => {
		const registry = createTestRegistry();
		registry.dispatch( STORE_NAME ).receiveGetSettings( defaultSettings );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
		registry.dispatch( CORE_SITE ).receiveSiteInfo( { ampMode: AMP_MODE_PRIMARY } );
		registry.dispatch( CORE_USER ).receiveGetAuthentication( {} );

		return storyFn( registry );
	} )
	.add( 'Edit, with all settings', ( registry ) => {
		const accountID = fixtures.accounts[ 0 ].accountId;
		registry.dispatch( STORE_NAME ).setAccountID( accountID );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( fixtures.accounts );
		registry.dispatch( STORE_NAME ).receiveGetContainers( fixtures.getContainers.all, { accountID } );
		const [ container ] = registry.select( STORE_NAME ).getAMPContainers( accountID );
		registry.dispatch( STORE_NAME ).setAMPContainerID( container.publicId );
		registry.dispatch( STORE_NAME ).setInternalAMPContainerID( container.containerId );

		return <Settings isOpen={ true } isEditing={ true } registry={ registry } />;
	} )
;

storiesOf( 'Tag Manager Module/Settings/Secondary AMP', module )
	.addDecorator( ( storyFn ) => {
		const registry = createTestRegistry();
		registry.dispatch( STORE_NAME ).receiveGetSettings( defaultSettings );
		registry.dispatch( STORE_NAME ).receiveGetExistingTag( null );
		registry.dispatch( CORE_SITE ).receiveSiteInfo( { ampMode: AMP_MODE_SECONDARY } );
		registry.dispatch( CORE_USER ).receiveGetAuthentication( {} );

		return storyFn( registry );
	} )
	.add( 'Edit, with all settings', ( registry ) => {
		const accountID = fixtures.accounts[ 0 ].accountId;
		registry.dispatch( STORE_NAME ).setAccountID( accountID );
		registry.dispatch( STORE_NAME ).receiveGetAccounts( fixtures.accounts );
		registry.dispatch( STORE_NAME ).receiveGetContainers( fixtures.getContainers.all, { accountID } );
		const [ webContainer ] = registry.select( STORE_NAME ).getWebContainers( accountID );
		registry.dispatch( STORE_NAME ).setContainerID( webContainer.publicId );
		registry.dispatch( STORE_NAME ).setInternalContainerID( webContainer.containerId );
		const [ ampContainer ] = registry.select( STORE_NAME ).getAMPContainers( accountID );
		registry.dispatch( STORE_NAME ).setAMPContainerID( ampContainer.publicId );
		registry.dispatch( STORE_NAME ).setInternalAMPContainerID( ampContainer.containerId );

		return <Settings isOpen={ true } isEditing={ true } registry={ registry } />;
	} )
;
