<?php
/**
 * Created by PhpStorm.
 * User: consensus
 * Date: 4/6/14
 * Time: 8:52 PM
 *
 * This file works on the delimited.csv file katy provided.
 * In order for this to work, I removed all the ------------------ in the file
 * and added one line that reads "ENDHEADERS" on it's own line anywhere
 * after the headers, but before the column/row data.
 * I also removed the line "(25 rows affected)"
 *
 * This should work for the entire dataset, given that the format
 * is the same.
 *
 */



$handle = fopen('delimited.csv', 'r');
$headers = '';
$values = array();
// if we successfully opened the file
if ($handle) {
  // while we still have lines to read
  while (($buffer = fgets($handle)) !== false) {
    // note teh newline character (\n) in "ENDHEADERS"
    // if we find our "ENDHEADERS" line, we break from this loop
    if (strcmp($buffer, "ENDHEADERS\n") == 0) {
      break;
    }
    // building a string of all the headers
    $headers .= $buffer;
  }

  // create an array of our headers
  $headerArray = str_word_count($headers, 1, "_");

//  var_dump($headerArray);



  while (($buffer = fgets($handle))  !== false) {
    if ($buffer === "\n") {
      continue;
    }

    $bufferArray = explode('$&', $buffer);


    foreach($bufferArray as $value) {
      if ($value != "\n" && $value != "\t" && $value != "\r" ) {
        $value = trim($value, " ");
        $value = trim($value, "\x00..\x1F");
        if (strlen($value) > 0) {
          $values[] = $value;
        }
      }
    }

  }

  for($i = 0; $i < count($values); $i++) {
    if ($i % 14 == 0) {
      echo "</br></br></br>";
    }
    echo $headerArray[$i % 14] . ": " .$values[$i] . "</br>";
  }

//  var_dump($values);
  // close our handle
  fclose($handle);

}



?>