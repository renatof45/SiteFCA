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

function error_field($title, array $errors) {
    foreach ($errors as $error) {
        /* @var $error Error */
        if ($error->getSource() == $title) {
            return ' error-field';
        }
    }
    return '';
}

function checkLogIn() {
    if (!array_key_exists('user', $_SESSION)) {
        $app = \Slim\Slim::getInstance();
        $app->redirect('/home');
    }
}

$app = new \Slim\Slim(array(
    'templates.path' => './',
        ));


$app->get('/', 'checkLogIn', function() use ($app) {
    $errors = array();
    $flashes = null;
    require '../layout/index.phtml';
});


$app->post('/login', function() use ($app) {
    $errors = array();
    if (array_key_exists('sub', $_POST)) {

        if ($_POST['numero'] == '' || !is_numeric($_POST['numero'])) {

            $app->redirect('/index.php?error');
        } else {
            $dao = new UtilizadorDao();
            $user = $dao->getUser($_POST['numero']);
            //print_r($user);
            if (array_key_exists('id', $user)) {
                if (($user['id'] == intval($_POST['numero']) && $user['pass'] == $_POST['pass'])) {
                    reset($user['area']);
                    $_SESSION['area'] = key($user['area']);
                    $_SESSION['user'] = $_POST['numero'];
                    $_SESSION['user_name'] = $user['nome'];
                    $relatoriodao = new RelatorioDao();
                    if ($user['tipo'] == 2) {
                        date_default_timezone_set('Europe/Lisbon');
                        $hora = date("H:i:s");
                        if ($hora > "06:00:00" && $hora < "14:00:00") {
                            if ($hora > "00:00:00") {
                                $relatorio = $relatoriodao->isShiftOpen(date('Y-m-d'), 1);
                                if ($relatorio) {
                                    $_SESSION['relatorio'] = $relatorio;
                                } else {
                                    $relatorio = $relatoriodao->insert(1, date('Y-m-d'));
                                    $_SESSION['relatorio'] = $relatorio;
                                }
                            }
                            $_SESSION['turno'] = 1;
                        } else if ($hora > "14:00:00" && $hora < "22:00:00") {
                            if ($hora > "00:00:00") {
                                $relatorio = $relatoriodao->isShiftOpen(date('Y-m-d'), 2);
                                if ($relatorio) {
                                    $_SESSION['relatorio'] = $relatorio;
                                } else {
                                    $relatorio = $relatoriodao->insert(2, date('Y-m-d'));
                                    $_SESSION['relatorio'] = $relatorio;
                                }
                            }

                            $_SESSION['turno'] = 2;
                        } else {
                            if ($hora > "22:00:00") {
                                $relatorio = $relatoriodao->isShiftOpen(date('Y-m-d'), 3);
                                if ($relatorio) {
                                    $_SESSION['relatorio'] = $relatorio;
                                } else {
                                    $relatorio = $relatoriodao->insert(3, date('Y-m-d'));
                                    $_SESSION['relatorio'] = $relatorio;
                                }
                            } else {
                                $relatorio = $relatoriodao->isShiftOpen(date('Y-m-d', (strtotime('-1 day'))), 3);
                                if ($relatorio) {
                                    $_SESSION['relatorio'] = $relatorio;
                                } else {
                                    $relatorio = $relatoriodao->insert(3, date('Y-m-d', (strtotime('-1 day'))));
                                    $_SESSION['relatorio'] = $relatorio;
                                }
                            }
                            $_SESSION['turno'] = 3;
                        }
                        //echo $_SESSION['turno'];
                        require '../layout/layout.phtml';
                    } else
                        require '../layout/layout_exterior.phtml';
                } else
                    $app->redirect('/index.php?error');
            } else
                $app->redirect('/index.php?error');
        }
    }
});

$app->run();
?>
