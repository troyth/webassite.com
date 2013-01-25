<html>
  <head>
    <title>MYSQL TEST</title>
  </head>
  <body>


  <?php


// connect to the server
$link = mysql_connect('localhost', 'eventsstaging', 'gs@ppEVTST@G3')
    or die('Could not connect: ' . mysql_error()); // OR DIE!!!!



echo 'Connected successfully';


// grab the DB in question
mysql_select_db('events_staging') or die('Could not select database');

// run a query: select from <table>

$query = "SELECT * FROM node";

$result = mysql_query($query) or die('Query failed: ' . mysql_error());

// Printing results in HTML

echo "<table>\n";

while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
    echo "\t<tr>\n";
    foreach ($line as $col_value) {
        echo "\t\t<td>$col_value</td>\n";
    }
    echo "\t</tr>\n";
}

echo "</table>\n";

// free resultset
mysql_free_result($result);

// close connection
mysql_close($link);
?>





  ?>



  </body>
</html>