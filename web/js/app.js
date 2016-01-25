var id = 0;
var count = 0;
var aut_type = 0;
var detach = true;
var selected_elem;
var selected_elem_top;
var selected_elem_left;
var matrix_table = '<div class="field">' +
'<label>Linhas:</label>' +
'<select id="linhas" onchange="relatorio(this)">' +
'<option value="2">2</option>' +
'<option value="3">3</option>' +
'<option value="4">4</option>' +
'<option value="5">5</option>' +
'<option value="6">6</option>' +
'</select>' +
'</div>' +
'<div class="field">' +
'<label>Colunas:</label>' +
'<select id="colunas" onchange="relatorio(this)">' +
'<option value="2">2</option>' +
'<option value="3">3</option>' +
'<option value="4">4</option>' +
'<option value="5">5</option>' +
'<option value="6">6</option>' +
'</select>' +
'</div>' +
'<div id="tabelabloco" class="field">' +
'<table id="MatrixTable"  width="500" border="0" cellpadding="0" cellspacing="0">' +
'<tbody id="MatrixTableBody">' +
'<tr style="height:  25px" >' +
'<td></td><td onclick="relatorio(this)" style="">ClickMe</td><td onclick="relatorio(this)" style="">ClickMe</td>' +
'</tr>' +
'<tr style="height:  25px">' +
'<td onclick="relatorio(this)">ClickMe</td><td></td><td ></td>' +
'</tr>' +
'<tr style="height:  25px">' +
'<td onclick="relatorio(this)">ClickMe</td><td></td><td></td>' +
'</tr>			' +
'</tbody>' +
'</table>' +
'</div>';

var escolha_multipla = '<div class="field">' +
'<label>Escolha1:</label>' +
'<input type="text" style="width: 250px" name="escolha1"/>' +
'<input type="button" name="adicionar" onclick="relatorio(this);" style="font-weight: bolder;width: 20px;height: 16px;margin-top: 2px;padding-bottom: 1px;"  value="+" class="button">' +
'</div>';

$(document).ready(function() {
    $('#ajaxform4').ajaxForm(function(data) {
        document.getElementById("area_id").innerHTML = data;
        document.getElementById("app").innerHTML = '<h2>Se esta a ler isto, é porque mudou de area!</h2>' +
    '<h2>Tenha atenção que a partir de agora todas as operações que efectuar serão referentes à area selecionada.</h2>';
    });
});

