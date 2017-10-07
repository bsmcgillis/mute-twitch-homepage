/**
 * You can view the console of this background file by clicking on the 
 * "Inspect Views: background page" link in the chrome://extension page
 */

chrome.runtime.onMessage.addListener( function( message, sender, sendResponse){
	if( message.action == 'mute' ){
		muteCurrentTab( sendResponse );
	}
	// sendResponse( {message: 'something' } ); //this does send
});

function muteCurrentTab( sendResponse ) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];

    //Maybe if I rewrite this as a lambda function, it'll have access to the sendResponse callback
    chrome.tabs.update(tab.id, {muted: true}, function(result){
    	if( result.mutedInfo.muted ){
    		sendResponse( { message: 'Tab Muted!' } ); //this isn't sending
    	}
    });
  });
}
