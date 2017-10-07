// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var muted = false;
maybeMuteTab();

function maybeMuteTab(){
	// var button = document.getElementById('js-mute-twitch');

	getMuteStatus( (response) => {
		console.log( 'muted check response: ', response ); //@DEBUG
		if( response.hasOwnProperty('twitchSettingsMuted') && response['twitchSettingsMuted'] ){
			muted = true;
			changeMutedStatus();
		}else{
			changeMutedStatus();
		}
	});

	//I'll need to update this to have the permanent and temporary mute options
	//Maybe a checkbox for permanent mute and a button to temporarily mute or unmute
	// button.addEventListener('click', () => {
	// 	changeMutedStatus();
	// 	saveMutedStatus();
	// });
}

function getMuteStatus(callback){
	chrome.storage.sync.get( 'twitchSettingsMuted', (muted) => {
		callback( chrome.runtime.lastError ? null : muted );
	});
}

function changeMutedStatus(){
	//need to also set the button text

	chrome.extension.sendMessage({ action: 'mute' }, function(response){
		console.log( 'Muting response: ', response.message ); //@DEBUG
	});
}

function saveMutedStatus(){
	chrome.storage.sync.set({ 'twitchSettingsMuted' : ! muted });
}
