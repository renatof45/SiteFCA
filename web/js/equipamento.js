var tipo = 0;
var estados;
var ajaxform_novo_options = {
    beforeSubmit: ajaxform_novo_options_request,
    success: ajaxform_novo_options_response

}
var instrumentos_status = []
var instrumentos_estapas = ["Retirada", "Colocadas Juntas Cegas", "Retiradas Juntas Cegas", "Calibrada"];
var ajaxform_change_status = {
    beforeSubmit: ajaxform_change_status_request
}

function ajaxform_change_status_request(formData, jqForm, options) {

}


function ajaxform_novo_options_request(formData, jqForm, options) {
    //console.log(formData);
    $.post('index.php/equipamento?salvar_novo&tipo=' + tipo, {
        dados: (formData)
    }, function (data) {
        document.getElementById("app").innerHTML = data;
        $('#dvLoading').hide();
    });
    return false;
}

function ajaxform_novo_options_response(responseText, statusText, xhr, $form) {
    conslole.log(responseText);
}

function instrumentos(object) {
    $('#dvLoading').show();
    if (object === 1) {
        $.post("index.php/equipamento?novo_instrumento=0", function (data) {
            document.getElementById("app").innerHTML = data;
        });
    }
    if (object === 2) {

        $.post("index.php/equipamento?get_status=0&tipo=2", function (data) {
            document.getElementById("app").innerHTML =
                    '<h1>Estado dos Instrumentos</h1><form><ul id="tab2" class="tabs"></ul></form>';
            var unidades = JSON.parse(data)['unidades'];
            var equipamentos = JSON.parse(data)['equipamentos'];
            estados = JSON.parse(data)['estados'];
            TABS.CreateTabs('tab2');
            for (var i = 0; i < unidades.length; i++) {
                var element = $('<div></div>');
                for (var j = 0; j < equipamentos.length; j++) {
                    var div = ''
                    if (equipamentos[j].unidade === unidades[i].id) {
                        div = '<div id=div' + equipamentos[j].id + ' class="field" style="height: 21px;background-color: #F3F3F3;"><label style="margin-left:5px;">' + equipamentos[j].Equipamento + ':</label>';
                        div += ('<p id="' + equipamentos[j].id + '" style="width: 200px;float: left;">' + equipamentos[j].estado + '</p>');
                        div += ('<input type="button" estado="' + equipamentos[j].estado + '" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="mais_dados" onclick="equipamento(this,2);" style="margin-top: 1px;float: left;" value="Mais dados" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="alterar_status" onclick="equipamento(this,2);" style="width:110px;margin-top: 1px;float: left;" value="Alterar status" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="inspecoes" onclick="equipamento(this,2);" style="width:100px;margin-top: 1px;float: left;" value="Inspeções" class="button">'+
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="alterar" onclick="equipamento(this,2);" style="width:100px;margin-top: 1px;float: left;" value="Alterar equipamento" class="button"></div>');
                        element.append(div);
                    }
                }
                element.css('padding', '10px');
                element.css('overflow', 'auto');
                if (i === 0)
                    TABS.AddTab(unidades[i].designacao, true, element[0].outerHTML, 'tab2');
                else
                    TABS.AddTab(unidades[i].designacao, false, element[0].outerHTML, 'tab2');
            }

        });
    }
    if (object == 'novo_instrumento') {
        tipo = 2;
        $('#dvLoading').show();
        $('#ajaxform_novo').ajaxForm(ajaxform_novo_options);
        //$("#ajaxform_novo_equipamento").attr('action', 'index.php/equipamento?salvar_novo_dinamico&tipo=1');
        $("#ajaxform_novo").submit(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        );
    }
}

function equipamento(object, tipo) {
    if (object.name === 'mais_dados') {
        $('#dvLoading').hide();
        if ($("#div" + object.getAttribute('equipamento_id'))[0].children[3].value === 'Cancelar') {
            $("#div" + object.getAttribute('equipamento_id'))[0].children[3].value = 'Alterar status';
            $("#div" + object.getAttribute('equipamento_id')).next().remove();
        }
        var div = '<div><div class="feild" style="margin-left:100px">';
        detach = false;
        if (object.value === 'Mais dados') {
            object.value = 'Menos dados';
            $.post("index.php/equipamento?get_status_equipamento=0&equipamento=" + object.getAttribute('equipamento_id'), function (data) {
                var estado = JSON.parse(data);
                div += '<label style="padding-bottom:0px">Estado:</label>';
                div += '<p>' + estado['estado'] + '</p>';
                div += '</div>';
                div += '<div class="feild" style="margin-left:100px">';
                div += '<label style="padding-bottom:0px">Data:</label>';
                div += '<p>' + estado['data'] + '</p>';
                div += '</div>';
                if (estado['estado'] === 'Em manutenção' || estado['estado'] === 'Parada - Em Manutenção') {
                    detach = false;
                    $.post("index.php/equipamento?get_etapas=0&status=" + estado.id, function (data) {
                        var etapas = (JSON.parse(data));
                        div += '<div class="feild" style="margin-left:100px">';
                        div += '<label style="padding-bottom:0px">Etapas:</label>';
                        div += '<ul style="width:100%">'
                        for (var i = 0; i < etapas.length; i++) {
                            div += ('<li style="margin-left: 10px;">-' + etapas[i].accao + ' em ' + etapas[i].data + '</li>');
                        }
                        div += '</ul>';
                        div += '<input type="button" id="adicionar_etapa' + object.getAttribute('equipamento_id') + '" estado="' + estado.id + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="etapas" onclick="equipamento(this,' + tipo + ');" style="width:110px;margin-bottom: 5px;float: left;" value="Adicionar etapa" class="button">'
                        div += '<input type="button" id="historico' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="historico" onclick="equipamento(this,2);" style="width:110px;margin-bottom: 5px;float: left;" value="Histórico completo" class="button"></div>'
                        $("#div" + object.getAttribute('equipamento_id')).after(div + '</div>');
                    });

                }
                else if (estado['estado'] === 'Em Serviço - Com anomalia') {
                    div += '<div class="feild" style="margin-left:100px">';
                    div += '<label style="padding-bottom:0px">Anomalia:</label>';
                    div += '<p>' + estado['descricao'] + '</p>';
                    div += '</div>';
                    div += '<div class="feild" style="margin-left:100px">';
                    div += '<label style="padding-bottom:0px">Comentarios:</label>';
                    console.log(estado['comentario']);
                    if (estado['comentario'] === ' ') {
                        div += '<p>Sem comentários</p>';
                    }
                    else
                        div += '<p>' + estado['comentario'] + '</p>';
                    div += '</div>';
                    div += '<input type="button" id="historico' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="historico" onclick="equipamento(this,2);" style="margin-left:100px;width:110px;margin-bottom: 5px;float: left;" value="Histórico completo" class="button"></div>'
                    $("#div" + object.getAttribute('equipamento_id')).after(div + '</div>');
                }
                else if (estado['estado'] === 'Parada - Indisponível') {
                    div += '<div class="feild" style="margin-left:100px">';
                    div += '<label style="padding-bottom:0px">Indisponibilidade:</label>';
                    div += '<p>' + estado['descricao'] + '</p>';
                    div += '</div>';
                    div += '<div class="feild" style="margin-left:100px">';
                    div += '<label style="padding-bottom:0px">Comentarios:</label>';
                    console.log(estado['comentario']);
                    if (estado['comentario'] === ' ') {
                        div += '<p>Sem comentários</p>';
                    }
                    else
                        div += '<p>' + estado['comentario'] + '</p>';
                    div += '</div>';
                    div += '<input type="button" id="historico' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="historico" onclick="equipamento(this,2);" style="margin-left:100px;width:110px;margin-bottom: 5px;float: left;" value="Histórico completo" class="button"></div>'
                    $("#div" + object.getAttribute('equipamento_id')).after(div + '</div>');
                }
                else {
                    div += '<input type="button" id="historico' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="historico" onclick="equipamento(this,2);" style="margin-left:100px;width:110px;margin-bottom: 5px;float: left;" value="Histórico completo" class="button"></div>'
                    $("#div" + object.getAttribute('equipamento_id')).after(div + '</div>');
                }

            });
        }
        else {
            object.value = 'Mais dados';
            $("#div" + object.getAttribute('equipamento_id')).next().remove();
        }
    }
    else if (object.name === 'etapas') {
        $('#dvLoading').hide();
        if (tipo === 1) {
            $("#" + object.id).before('<select estado="' + object.getAttribute('estado') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '" style="float:left" onchange="equipamento(this,' + tipo + ');" name="etapas_escolha" id="etapas' + object.getAttribute('equipamento_id') + '">' +
                    '<option value="0">Escolha uma opção</option>' +
                    '<option value="1">Colocadas juntas cegas</option>' +
                    '<option value="2">Retiradas juntas cegas</option>' +
                    '<option value="3">Desligada electricamnete</option>' +
                    '<option value="4">Ligada electricamente</option>' +
                    '<option value="5">Retirado equipamento</option>' +
                    '<option value="6">Em lavagem</option>' +
                    '</select>');
        }
        else if (tipo === 2) {
            $("#" + object.id).before('<select estado="' + object.getAttribute('estado') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '" style="float:left" onchange="equipamento(this,' + tipo + ');" name="etapas_escolha" id="etapas' + object.getAttribute('equipamento_id') + '">' +
                    '<option value="0">Escolha uma opção</option>' +
                    '<option value="1">Colocadas juntas cegas</option>' +
                    '<option value="2">Retiradas juntas cegas</option>' +
                    '<option value="3">Desligados cabos electricos</option>' +
                    '<option value="4">Em calibração</option>' +
                    '</select>');
        }
    }
    else if (object.name === 'etapas_escolha') {

        detach = false;
        $.post("index.php/equipamento?update_etapas=0&accao=" + $("#" + object.id + " option:selected").html() + '&status=' + object.getAttribute('estado'), function (data) {
            $('#dvLoading').hide();
            ($("#" + object.id).prev().append('<li style="margin-left: 10px;">-' + $("#" + object.id + " option:selected").html() + ' em ' + data + '</li>'));
            $("#" + object.id).remove();
        });
    }
    else if (object.name === 'historico') {
        detach = false;
        $.post("index.php/equipamento?history=" + object.getAttribute('equipamento_id'), function (data) {
            $('#dvLoading').hide();
            var historico = JSON.parse(data);
            var table = ('<table class="historico"><tr><th style="width:110px">Data</th><th style="width:300px">Status</th><th>Comentátio</th></tr>');
            for (var i = 0; i < historico.length; i++) {

                if (historico[i].status.status == 'Parada - Em Manutenção' || historico[i].status.status === 'Em manutenção') {

                    var div = '<ul style="margin-left: 20px;margin-bottom: 10px;"><h4>Etapas:</h4>';
                    for (var j = 0; j < historico[i].etapas.length; j++) {
                        div += ('<li style="margin-left: 10px;">-' + historico[i].etapas[j].accao + ' em <bold>' + historico[i].etapas[j].data + '</bold></li>');
                    }
                    div += '</ul>'
                    table += '<tr><td>' + historico[i].status.data + '</td><td>Em manutenção' + div + '</td><td>' + historico[i].status.comentario + '</td></tr>';
                }
                else {
                    table += '<tr><td>' + historico[i].status.data + '</td><td>' + historico[i].status.status +'  - '+historico[i].status.descricao+ '</td><td>' + historico[i].status.comentario + '</td></tr>';
                }
            }
            $("#" + object.id).after(table + '</table>');

        });
    }
    else if (object.name === 'alterar_status') {
        $('#dvLoading').hide();
        if ($("#div" + object.getAttribute('equipamento_id'))[0].children[2].value === 'Menos dados') {
            $("#div" + object.getAttribute('equipamento_id'))[0].children[2].value = 'Mais dados';
            $("#div" + object.getAttribute('equipamento_id')).next().remove();
        }
        if (object.value === 'Alterar status') {
            object.value = 'Cancelar';
            detach = false;
            $.post("index.php/equipamento?get_accoes&tipo=" + tipo, function (data) {
                var accoes = JSON.parse(data);
                var element = '<div><form style="width:500px;margin-left:100px">' +
                        '<fieldset id="dialog_elements">' +
                        '<div  class="field">' +
                        '<label style="width: 120px">Novo status:</label>' +
                        '<select onchange="equipamento(this,' + tipo + ');" id="halt-status' + object.getAttribute('equipamento_id') + '" name="halt-status">';
                for (var i = 0; i < accoes.length; i++) {
                    element += '<option value="' + i + '">' + accoes[i] + '</option>';
                }
                element += '</select>' +
                        '</div>' +
                        '</fieldset>' +
                        '</form>' +
                        '<input type="button" id="salvar' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="salvar_status" onclick="equipamento(this,' + tipo + ');" style="margin-left:100px;width:80px;margin-bottom: 5px;float: left;" value="Salvar" class="button">' +
                        '<input type="button" id="salvar' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="pedido" onclick="equipamento(this,' + tipo + ');" style="width:110px;margin-bottom: 5px;float: left;" value="Pedido de trabalho" class="button">' +
                        '<input type="button" id="relatorio' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="relatorio" onclick="equipamento(this,' + tipo + ');" style="width:110px;margin-bottom: 5px;float: left;" value="Alterar relatório" class="button">' +
                        '<input type="button" id="cancel' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="cancel" onclick="equipamento(this,' + tipo + ');" style="width:90px;margin-bottom: 5px;float: left;" value="Cancelar" class="button">' +
                        '</div>' +
                        '<div id="dialog-unidades" title="Unidades">' +
                        '<form id="salvarRelatorioForm" method="post">' +
                        '</form></div>';
                $("#div" + object.getAttribute('equipamento_id')).after(element);
            });
        }
        else {
            object.value = 'Alterar status';
            console.log(object.id);
            $("#div" + object.getAttribute('equipamento_id')).next().remove();
        }
    }
    else if (object.name === 'cancel') {
        $('#dvLoading').hide();
        console.log($("#div" + object.getAttribute('equipamento_id'))[0].children[3].value);
        $("#div" + object.getAttribute('equipamento_id'))[0].children[3].value = 'Alterar status';
        $("#div" + object.getAttribute('equipamento_id')).next().remove();
    }
    else if (object.name === 'relatorio') {
        $("#salvarRelatorioForm").html('<ul id="tab1" class="tabs"></ul>');
        $("#dialog-unidades").dialog('open');
    }
    else if (object.name === 'salvar_status') {
        $('#dvLoading').hide();
        detach = false;
        console.log($("#indisponobilidade option:selected").text());
        var descricao = $("#descricao option:selected").text();
        var comentario = '';
        if ($("#comentario").val() !== undefined)
            comentario = $("#comentario").val();
        $.post("index.php/equipamento?change_satus", {equipamento: object.getAttribute('equipamento_id'), status: $("#halt-status" + object.getAttribute('equipamento_id') + " option:selected").html(), descricao: descricao, comentario: comentario}, function (dat) {
            $("#" + object.getAttribute('equipamento_id')).html($("#halt-status" + object.getAttribute('equipamento_id') + " option:selected").html());
            $("#div" + object.getAttribute('equipamento_id')).next().remove();
            $("#div" + object.getAttribute('equipamento_id'))[0].children[3].value = 'Alterar status';
        });
    }
    else if (object.name === 'halt-status') {
        $('#dvLoading').hide();
        if (object.value === '4') {
            $("#" + object.id).after('<div  class="field">' +
                    '<label style="width: 120px">Indisponibilidade:</label>' +
                    '<select id="descricao">' +
                    '<option value="1">Fuga pelos empanques</option>' +
                    '<option value="2">Vibrações</option>' +
                    '<option value="3">Ruido anormal</option>' +
                    '<option value="4">Aquecimento</option>' +
                    '<option value="5">Valvulas com batimento</option>' +
                    '<option value="6">Manutenção agendada</option>' +
                    '</select>' +
                    '</div>' +
                    '<div  class="field">' +
                    '<label style="width: 120px">Comentários:</label>' +
                    '<textarea id="comentario" style="height: 90px;width:200px"> </textarea>' +
                    '</div>');
        }
        else if (object.value === '1' || object.value === '3') {
            $("#" + object.id).after('<div  class="field">' +
                    '<label style="width: 120px">Anomalia:</label>' +
                    '<select id="descricao">' +
                    '<option value="1">Fuga pelos empanques</option>' +
                    '<option value="2">Vibrações</option>' +
                    '<option value="3">Ruido anormal</option>' +
                    '<option value="4">Aquecimento</option>' +
                    '<option value="5">Valvulas com batimento</option>' +
                    '<option value="6">Manutenção agendada</option>' +
                    '</select>' +
                    '</div>' +
                    '<div  class="field">' +
                    '<label style="width: 120px">Comentários:</label>' +
                    '<textarea id="comentario" style="height: 90px;width:200px"> </textarea>' +
                    '</div>');
        }
        else {
            $("#" + object.id).next().remove();
            $("#" + object.id).next().remove();
            $("#dialog-alterar-status").dialog("option", "height", 180);
        }
    }
}


function equipamento_estatico(object) {
    $('#dvLoading').show();
    if (object == 'novo_estatico') {
        tipo = 3;
        $('#dvLoading').show();
        $('#ajaxform_novo').ajaxForm(ajaxform_novo_options);
        //$("#ajaxform_novo_equipamento").attr('action', 'index.php/equipamento?salvar_novo_dinamico&tipo=1');
        $("#ajaxform_novo").submit(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        );
    }
    else if (object == 1) {
        $.post("index.php/equipamento?novo_estatico=0", function (data) {
            document.getElementById("app").innerHTML = data;
        });
    }
}
function equipamento_dinamico(object) {
    $('#dvLoading').show();
    if (object === 2) {
        $.post("index.php/equipamento?get_status=0&tipo=1", function (data) {
            document.getElementById("app").innerHTML =
                    '<h1>Estado de equipamento dinamico</h1><form><ul id="tab2" class="tabs"></ul></form>';
            var unidades = JSON.parse(data)['unidades'];
            var equipamentos = JSON.parse(data)['equipamentos'];
            estados = JSON.parse(data)['estados'];
            TABS.CreateTabs('tab2');
            for (var i = 0; i < unidades.length; i++) {
                var element = $('<div></div>');
                for (var j = 0; j < equipamentos.length; j++) {
                    var div = ''
                    if (equipamentos[j].unidade === unidades[i].id) {
                        div = '<div id=div' + equipamentos[j].id + ' class="field" style="height: 21px;background-color: #F3F3F3;"><label style="margin-left:5px;">' + equipamentos[j].Equipamento + ':</label>';
                        div += ('<p id="' + equipamentos[j].id + '" style="width: 200px;float: left;">' + equipamentos[j].estado + '</p>');
                        div += ('<input type="button" estado="' + equipamentos[j].estado + '" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="mais_dados" onclick="equipamento(this,1);" style="margin-top: 1px;float: left;" value="Mais dados" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="alterar_status" onclick="equipamento(this,1);" style="width:110px;margin-top: 1px;float: left;" value="Alterar status" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="inspecoes" onclick="equipamento(this,1);" style="width:100px;margin-top: 1px;float: left;" value="Inspeções" class="button">'+
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="alterar" onclick="equipamento(this,2);" style="width:120px;margin-top: 1px;float: left;" value="Alterar equipamento" class="button"></div>');
                        element.append(div);
                    }
                }
                element.css('padding', '10px');
                element.css('overflow', 'auto');
                if (i === 0)
                    TABS.AddTab(unidades[i].designacao, true, element[0].outerHTML, 'tab2');
                else
                    TABS.AddTab(unidades[i].designacao, false, element[0].outerHTML, 'tab2');
            }

        });
    }

    else if (object === 1) {
        $.post("index.php/equipamento?novo_dinamico=0", function (data) {
            document.getElementById("app").innerHTML = data;
        });
    } else if (object === 3) {
        $.post("index.php/equipamento?horas_de_marcha=0", function (data) {
            document.getElementById("app").innerHTML = data;
        });
    }
    else if (object === 'novo_equipamento_dinamico') {
        tipo = 1;
        $('#ajaxform_novo').ajaxForm(ajaxform_novo_options);
        //$("#ajaxform_novo_equipamento").attr('action', 'index.php/equipamento?salvar_novo_dinamico&tipo=1');
        $("#ajaxform_novo").submit(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        });
    }

    if (object.name === 'alterar') {
        detach = false;
        $("#salvarRelatorioForm").html('<ul id="tab1" class="tabs"></ul>');
        $("#dialog-unidades").dialog("open");
    }
}




