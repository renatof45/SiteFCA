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
        $app->redirect('index.php/home');
    }
}

$app = new \Slim\Slim(array(
    'templates.path' => './',
        ));
$app->post('/perfil', 'checkLogIn', function() {
    require "../page/perfil.php";
    require "../page/perfil.phtml";
});

$app->post('/feed', 'checkLogIn', function() {
    require "../page/feed/feed.html";
});

$app->post('/enclub', 'checkLogIn', function() {
    require "../page/lubrificantes/EncLubrificantes.php";
    require "../page/lubrificantes/EncLubrificantes.phtml";
});

$app->post('/pesquizar-lub', 'checkLogIn', function() {
    //print_r(($_POST));
    $oleos = new EncOleosDao();
    $oleo_list = $oleos->get_Oleos();
    if (array_key_exists('search_by_oleo', $_POST)) {
        $oleo_history = $oleos->getLubHistory($_POST['search_by_oleo']);
    }
    if (array_key_exists('dataInicio', $_POST)) {
        $oleo_history = $oleos->getLubHistorybyDate($_POST['dataInicio'], $_POST['dataFim']);
    }
    require "../page/lubrificantes/pesquizar-lub.phtml";
});

$app->post('/enc-pendentes', 'checkLogIn', function() {
    require "../page/lubrificantes/enc-pendentes.php";
    require "../page/lubrificantes/enc-pendentes.phtml";
});

$app->post('/alt_lub', 'checkLogIn', function() {
    require "../page/lubrificantes/alterar-lub.php";
    require "../page/lubrificantes/alterar-lub.phtml";
});

$app->post('/novo-lub', 'checkLogIn', function() {
    require "../page/lubrificantes/novo-lub.php";
    require "../page/lubrificantes/novo-lub.phtml";
});

$app->post('/relatorio', 'checkLogIn', function() use ($app) {
    $type = $app->request()->get('type');
    if ($type == 2) {
        require "../page/relatorios/area_c.phtml";
        require "../page/relatorios/area_c.php";
    } elseif ($type == 1) {

        require "../page/relatorios/resumo.phtml";
    }
});


$app->post('/processo', 'checkLogIn', function() use ($app) {
    $type = $app->request()->get('type');
    //echo $type;
    $unidadesdao = new UnidadesDao();
    $unidades = $unidadesdao->findUnidades($_SESSION['area']);
    $processodao = new ProcessoDao();
    if (array_key_exists('adicionar', $_GET)) {
        //print_r($_POST);
        $processodao->novaManobra($_POST['nome'], $_POST['unidade'], $_POST['passos']);
        if (array_key_exists("1200", $_POST)) {
            print_r($_POST['1200']);
        }
        require "../page/processo/nova_manobra.phtml";
    } elseif (array_key_exists('manobra', $_GET)) {
        $manobras = $processodao->getManobra($_GET['manobra']);
        $passos_count = 1;
        require "../page/processo/manobras.phtml";
    } elseif ($type == 1) {
        $manobras = $processodao->getAll(1);
        require "../page/processo/manobras.phtml";
        //require "../page/relatorios/area_c.php";    
    } elseif ($type == 2) {

        require "../page/processo/nova_manobra.phtml";
    } elseif ($type == 3) {

        require "../page/processo/teste.php";
    }
});


$app->post('/equipamento', 'checkLogIn', function() use($app) {
    $equipamentodao = new EquipamentoDao();

    if (array_key_exists('status_dinamico', $_GET)) {
        $unidadesdao = new UnidadesDao();
        $unidades = $unidadesdao->findUnidades($_SESSION['area']);

        if (array_key_exists('unidade', $_GET)) {
            $unidade = $_GET['unidade'];
        } else
            $unidade = $unidades[0]['id'];

        $equipamentos = $equipamentodao->getBeType(1, $unidade);
        $estados = $equipamentodao->getEstados();
        require "../page/equipamento/status_dinamico.phtml";
    }

    if (array_key_exists('horas_de_marcha', $_GET)) {
        $unidadesdao = new UnidadesDao();
        $unidades = $unidadesdao->findUnidades($_SESSION['area']);

        if (array_key_exists('unidade', $_GET)) {
            $unidade = $_GET['unidade'];
        } else
            $unidade = $unidades[0]['id'];
        //$equipamentodao->getHorasDeMarcha(1,5);
        $equipamentos = $equipamentodao->getBeType(1, $unidade);
        $estados = $equipamentodao->getEstados();
        require "../page/equipamento/horas_de_marcha.phtml";
    }

    elseif (array_key_exists('novo_dinamico', $_GET)) {
        $unidadesdao = new UnidadesDao();
        $unidades = $unidadesdao->findUnidades($_SESSION['area']);
        $equipamentos = $equipamentodao->getBeType(1, 1);
        $estados = $equipamentodao->getEstados();
        require "../page/equipamento/novo_dinamico.phtml";
    } elseif (array_key_exists('change_satus_dinamico', $_GET)) {
        $equipamentodao->updateStatus($_GET['equipamento'], $_GET['status']);
        $unidadesdao = new UnidadesDao();
        $unidades = $unidadesdao->findUnidades($_SESSION['area']);
        $equipamentos = $equipamentodao->getBeType(1, $_POST['unidade']);
        $estados = $equipamentodao->getEstados();
        require "../page/equipamento/status_dinamico.phtml";
    } elseif (array_key_exists('history', $_GET)) {
        $history = $equipamentodao->getHistory($_GET["history"]);
        echo json_encode($history);
    }
});


