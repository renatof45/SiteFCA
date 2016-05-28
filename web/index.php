<?php

require 'Slim/Slim.php';

require_once('../config_1/Config.php');
require_once('../validation/Error.php');
require_once('../flash/Flash.php');
require_once('../exception/NotFoundException.php');
require_once('../dao/DAO.php');
require_once('../dao/AutorizacaoDao.php');
require_once('../dao/FeedDao.php');
require_once('../dao/UnidadesDao.php');
require_once('../dao/EncOleosDao.php');
require_once('../dao/firmaDao.php');
require_once('../dao/UtilizadorDao.php');
require_once('../dao/EquipamentoDao.php');
require_once('../dao/RelatorioDao.php');
require_once('../dao/PedidosTrabalhoDao.php');
require_once('../dao/ProcessoDao.php');
require_once('../mapping/EncOleosMapper.php');
require_once('../mapping/FeedMapper.php');
require_once('../mapping/AutorizacaoMapper.php');
require_once('../mapping/PedidosTrabalhoMapper.php');
require_once('../mapping/UtilizadorMapper.php');
require_once('../model/Autorizacao.php');
require_once('../model/Feed.php');
require_once('../model/Utilizador.php');
require_once('../model/PedidosTrabalho.php');
require_once('../model/EncOleos.php');
require_once('../validation/AutorizacaoValidator.php');
require_once('../validation/FeedValidator.php');
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

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function object_to_array($data) {
    if (is_array($data) || is_object($data)) {
        $result = array();
        foreach ($data as $key => $value) {
            $result[$key] = object_to_array($value);
        }
        return $result;
    }
    return $data;
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
$app->post('/perfil', 'checkLogIn', function() use ($app) {
    $errors = array();
    $dao = new UtilizadorDao();
    $flashes = null;

    if (array_key_exists('alterar', $_POST)) {
        $areas = array();
        $utilizador = new Utilizador(null);
        if (array_key_exists('area', $_POST)) {
            $areas[$_POST['area']] = $_POST['area'];
        }

        $tipo = $dao->getTipo($_SESSION['user']);
        $params = array(
            'numero' => $_POST['utilizador']['numero'],
            'pass' => $_POST['utilizador']['pass'],
            'nome' => $_POST['utilizador']['nome'],
            'tipo' => $tipo,
            'area' => $areas
        );

        UtilizadorMapper::map($utilizador, $params);
        $dao->delete($_SESSION['user']);
        $errors = UtilizadorValidator::validate($utilizador);

        if (empty($errors)) {
            $dao->insert($utilizador);
            $app->redirect('/SiteFCA-master/web/index.php/sair?userchange');
        }
    } else {
        $utilizador = new Utilizador($dao->getUser($_SESSION['user']));
        //print_r($utilizador->getArea());
    }
    require "../page/perfil.phtml";
});

$app->post('/feed', 'checkLogIn', function() {
    $errors = array();
    if (array_key_exists('type', $_GET)) {
        if ($_GET['type'] == 1) {
            $flashes = Flash::getFlashes();
            require "../page/feed/feed.html";
        } else if ($_GET['type'] == 3) {
            $feed = new Feed();
            $data = array(
                'titulo' => $_POST['titulo'],
                'descricao' => $_POST['descricao'],
                'texto' => $_POST['texto'],
                'publicar' => $_POST['publicar']
            );
            FeedMapper::map($feed, $data);
            $errors = FeedValidator::validate($feed);
            if (empty($errors)) {
                $dao = new FeedDao();
                $dao->update($_GET['id'], $feed);
                Flash::addFlash('Feed gravada com sucesso!');
            }
            $flashes = Flash::getFlashes();
            require "../page/feed/feed.html";
        } else if ($_GET['type'] == 4) {
            $feed = new Feed();
            $data = array(
                'titulo' => $_POST['titulo'],
                'descricao' => $_POST['descricao'],
                'texto' => $_POST['texto'],
                'publicar' => $_POST['publicar']
            );
            FeedMapper::map($feed, $data);
            $errors = FeedValidator::validate($feed);
            if (empty($errors)) {
                $dao = new FeedDao();
                $dao->insert($feed);
                Flash::addFlash('Feed gravada com sucesso!');
            }
            $flashes = Flash::getFlashes();
            require "../page/feed/feed.html";
        } else {
            $dao = new FeedDao();
            $feeds = $dao->getAll();

            $flashes = Flash::getFlashes();
            require "../page/feed/edit.html";
        }
    }
    if (array_key_exists("edit", $_GET)) {
        $dao = new FeedDao();
        $feed = $dao->getFeed($_GET['id']);
        $flashes = Flash::getFlashes();
        require "../page/feed/feed.html";
    }
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
        $relatoriodao = new RelatorioDao ();
        $template = $relatoriodao->getRelatorio($_GET['versao']);
        echo json_encode(($template));
    } elseif (array_key_exists('getlastrelatorio', $_GET)) {
        $relatoriodao = new RelatorioDao ();
        if (array_key_exists('index', $_GET)) {
            $index = $_GET['index'];
        } else {
            $index = -1;
        }
        echo json_encode(($relatoriodao->getLastRelatorio($index)));
    } elseif (array_key_exists('unidades', $_GET)) {
        require "../page/relatorios/unidades.phtml";
    } elseif ($type == 1) {
        $relatoriodao = new RelatorioDao ();
        $trabalhos = $relatoriodao->getTrabalhos();
        $equipamentos = $relatoriodao->getEquipamentos();
        //print_r($equipamentos);
        require "../page/relatorios/resumo.phtml";
    } elseif ($type == 3) {
        $relatoriodao = new RelatorioDao ();
        $template = $relatoriodao->getRelatorio($_GET['versao']);
        echo json_encode(($template));

        //require "../page/relatorios/novo.phtml";
    } elseif (array_key_exists('getteemplate', $_GET)) {
        require "../page/relatorios/novo.phtml";
    } elseif (array_key_exists('salvar', $_GET)) {
        $myfile = fopen("newfile.txt", "w") or die("Unable to open file!");
        fwrite($myfile, $_POST['content'] . '#');
        fwrite($myfile, $_POST['separadores']);
        fclose($myfile);
        $relatoriodao = new RelatorioDao ();
        $relatoriodao->updateTemplate($_POST['content'], $_POST['separadores'], $_POST['versao']);
    } elseif (array_key_exists('salvarrelatorio', $_GET)) {
        $relatoriodao = new RelatorioDao ();
        $relatoriodao->updateRelatrio($_POST['comentario'], $_POST['dados'], $_POST['accao'], $_POST['manobra']);
    } elseif (array_key_exists('getversoes', $_GET)) {
        $relatoriodao = new RelatorioDao ();
        $versoes = $relatoriodao->getVersoes();
        require "../page/relatorios/versoes.phtml";
    } elseif (array_key_exists('setdefaultversao', $_GET)) {
        $relatoriodao = new RelatorioDao ();
        $relatoriodao->setDefaultVersao($_GET['setdefaultversao']);
    } elseif (array_key_exists('criarversao', $_GET)) {
        $relatoriodao = new RelatorioDao ();
        if (array_key_exists('versao', $_POST))
            $versao = $_POST['versao'];
        else
            $versao = 0;
        $relatoriodao->createVersao($_POST['tipo'], $versao);
    }elseif (array_key_exists('checkversao', $_GET)) {
        $relatoriodao = new RelatorioDao ();
        echo json_encode($relatoriodao->checkVersao());
    } elseif (array_key_exists('deleteversao', $_GET)) {
        $relatoriodao = new RelatorioDao();
        $relatoriodao->deleteVersao($_GET['versao']);
    }
});

