<html>
  <head>
    <title>PHP demo</title>
  </head>
  <body>

    <?php
      // php can be added inline if it stays within the preset tags

      print 'php output';


      // make a list
      print '<ul>';
      $i = 0;

      while ($i < 100) {

        print '<li>output string # ' . $i . ' ' . make_random_string(10);

        $i++;
      }
      print '</ul>'; // close the list



      function make_random_string($length) {

        $min = 65;
        $max = 90;
        $string = '';
        $j = 0;
        while ($j < $length) {
          $string .= chr(rand($min, $max));
          $j++;
        }
        return $string;
      }


    ?>





  </body>
</html>