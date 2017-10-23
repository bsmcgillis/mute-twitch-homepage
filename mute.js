// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

//I think here, I need to listen for an event from mute-bg to see if
//the URL has changed. I guess when I first land on a page, I can store
//whatever the URL was. And then in the background file, I can constantly
//being listening for the URL to change. When it does, I'll fire a message
//to this file.

/**
 * Fire the mute check when we first land on a page
 */
maybeMuteTab();


/**
 * Also listen for when the URL changes, but a full page change event
 * hasn't fired, like on SPA applications.
 */
chrome.extension.onMessage.addListener( function( message, sender, sendResponse ){
	if( message.hasOwnProperty( 'action' ) && message.action === 'url_changed' ){
		maybeMuteTab();
	}
});

function maybeMuteTab(){
	if( location.href === 'https://www.twitch.tv/' ){
		getMuteStatus( (response) => {
			if( response.hasOwnProperty('twitchSettingsMuted') && response['twitchSettingsMuted'] ){
				setMuteStatus( true );
			}else{
				setMuteStatus( false );
			}
		});
	}else{
		setMuteStatus( false );
	}
}

function getMuteStatus(callback){
	chrome.storage.sync.get( 'twitchSettingsMuted', (muted) => {
		callback( chrome.runtime.lastError ? null : muted );
	});
}

function setMuteStatus( mute ){
	chrome.extension.sendMessage( { mute: mute }, function(response){} );
}
