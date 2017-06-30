App={
	socket: null,
     	defaultTok: 1, 
     	defaultNumNulls: 20,
	tok : this.defaultTok,
         people : [], 
         defaultPerson : -1,
         images : [],
         training : false,
          numNulls: null, 
          sentTimes:null, 
          receivedTimes: null,
     	socketName: '',	
 createSocket: function (address, name) {
    //address="ws://openface-ws.cloudapps.demo.com";
    this.socket = new WebSocket(address);
    this.socketName = name;
    this.socket.binaryType = "arraybuffer";
    this.socket.onopen = function() {
        $("#serverStatus").html("Connected to " + name);
        this.sentTimes = [];
        this.receivedTimes = [];
        this.tok = this.defaultTok;
        this.numNulls = 0

        this.send(JSON.stringify({'type': 'NULL'}));
        this.sentTimes.push(new Date());
    }  
},

	init: function() {
		console.log("init");
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;	

		if (navigator.getUserMedia) {     
	    		navigator.getUserMedia({video: true}, this.Media.handleVideo, this.Media.videoError);
		}	
	},
	connect:function() {
		console.log('connect');
		this.createSocket("wss://192.168.223.196:9000", "Local");
/*		var socket = new WebSocket("wss://192.168.223.196:9000");
		    socket.binaryType = "arraybuffer";
		    socket.onopen = function() {
		    console.log('connected to openface');		        
		    }		
*/
	},

	Media: {
		handleVideo: function(stream) {
			console.log("handleVideo");
			var v=$('#vid');
			var vidSource=window.URL.createObjectURL(stream);
			console.log(vidSource);
		    	v.attr('src', vidSource);
		},
		videoError:function(e) {
			console.log('error '+e);
		},
		captureVideo: function() {
			console.log("snap!");
			var c=document.getElementById('vidcap');
			var video=document.getElementById("vid");	
			var i=$('#localImg');
			c.getContext("2d").drawImage(video, 0, 0, 150,100);
			//var img = c.toDataURL("image/png");
			var img = c.toDataURL("image/jpeg", 0.6);
			//canvas.toDataURL('image/jpeg', 0.6);
			i.attr('src',img);					
		},
		dataURItoBlob:function(dataURI) {
		    // convert base64/URLEncoded data component to raw binary data held in a string
		    var byteString;
		    if (dataURI.split(',')[0].indexOf('base64') >= 0)
		        byteString = atob(dataURI.split(',')[1]);
		    else
		        byteString = unescape(dataURI.split(',')[1]);

		    // separate out the mime component
		    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		    // write the bytes of the string to a typed array
		    var ia = new Uint8Array(byteString.length);
		    for (var i = 0; i < byteString.length; i++) {
		        ia[i] = byteString.charCodeAt(i);
		    }

		    return new Blob([ia], {type:mimeString});			
		}

	}	
};
