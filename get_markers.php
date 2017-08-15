<?php
require("connect.php");

// $tracks = $_GET['tracks'];
$tracks = json_decode($_GET['tracks']);
$markertypes = json_decode($_GET['markertypes']);
// $tracks = array("1", "0",);

function parseToXML($htmlStr)
{
$xmlStr=str_replace('<','&lt;',$htmlStr);
$xmlStr=str_replace('>','&gt;',$xmlStr);
$xmlStr=str_replace('"','&quot;',$xmlStr);
$xmlStr=str_replace("'",'&#39;',$xmlStr);
$xmlStr=str_replace("&",'&amp;',$xmlStr);
return $xmlStr;
}

// Opens a connection to a MySQL server
$connection= new mysqli("localhost", $username, $password, $database);
if (!$connection) {
  die('Not connected : ' . mysql_error());
}

// Select all the rows in the markers table
$query = "SELECT * FROM markers where 1";
$result = $connection->query($query);
if (!$result) {
  die('Invalid query: ' . mysql_error());
}

header("Content-type: text/xml; charset=utf-8");
// Start XML file, echo parent node
echo "<markers>";

  while($row = $result->fetch_assoc())
      {
        if(in_array($row["track"], $tracks))
        {
          if(in_array($row["type"], $markertypes))
          {
            // Add to XML document node
            echo "<marker ";
            echo "id='" . $row["id"] . "' ";
            echo "name='" . utf8_encode(parseToXML($row["name"])) . "' ";
            echo "info='" . utf8_encode(parseToXML($row["info"])) . "' ";
            echo "lat='" . $row["lat"] . "' ";
            echo "lng='" . $row["lng"] . "' ";
            echo "type='" . $row["type"] . "' ";
            echo "/>";
          }
        }

      }

// End XML file
echo "</markers>";


?>
