<?php
/**
 * Created by PhpStorm.
 * User: honey
 * Date: 02.05.2019
 * Time: 17:15
 */
ini_set('upload_max_filesize', '10M');
// Здесь нужно сделать все проверки передаваемых файлов и вывести ошибки если нужно

// Переменная ответа

$data = array();

if (isset($_GET['uploadfiles'])) {
    $error = false;
    $files = array();

    $uploaddir = 'uploads/'; // . - текущая папка где находится submit.php

    // Создадим папку если её нет

    if (!is_dir($uploaddir)) mkdir($uploaddir, 0777);

    // переместим файлы из временной директории в указанную
    foreach ($_FILES as $file) {
        if (move_uploaded_file($file['tmp_name'], $uploaddir . basename($file['name']))) {
            $files[] = realpath($uploaddir . $file['name']);
        } else {
            $error = true;
        }
    }
    /*foreach ($_FILES as $file) {

    $uploadfile = $uploaddir . basename($_FILES['userfile']['name']);
    }
    move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile);*/


    $data = $error ? array('error' => 'Ошибка загрузки файлов.'.($file['error'])) : array('files' => $files);

    echo json_encode($data);

    if (is_dir($uploaddir)) {
        if ($dh = opendir($uploaddir)) {
            while (($file = readdir($dh)) !== false) {
                if ((time() - filemtime($uploaddir.$file)) > strtotime('2 hours')) {
                    unlink($file);
                }
            }
            closedir($dh);
        }
    }

}