$(document).keypress(function(event) {

    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13' && event.srcElement.id == 'password') {
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

    $.post("index.php/home", function(data) {
        document.getElementById("app").innerHTML = data;
    });
/*.done(function() {
     $.post("index.php/header", function(data) {
     document.getElementById("area_id").innerHTML = data;
     });
     }).done(function(){
     
     });*/
}

function salvar_relatorio() {
    $('#dvLoading').show();
    $('#ajaxform1').attr('action', 'index.php/area_c');
    $('#ajaxform1').submit();
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
    $.post("index.php/home", function(data) {
        document.getElementById("app").innerHTML = data;
    });
}

function add_edit_aut() {
    $("#ajaxform1").attr('action', 'index.php/add-edit-aut');
    $('#dvLoading').show();
    $("#change-status-form").submit();
}

function pesquiaut(tipo) {
    $('#dvLoading').show();
    $.post("index.php/trab-em-curso?tipo=" + tipo, function(data) {
        document.getElementById("app").innerHTML = data;
    });
}

function recicionar() {
    $('#dvLoading').show();
    $.post("index.php/enc-pendentes", function(data) {
        document.getElementById("app").innerHTML = data;
    });

}


function iserirAut() {
    $('#dvLoading').show();
    $.post("index.php/add-edit-aut", function(data) {
        document.getElementById("app").innerHTML = data;
    });

}

function regisaut(tipo) {
    $('#dvLoading').show();
    $.post("index.php/regis-aut?tipo=" + tipo, function(data) {
        document.getElementById("app").innerHTML = data;
    });
}



function EncLubrificantes(tipo) {
    $('#dvLoading').show();
    $.post("index.php/enclub?tipo=" + tipo, function(data) {
        document.getElementById("app").innerHTML = data;
    });
}

function sair() {
    $('#dvLoading').show();
    $.post("index.php/sair", function(url) {
        window.location = url;
    });
}

function pesquizarLub(tipo) {
    $('#dvLoading').show();
    $.post("index.php/pesquizar-lub?tipo=" + tipo, function(data) {
        document.getElementById("app").innerHTML = data;
    });
}

function novoLub() {
    $('#dvLoading').show();
    $.post("index.php/novo-lub", function(data) {
        document.getElementById("app").innerHTML = data;
    });

}

function alterarLub() {
    $('#dvLoading').show();
    $.post("index.php/alt_lub", function(data) {
        document.getElementById("app").innerHTML = data;
    });
}

function perfil() {
    $('#dvLoading').show();
    $.post("index.php/perfil", function(data) {
        document.getElementById("app").innerHTML = data;
    });
}



function pedidos_trabalho(type) {
    $('#dvLoading').show();
    $.post("index.php/pedidos_trabalho?type=" + type, function(data) {
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
    $.post("index.php/add-edit-aut?equipamento=" + inst.value, function(data) {
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


function equipamento_dinamico(type) {
    $('#dvLoading').show();
    if (type == 2) {
        $.post("index.php/equipamento?status_dinamico=0", function(data) {
            document.getElementById("app").innerHTML = data;
        });
    } else if (type == 1) {
        $.post("index.php/equipamento?novo_dinamico=0", function(data) {
            document.getElementById("app").innerHTML = data;
        });
    } else if (type == 3) {
        $.post("index.php/equipamento?horas_de_marcha=0", function(data) {
            document.getElementById("app").innerHTML = data;
        });
    }
    if (type == 4) {

    }
}
var last_equipamento;

function subChangeEquipamentoStatus(equipamento, inst) {

    if (inst.name == "status") {
        $('#dvLoading').show();
        $("#ajaxform1").attr('action', 'index.php/equipamento?change_satus_dinamico=0&equipamento=' + equipamento + '&status=' + inst.value);
        $("#ajaxform1").submit();
    } else if (inst.name == "disponibiblidade") {
        if (inst.value == 1) {
            $('#dvLoading').show();
            $("#ajaxform1").attr('action', 'index.php/equipamento?change_satus_dinamico=0&equipamento=' + equipamento + '&status=' + 12);
            $("#ajaxform1").submit();
        } else {
            $("#dialog-indisponibilidade")
            .data('status', document.getElementById("status").value)
            .data('inst', inst)
            .data('equipamento', equipamento)
            .dialog("open");
        }
    } else if (inst.name == "vermais") {
        $('#historico' + last_equipamento).hide();
        detach = false;
        $.post("index.php/equipamento?history=" + equipamento, function(data) {
            history_data = JSON.parse(data);
            console.log(history_data);
            document.getElementById("show_history" + equipamento).innerHTML = '<tr><th>Data</th><th>Turno</th><th style="width: 300px;">Status</th></tr>'
            for (var i = 0; i < history_data.length; i++) {
                document.getElementById("show_history" + equipamento).innerHTML += "<tr><td>" + history_data[i].data + "</td><td>" + history_data[i].turno + "</td><td>" + history_data[i].descricao + "</td></tr>";
            //$("#show_history" + equipamento).append("<tr><td>" + history_data[i].data + "</td><td>" + history_data[i].turno + "</td><td>" + history_data[i].descricao + "</td></tr>");
            }

            $('#historico' + equipamento).show();
            last_equipamento = equipamento;
        });
    //$('#historico' + equipamento).show();

    } else if (inst.name == "alterar") {
        $("#dialog-indisponibilidade")
        .data('equipamento', equipamento)
        .data('inst', inst)
        .dialog("open");
    } else {
        stat = inst.name.split(":");
        console.log(stat[0]);
        if (stat[1] == "servico") {
            $('#dvLoading').show();
            $("#ajaxform1").attr('action', 'index.php/equipamento?change_satus_dinamico=0&equipamento=' + equipamento + '&status=' + 5);
            $("#ajaxform1").submit();
        } else {
            //$("#ajaxform1").attr('action', 'index.php/equipamento?change_satus_dinamico=0&equipamento=' + equipamento + '&status=' + 12);
            $("#dialog-disponibilidade")
            .data('equipamento', equipamento)
            .data('inst', inst)
            .dialog("open");
        }

    }
}

function subChangeEquipamentoUnidaded(inst) {
    $('#dvLoading').show();
    $.post("index.php/equipamento?status_dinamico=0&unidade=" + inst.value, function(data) {
        document.getElementById("app").innerHTML = data;
    });
}


function processo(type) {
    console.log($("#passos").children().size());
    if (type.name == "nova_manobra") {
        $("#passos").append('<div class="field"><label>Passo ' + ($("#passos").children().size() + 1) + ':</label><textarea rows="4" cols="60" name="passos[passo' + ($("#passos").children().size() + 1) + ']"></textarea></div>');
    }
    if (type.name == "aceitarmanobra") {
        for (var i = 0; i < $("#passos").children().size(); i++) {
            if (!($("#passos").children()[i].children[1].checked)) {
                $("#dialog-aceitar-manobra").dialog("open");
                break;
            }
        }
    }
    if (type.name == "ocultar") {
        if ($('#relatorio').is(":visible")) {
            $("#relatorio").hide();
            $("#ocultar").val("Mostrar relatorio");
        }
        else {
            $("#relatorio").show();
            $("#ocultar").val("Ocultar relatorio");
        }
    }
    if (type.name == "vermanobra") {
        $('#dvLoading').show();
        $("#ajaxform1").attr('action', 'index.php/processo?manobra=' + $("#manobras").val() + '&unidade=' + $("#unidade option:selected").text());
        $("#ajaxform1").submit();
    }
    if (type.name == "adicionar") {
        $('#dvLoading').show();
        $("#ajaxform1").attr('action', 'index.php/processo?adicionar=true');
        $("#ajaxform1").submit();
    }
    if (type == 1) {
        $.post("index.php/processo?type=" + type, function(data) {
            document.getElementById("app").innerHTML = data;
        });
    }
    if (type == 2) {
        $.post("index.php/processo?type=" + type, function(data) {
            document.getElementById("app").innerHTML = data;
        });
    }
    if (type == 3) {
        $.post("index.php/processo?type=" + type, function(data) {
            document.getElementById("app").innerHTML = data;
        });
    }
}

function relatorio(type,obj) {
    //$('#dvLoading').show();
    console.log(type);
    if (type.nodeName === "TD") {
        console.log(type.cellIndex + ' , ' + type.parentNode.rowIndex);
        $("#dialog-inserirnomestabbela")
        .data('cellIndex', type.cellIndex)
        .data('rowIndex', type.parentNode.rowIndex)
        .dialog("open");
    }
    
    else if(type=='picker'){
        selected_elem=obj.getAttribute('name');
        selected_elem_top=$("#draggable"+selected_elem).css('top');
        selected_elem_left=$("#draggable"+selected_elem).css('left');
        //console.log($("#draggable"+selected_elem).position().top);
        var html=$("#containment-wrapper").find('#draggable'+selected_elem)[0].childNodes[1].outerHTML;
        $("#containment-wrapper").find('#draggable'+selected_elem).remove();
        //console.log('MatrixTable'+selected_elem);
        $('#dvLoading').hide();
        $("#dialog-novobloco").dialog("open");
        $("#multipla").hide();
        $("#tabela").html('<div id="tabelabloco" class="field">'+html+'<div>');
        $("#MatrixTable").attr('id', 'MatrixTable'+selected_elem);
        $("#MatrixTableBody").attr('id', 'MatrixTableBody'+selected_elem);
        $("#tabelabloco").attr('id', 'tabelabloco'+selected_elem);
        $("#tabela").show();
        tableresize('MatrixTable'+selected_elem);
    }

    else if (type === 1) {
        $.post("index.php/relatorio?type=" + type, function(data) {
            document.getElementById("app").innerHTML = data;
        });
    } else if (type === 2) {
        $.post("index.php/relatorio?type=" + type, function(data) {
            document.getElementById("app").innerHTML = data;
        });
    }
    else if (type === 3) {
        $.post("index.php/relatorio?type=" + type, function(data) {
            document.getElementById("app").innerHTML = data;
        //$("#app").css('border','1px solid');
        });
    }
    else if (type === 'novobloco') {
        var elems = $("#containment-wrapper").children().size();
        $('#dvLoading').hide();
        $("#dialog-novobloco").dialog("open");
        $("#multipla").hide();
        $("#tabela").html(matrix_table);
        $("#MatrixTable").attr('id', 'MatrixTable'+(elems+1));
        $("#MatrixTableBody").attr('id', 'MatrixTableBody'+(elems+1));
        $("#tabelabloco").attr('id', 'tabelabloco'+(elems+1));
        $("#tabela").show();
        selected_elem=(elems+1);
        tableresize('MatrixTable'+(elems+1));
    }
    else if (type.id === 'linhas') {
        $('#dvLoading').hide();
        $("#MatrixTable"+selected_elem).colResizable({
            disable: true
        });
        var linha = $("#MatrixTableBody"+selected_elem).children()[1].innerHTML;
        console.log($("#MatrixTableBody"+selected_elem).children());
        if (($('#MatrixTable'+selected_elem+' tr').length - 1) < type.value) {
            var insert = type.value - ($('#MatrixTable'+selected_elem+' tr').length - 1);
            for (var i = 0; i < insert; i++) {
                $('#MatrixTableBody'+selected_elem).append('<tr style="height:  25px">' + linha + '</tr>');
            }
        }
        else {
            var remove = ($('#MatrixTable tr').length - 1) - type.value;
            for (i = 0; i < remove; i++) {
                $("#MatrixTableBody"+selected_elem).children()[$('#MatrixTable'+selected_elem+' tr').length - 1].remove();
            }
        }
        tableresize();
    }
    else if (type.id === 'colunas') {
        $("#MatrixTable"+selected_elem).colResizable({
            disable: true
        });
        $('#dvLoading').hide();
        var length = $('#MatrixTableBody'+selected_elem).children()[0].children.length;
        if (length - 1 < type.value) {
            var insert = type.value - (length - 1);
            for (var i = 0; i < insert; i++) {
                length = $('#MatrixTableBody'+selected_elem).children()[0].children.length;
                $('#MatrixTableBody'+selected_elem).find('tr').each(function() {
                    if ($(this).find('td').eq(length - 1)[0].parentNode.rowIndex === 0)
                        $(this).find('td').eq(length - 1).after('<td onclick="relatorio(this)" style="width: 50px">Click Me</td>');
                    else
                        $(this).find('td').eq(length - 1).after('<td ></td>');
                });
            }
        }
        else {
            var remove = (length - 1) - type.value;
            for (i = 0; i < remove; i++) {
                length = $('#MatrixTableBody'+selected_elem).children()[0].children.length;
                $('#MatrixTableBody'+selected_elem).find('tr').each(function() {
                    $(this).find('td').eq(length - 1).remove();
                });
            }
        }
        tableresize(selected_elem);
    }
    else if (type === 'imprimir') {

        var restore = document.body.innerHTML;
        var printarea = document.getElementById('containment-wrapper').innerHTML;
        document.body.innerHTML = printarea;
        window.print();
        document.body.innerHTML = restore;
        $.post("index.php/relatorio?type=3", function(data) {
            document.getElementById("app").innerHTML = data;
        //$("#app").css('border','1px solid');
        });
    //
    }
    else if (type.name === "tipo") {
        if (type.value === '1') {
            $("#multipla").html(escolha_multipla);
            $("#multipla").show();
            $("#tabela").hide();
        }
        else if (type.value === '4') {
            $("#MatrixTable"+selected_elem).colResizable({
                disable: true
            });
            $("#multipla").hide();
            $("#tabela").html(matrix_table);
            $("#tabela").show();
            tableresize(selected_elem);
        }
    }

    else if (type.name === "adicionar") {
        $('#dvLoading').hide();
        var elems = $("#multipla").children().size();
        $("#multipla").append('<div class="field">' +
            '<label>Escolha' + (elems + 1) + ':</label>' +
            '<input type="text" style="width: 250px" name="escolha' + (elems + 1) + ')"/>' +
            '<input type="button" name="adicionar" onclick="relatorio(this);" style="font-weight: bolder;width: 20px;height: 16px;margin-top: 2px;padding-bottom: 1px;"  value="+" class="button">' +
            '</div>');
    }
}

function tableresize(id) {

    $("#"+id).colResizable({
        liveDrag: true,
        gripInnerHtml: "<div class='grip'></div>",
        draggingClass: "dragging",
        fixed: false,
    });

}

function feed(type, id) {

    if (type === 1) {
        $('#dvLoading').show();
        $.post("index.php/feed?type=1", function(data) {
            document.getElementById("app").innerHTML = data;
            initSample();
        });
    }
    else if (type === 2) {
        $('#dvLoading').show();
        $.post("index.php/feed?type=2", function(data) {
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
