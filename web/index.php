<?php

require 'Slim/Slim.php';

function loadClass($name) {
    $classes = array(
        'Config' => '../config/Config.php',
        'Error' => '../validation/Error.php',
        'Flash' => '../flash/Flash.php',
        'NotFoundException' => '../exception/NotFoundException.php',
        'TodoDao' => '../dao/TodoDao.php',
        'TodoMapper' => '../mapping/TodoMapper.php',
        'Todo' => '../model/Todo.php',
        'TodoSearchCriteria' => '../dao/TodoSearchCriteria.php',
        'TodoValidator' => '../validation/TodoValidator.php',
        'Utils' => '../util/Utils.php',
    );
    if (!array_key_exists($name, $classes)) {
        die('Class "' . $name . '" not found.');
    }
    require_once $classes[$name];
}

\Slim\Slim::registerAutoloader();
spl_autoload_register('loadClass');
session_start();

$app = new \Slim\Slim(array(
    'templates.path' => './',
        ));


$app->get('/', function() use ($app) {
    $errors = array();
    $flashes = null;
    require '../layout/index.phtml';
});




$app->run();
?>
