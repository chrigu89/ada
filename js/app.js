'use strict';


var pushNotification;
var final_token;
var watchID = null;

var permanentStorage = window.localStorage;
var tempStorage = window.sessionStorage;

var push_values = 0;

var init = {
	initialize: function() {

		console.log('init.initialize');

		if (document.location.protocol == "file:") {
			// file protocol indicates phonegap
			document.addEventListener("deviceready", init.onDeviceReady, false);
		} else {
			// browser on localhost, no phonegap
			init.onDomReady();
		}
		
		
	},
	onDeviceReady: function() {
		
		console.log('init.onDeviceReady ❤ running on DEVICE');
		navigator.splashscreen.hide();
		init.run();

		document.addEventListener("online", onOnline, false);
		document.addEventListener("offline", onOffline, false);
		
	
		try 
		{ 
			pushNotification = window.plugins.pushNotification;
			
			//$("#app-status-ul").append('<li>registering ' + device.platform + '</li>');
			if (device.platform == 'android' || device.platform == 'Android' ||
					device.platform == 'amazon-fireos' ) {
					pushNotification.register(successHandler, errorHandler, {"senderID":"614620512453","ecb":"onNotification"});		// required!
					
			} else {
				pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
			}
		}
		catch(err) 
		{ 
			//txt="Es ist ein Fehler aufgetreten:\n"; 
			//txt+="" + err.message + "\n"; 
			//alert(txt); 
		} 
		
		//init.receivedEvent('deviceready');

        if (window.plugins.backgroundGeoLocation) {
            init.configureBackgroundGeoLocation();
        }

		window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, onFileSystemSuccess, onFail);  // TEMPORARY oder PERSISTENT
		


	},
	onDomReady: function() {
		console.log('init.onDomReady ❤ running on DESKTOP');
		init.run();
	},
	run: function() {
		console.log('init.run');
	},
	receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },	
	configureBackgroundGeoLocation: function() {
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		
		var bgGeo = window.plugins.backgroundGeoLocation;
	
		var callbackFn = function(location) {
			var token = window.localStorage.getItem("token");
			
			$.ajax({
				type: 'GET',
				url: 'http://ada-go.com/ios/api.php?rquest=set_device_geo',
				data:  { token: token, lat: location.latitude, long: location.longitude, save: 1 },
				crossDomain: true,
				cache: false,
				success: function(response) {
					// alert(token);
				}
			});
			bgGeo.finish();
			
			
		};
		
		var failureFn = function(error) {
			console.log('BackgroundGeoLocation error');
			console.log(error);
			bgGeo.finish();
		}
				
		bgGeo.configure(callbackFn, failureFn, {
			url: 'http://ada-go.com/ios/api.php?rquest=set_device_geo', // <-- Android ONLY: your server url to send locations to
			params: {
				token: window.localStorage.getItem("token"),
			},
			method: 'GET',
			autoSync: true,
			locationUpdateInterval: 5000,
			desiredAccuracy: 0,
			stationaryRadius: 50,
			distanceFilter: 50,		
			activityType: 'AutomotiveNavigation',
			debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
		});
		
		
		bgGeo.start(callbackFn, failureFn);
		
		//changePace(isMoving, callbackFn, failureFn);
	}


	
};

init.initialize();


// iOS
function onNotificationAPN (event) {
    if ( event.alert )
    {
		$("#app-status-ul").append('<li><a class="onclick_external" rel="'+event.link+'">' + event.alert.substring(0, 100) + '...</a></li>').delay(10000).fadeOut(500);
        //navigator.notification.alert(event.alert);
    }

    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}



// handle GCM notifications for Android
function onNotification(e) {
	
	switch( e.event )
	{
		case 'registered':
		if ( e.regid.length > 0 )
		{
			// Token für Android
			final_token = e.regid;
			console.log(final_token);
			window.localStorage.setItem("token", final_token);
				
			$.ajax({
				type: 'GET',
				url: 'http://ada-go.com/ios/api.php?rquest=set_device',
				data:  { os: 2, token: final_token },
				crossDomain: true,
				cache: false,
				success: function(response) {
					alert('antwort von set_device');
					
				}
			});
			
			
			
	
		}
		break;
		
		case 'message':
			if (e.foreground)
			{
				//$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
				// var my_media = new Media("/android_asset/www/"+ soundfile);
				// my_media.play();
			} else {
				if (e.coldstart) {
					//$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
				} else {
					//$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
				}
			}
			
			$("#app-status-ul").append('<li><a class="onclick_external" rel="'+e.payload.link+'">' + e.payload.title.substring(0, 30) + ': ' + e.payload.message.substring(0, 70) + '...</a></li>').delay(10000).fadeOut(500);
	
			
			setTimeout(function () { $('#app-status-ul').fadeOut('fast'); }, 7000);
		
			//alert(e.payload.title + ': ' + e.payload.message);
			
		break;
		
		case 'error':
			//$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
		break;
		
		default:
			//$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
		break;
	}
}



function tokenHandler (result) {
	// Token für iOS
	final_token = result;
	window.localStorage.setItem("token", final_token);
	$.ajax({
		type: 'GET',
		url: 'http://ada-go.com/ios/api.php?rquest=set_device',
		data:  { os: 1, token: final_token },
		crossDomain: true,
		cache: false,
		success: function(response) {
			
		}
	});
	

}

