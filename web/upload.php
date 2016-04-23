<?php

$target_dir = "userfiles/";
$target_file = $target_dir . basename($_FILES["upload"]["name"]);
$uploadOk = 1;


// Check if $uploadOk is set to 0 by an error
if ($uploadOk != 0) {
    if (move_uploaded_file($_FILES["upload"]["tmp_name"], $target_file)) {
        echo ('{"uploaded": 1,"fileName":"' . basename($_FILES["upload"]["name"]) . '","url": "' . $target_file . '"}');
    } else {
        echo ('{"uploaded": 0,"error": {"message": "Sorry, there was an error uploading your file."}');
    }
}
?>

