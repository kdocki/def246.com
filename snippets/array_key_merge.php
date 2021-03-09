<?php 

/**
 * Changes the keys of an array by merging the values from another array
 * WARNING: can alter first array passed into function
 * @return bool (if array has been changed)
 *
 * Example Usage:
 *   $ary1 = array('myBadKey' => 1, 2, 'foo' => bar);
 *   $ary2 = array('myBadKey' => 'myGoodKey', 0 => 'NonNumericKey');
 *   print_r($ary1);
 *   array_key_merge($ary1, $ary2);
 *   print_r($ary1);
 * 
 */

function array_key_merge(&$array1, $array2)
{
   $hasChanged = false;

   foreach($array1 as $key => $value)
   {
        if(array_key_exists($key, $array2))
        {
           $array1[$array2[$key]] = $array1[$key];
           unset($array1[$key]);
           $hasChanged = true;
        }
   }

   return $hasChanged;
}

?>