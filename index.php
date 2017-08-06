<!DOCTYPE html>
<html>
  <head>
    <title>Karta</title>
    <meta charset="UTF-8">
    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 100%;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 90%;
        margin: 0;
        padding: 0;
      }
    </style>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
    <script src="loadgpx.js" type="text/javascript"></script>
    <script src="markerclusterer.js"></script>
    <script src="functions.js"></script>
  </head>
  <body>
    <div id="options">
        <input type="checkbox" name="trails" value="storulvan_blahammaren.gpx" id="storbla" onchange="refreshMap()">Storulvån - Blåhammar'n
        <input type="checkbox" name="trails" value="blahammaren_sylarna.gpx" id="blasyl" onchange="refreshMap()">Blåhammar'n - Sylarna
    </div>

    <div id="map" height="100%" width="100%"></div>

    <div id="form">
      <table>
      <tr><td>Titel:</td> <td><input type='text' id='name'/> </td> </tr>
      <tr><td>Beskrivning:</td> <td><input type='text' id='address'/> </td> </tr>
      <tr><td>Typ:</td> <td><select id='type'> +
                 <option value='rast' SELECTED>Rastplats</option>
                 <option value='vackert'>Fint</option>
                 <option value='problem'>Problem</option>
                 </select> </td></tr>
                 <tr><td></td><td><input type='button' value='Save' onclick='saveData()'/></td></tr>
      </table>
    </div>

    <div id="message">Location saved</div>

    <script>
      document.getElementById("form").style.display = "none";
      document.getElementById("message").style.display = "none";

      var map;
      var marker;
      var newinfowindow;
      var infoWindow;
      var messagewindow;
      var customLabel = {
        rast: {
          label: 'R',
          image: 'img/icon-rast.png'
        },
        problem: {
          label: '!',
          image: 'img/icon-prob.png'
        },
        vackert: {
          label: 'V',
          image: 'img/icon-vack.png'
        }
      };

    </script>

    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4J2RTh8Q-Ue81BZAYJ0g1KhaW6k74Owg&callback=initMap">
    </script>

  </body>
</html>
