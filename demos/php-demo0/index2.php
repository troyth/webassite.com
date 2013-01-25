<!DOCTYPE html>
<?php 
  $name = "Leigha";
?>

<html>
  <head>
    <title>Test page</title>
    <link rel="stylesheet" href="http://www.webassite.com/demos/css-selectors/style.css">
  </head>
  <body>
    <h1>Hello World!</h1>
    <p class="first">Here is a sample website paragraph</p>
    <p class="second">Here is another sample website paragraph</p>
    <p>Here is yet another sample website paragraph</p>

    <?php echo '<p>A PHP paragraph with your name: ' . $name . " (you're welcome Leigha)</p>"; ?>

    <a href="http://google.com">Go to Google</a>
    <img src="http://www.webassite.com/demos/css-selectors/columbia_university.jpg" width="300">
  </body>
</html>