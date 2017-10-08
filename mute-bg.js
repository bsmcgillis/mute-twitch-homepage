/**
 * You can view the console of this background file by clicking on the 
 * "Inspect Views: background page" link in the chrome://extension page
 */

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse){
	if( message.hasOwnProperty( 'mute' ) ){
		setCurrentTabMuteStatus( message.mute, sendResponse );
	}
});

function setCurrentTabMuteStatus( mute, sendResponse ) {
	var queryInfo = {
    	active: true,
    	currentWindow: true
  	};

  	chrome.tabs.query(queryInfo, (tabs) => {
    	var tab = tabs[0];

    	chrome.tabs.update( tab.id, {muted: mute} );
  	});
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if( changeInfo.hasOwnProperty('url') && changeInfo.url ){
		chrome.tabs.sendMessage( tabId, { action: 'url_changed' }, function(response){} );
	}
});