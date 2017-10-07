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