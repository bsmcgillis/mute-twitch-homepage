
/**
 * Making variables available for multiple functions
 */
var permMute = false;
var tempMute = false;
var permMuteElem;
var tempMuteElem;

/**
 * Fires on DOMContentLoaded because we need to wait for the DOM in the 
 * mute.html to be loaded before interacting with any of the content
 */
document.addEventListener('DOMContentLoaded', () => {
	getCurrentTab( (tab) => {

		var twitchContainer = document.getElementById('twitch-container');
  		var nonTwitchContainer = document.getElementById('non-twitch-container');

		if( tab.url !== 'https://go.twitch.tv/' ){
			twitchContainer.style.display 		= 'none';
			nonTwitchContainer.style.display 	= 'flex';
			setNonTwitchHTML();
	  	}else{
			nonTwitchContainer.style.display 	= 'none';
			twitchContainer.style.display 		= 'flex';
	  		setTwitchHTML();
	  	}
	});
});

function setTwitchHTML(){
  	tempMuteElem = document.getElementById('js-mute-temp');
  	permMuteElem = document.getElementById('js-mute-perm');

  	getMuteStatus( (response) => {
  		if( response.hasOwnProperty('twitchSettingsMuted') && response['twitchSettingsMuted'] ){
  			permMute = true;
  			tempMute = true;
  		}

  		updateHtmlElements();
  	});

  	tempMuteElem.addEventListener('click', () => {
  		toggleMuteStatus( true );
  	});

	permMuteElem.addEventListener('change', () => {
  		toggleMuteStatus( false );
  		saveMuteStatus();
  	});
}

function setNonTwitchHTML(){
	var twitchLink = document.getElementById('twitch-link');
	twitchLink.addEventListener('click', () => {
		getCurrentTab( (tab) => {
			chrome.tabs.update( tab.id, { url: 'https://go.twitch.tv/' } );
		});
	});
}

function getMuteStatus(callback){
	chrome.storage.sync.get( 'twitchSettingsMuted', (muted) => {
		callback( chrome.runtime.lastError ? null : muted );
	});
}

/**
 * The tempMute status doesn't persist through page refreshes. So, it needs
 * to be treated slightly differently.
 */
function toggleMuteStatus( temp ){
	var muteStatus;

	if( temp ){
		tempMute 	= ! tempMute;
		muteStatus 	= tempMute;
	}else{
		permMute 	= ! permMute;
		tempMute 	= permMute;
		muteStatus 	= permMute;
	}

	setMuteStatus( muteStatus, (response) => {
		updateHtmlElements();
	});
}

function setMuteStatus( mute, callback ){
	chrome.extension.sendMessage({ mute: mute }, function(response){
		callback({status: 'done'});
	});
}

function saveMuteStatus(){
	chrome.storage.sync.set({ 'twitchSettingsMuted' : permMute });
}

function updateHtmlElements(  ){
	if( tempMute ){
		tempMuteElem.innerText = "Temporarily Unmute";
		tempMuteElem.classList.remove('unmute');
		tempMuteElem.classList.add('mute');
	}else{
		tempMuteElem.innerText = "Temporarily Mute";
		tempMuteElem.classList.remove('mute');
		tempMuteElem.classList.add('unmute');
	}

	if( permMute ){
		permMuteElem.checked = true;
	}else{
		permMuteElem.checked = false;
	}
}

function getCurrentTab(callback) {
	var queryInfo = {
    	active: true,
    	currentWindow: true
  	};

  	chrome.tabs.query(queryInfo, (tabs) => {
    	var tab = tabs[0];

    	callback(tab);
  	});
}
