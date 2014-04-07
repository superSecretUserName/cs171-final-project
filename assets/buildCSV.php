<?php
/**
 * Created by PhpStorm.
 * User: consensus
 * Date: 4/6/14
 * Time: 8:52 PM
 */



$handle = fopen('delimited.csv', 'r');

if ($handle) {
  while (($buffer = fgets($handle)) !== false) {
    echo $buffer;
    echo "</br>";
  }
  fclose($handle);
}




?>