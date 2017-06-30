/*
Copyright 2015-2016 Carnegie Mellon University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

window.URL = window.URL ||
    window.webkitURL ||
    window.msURL ||
    window.mozURL;

// http://stackoverflow.com/questions/6524288
$.fn.pressEnter = function(fn) {

    return this.each(function() {
        $(this).bind('enterPress', fn);
        $(this).keyup(function(e){
            if(e.keyCode == 13)
            {
              $(this).trigger("enterPress");
            }
        })
    });
 };

function registerHbarsHelpers() {
    // http://stackoverflow.com/questions/8853396
    Handlebars.registerHelper('ifEq', function(v1, v2, options) {
        if(v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
}
 
 function sendFrameLoop() {
    //console.log("sending Frame loop");
    if (socket == null || socket.readyState != socket.OPEN ||
        !vidReady || numNulls != defaultNumNulls) {
        return;
    }

    if (tok > 0) {
        var canvas = document.createElement('canvas');
        canvas.width = vid.width;
        canvas.height = vid.height;
        var cc = canvas.getContext('2d');
        cc.drawImage(vid, 0, 0, vid.width, vid.height);
        var apx = cc.getImageData(0, 0, vid.width, vid.height);

        var dataURL = canvas.toDataURL('image/jpeg', 0.6)
        //console.log(tok+'  '+training+ ' '+people[people.length-1]);
        var dataStore=DataUtil.dataStore;
        var durl0=dataStore["ws"];
        if (people[people.length-1]=='ws') {
            //durl=durl0
             if (training && durl0.length > 0) {
                //console.log(durl0.length);
                dataURL=durl0[durl0.length-1];
                durl0.pop();
                if (durl0.length==0) {
                     $("#trainingChk").bootstrapToggle('off');
                 }
            }             
        }
         if (people[people.length-1]=='dy') {
        var durl1=dataStore["dy"];            
             if (training && durl1.length > 0) {
                //console.log(durl1.length);
                dataURL=durl1[durl1.length-1];
                durl1.pop();
                if (durl1.length==0) {
                     $("#trainingChk").bootstrapToggle('off');
                 }
            }               
        }

         if (people[people.length-1]=='dt') {
        var durl2=dataStore["dt"];            
             if (training && durl2.length > 0) {
                //console.log(durl1.length);
                dataURL=durl2[durl2.length-1];
                durl2.pop();
                if (durl2.length==0) {
                     $("#trainingChk").bootstrapToggle('off');
                 }
            }               
        }

         if (people[people.length-1]=='ew') {
        var durl2=dataStore["ew"];            
             if (training && durl2.length > 0) {
                //console.log(durl1.length);
                dataURL=durl2[durl2.length-1];
                durl2.pop();
                if (durl2.length==0) {
                     $("#trainingChk").bootstrapToggle('off');
                 }
            }               
        }


        //console.log(dataURL);
/*        if ($("#trainingChk").prop('checked')) {
            var d="<div>'"+dataURL+"',</div>";
            $("#dataURL").html($("#dataURL").html()+d);
        }
*/        var msg = {
            'type': 'FRAME',
            'dataURL': dataURL,
            'identity': defaultPerson
        }
        socket.send(JSON.stringify(msg));
        tok--;
    }
    setTimeout(function() {requestAnimFrame(sendFrameLoop)}, 250);
}


function getPeopleInfoHtml() {
    var info = {'-1': 0};
    var len = people.length;
    for (var i = 0; i < len; i++) {
        info[i] = 0;
    }

    var len = images.length;
    for (var i = 0; i < len; i++) {
        id = images[i].identity;
        info[id] += 1;
    }

    var h = "<li><b>Unknown:</b> "+info['-1']+"</li>";
    var len = people.length;
    for (var i = 0; i < len; i++) {
        h += "<li><b>"+people[i]+":</b> "+info[i]+"</li>";
    }
    return h;
}

function redrawPeople() {
    var context = {people: people, images: images};
    //hide display
    //$("#peopleTable").html(peopleTableTmpl(context));
    //console.log($("#peopleTable").html());
    var context = {people: people};
    $("#defaultPersonDropdown").html(defaultPersonTmpl(context));

    $("#peopleInfo").html(getPeopleInfoHtml());

}