$app->get('/relatorio', 'checkLogIn', function() use ($app) {
    if (array_key_exists('imprimir', $_GET)) {
        $relatoriodao = new RelatorioDao();
        $template = $relatoriodao->getRelatorio($_GET['versao']);
        //echo $template;
        $paginas = json_decode(($template['template']));
        //echo count(($paginas));
        $separadores = json_decode($template['separadores']);
        //print_r($_SESSION);
        $db = new DAO();
        $areas = $db->getDb()->query('SELECT * FROM galp.area;', PDO::FETCH_ASSOC);
        foreach ($areas as $row) {
            if ($row['ID'] == $_SESSION['area']) {
                $area = $row['Area'];
            }
        }
        if ($_SESSION['turno'] == 1) {
            $turno = '06:00 - 14:00';
        } elseif ($_SESSION['turno'] == 2) {
            $turno = '14:00 - 22:00';
        } else {
            $turno = '22:00 - 06:00';
        }

        //echo date('d-m-Y');
        $count = 0;
        require "../page/relatorios/imprimir.phtml";
    }
});

$app->get('/processo', 'checkLogIn', function() use ($app) {
    $unidadesdao = new UnidadesDao();
    $unidades = $unidadesdao->findUnidades($_SESSION['area']);
    $processodao = new ProcessoDao();
    if (array_key_exists('imprimir', $_GET)) {
        $procedimento = $processodao->getProc($_GET['proc']);
        $manobras = object_to_array(json_decode(json_decode($procedimento['manobra'])));
        $descricao = $procedimento['descricao'];
        $index = 0;
        require "../page/processo/imprimir_proc.phtml";
    }
});

