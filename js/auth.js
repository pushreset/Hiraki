var Auth;
function InitAuth(){
	/*
	console.log('get url string');
	var base_url = 'http://www.flickr.com/services/oauth/request_token';
	var url = ConstructBaseString();
	console.log(url);
	
	console.log('encode string');
	var encoded_url_1 = OAuth.percentEncode('GET'+base_url);
	var encoded_url_2 = OAuth.percentEncode(url);
	var encoded_url = OAuth.percentEncode(encoded_url_1+encoded_url_2);
	console.log(encoded_url);
	
	console.log('encode string in sha1 (signature)');
	var signature = b64_hmac_sha1('8a15b7ca759b3d17', encoded_url);
	//var signature = (Crypto.SHA1(encoded_url)).encodeBase64();
	console.log(signature);
	
	console.log('request token url (url + signature)');
	var url_get_token = base_url+url + "&oauth_signature="+signature;
	console.log(url_get_token);
	
	console.log('get token');
	GetToken(url_get_token);
	*/
	
	Auth = new OAuth();
	
	
	
}



/*

http://www.flickr.com/services/oauth/request_token
?oauth_nonce=89601180
&oauth_timestamp=1305583298
&oauth_consumer_key=653e7a6ecc1d528c516cc8f92cf98611
&oauth_signature_method=HMAC-SHA1
&oauth_version=1.0
&oauth_callback=http%3A%2F%2Fwww.example.com


Consumer secret: 8a15b7ca759b3d17
Key = Consumer Secret + “&” + Token Secret


 */

function ConstructBaseString(){
	var string = '?oauth_nonce='+randomString();
	string = string + '&oauth_timestamp='+GetUnixTimeStamp();
	string = string + '&oauth_consumer_key=8c84c8f345dc08ab6196b3eb778d18ee';
	string = string + '&oauth_signature_method=HMAC-SHA1';
	string = string + '&oauth_version=1.0';
	string = string + '&oauth_callback=http%3A%2F%2Fhiraki.pushreset.fr';
	
	return string;
}

function GetUnixTimeStamp(){
	return Math.round((new Date()).getTime() / 1000);
}

function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

function GetToken(url){
	$.ajax({
		url: url,
		dataType: 'jsonp',
	    jsonp: false,
	    jsonpCallback: 'jsonFlickrApi',
		success: function(data){
		},
		complete: function(jqXHR, textStatus){
		},
		error: function(){
		},
		
	});
}


