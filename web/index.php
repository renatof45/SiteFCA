<?php

require 'Slim/Slim.php';

require_once('../config_1/Config.php');
require_once('../validation/Error.php');
require_once('../flash/Flash.php');
require_once('../exception/NotFoundException.php');
require_once('../dao/DAO.php');
require_once('../dao/AutorizacaoDao.php');
require_once('../dao/UnidadesDao.php');
require_once('../dao/EncOleosDao.php');
require_once('../dao/firmaDao.php');
require_once('../dao/UtilizadorDao.php');
require_once('../dao/EquipamentoDao.php');
require_once('../dao/RelatorioDao.php');
require_once('../dao/PedidosTrabalhoDao.php');
require_once('../dao/ProcessoDao.php');
require_once('../mapping/EncOleosMapper.php');
require_once('../mapping/AutorizacaoMapper.php');
require_once('../mapping/PedidosTrabalhoMapper.php');
require_once('../mapping/UtilizadorMapper.php');
require_once('../model/Autorizacao.php');
require_once('../model/Utilizador.php');
require_once('../model/PedidosTrabalho.php');
require_once('../model/EncOleos.php');
require_once('../validation/AutorizacaoValidator.php');
require_once('../validation/UtilizadorValidator.php');
require_once('../validation/PedidosTrabalhoValidator.php');
require_once('../util/Utils.php');
require_once('../pdf/fpdf.php');
require_once('../php-ews/sendmail.php');

\Slim\Slim::registerAutoloader();
//spl_autoload_register('loadClass');
session_start();

$app = new \Slim\Slim(array(
            'templates.path' => './',
        ));


$app->get('/', function() use ($app) {
            $errors = array();
            $flashes = null;
            require '../layout/index.phtml';
        });


$app->post('/login',function() use ($app){
            require '../page/home.html';
});

$app->run();
?>