$app->post('/processo', 'checkLogIn', function() use ($app) {
    $type = $app->request()->get('type');
    //echo $type;
    $unidadesdao = new UnidadesDao();
    $unidades = $unidadesdao->findUnidades($_SESSION['area']);
    $processodao = new ProcessoDao();
    if (array_key_exists('salvar', $_GET)) {
        //echo json_encode($_POST);
        //$app->redirect("index.php/processo?type=2");
        $processodao->novoProc($_POST['publicar'],$_GET['nome'], $_GET['unidade'], json_encode($_POST['procidimento']), json_encode($_POST['descricao']));

        //require "../page/processo/nova_manobra.phtml";
    } elseif ($type == 5) {
        $manobras = $processodao->getAllPendentes();
        echo json_encode(array('manobra' => $manobras, 'unidades' => $unidades));
    } elseif (array_key_exists('getpassos', $_GET)) {
        echo json_encode(array('passos' => $processodao->getPassos($_GET['manobra'])));
    } elseif (array_key_exists('deletepassos', $_GET)) {
        $processodao->deletePassos($_GET['manobra'], $_GET['passo']);
        $equipamneto = new EquipamentoDao();
        $equipamneto->deleteStatus($_GET['accao']);
        $relatorio = new RelatorioDao();
        $relatorio->deleteRelatorio($_GET['accao']);
        $relatorio = new RelatorioDao();
        $relatorio->deleteRelatorio($_GET['relatorio']);
    } elseif (array_key_exists('novamanobra', $_GET)) {
        echo $processodao->novaManobra($_GET['proc'], 0);
    } elseif (array_key_exists('updatemanobra', $_GET)) {
        $processodao->updateManobra($_GET['manobra'], 1);
        date_default_timezone_set('Europe/Lisbon');
        echo date('Y-m-d H:i:s');
    } elseif (array_key_exists('update', $_GET)) {
        $processodao->updateProc($_POST['publicar'],$_GET['id'], $_GET['nome'], $_GET['unidade'], json_encode($_POST['procidimento']), json_encode($_POST['descricao']));
    } elseif (array_key_exists('salvar_passo_proc', $_GET)) {
        $processodao->updatePassos($_GET['obs'], $_GET['proc_id'], $_GET['passo'], $_GET['monobra_id']);
        date_default_timezone_set('Europe/Lisbon');
        echo date('Y-m-d H:i:s');
    } elseif (array_key_exists('show_proc', $_GET)) {
        $manobras = $processodao->getProc($_GET['proc']);
        $passos_count = 1;
        require "../page/processo/manobras.phtml";
    } elseif ($type == 1) {
        $manobras = $processodao->getAll();
        //$procedimentos=  object_to_array(json_decode(object_to_array(json_decode($manobras['manobra']))['procidimento']));
        echo json_encode(array('manobra' => $manobras, 'unidades' => $unidades));
    } elseif (array_key_exists('getprocedimentos', $_GET)) {
        $manobras = $processodao->getProc($_GET['proc']);
        echo json_encode($manobras);
    } elseif ($type == 2) {
        $relatoriodao = new RelatorioDao();
        $template = $relatoriodao->getRelatorio($relatoriodao->getCurrentVersao());
        $relatorio = json_decode($template['template']);
        echo json_encode(($template));
        //require "../page/processo/nova_manobra.phtml";
    } elseif (array_key_exists('novoproc', $_GET)) {
        require "../page/processo/nova_manobra.phtml";
    } elseif ($type == 3) {

        require "../page/processo/nova_rotina.phtml";
    } elseif (array_key_exists('anularmanobra', $_GET)) {
        $processodao->deleteManobra($_GET['manobra']);
    } elseif (array_key_exists('myprocs', $_GET)) {
        $manobras=$processodao->getMyProcs($_SESSION['user']);
        echo json_encode(array('manobra' => $manobras, 'unidades' => $unidades));
    }
    elseif (array_key_exists('deleteproc', $_GET)) {
        $processodao->deleteProc($_GET['proc']);
    }
    elseif(array_key_exists('novarotina',$_GET)){
        if($_GET['updaterotina']=='false')
            echo $processodao->novaRotina($_POST['nome'],$_POST['unidade'],$_POST['alerta'],$_POST['descricao'],$_POST['frequencia']);
        else{
            $processodao->updateRotina($_GET['rotinaid'],$_POST['nome'],$_POST['unidade'],$_POST['alerta'],$_POST['descricao'],$_POST['frequencia']);
        }
    }
    elseif(array_key_exists('parahoje', $_GET)){
        echo json_encode(array('rotinas'=>$processodao->getRotinasParaHoje(), 'unidades' => $unidades,'turno'=>$_SESSION['turno']));
    }
});

