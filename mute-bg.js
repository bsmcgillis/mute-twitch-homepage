/**
 * You can view the console of this background file by clicking on the 
 * "Inspect Views: background page" link in the chrome://extension page
 */

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse){
	setCurrentTabMuteStatus( message.mute, sendResponse );
});

function setCurrentTabMuteStatus( mute, sendResponse ) {
	var queryInfo = {
    	active: true,
    	currentWindow: true
  	};

  	chrome.tabs.query(queryInfo, (tabs) => {
    	var tab = tabs[0];

    	chrome.tabs.update(tab.id, {muted: mute}, (result) => {
    		//I'd love to send a success response back on the
    		//sendResponse callback, but it doesn't work for some reason
    	});
  	});
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	console.log( 'tabId: ', tabId ); //@DEBUG
	console.log( 'changeInfo: ', changeInfo ); //@DEBUG
	console.log( 'tab: ', tab ); //@DEBUG
});