function getDataURLFromRGB(rgb) {
    var rgbLen = rgb.length;

    var canvas = $('<canvas/>').width(96).height(96)[0];
    var ctx = canvas.getContext("2d");
    var imageData = ctx.createImageData(96, 96);
    var data = imageData.data;
    var dLen = data.length;
    var i = 0, t = 0;

    for (; i < dLen; i +=4) {
        data[i] = rgb[t+2];
        data[i+1] = rgb[t+1];
        data[i+2] = rgb[t];
        data[i+3] = 255;
        t += 3;
    }
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL("image/png");
}

function updateRTT() {
    //console.log("**** updateRTT "+   socketName);
    var diffs = [];
    for (var i = 5; i < defaultNumNulls; i++) {
        diffs.push(receivedTimes[i] - sentTimes[i]);
    }
    $("#rtt-"+socketName).html(
        jStat.mean(diffs).toFixed(2) + " ms (σ = " +
            jStat.stdev(diffs).toFixed(2) + ")"
    );
}

function sendState() {
    var msg = {
        'type': 'ALL_STATE',
        'images': images,
        'people': people,
        'training': training
    };
    socket.send(JSON.stringify(msg));
}

function createSocket(address, name) {
    socket = new WebSocket(address);
    socketName = name;
    socket.binaryType = "arraybuffer";
    socket.onopen = function() {
        $("#serverStatus").html("Connected to " + name);
        sentTimes = [];
        receivedTimes = [];
        tok = defaultTok;
        numNulls = 0

        socket.send(JSON.stringify({'type': 'NULL'}));
        sentTimes.push(new Date());
    }
    socket.onmessage = function(e) {
        //console.log(e);
        var j = JSON.parse(e.data);
        //console.log('*********'+j.type);
        if (j.type == "NULL") {
        receivedTimes.push(new Date());
            numNulls++;
          //          console.log('****************************'+numNulls+' , '+defaultNumNulls);
            if (numNulls == defaultNumNulls) {
            //    console.log('**************************** inside loop');
                updateRTT();
                sendState();
                sendFrameLoop();
            } else {
                socket.send(JSON.stringify({'type': 'NULL'}));
                     sentTimes.push(new Date());
            }
        } else if (j.type == "PROCESSED") {
            tok++;
        } else if (j.type == "NEW_IMAGE") {
            images.push({
                hash: j.hash,
                identity: j.identity,
                image: getDataURLFromRGB(j.content),
                representation: j.representation
            });

            redrawPeople();
        } else if (j.type == "IDENTITIES") {
            var h = "Last updated: " + (new Date()).toTimeString();
            h += "<ul>";
            var len = j.identities.length
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var identity = "Unknown";
                    var idIdx = j.identities[i];
                    console.log("--------------ID:"+idIdx+" defaultPerson:"+defaultPerson);
                    if (idIdx != -1) {
                        identity = people[idIdx];
                        console.log("*******************FOUND "+identity)
                        getUserInfo(identity);
                        getAddressInfo();
                    }
                    h += "<li>" + identity + "</li>";
                }
            } else {
                h += "<li>Nobody detected.</li>";
                $('#userInfo').html('Nobody Detected');
                $('#locationInfo').html('Nobody Detected');

            }
            h += "</ul>"
            $("#peopleInVideo").html(h);
        } else if (j.type == "ANNOTATED") {
            $("#detectedFaces").html(
                "<img src='" + j['content'] + "' width='430px'></img>"
            )
        } else if (j.type == "TSNE_DATA") {
            BootstrapDialog.show({
                message: "<img src='" + j['content'] + "' width='100%'></img>"
            });
        } else {
            console.log("Unrecognized message type: " + j.type);
        }
    }
    socket.onerror = function(e) {
        console.log("Error creating WebSocket connection to " + address);
        console.log(e);
    }
    socket.onclose = function(e) {
        if (e.target == socket) {
            $("#serverStatus").html("Disconnected.");
        }
    }
}

