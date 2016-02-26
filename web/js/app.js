var id = 0;
var count = 0;
var aut_type = 0;
var detach = true;


$(document).ready(function () {
    $('#ajaxform4').ajaxForm(function (data) {
        document.getElementById("area_id").innerHTML = data;
        document.getElementById("app").innerHTML = '<h2>Se esta a ler isto, é porque mudou de area!</h2>' +
    '<h2>Tenha atenção que a partir de agora todas as operações que efectuar serão referentes à area selecionada.</h2>';
    });
});

$(document).keypress(function (event) {

    var keycode = (event.keyCode ? event.keyCode : event.which);
    //alert(event.srcElement.id);
    if (keycode == '13' && event.srcElement.id == 'password_oleo') {
        alert('Por favor use o butão OK');
    }

});


function set_hora(hora) {

    document.getElementById('hora').value = hora;
}

function set_minutos(minutos) {
    hora = document.getElementById('hora').value;
    document.getElementById('hora').value = document.getElementById('hora').value + ':' + minutos;
}


function regisaut_dialog(id1, tipo) {
    id = id1;
    console.log('hora:' + $("#hora").val());
    aut_type = tipo;
    $("#dialog-regis-aut").dialog("open");
//console.log("teste");
}



function log_in() {
    console.log("teste");
    $("#ajaxform1").attr('action', 'index.php/home');
    $('#dvLoading').show();
    $("#ajaxform1").submit();
}

function inscrever() {
    $("#ajaxform2").attr('action', 'index.php/home');
    $('#dvLoading').show();
    $("#ajaxform2").submit();
}

function submit_area(that) {
    $("#ajaxform4").attr('action', 'index.php/header');
    $('#dvLoading').show();
    $("#ajaxform4").submit();
}

function app() {

    $.post("index.php/home", function (data) {
        document.getElementById("app").innerHTML = data;
    });
/*.done(function() {
     $.post("index.php/header", function(data) {
     document.getElementById("area_id").innerHTML = data;
     });
     }).done(function(){
     
     });*/
}



function alterar_lub() {
    $('#dvLoading').show();
    $('#ajaxform1').attr('action', 'index.php/alt_lub');
    $('#ajaxform1').submit();
}

function novo_oleo() {
    $('#dvLoading').show();
    $('#ajaxform1').attr('action', 'index.php/novo-lub');
    $('#ajaxform1').submit();
}

function rec_oleo(id) {
    $('#dvLoading').show();
    $('#ajaxform1').attr('action', 'index.php/enc-pendentes?id=' + id);
    $('#ajaxform1').submit();
}

function get_lub_history() {
    $('#dvLoading').show();
    $('#ajaxform1').attr('action', 'index.php/pesquizar-lub');
    $('#ajaxform1').submit();
}

function sub(that) {
    $("#change-status-form").attr('action', 'index.php/enclub?encomendar=5&tipo=1');
    $('#dvLoading').show();
    $("#change-status-form").submit();
}


function subPedidoSelect(inst) {
    //console.log(inst.value);
    $("#ajaxform1").attr('action', 'index.php/pedidos_trabalho?type=1&unidade=' + inst.value);
    $('#dvLoading').show();
    $("#ajaxform1").submit();
}

function novo_pedido() {
    $("#ajaxform1").attr('action', 'index.php/pedidos_trabalho?type=1');
    $('#dvLoading').show();
    $("#ajaxform1").submit();
}

function sub2(that) {
    $("#change-status-form").attr('action', 'index.php/enclub?encomendar=0&tipo=1&area=1');
    $('#dvLoading').show();
    $("#change-status-form").submit();
}

function home() {
    $('#dvLoading').show();
    $.post("index.php/home", function (data) {
        document.getElementById("app").innerHTML = data;
    });
}

function add_edit_aut() {
    $("#ajaxform1").attr('action', 'index.php/add-edit-aut');
    $('#dvLoading').show();
    $("#ajaxform1").submit();
}

function pesquiaut(tipo) {
    $('#dvLoading').show();
    $.post("index.php/trab-em-curso?tipo=" + tipo, function (data) {
        document.getElementById("app").innerHTML = data;
    });
}

