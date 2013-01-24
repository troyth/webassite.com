<?php

// get the query parameters
$q = $_GET["q"];


// examine cases
switch ($q) {

  case 'time':
    print 'the time on the server is ' . time();
    break;
  
  case 'agent':
    print 'user agent was ' . $_SERVER['HTTP_USER_AGENT'];
    break;
  
  default:
    print 'invalid command, try either "time" or "agent"';
    exit;

}


?>