function umSuccess(stream) {
    if (vid.mozCaptureStream) {
        vid.mozSrcObject = stream;
    } else {
        vid.src = (window.URL && window.URL.createObjectURL(stream)) ||
            stream;
    }
    vid.play();
    vidReady = true;
    sendFrameLoop();
}

function addPersonCallback(el) {
    defaultPerson = people.length;
    var newPerson = $("#addPersonTxt").val();
    if (newPerson == "") return;
    people.push(newPerson);
    $("#addPersonTxt").val("");

    if (socket != null) {
        var msg = {
            'type': 'ADD_PERSON',
            'val': newPerson
        };
        socket.send(JSON.stringify(msg));
    }
    redrawPeople();
}

function trainingChkCallback() {
    training = $("#trainingChk").prop('checked');
    if (training) {
        makeTabActive("tab-preview");
    } else {
        makeTabActive("tab-annotated");
    }
    if (socket != null) {
        var msg = {
            'type': 'TRAINING',
            'val': training
        };
        socket.send(JSON.stringify(msg));
    }
}

function viewTSNECallback(el) {
    if (socket != null) {
        var msg = {
            'type': 'REQ_TSNE',
            'people': people
        };
        socket.send(JSON.stringify(msg));
    }
}

function findImageByHash(hash) {
    var imgIdx = 0;
    var len = images.length;
    for (imgIdx = 0; imgIdx < len; imgIdx++) {
        if (images[imgIdx].hash == hash) {
            console.log("  + Image found.");
            return imgIdx;
        }
    }
    return -1;
}

function updateIdentity(hash, idx) {
    var imgIdx = findImageByHash(hash);
    if (imgIdx >= 0) {
        images[imgIdx].identity = idx;
        var msg = {
            'type': 'UPDATE_IDENTITY',
            'hash': hash,
            'idx': idx
        };
        // console.log(Object.keys(socket));
        socket.send(JSON.stringify(msg));
    }
}

function removeImage(hash) {
    console.log("Removing " + hash);
    var imgIdx = findImageByHash(hash);
    if (imgIdx >= 0) {
        images.splice(imgIdx, 1);
        redrawPeople();
        var msg = {
            'type': 'REMOVE_IMAGE',
            'hash': hash
        };
        socket.send(JSON.stringify(msg));
    }
}

function changeServerCallback() {

    $(this).addClass("active").siblings().removeClass("active");
    switch ($(this).html()) {
    case "Local":
        socket.close();
        redrawPeople();
//        createSocket("ws:" + window.location.hostname + ":9000", "Local");
        var wsocket=WEBSOCKET_ENDPOINT || "wss://openface-ws.cloudapps.demo.com";
        createSocket( wsocket, "Local");
          // createSocket("wss://192.168.223.196:9000", "Local");
        break;
    default:
        alert("Unrecognized server: " + $(this.html()));
    }
}

function getAddressInfo() {
    //console.log('----------------------------'+marker.getPosition().lat());
    var coord= {
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
    };
  //var url ="https://192.168.223.130:3002/address";
var url= ADDRESS_SERVICE || "https://addresssvc-demo.cloudapps.demo.com/address";
  $.ajax({
    url:url,  
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With, Session'        
    },
    type: 'POST',
    dataType: 'text',
    data: JSON.stringify(coord),
contentType: "application/json",
crossDomain:true,    
    success:function(data) {
        var display='';
console.log('----------------------------'+Object.keys(JSON.parse(data)));
      $('#locationInfo').html("<b>"+JSON.parse(data).formatted_address+"</b>");
    },//success
    error: function(e) {
        console.log("error" + e.responseText);

    }
  });//ajax    
}

function getUserInfo(uid) {
//var url ="https://192.168.223.130:3001/users";

var url=  USER_SERVICE || "https://usersvc-demo.cloudapps.demo.com/users";
    console.log(url);
  $.ajax({
    url:url+"/"+uid,  
    cache: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With, Session'        
    },
contentType: "json",
crossDomain:true,    
    success:function(data) {
      $('#userInfo').html(Object.keys(data).map(k => "<div><b>"+k +": " +data[k]+"</b></div>"));
    }//success
  });//ajax

}
