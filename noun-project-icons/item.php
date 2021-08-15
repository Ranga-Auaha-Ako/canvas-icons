<?php
header('Content-type: image/svg+xml');
$color = $_GET["color"];
$SVGPath = $_SERVER['DOCUMENT_ROOT'] . strtok($_SERVER["REQUEST_URI"], '?');
// echo $SVGPath;
// echo "\n";
$SVG = file_get_contents($SVGPath);

// echo $SVG;
// echo "\n";
if ($color && trim($color, '0..9A..Fa..f') == '') {
    echo str_replace('#000000','#' . $color, $SVG);
} else {
    echo $SVG;
}
?>