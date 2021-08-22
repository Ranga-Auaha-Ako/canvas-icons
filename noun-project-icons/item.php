<?php
header('Content-type: image/svg+xml');
$SVGPath = getcwd() . '/' . $_GET["id"];
$SVG = file_get_contents($SVGPath);
if (isset($_GET['color']) && trim($_GET["color"], '0..9A..Fa..f') == '') {
    $color = $_GET["color"];
    echo str_replace(array('#000000','black','rgb(0,0,0)','rgba(0,0,0,1)'),'#' . $color, $SVG);

} else {
    echo $SVG;
}
?>