$app->post('/pedidos_trabalho', 'checkLogIn', function() use ($app) {
    $type = $app->request()->get('type');
    $errors = array();
    $pedido = new PedidosTrabalho();
    $unidadesdao = new UnidadesDao();
    $equipamentodao = new EquipamentoDao();
    $unidades = $unidadesdao->findUnidades($_SESSION['area']);

    if ($type == 2) {
        $pedidosdao = new PedidosTrabalhoDao();
        $pendentes = $pedidosdao->getByStatus(0);
        require "../page/pedidos_trabalho/pendentes.phtml";
    }

    if (array_key_exists('save', $_POST)) {
        //print_r($_POST);
        $data = array(
            'unidade' => $_POST['pedido']['unidade'],
            'equipamento' => $_POST['pedido']['equipamento'],
            'descricao' => $_POST['pedido']['descricao'],
            'prioridade' => $_POST['pedido']['prioridade']
        );

        // map
        PedidosTrabalhoMapper::map($pedido, $data);
        // validate
        $errors = PedidosTrabalhoValidator::validate($pedido);
        if (empty($errors)) {
            $dao = new PedidosTrabalhoDao();
            $dao->insert($pedido);
            Flash::addFlash('AutorizaÃ§Ã£o gravada com sucesso!');
            // redirect
            //Utils::redirect('add-edit-aut', array());
        }
    }
    if (array_key_exists('unidade', $_GET)) {
        $equipamentos = $equipamentodao->getByUnidade($_GET['unidade']);
    } else
        $equipamentos = $equipamentodao->getByUnidade($unidades[0]['id']);

    if ($type == 1) {
        require "../page/pedidos_trabalho/novo.phtml";
    }
});


$app->post('/add-edit-aut', 'checkLogIn', function() {
    if (array_key_exists('equipamento', $_GET)) {
        $pedidodao = new PedidosTrabalhoDao();
        $pedido = $pedidodao->getByEquipamento($_GET['equipamento']);
        //print_r($pedido);
        echo json_encode($pedido);
    } else if (array_key_exists('pedido', $_GET)) {
        $pedidodao = new PedidosTrabalhoDao();
        $pedidodao->update($_GET['pedido'], $_GET['aut']);
    } else {
        require "../page/autorizacoes/add-edit-aut.php";
        require "../page/autorizacoes/add-edit-aut.phtml";
    }
});

$app->post('/regis-aut', 'checkLogIn', function() {



    require "../page/autorizacoes/regis-aut.php";
    require "../page/autorizacoes/regis-aut.phtml";
});

$app->post('/trab-em-curso', 'checkLogIn', function() {
    require "../page/autorizacoes/pesqui-aut.php";
    require "../page/autorizacoes/pesqui-aut.phtml";
});

$app->get('/sair', function() use($app) {
    session_destroy();
    $app->redirect('/');
});


$app->get('/', function() use ($app) {
    $errors = array();
    $flashes = null;
    $db = new DAO();
    $sql = file_get_contents('../db/galp.sql');
    $qr = $db->getDb()->exec($sql);
    $dao = new UtilizadorDao();
    if (array_key_exists('numero', $_POST))
        $user = $dao->getUser($_POST['numero']);
    else
    if (array_key_exists('user', $_SESSION)) {
        $user = $dao->getUser($_SESSION['user']);
    }
    if (!array_key_exists('user', $_SESSION)) {
        $template = '../layout/intro.html';
    } else {
        $template = '../layout/area-de-trabalho.html';
    }
    require '../layout/index.phtml';
});


$app->get('/home', function() {
    require '../layout/index.phtml';
});

$app->post('/login', function() use ($app) {
    //print_r($_POST);
    if (array_key_exists('error', $_GET)) {
        $template = '../layout/intro.html';
        require '../layout/index.phtml';
    }
    if (array_key_exists('sub_x', $_POST)) {

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
                        $app->redirect('/index.php');
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
