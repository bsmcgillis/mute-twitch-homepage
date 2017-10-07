// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var mute = false;

//I think here, I need to listen for an event from mute-bg to see if
//the URL has changed. I guess when I first land on a page, I can store
//whatever the URL was. And then in the background file, I can constantly
//being listening for the URL to change. When it does, I'll fire a message
//to this file. 


if( location.href === 'https://go.twitch.tv/' ){
	maybeMuteTab();
}else{
	setMuteStatus();
}

function maybeMuteTab(){

	getMuteStatus( (response) => {
		console.log( 'mute check response in mute.js: ', response ); //@DEBUG
		if( response.hasOwnProperty('twitchSettingsMuted') && response['twitchSettingsMuted'] ){
			mute = true;
			setMuteStatus();
		}else{
			setMuteStatus();
		}
	});
}

function getMuteStatus(callback){
	chrome.storage.sync.get( 'twitchSettingsMuted', (muted) => {
		callback( chrome.runtime.lastError ? null : muted );
	});
}

function setMuteStatus(){
	chrome.extension.sendMessage({ mute: mute }, function(response){
		//The response from this call is always undefined for some reason
		// console.log( 'Muting response: ', response.message ); //@DEBUG
	});
}
