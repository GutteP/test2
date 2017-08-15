function loadGPXFileIntoGoogleMap(map, filename) {
    $.ajax({url: filename,
        dataType: "xml",
        success: function(data) {
          var parser = new GPXParser(data, map);
          parser.setTrackColour("#ff0000");     // Set the track line colour
          parser.setTrackWidth(5);          // Set the track line width
          parser.setMinTrackPointDelta(0.001);      // Set the minimum distance between track points
          // parser.centerAndZoom(data);
          parser.addTrackpointsToMap();         // Add the trackpoints
          parser.addRoutepointsToMap();         // Add the routepoints
          parser.addWaypointsToMap();           // Add the waypoints
        }
    });
}
function refreshMap()
{
  initMap();
}

function trails()
{
  if(document.getElementById("storbla").checked == true)
  {
    loadGPXFileIntoGoogleMap(map, "storulvan_blahammaren.gpx");
  }
  if(document.getElementById("blasyl").checked == true)
  {
    loadGPXFileIntoGoogleMap(map, "blahammaren_sylarna.gpx");
  }
  if(document.getElementById("sylstor").checked == true)
  {
    loadGPXFileIntoGoogleMap(map, "sylarna_storulvan.gpx");
  }
}
function markersURL()
{
  // downloadUrl2('get_markers.php', function(data) {

  // var url = 'save_markers.php?name=' + name + '&info=' + info +
  //           '&type=' + type + '&track=' + track + '&lat=' + latlng.lat() + '&lng=' + latlng.lng();

  // $tracks = array("1", "0");
  var tracks = '[';
  if(document.getElementById('storbla').checked == true)
  {
    tracks += '1,';
  }
  else
  {
    tracks += '0,';
  }
  if(document.getElementById('blasyl').checked == true)
  {
    tracks += '2,';
  }
  else
  {
    tracks += '0,';
  }
  if(document.getElementById('sylstor').checked == true)
  {
    tracks += '3';
  }
  else
  {
    tracks += '0';
  }
  tracks += ']';

  var markertypes = '[';
  if(document.getElementById('beauty').checked == true)
  {
    markertypes += '"vackert",';
  }
  else
  {
    markertypes += '"null",';
  }
  if(document.getElementById('pause').checked == true)
  {
    markertypes += '"rast",';
  }
  else
  {
    markertypes += '"null",';
  }
  if(document.getElementById('problem').checked == true)
  {
    markertypes += '"problem"';
  }
  else
  {
    markertypes += '"null"';
  }
  markertypes += ']';

  return 'get_markers.php?tracks=' + tracks + '&markertypes=' + markertypes;

  //http://localhost/test2/get_markers.php?tracks=[1,0,3]&markertypes=["vackert","null","rast"]

}



// google.maps.event.addListener(map, 'tilesloaded', tilesLoaded);
// function tilesLoaded() {
//     google.maps.event.clearListeners(map, 'tilesloaded');
//     google.maps.event.addListener(map, 'zoom_changed', saveMapState);
//     google.maps.event.addListener(map, 'dragend', saveMapState);
//     alert("EHJ");
// }

var mapZoom = 0;
var mapCentre = 0;
var mapLat = 0;
var mapLng = 0;

function saveMapState() {
    mapZoom = map.getZoom();
    mapCentre = map.getCenter();
    mapLat = mapCentre.lat();
    mapLng = mapCentre.lng();
}

function getLat()
{
  if(mapLat == 0)
  {
    mapLat = 63.294662;
  }
  return mapLat;
}
function getLng()
{

  if(mapLng == 0)
  {
    mapLng = 16.225308;
  }
  return mapLng;
}
function getZoom()
{

  if(mapZoom == 0)
  {
    mapZoom = 5;
  }
  return mapZoom;
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: getZoom(),
    mapTypeId: 'terrain',
    center: {lat: getLat(), lng: getLng()}
  });

  newinfowindow = new google.maps.InfoWindow({
    content: document.getElementById('form')
  })

  infoWindow = new google.maps.InfoWindow;

  messagewindow = new google.maps.InfoWindow({
    content: document.getElementById('message')
  });

  google.maps.event.addListener(map, 'click', function(event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      draggable:true,
      map: map
    });
    google.maps.event.addListener(marker, 'click', function() {
      newinfowindow.open(map, marker);
      document.getElementById("form").style.display = "block";
    });
  });
  trails();

  map.addListener('zoom_changed', function() {
            saveMapState();
          });
  map.addListener('dragend', function() {
            saveMapState();
          });

  var markerCluster = new MarkerClusterer(map, marker,  {imagePath: 'img/m'});

  // downloadUrl2('get_markers.php', function(data) {
  downloadUrl2(markersURL(), function(data) {
    var xml = data.responseXML;
    var markers = xml.documentElement.getElementsByTagName('marker');
    Array.prototype.forEach.call(markers, function(markerElem) {
      var id = markerElem.getAttribute('id');
      var name = markerElem.getAttribute('name');
      var info = markerElem.getAttribute('info');
      var type = markerElem.getAttribute('type');
      var point = new google.maps.LatLng(
          parseFloat(markerElem.getAttribute('lat')),
          parseFloat(markerElem.getAttribute('lng')));

      var infowincontent = document.createElement('div');
      var strong = document.createElement('strong');
      strong.textContent = name
      infowincontent.appendChild(strong);
      infowincontent.appendChild(document.createElement('br'));

      var text = document.createElement('text');
      text.textContent = info
      infowincontent.appendChild(text);
      // var image = 'img/icon-rast.png';
      var icon = customLabel[type] || {};
      var marker = new google.maps.Marker({
        map: map,
        position: point,
        label: icon.label,
        icon: icon.image
      });
      markerCluster.addMarker(marker);
      marker.addListener('mouseover', function() {
        infoWindow.setContent(infowincontent);
        infoWindow.open(map, marker);
      });
    });
  });
}

function saveData() {
  var name = escape(document.getElementById('name').value);
  var info = escape(document.getElementById('info').value);
  var type = document.getElementById('type').value;
  var track = document.getElementById('track').value;
  var latlng = marker.getPosition();
  var url = 'save_markers.php?name=' + name + '&info=' + info +
            '&type=' + type + '&track=' + track + '&lat=' + latlng.lat() + '&lng=' + latlng.lng();

  downloadUrl(url, function(data, responseCode) {
    newinfowindow.close();
    messagewindow.open(map, marker);
    document.getElementById("message").style.display = "block";
  });

}

function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
      new ActiveXObject('Microsoft.XMLHTTP') :
      new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request.responseText, request.status);
    }
  };

  request.open('GET', url, true);
  request.send(null);
}

function downloadUrl2(get_url, callback) {
  var request = window.ActiveXObject ?
      new ActiveXObject('Microsoft.XMLHTTP') :
      new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };

  request.open('GET', get_url, true);
  request.send(null);
}

function doNothing () {
}
