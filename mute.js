// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var muted = false;
changeMuteStatus();

getCurrentTabUrl((url) => {

	// var button = document.getElementById('js-mute-twitch');

	// getMuteStatus( (response) => {
	// 	if( response.hasOwnProperty('twitchSettingsMuted') && response['twitchSettingsMuted'] ){
	// 		muted = true;
	// 		changeMuteStatus();
	// 	}
	// });

	// button.addEventListener('click', () => {
	// 	changeMuteStatus();
	// 	saveMuteStatus();
	// });
});

chrome.extension.sendMessage({ action: 'mute' }, function(response){
	console.log( response.message ); //@DEBUG
});

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function getMuteStatus(callback){
	chrome.storage.sync.get( 'twitchSettingsMuted', (muted) => {
		callback( chrome.runtime.lastError ? null : muted );
	});
}

function changeMuteStatus(){
	//need to also set the button text

	var script = [
		'var divs = document.querySelectorAll("div.vertical-carousel-player");',
		'for (var i = 0; i < divs.length; i++) {',
			'divs[i].parentNode.removeChild(divs[i]);',
		'}'
	].join('');

	// var script = 'document.body.style.backgroundColor="green";';

	chrome.tabs.executeScript({
	  code: script
	});
}

function saveMuteStatus(){
	chrome.storage.sync.set({ 'twitchSettingsMuted' : !muted });
}
