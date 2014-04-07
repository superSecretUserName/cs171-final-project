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
 * is the same. It should also be flexible enough that we can add additional columns
 * and the script should still run!
 *
 * HORAY!
 *
 */


// open our data file
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
      // stop processing since we are done with headers
      break;
    }
    // building a string of all the headers
    $headers .= $buffer;
  }

  // create an array of our headers. Allow _ in words.
  $headerArray = str_word_count($headers, 1, "_");


  // continue processing after the headers
  while (($buffer = fgets($handle))  !== false) {
    // ignore any lines that are just a new line character
    if ($buffer === "\n") {
      continue;
    }
    // break our current line into elements in an array, delimited on $&
    $bufferArray = explode('$&', $buffer);

    // go through each item in this line
    foreach($bufferArray as $value) {
      // if it's not just a blank line
      if ($value != "\n" && $value != "\t" && $value != "\r" ) {
        // remove unnecessary whitespace
        $value = trim($value, " ");
        // remove any special characters
        $value = trim($value, "\x00..\x1F");
        // if it's longer than 0 length
        if (strlen($value) > 0) {
          // push it onto our values array
          $values[] = $value;
        }
      }
    }

  }
  // loop through all our data
  for($i = 0; $i < count($values); $i++) {
    // at the end of each record
    if ($i % count($headerArray) == 0) {
      // insert some padding
      echo "</br><hr></br>";
    }
    // output: column_name + : + value
    echo $headerArray[$i % count($headerArray)] . ": " .$values[$i] . "</br>";
  }

  // close our handle
  fclose($handle);

}



