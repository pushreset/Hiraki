var api_key = '8c84c8f345dc08ab6196b3eb778d18ee';
var $_preview;
var $_preview_img;
var $_modal;
var $_modal_img;
var mouseX;
var mouseY;
var previewLoadTimeOut;
var previewShowTimeOut;
var photos_by_request = 10;
var modal;
var photosPool = {};
var currentUser;

$(document).ready(function() {
	
	$_modal = $('#modal_content');
	$_modal_img = $_modal.find('.photo img');
	
	$('.thumbnail').live('mouseenter', function(e){
		ActivePreview($(this));		
	});
	
	$('.thumbnail').live('mouseleave', function(){
		//console.log('mouseleave');
		ClearTimeOuts();	
		if($_preview.is(':visible')){	
			$_preview_img.attr('src', '');
			$_preview.hide();	
		}
	});
	
	/*$('body').mousemove(function(e){
		//console.log('hover');
		//$_preview.css({left: e.pageX, top: e.pageY});
		//console.log("left: "+ e.pageX +" top: "+ e.pageY);
		//mouseX = e.pageX;
		//mouseY = e.pageY;
	})*/
	
	$('.preview, .thumbnail').live('click', function(){	
		ClearTimeOuts();
		var photo = photosPool[$(this).data('id')];
		var url = GetPhotoUrl(photo, 'z');
		
		var page_link = GetPhotoPageUrl(photo);
		$_modal.find('.photo_link a').attr('href', page_link);
		
		GetUserInfos(photo.owner, ConstructModalUserInfos);
	
		jQuery.doWhen(
			function(){
		  		return $_modal_img.attr('src', url);
			},
			function(){
				$_modal.imagesLoaded(function() {
					modal = $.openDOMWindow({
						windowSourceID:'#modal',
						height: '', 
						width:  '',
						positionType:'centered',
						functionCallOnOpen: function(){
							$('body').scroll();
						},
						functionCallOnClose: function(){
							ResetModalContent();
						},
						windowBGColor: '#161616',
						borderColor:'#202b30',
						borderSize:'2',
						
						//positionLeft: '50%',
						//positionTop: '50%'
					});
				});
			});
		
		
	key('right', function(){
		var previewActive = $('.preview:visible');
		var index = previewActive.parent('.thumbnail').index();
		previewActive.hide();
		$('.preview').eq(index+1).trigger('mouseenter')
	});	
		
		
		
	});
	
	
	
	
	GetMostInteresting();
});

function GetMostInteresting(){
	var params = {
			method: 'flickr.interestingness.getList',
			api_key: api_key,
			format: 'json',
			per_page: photos_by_request
		};
	
	$.ajax({
		url: "http://api.flickr.com/services/rest/",
		data: params,
		dataType: 'jsonp',
	    jsonp: false,
	    jsonpCallback: 'jsonFlickrApi',
		success: function(data){
			//console.log('success');
			console.log(data);
			ConstructThumbails(data.photos.photo);
		},
		complete: function(jqXHR, textStatus){
			//console.log('complete');
			//console.log('jqXHR : ');
			//console.log(jqXHR);
			//console.log('textStatus : ');
			//console.log(textStatus);
			//console.log(data);
		}
		
	});	
}

function GetUserInfos(user_id, callback){
	var params = {
		method: 'flickr.people.getInfo',
		api_key: api_key,
		format: 'json',
		user_id: user_id
	};
	
	$.ajax({
		url: "http://api.flickr.com/services/rest/",
		data: params,
		dataType: 'jsonp',
	    jsonp: false,
	    jsonpCallback: 'jsonFlickrApi',
		success: function(data){
			currentUser = data.person;			
			if(callback && typeof (callback) === "function") {
				callback();
			}
		},
		complete: function(jqXHR, textStatus){
		},
		error: function(){
		},
		
	});
	
}

function ConstructThumbails(photos){
	$.each(photos, function(index, photo){
		//console.log(photo);
		photosPool[photo.id] = photo;
		
		var thumb_url = GetPhotoUrl(photo, 's');
		var small_url = GetPhotoUrl(photo, 'm');
		//console.log(small_url);
		InsertThumbnail(thumb_url, small_url, photo.id, photo.title);
	});
}


//http://www.flickr.com/photos/{user-id}/{photo-id}
function GetPhotoPage(user_id, photo_id){
	return "http://www.flickr.com/photos/"+id+"/"+photo_id;
}

// http://www.flickr.com/photos/{user-id}/{photo-id}
function GetPhotoPageUrl(photo){
	return "http://www.flickr.com/photos/"+photo.owner+"/"+photo.id;
}

// http://farm{icon-farm}.static.flickr.com/{icon-server}/buddyicons/{nsid}.jpg
// http://www.flickr.com/images/buddyicon.jpg
function GetAvatarUrl(user_id, farm, server){
	if(user_id != '' && farm != '' & server != '')
		return "http://farm"+farm+".static.flickr.com/"+server+"/buddyicons/"+user_id+".jpg";
	else
		return "http://www.flickr.com/images/buddyicon.jpg";
}

// http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)
// s	small square 75x75
// t	thumbnail, 100 on longest side
// m	small, 240 on longest side
// -	medium, 500 on longest side
// z	medium 640, 640 on longest side
// b	large, 1024 on longest side*
// o	original image, either a jpg, gif or png, depending on source format
function GetPhotoUrl(photo, size){
	return "http://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_"+size+".jpg";
}
function InsertThumbnail(thumb_url, preview_url, photo_id, title){
	var html = '<div class="thumbnail" data-id="'+photo_id+'"><img class="thumb" data-id="'+photo_id+'" src="'+thumb_url+'" data-preview="'+preview_url+'" /><div style="display:none;" class="preview" data-id="'+photo_id+'"><img data-id="'+photo_id+'" class="preview_img" src="" />';
	
	if(title != '')
		html = html+'<div class="layer_info"><span>'+title+'</span></div>';
	
	html = html+'</div></div>';
	
	$('#explorer').append(html);
}


function ClearTimeOuts(){
	window.clearTimeout(previewLoadTimeOut);
	window.clearTimeout(previewShowTimeOut);
}

function ActivePreview(element){
	$('.thumbnail').css('z-index', 2);
	element.css('z-index', 3);
		
	var img 		= element.find('.thumb');
	var url_preview = img.data('preview');
	$_preview		= element.find('.preview');
	$_preview_img 	= $_preview.find('.preview_img');
		
	previewLoadTimeOut = window.setTimeout(function(){		
		$_preview_img.attr('src', url_preview);			
		previewShowTimeOut = window.setTimeout(function(){
			$_preview.fadeIn('fast');
		}, 200);		
	}, 300);
}

function ConstructModalUserInfos(){
	console.log(currentUser);
	
	var avatar_url = GetAvatarUrl(currentUser.id, currentUser.iconfarm, currentUser.iconserver);
	
	$_modal.find('.avatar img').attr('src', avatar_url);
}

function ResetModalContent(){
	$_modal.find('.avatar img').attr('src', '');
	$_modal_img.attr('src', '');
}