$app->post('/equipamento', 'checkLogIn', function() use($app) {
    $equipamentodao = new EquipamentoDao();
    if (array_key_exists('get_equipamento', $_GET)) {
        echo json_encode($equipamentodao->getEqipmentoById($_GET['get_equipamento']));
    }
    if (array_key_exists('update_equipamento', $_GET)) {
        print_r($_GET);
        ($equipamentodao->updateEquipamento($_GET['equipqmento'], $_GET['id'], $_GET['descricao']));
    }
    if (array_key_exists('get_status', $_GET)) {
        $unidadesdao = new UnidadesDao();
        $unidades = $unidadesdao->findUnidades($_SESSION['area']);

        if (array_key_exists('unidade', $_GET)) {
            $unidade = $_GET['unidade'];
        } else
            $unidade = $unidades[0]['id'];
        if ($_GET['get_status'] == 1)
            $equipamentos = $equipamentodao->getAll();
        else
            $equipamentos = $equipamentodao->getAllByType($_GET['tipo']);
        $estados = $equipamentodao->getEstados();
        $status = array();
        foreach ($equipamentos as $equipamento) {
            array_push($status, $equipamentodao->getEstadoByEquipamento($equipamento['id']));
        }
        echo json_encode(array('status' => $status, 'unidades' => $unidades, 'estados' => $estados, 'equipamentos' => $equipamentos));
        //require "../page/equipamento/status_dinamico.phtml";
    }

    if (array_key_exists('update_etapas', $_GET)) {
        $equipamentodao->updateEtapas($_GET['status'], $_GET['accao']);
        date_default_timezone_set('Europe/Lisbon');
        $now = new DateTime();
        echo $now->format('Y-m-d H:i:s');
    }
    if (array_key_exists('get_etapas', $_GET)) {
        echo json_encode($equipamentodao->getEtapas($_GET['status']));
    }
    if (array_key_exists('get_accoes', $_GET)) {
        echo json_encode($equipamentodao->getAccoes($_GET['tipo']));
    }
    if (array_key_exists('get_status_equipamento', $_GET)) {
        echo json_encode($equipamentodao->getEstadoByEquipamento($_GET['equipamento']));
    } elseif (array_key_exists('equipamento-status', $_GET)) {
        $equipamento = $equipamentodao->getEqipmentoById($_GET['equipamento-status']);
        $status = $equipamentodao->getEstadoByIf($_GET['status']);
        echo $equipamento['equipamento'] . '  ' . $status;
    }
    if (array_key_exists('horas_de_marcha', $_GET)) {
        $unidadesdao = new UnidadesDao();
        $unidades = $unidadesdao->findUnidades($_SESSION['area']);

        if (array_key_exists('unidade', $_GET)) {
            $unidade = $_GET['unidade'];
        } else
            $unidade = $unidades[0]['id'];
        $total = array();
        $horas = array();
        $equipamentos = $equipamentodao->getAll();
        foreach ($equipamentos as $equipamento) {
            $aux = array();
            $aux['equipamento'] = $equipamento;
            $aux['total'] = $equipamentodao->getHorasDeMarcha($equipamento['id'], 'Em Serviço', 'total');
            $aux['mes'] = $equipamentodao->getHorasDeMarcha($equipamento['id'], 'Em Serviço', 'mes');
            array_push($horas, $aux);
        }
        $estados = $equipamentodao->getEstados();

        echo json_encode(array('horas' => $horas, 'unidades' => $unidades));
        //require "../page/equipamento/horas_de_marcha.phtml";
    } elseif (array_key_exists('salvar_novo', $_GET)) {
        //print_r($_POST['dados']);
        $equipamentodao->insertNovoEquipamento($_POST['dados'][1]['value'], $_POST['dados'][0]['value'], $_POST['dados'][2]['value'], $_GET['tipo']);
        $unidadesdao = new UnidadesDao();
        $unidades = $unidadesdao->findUnidades($_SESSION['area']);
        $equipamentos = $equipamentodao->getByType(1, 1);
        $estados = $equipamentodao->getEstados();
        if ($_GET['tipo'] == 1)
            require "../page/equipamento/novo_dinamico.phtml";
        else
            require "../page/equipamento/novo_instrumento.phtml";
    }
    elseif (array_key_exists('delete', $_GET)) {
        $equipamentodao->deleteEquipamneto($_GET['id']);
        echo "teste";
    } elseif (array_key_exists('novo_instrumento', $_GET)) {
        $unidadesdao = new UnidadesDao();
        $unidades = $unidadesdao->findUnidades($_SESSION['area']);
        require "../page/equipamento/novo_instrumento.phtml";
    } elseif (array_key_exists('novo_dinamico', $_GET)) {
        $unidadesdao = new UnidadesDao();
        $unidades = $unidadesdao->findUnidades($_SESSION['area']);

        require "../page/equipamento/novo_dinamico.phtml";
    } elseif (array_key_exists('novo_estatico', $_GET)) {
        $unidadesdao = new UnidadesDao();
        $unidades = $unidadesdao->findUnidades($_SESSION['area']);

        require "../page/equipamento/novo_estatico.phtml";
    } elseif (array_key_exists('change_satus', $_GET)) {
        //print_r($_POST['accao']);
        $equipamentodao->updateStatus($_POST['manobra'], $_POST['equipamento'], $_POST['accao'], $_POST['status'], $_POST['comentario'], $_POST['descricao']);
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
    if (array_key_exists('save', $_GET)) {
        $data = array(
            'unidade' => $_POST['unidade'],
            'equipamento' => $_POST['equipamento'],
            'descricao' => $_POST['texto'],
            'prioridade' => $_POST['prioridade']
        );

        // map
        PedidosTrabalhoMapper::map($pedido, $data);
        $dao = new PedidosTrabalhoDao();
        $dao->insert($pedido);
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
            Flash::addFlash('Autorização gravada com sucesso!');
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
    $app->redirect('/SiteFCA-master/web/');
});

$app->post('/signin', function() use($app) {
    if (array_key_exists('newuser', $_GET)) {
        $app->redirect('/');
    }
    $utilizador = new Utilizador(null);
    $dao = new UtilizadorDao();
    $errors = array();

    if (array_key_exists('signin', $_POST)) {
        $areas = array();
         if (array_key_exists('area', $_POST)) {
            $areas[$_POST['area']] = $_POST['area'];
        }
        $params = array(
            'numero' => $_POST['utilizador']['numero'],
            'pass' => $_POST['utilizador']['pass'],
            'nome' => $_POST['utilizador']['nome'],
            'tipo' => 1,
            'area' => $areas
        );

        UtilizadorMapper::map($utilizador, $params);

        $errors = UtilizadorValidator::validate($utilizador);

        if (empty($errors)) {

            $dao = new UtilizadorDao();
            $dao->insert($utilizador);
            //Flash::addFlash('Utilizador gravado com sucesso!');
            $app->redirect('/SiteFCA-master/web/index.php?newuser');
            //Utils::redirect('home', array());
        } else
            require "../layout/signin.phtml";
    } else
        require "../layout/signin.phtml";
});



$app->get('/signin', function() use($app) {
    //$template = '../layout/user_qualification.phtml';
    require '../layout/signin.phtml';
});

$app->get('/user_qualification', function() use($app) {

    require '../layout/user_qualification.phtml';
});

$app->post('/user_qualification', function () use($app) {
    $pedido = "<p>Nome: " . $_POST['nome'] . "</p><br><p>Numero: " . $_POST['numero'] . "</p><br><p>Categoria: " . $_POST['posto'] . "</p>";

    try {
        new EwsSendEmail($_POST['pass'], $pedido, 'Pedido de qualificação', '711241', $_SESSION['user']);
    } catch (SoapFault $ex) {
        $errors[] = new Error('numero', $ex->getMessage());
        require '../layout/user_qualification.phtml';
    } catch (EWS_Exception $ex) {
        $errors[] = new Error('numero', $ex->getMessage());
        require '../layout/user_qualification.phtml';
    }
    if (empty($errors)) {
        $app->redirect('/SiteFCA-master/web/index.php?request_qualification');
    }
});

$app->get('/lostpass', function() {
    require '../layout/lost_pass.phtml';
});

$app->post('/lostpass', function() use($app) {
    $pass = generateRandomString();
    $pedido = '<p>A seu pedido foi feito o reset da sua password de acesso ao Site FCA</p><br><p>Nova password: <b>' . $pass . '</b></p>';

    echo $pass;
    try {
        new EwsSendEmail($_POST['password'], $pedido, 'Reset de password', $_POST['numero'], '711241');
    } catch (SoapFault $ex) {
        $errors[] = new Error('numero', $ex->getMessage());
        require '../layout/lost_pass.phtml';
    } catch (EWS_Exception $ex) {
        $errors[] = new Error('numero', $ex->getMessage());
        require '../layout/lost_pass.phtml';
    }
    if (empty($errors)) {
        $userdao = new UtilizadorDao();
        $userdao->resetPass($_POST['numero'], $pass);
        $app->redirect('/SiteFCA-master/web/index.php?request_pass');
    }
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
        if (array_key_exists('noticia', $_GET)) {
            $feeddao = new FeedDao();
            $feed = $feeddao->getFeed($_GET['noticia']);
            $template = '../layout/noticias.html';
        } else {
            $template = '../layout/intro.html';
        }
    } else {
        if ($user['tipo'] == 2)
            $template = '../layout/area-de-trabalho.html';
        else {
            $template = '../layout/layout_exterior.phtml';
        }
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

            $app->redirect('/SiteFCA-master/web/index.php?error');
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
                    $_SESSION['user_type'] = $user['tipo'];
                    $relatoriodao = new RelatorioDao();
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
                    $app->redirect('/SiteFCA-master/web/index.php');
                } else
                    $app->redirect('/SiteFCA-master/web/index.php?error');
            } else
                $app->redirect('/SiteFCA-master/web/index.php?error');
        }
    }
});
$app->run();
?>