function successHandler (result) {
	//$("#app-status-ul").append('<li>success:'+ result +'</li>');
}

function errorHandler (error) {
	//$("#app-status-ul").append('<li>error:'+ error +'</li>');
}


// onSuccess GeoLocation
//
var onSuccess = function(position) {
	$('.gps').addClass('online');
    //$("#app-status-ul").append('<li>gps lat: '+ position.coords.latitude +'</li>');
    //$("#app-status-ul").append('<li>gps long: '+ position.coords.longitude +'</li>');
	
	var token = window.localStorage.getItem("token");
	/*if($('IFRAME').length==1) {
		var src = $('IFRAME').attr('src');
		$('IFRAME').attr('src',src+'action/coord/'+position.coords.latitude+'/'+position.coords.longitude+'/');
	}*/
	$.ajax({
		type: 'GET',
		url: 'http://ada-go.com/ios/api.php?rquest=set_device_geo',
		data:  { token: token, lat: position.coords.latitude, long: position.coords.longitude },
		crossDomain: true,
		cache: false,
		success: function(response) {
		}
	});
	
	return;
};


// onError Callback receives a PositionError object
//
function onError(error) {
    //alert('code: '    + error.code    + '\n' +
    //'message: ' + error.message + '\n');
}


function onOnline() {
	//console.warn('NETWORK: Device is now online');
}

function onOffline() {
	//console.warn('NETWORK: Device is now offline');
	if(activ==0){
		document.getElementById('offline').css('display', 'block');
	}
	
}

var onSettings = function() {
	var token = window.localStorage.getItem("token");
		
	$.ajax({
		type: 'GET',
		dataType: "json",
		url: 'http://ada-go.com/ios/api.php?rquest=get_user',
		data:  { token: token },
		crossDomain: true,
		cache: false,
		success: function(response) {
			var distance = response.distance;
			var status = response.status;
			var id = response.id;
			if(status == 1) {
				$('.status').addClass('on');
			} else {
				$('.status').addClass('off');
			}
			$('.distance select option[value='+distance+']').prop('selected', true);
			$('.distance select').css('display', 'block');
			
			$('.user_id').html(id);
			
			$('.category').addClass('off');
			
			var result = response.category.split(",");
			
			for (var i=0; i < result.length; i++) {
				var current = result[i];
				$('.category[data-id='+current+']').toggleClass('on off');
			}
			$('.loader_img').css("display", "none");
			
			
		}
	});

	return;
};

var pushs;
var onPush = function() {
	var token = window.localStorage.getItem("token");
	$.ajax({
		type: 'GET',
		dataType: "json",
		url: 'http://ada-go.com/ios/api.php?rquest=get_pushs',
		data:  { token: token },
		crossDomain: true,
		cache: false,
		success: function(response) {
			
			var pushs = response;
			var ausgabe = '<ul>';
			for (var i=0; i < pushs.length; i++) {
				var current = pushs[i];
				if(current.push_link != 0) {
					ausgabe += '<li><a class="onclick_external" rel="'+current.push_link+'"><strong>'+current.object_name+'</strong><br>'+current.push_title+'<br>'+current.push_text+'</a></li>';
				} else {
					ausgabe += '<li><strong>'+current.object_name+'</strong><br>'+current.push_title+'<br>'+current.push_text+'</li>';
				}
			}
			ausgabe += '<ul>';
			$('.loader_img').css("display", "none");
			$( "#pushs" ).html( ausgabe );
			onReady();
			
		}
	});

	return;
};

var changeDistance = function(distance) {
	var token = window.localStorage.getItem("token");
	
	$.ajax({
		type: 'GET',
		url: 'http://ada-go.com/ios/api.php?rquest=change_distance',
		data:  { token: token, distance: distance },
		crossDomain: true,
		cache: false,
		success: function(response) {	
			alert('Die Distanz wurde geändert');				
		}
	});

	return;
};

var changeStatus = function(status) {
	var token = window.localStorage.getItem("token");
	
	$.ajax({
		type: 'GET',
		url: 'http://ada-go.com/ios/api.php?rquest=change_status',
		data:  { token: token, status: status },
		crossDomain: true,
		cache: false,
		success: function(response) {
			alert('Der Status wurde geändert');			
		}
	});

	return;
};

var changeCategory = function(category) {
	var token = window.localStorage.getItem("token");
	$.ajax({
		type: 'GET',
		url: 'http://ada-go.com/ios/api.php?rquest=change_category',
		data:  { token: token, category: category },
		crossDomain: true,
		cache: false,
		success: function(response) {
			//alert('Der Status wurde geändert');
			$('.category[data-id='+category+']').toggleClass('on off');
		}
	});

	return;
};


$('.distance select').change(function(){
	var distance = $(this).val();
	changeDistance(distance);
});


$('.category').click(function(){
	
	if($(this).hasClass('off')) {
		changeCategory($(this).attr("data-id"));
	} else {
		changeCategory($(this).attr("data-id"));
	}
	
});

$('.status').click(function(){
	
	if($(this).hasClass('off')) {
		changeStatus(1);
		$(this).removeClass('off');
		$(this).addClass('on');
	} else {
		changeStatus(0);
		$(this).removeClass('on');
		$(this).addClass('off');
	}
	
});
