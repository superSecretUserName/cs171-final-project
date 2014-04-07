<?php
/**
 * Created by PhpStorm.
 * User: consensus
 * Date: 4/6/14
 * Time: 8:52 PM
 */



$handle = fopen('delimited.csv', 'r');
$headers = '';
// if we successfully opened the file
if ($handle) {
  // while we still have lines to read
  while (($buffer = fgets($handle)) !== false) {
    // note teh newline character (\n) in "ENDHEADERS"
    // if we find our "ENDHEADERS" line, we break from this loop
    if (strcmp($buffer, "ENDHEADERS\n") == 0) {
      break;
    }
    echo $buffer;
    echo "</br>";
    // building a string of all the headers
    $headers .= $buffer;
  }

  // create an array of our headers
  $headerArray = str_word_count($headers, 1, "_");

  var_dump($headerArray);

  // close our handle
  fclose($handle);
}



?>