function recicionar() {
    $('#dvLoading').show();
    $.post("index.php/enc-pendentes", function (data) {
        document.getElementById("app").innerHTML = data;
    });

}


function iserirAut() {
    $('#dvLoading').show();
    $.post("index.php/add-edit-aut", function (data) {
        document.getElementById("app").innerHTML = data;
    });

}

function regisaut(tipo) {
    $('#dvLoading').show();
    $.post("index.php/regis-aut?tipo=" + tipo, function (data) {
        document.getElementById("app").innerHTML = data;
    });
}



function EncLubrificantes(tipo) {
    $('#dvLoading').show();
    $.post("index.php/enclub?tipo=" + tipo, function (data) {
        document.getElementById("app").innerHTML = data;
    });
}

function sair() {
    $('#dvLoading').show();
    $.post("index.php/sair", function (url) {
        window.location = url;
    });
}

function pesquizarLub(tipo) {
    $('#dvLoading').show();
    $.post("index.php/pesquizar-lub?tipo=" + tipo, function (data) {
        document.getElementById("app").innerHTML = data;
    });
}

function novoLub() {
    $('#dvLoading').show();
    $.post("index.php/novo-lub", function (data) {
        document.getElementById("app").innerHTML = data;
    });

}

function alterarLub() {
    $('#dvLoading').show();
    $.post("index.php/alt_lub", function (data) {
        document.getElementById("app").innerHTML = data;
    });
}

function perfil() {
    $('#dvLoading').show();
    $.post("index.php/perfil", function (data) {
        document.getElementById("app").innerHTML = data;
    });
}



function pedidos_trabalho(type) {
    $('#dvLoading').show();
    $.post("index.php/pedidos_trabalho?type=" + type, function (data) {
        document.getElementById("app").innerHTML = data;
    });
}

function associate_trab(pedido, descricao) {
    $(".hiddenbox").slideUp();
    $("#pedido").attr('value', pedido);
    $("#descricao_trabalho").val(descricao);
}

function show_pedidos(inst) {
    $(".hiddenbox").slideUp();
    $('#dvLoading').show();
    $("#trab_list").html('');
    $.post("index.php/add-edit-aut?equipamento=" + inst.value, function (data) {
        content = JSON.parse(data);
        console.log(content);
        for (var i = 0; i < content.length; i++) {
            $("#trab_list").append('<li  style="margin-bottom: 35px";>' + content[i].descricao + '<input type="button" onclick="associate_trab(' + content[i].id + ',\'' + content[i].descricao +
                '\')" style="width: 100px;margin-top:1px;margin-left: 200px;" value="Associar" class="submit"/></li>')
        }
        $('#dvLoading').hide();
        $(".hiddenbox").slideDown();
    });

}

function feed(type, id) {

    if (type === 1) {
        $('#dvLoading').show();
        $.post("index.php/feed?type=1", function (data) {
            document.getElementById("app").innerHTML = data;
            initSample();
        });
    }
    else if (type === 2) {
        $('#dvLoading').show();
        $.post("index.php/feed?type=2", function (data) {
            document.getElementById("app").innerHTML = data;
        //initSample();
        //$('#dvLoading').hide();
        });
    }
    else if (type.name === 'editar') {
        $('#dvLoading').show();
        $("#ajaxform1").attr('action', 'index.php/feed?edit=true&id=' + id);
        $("#ajaxform1").submit();
    }
    else if (type === 3) {

        var editor = CKEDITOR.instances.editor;
        $("#texto").val(editor.getData());
        $('#dvLoading').show();
        $("#ajaxform1").attr('action', 'index.php/feed?type=3&id=' + id);
        $("#ajaxform1").submit();

    }
    else if (type === 4) {

        var editor = CKEDITOR.instances.editor;
        $("#texto").val(editor.getData());
        $('#dvLoading').show();
        $("#ajaxform1").attr('action', 'index.php/feed?type=4');
        $("#ajaxform1").submit();

    }

}

function creategrid() {

}
