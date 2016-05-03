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
    detach = false;
    $.post('index.php/equipamento?salvar_novo&tipo=' + tipo, {
        dados: (formData)
    }, function (data) {
        $('#dvLoading').hide();
        //document.getElementById("app").innerHTML = data;
        $("#informacao").html('Novo equipamento adicionado!');
        $("#dialog-informacao").dialog('open');
    });
    return false;
}

function ajaxform_novo_options_response(responseText, statusText, xhr, $form) {
    conslole.log(responseText);
}

function equipamento_estatico(object) {
    $('#dvLoading').show();
    if (object === 2) {
        $.post("index.php/equipamento?get_status=0&tipo=3", function (data) {
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
                        div = '<div id=div' + equipamentos[j].id + ' class="field" style="height: 22px;background-color: #F3F3F3;"><label style="margin-left:5px;">' + equipamentos[j].Equipamento + ':</label>';
                        div += ('<p id="' + equipamentos[j].id + '" style="width: 200px;float: left;">' + equipamentos[j].estado + '</p>');
                        div += ('<input type="button" estado="' + equipamentos[j].estado + '" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="mais_dados" onclick="equipamento(this,3);" style="background-image: url(img/buttons/b_view.png);margin-top: 1px;float: left;" value="Mais dados" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  unidade="' + unidades[i].id + '" name="alterar_status" onclick="equipamento(this,3);" style="background-image: url(img/buttons/exec.png);alterarmargin-top: 1px;float: left;" value="Alterar status" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="inspecoes" onclick="equipamento(this,3);" style="background-image: url(img/buttons/b_usredit.png);margin-top: 1px;float: left;" value="Inspeções" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="alterar" onclick="equipamento(this,3);" style="background-image: url(img/buttons/b_edit.png);margin-top: 1px;float: left;" value="Alterar equipamento" class="button"></div>');
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
            $("#app").append(
                    '<div id="dialog-unidades" title="Unidades">' +
                    '<form id="salvarRelatorioForm" method="post">' +
                    '</form><div id="dialog-informacao" title="Informação">' +
                    '<label id="informacao">        ' +
                    '    </label>' +
                    '</div>')
        });
    }
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
                //equipamentos.sort();
                for (var j = 0; j < equipamentos.length; j++) {
                    var div = ''
                    if (equipamentos[j].unidade === unidades[i].id) {
                        div = '<div id=div' + equipamentos[j].id + ' class="field" style="height: 22px;background-color: #F3F3F3;"><label style="margin-left:5px;">' + equipamentos[j].Equipamento + ':</label>';
                        if(equipamentos[j].estado==='Em Serviço' || equipamentos[j].estado==='Em Serviço - Em observação' )
                            div += ('<img equipamento_id="' + equipamentos[j].id + '" class="status_icon" id="icon'+equipamentos[j].id+'" onclick="equipamento(\'flip_status\',this)" src="img/status/DONE.png" alt="Smiley face" height="16" width="16"><p id="' + equipamentos[j].id + '" style="width: 200px;float: left;">' + equipamentos[j].estado + '</p>');
                        else  if(equipamentos[j].estado==='Em Serviço - Com anomalia')
                            div += ('<img equipamento_id="' + equipamentos[j].id + '" class="status_icon" src="img/status/NOTOK.png" alt="Smiley face" height="16" width="16"><p id="' + equipamentos[j].id + '" style="width: 200px;float: left;">' + equipamentos[j].estado + '</p>');
                        else  if(equipamentos[j].estado==='Em manutençao' )
                            div += ('<img equipamento_id="' + equipamentos[j].id + '" class="status_icon" id="icon'+equipamentos[j].id+'" src="img/action/edit.png" alt="Smiley face" height="16" width="16"><p id="' + equipamentos[j].id + '" style="width: 200px;float: left;">' + equipamentos[j].estado + '</p>');
                        else
                            div += ('<img equipamento_id="' + equipamentos[j].id + '" class="status_icon" id="icon'+equipamentos[j].id+'" onclick="equipamento(\'flip_status\',this)" src="img/status/VOIDED.png" alt="Smiley face" height="16" width="16"><p id="' + equipamentos[j].id + '" style="width: 200px;float: left;">' + equipamentos[j].estado + '</p>');                           
                        div += ('<input type="button" estado="' + equipamentos[j].estado + '" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="mais_dados" onclick="equipamento(this,1);" style="background-image: url(img/buttons/b_view.png);margin-top: 1px;float: left;" value="Mais dados" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  unidade="' + unidades[i].id + '" name="alterar_status" onclick="equipamento(this,1);" style="background-image: url(img/buttons/exec.png);margin-top: 1px;float: left;" value="Alterar status" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="inspecoes" onclick="equipamento(this,1);" style="background-image: url(img/buttons/b_usredit.png);margin-top: 1px;float: left;" value="Inspeções" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="alterar" onclick="equipamento(this,1);" style="background-image: url(img/buttons/b_edit.png);margin-top: 1px;float: left;" value="Alterar equipamento" class="button"></div>');
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
            $("#app").append(
                    '<div id="dialog-unidades" title="Unidades">' +
                    '<form id="salvarRelatorioForm" method="post">' +
                    '</form><div id="dialog-informacao" title="Informação">' +
                    '<label id="informacao">        ' +
                    '    </label>' +
                    '</div>');
        });
    }

    else if (object === 1) {
        $.post("index.php/equipamento?novo_dinamico=0", function (data) {
            document.getElementById("app").innerHTML = data;
        });
    } else if (object === 3) {
        $.post("index.php/equipamento?horas_de_marcha=0", function (data) {
            console.log(data);
            document.getElementById("app").innerHTML =
                    '<h1>Horas de marcha de equipamento dinamico</h1><form><ul id="tab2" class="tabs"></ul></form>';
            var unidades = JSON.parse(data)['unidades'];
            var horas = JSON.parse(data)['horas'];
            console.log(horas);
            TABS.CreateTabs('tab2');
            for (var i = 0; i < unidades.length; i++) {
                var element = $('<div></div>');
                var div = '';
                div = '<div  class="field" style="height: 21px">' +
                        '<label style="width: 120px;margin-left: 100px;">Total de horas</label>' +
                        '<label style="width: 100px;">Este mês</label>' +
                        '<label style="width: 250px;">Status</label></div>';
                element.append(div);
                for (var j = 0; j < horas.length; j++) {
                    var div = ''
                    if (horas[j].equipamento.unidade === unidades[i].id && horas[j].equipamento.tipo === '1') {
                        div = '<div id=div' + horas[j].equipamento.id + ' class="field" style="height: 21px;background-color: #F3F3F3;">' +
                                '<label style="margin-left:5px;">' + horas[j].equipamento.Equipamento + ':</label>' +
                                '<label style="width: 120px;">' + horas[j].total + '</label>' +
                                '<label style="width: 100px;">' + horas[j].mes + '</label>' +
                                '<label style="width: 250px;">' + horas[j].equipamento.estado + '</label>';
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
                    '<h1>Estado dos Instrumentos</h1><form><ul id="tab2" class="tabs"></ul></form><div id="dialog-informacao" title="Informação">' +
                    '<label id="informacao">        ' +
                    '    </label>' +
                    '</div>';
            var unidades = JSON.parse(data)['unidades'];
            var equipamentos = JSON.parse(data)['equipamentos'];
            estados = JSON.parse(data)['estados'];
            TABS.CreateTabs('tab2');
            for (var i = 0; i < unidades.length; i++) {
                var element = $('<div></div>');
                for (var j = 0; j < equipamentos.length; j++) {
                    var div = ''
                    if (equipamentos[j].unidade === unidades[i].id) {
                        div = '<div id=div' + equipamentos[j].id + ' class="field" style="height: 22px;background-color: #F3F3F3;"><label style="margin-left:5px;">' + equipamentos[j].Equipamento + ':</label>';
                        if(equipamentos[j].estado==='Em Serviço' || equipamentos[j].estado==='Em Serviço - Em observação' )
                            div += ('<img equipamento_id="' + equipamentos[j].id + '" class="status_icon" id="icon'+equipamentos[j].id+'" onclick="equipamento(\'flip_status\',this)" src="img/status/DONE.png" alt="Smiley face" height="16" width="16"><p id="' + equipamentos[j].id + '" style="width: 200px;float: left;">' + equipamentos[j].estado + '</p>');
                        else  if(equipamentos[j].estado==='Em Serviço - Com anomalia')
                            div += ('<img equipamento_id="' + equipamentos[j].id + '" class="status_icon" src="img/status/NOTOK.png" alt="Smiley face" height="16" width="16"><p id="' + equipamentos[j].id + '" style="width: 200px;float: left;">' + equipamentos[j].estado + '</p>');
                        else  if(equipamentos[j].estado==='Em manutençao' )
                            div += ('<img equipamento_id="' + equipamentos[j].id + '" class="status_icon" id="icon'+equipamentos[j].id+'" src="img/action/edit.png" alt="Smiley face" height="16" width="16"><p id="' + equipamentos[j].id + '" style="width: 200px;float: left;">' + equipamentos[j].estado + '</p>');
                        else
                            div += ('<img equipamento_id="' + equipamentos[j].id + '" class="status_icon" id="icon'+equipamentos[j].id+'" onclick="equipamento(\'flip_status\',this)" src="img/status/VOIDED.png" alt="Smiley face" height="16" width="16"><p id="' + equipamentos[j].id + '" style="width: 200px;float: left;">' + equipamentos[j].estado + '</p>');                           
                        div += ('<input type="button" estado="' + equipamentos[j].estado + '" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="mais_dados" onclick="equipamento(this,2);" style="background-image: url(img/buttons/b_view.png);margin-top: 1px;float: left;" value="Mais dados" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  unidade="' + unidades[i].id + '" name="alterar_status" onclick="equipamento(this,2);" style="background-image: url(img/buttons/exec.png);margin-top: 1px;float: left;" value="Alterar status" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="inspecoes" onclick="equipamento(this,2);" style="background-image: url(img/buttons/b_usredit.png);margin-top: 1px;float: left;" value="Inspeções" class="button">' +
                                '<input type="button" equipamento_id="' + equipamentos[j].id + '"   unidade="' + unidades[i].id + '"  equipamento="' + equipamentos[j].Equipamento + '" name="alterar" onclick="equipamento(this,2);" style="background-image: url(img/buttons/b_edit.png);margin-top: 1px;float: left;" value="Alterar equipamento" class="button"></div>');
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
    $('#dvLoading').show();
    if (object.name === 'alterar') {
        if ($("#div" + object.getAttribute('equipamento_id')).next().length > 0) {
            if ($("#div" + object.getAttribute('equipamento_id')).next()[0].style.backgroundColor === '') {
                $("#div" + object.getAttribute('equipamento_id')).next().remove();
            }
        }
        detach = false;
        $.post("index.php/equipamento?get_equipamento=" + object.getAttribute('equipamento_id'), function (data) {
            $('#dvLoading').hide();
            var equipamento = JSON.parse(data);
            console.log(equipamento);
            var element = '<div style="margin-left:100px;margin-bottom:10px">' +
                    '<div style="margin-bottom: 10px;" class="field">' +
                    '<label >Nome:</label>' +
                    '<input type="text" value="' + equipamento['equipamento'] + '" style="width: 200px"/>' +
                    '</div>' +
                    '<div class="field">' +
                    '<label>Descrição:</label>' +
                    '<textarea style="height: 50px;width: 550px" name="descricao">' + equipamento['descricao'] + '</textarea>' +
                    '</div>' +
                    '<input type="button" unidade="' + object.getAttribute('unidade') + '" id="salvar' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="salvar_equipamneto" onclick="equipamento(this,' + tipo + ');" style="background-image: url(img/buttons/save.png);margin-bottom: 5px;float: left;" value="Salvar" class="button">' +
                    '<input type="button" id="pedido' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="eliminar_equipamento" onclick="equipamento(this,' + tipo + ');" style="background-image: url(img/buttons/b_drop.png);margin-bottom: 5px;float: left;" value="Eliminar" class="button">' +
                    '<input type="button" onclick="$(\'#div' + object.getAttribute('equipamento_id') + '\').next().remove();" style="background-image: url(img/buttons/s_cancel.png);margin-bottom: 5px;float: left;" value="Cancelar" class="button">' +
                    '</div>';
            $("#div" + object.getAttribute('equipamento_id')).after(element);
        });
    }
    if (object.name === 'salvar_equipamneto') {
        detach = false;
        console.log($("#div" + object.getAttribute('equipamento_id')).next().children());
        var id = object.getAttribute('equipamento_id');
        var descricao = $("#div" + object.getAttribute('equipamento_id')).next().children()[1].children[1].value;
        var equipqmento = $("#div" + object.getAttribute('equipamento_id')).next().children()[0].children[1].value;
        $.post("index.php/equipamento?update_equipamento&id=" + id + "&equipqmento=" + equipqmento + "&descricao=" + descricao, function (data) {
            $('#dvLoading').hide();
            $("#div" + object.getAttribute('equipamento_id')).next().remove();
            ($("#div" + object.getAttribute('equipamento_id'))[0].children[0].innerHTML = equipqmento);
            $("#informacao").html('Equipamento alterado com sucesso!');
            $("#dialog-informacao").dialog('open');
        });
    }
    if (object.name === 'eliminar_equipamento') {
        detach = false;

        $.post('index.php/equipamento?delete&id=' + object.getAttribute('equipamento_id'), function (data) {
            console.log(data);
            $("#" + object.id).parent().prev().remove()
            $("#" + object.id).parent().remove();
            $("#informacao").html('Equipamento Eliminado!');
            $("#dialog-informacao").dialog('open');
        });
    }
    if (object.name === 'mais_dados') {
        $('#dvLoading').hide();
        if ($("#div" + object.getAttribute('equipamento_id')).next().length > 0) {
            if ($("#div" + object.getAttribute('equipamento_id')).next()[0].style.backgroundColor === '') {
                $("#div" + object.getAttribute('equipamento_id')).next().remove();
            }
        }
        var div = '<div ><div class="feild" style="margin-left:100px">';
        detach = false;
        if (object.value === 'Mais dados') {
            //object.value = 'Menos dados';
            $.post("index.php/equipamento?get_status_equipamento=0&equipamento=" + object.getAttribute('equipamento_id'), function (data) {
                var estado = JSON.parse(data);
                div += '<label style="padding-bottom:0px">Estado:</label>';
                div += '<p>' + estado['estado'] + '</p>';
                div += '</div>';
                div += '<div class="feild" style="margin-left:100px">';
                div += '<label style="padding-bottom:0px">Data:</label>';
                div += '<p>' + estado['data'] + '</p>';
                div += '</div>';
                if (estado['estado'] === 'Em manutençao' || estado['estado'] === 'Parada - Em Manutenção') {
                    detach = false;
                    $.post("index.php/equipamento?get_etapas=0&status=" + estado.id, function (data) {
                        var etapas = (JSON.parse(data));
                        div += '<div class="feild" style="margin-left:100px">';
                        div += '<label style="padding-bottom:0px">Etapas:</label>';
                        div += '<ul style="margin: 10px;width:100%">'
                        for (var i = 0; i < etapas.length; i++) {
                            div += ('<li style="margin-left: 10px;">-' + etapas[i].accao + ' em ' + etapas[i].data + '</li>');
                        }
                        div += '</ul>';
                        div += '<input type="button" id="adicionar_etapa' + object.getAttribute('equipamento_id') + '" estado="' + estado.id + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="etapas" onclick="equipamento(this,' + tipo + ');" style="background-image: url(img/buttons/b_snewtbl.png);margin-bottom: 5px;float: left;" value="Adicionar etapa" class="button">'
                        div += '<input type="button" id="historico' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="historico" onclick="equipamento(this,' + tipo + ');" style="background-image: url(img/buttons/b_view_add.png);margin-bottom: 5px;float: left;" value="Histórico completo" class="button">';
                        div += '<input type="button" onclick="$(\'#div' + object.getAttribute('equipamento_id') + '\').next().remove();" style="background-image: url(img/buttons/s_cancel.png);margin-bottom: 5px;float: left;" value="Cancelar" class="button"></div>';
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
                    div += '<input type="button" id="historico' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="historico" onclick="equipamento(this,' + tipo + ');" style="background-image: url(img/buttons/b_view_add.png);margin-bottom: 5px;float: left;" value="Histórico completo" class="button">';
                    div += '<input type="button" onclick="$(\'#div' + object.getAttribute('equipamento_id') + '\').next().remove();" style="background-image: url(img/buttons/s_cancel.png);margin-bottom: 5px;float: left;" value="Cancelar" class="button"></div>';
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
                    div += '<input type="button" id="historico' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="historico" onclick="equipamento(this,' + tipo + ');" style="background-image: url(img/buttons/b_view_add.png);margin-left: 100px;margin-bottom: 5px;float: left;" value="Histórico completo" class="button">';
                    div += '<input type="button" onclick="$(\'#div' + object.getAttribute('equipamento_id') + '\').next().remove();" style="background-image: url(img/buttons/s_cancel.png);margin-bottom: 5px;float: left;" value="Cancelar" class="button"></div>';
                    $("#div" + object.getAttribute('equipamento_id')).after(div + '</div>');
                }
                else {
                    div += '<input type="button" id="historico' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="historico" onclick="equipamento(this,' + tipo + ');" style="background-image: url(img/buttons/b_view_add.png);margin-left: 100px;margin-bottom: 5px;float: left;" value="Histórico completo" class="button">';
                    div += '<input type="button" onclick="$(\'#div' + object.getAttribute('equipamento_id') + '\').next().remove();" style="background-image: url(img/buttons/s_cancel.png);margin-bottom: 5px;float: left;" value="Cancelar" class="button"></div>';
                    $("#div" + object.getAttribute('equipamento_id')).after(div + '</div>');
                }

            });
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
        else if (tipo === 3) {
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
            var table = ('<table  style="width:700px;" class="historico"><tr><th style="width:110px">Data</th><th style="width:300px">Status</th><th>Comentátio</th></tr>');
            for (var i = 0; i < historico.length; i++) {

                if (historico[i].status.status == 'Parada - Em Manutenção' || historico[i].status.status === 'Em manutençao') {

                    var div = '<ul style="margin-left: 20px;margin-bottom: 10px;"><h4>Etapas:</h4>';
                    for (var j = 0; j < historico[i].etapas.length; j++) {
                        div += ('<li style="margin-left: 10px;">-' + historico[i].etapas[j].accao + ' em <bold>' + historico[i].etapas[j].data + '</bold></li>');
                    }
                    div += '</ul>'
                    table += '<tr><td>' + historico[i].status.data + '</td><td>Em manutenção' + div + '</td><td>' + historico[i].status.comentario + '</td></tr>';
                }
                else {
                    table += '<tr><td>' + historico[i].status.data + '</td><td>' + historico[i].status.status + '  - ' + historico[i].status.descricao + '</td><td>' + historico[i].status.comentario + '</td></tr>';
                }
            }
            console.log($("#" + object.id).prev().prop('nodeName'));
            if ($("#" + object.id).prev().prop('nodeName') === 'INPUT')
                $("#" + object.id).before('<div style="margin:10px;margin-top:40px;margin-left:0px;">' + table + '</table></div>');
            else
                $("#" + object.id).before('<div style="margin:10px;margin-left:100px;">' + table + '</table></div>');

        });
    }
    else if (object.name === 'alterar_status') {

        if ($("#div" + object.getAttribute('equipamento_id')).next().length > 0) {
            if ($("#div" + object.getAttribute('equipamento_id')).next()[0].style.backgroundColor === '') {
                $("#div" + object.getAttribute('equipamento_id')).next().remove();
            }
        }
        if (object.value === 'Alterar status') {
            //object.value = 'Cancelar';
            detach = false;
            $.post("index.php/equipamento?get_accoes&tipo=" + tipo, function (data) {
                $('#dvLoading').hide();
                var accoes = JSON.parse(data);
                var element = '<div style="margin-left:100px;margin-bottom:10px">' +
                        '<div style="margin-bottom: 10px;" class="field">' +
                        '<label style="width: 120px">Novo status:</label>' +
                        '<select onchange="equipamento(this,' + tipo + ');" id="halt-status' + object.getAttribute('equipamento_id') + '" name="halt-status">';
                for (var i = 0; i < accoes.length; i++) {
                    element += '<option value="' + i + '">' + accoes[i] + '</option>';
                }
                element += '</select>' +
                        '</div>' +
                        '<input type="button" unidade="' + object.getAttribute('unidade') + '" id="salvar' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="salvar_status" onclick="equipamento(this,' + tipo + ');" style="background-image: url(img/buttons/save.png);margin-bottom: 5px;float: left;" value="Salvar" class="button">' +
                        '<input type="button" id="pedido' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="pedido_trabalho" onclick="equipamento(this,' + tipo + ');" style="background-image: url(img/buttons/normalize.png);margin-bottom: 5px;float: left;" value="Pedido de trabalho" class="button">' +
                        '<input type="button" id="relatorio' + object.getAttribute('equipamento_id') + '" equipamento_id="' + object.getAttribute('equipamento_id') + '"  name="relatorio" onclick="equipamento(this,' + tipo + ');" style="background-image: url(img/buttons/b_edit.png);margin-bottom: 5px;float: left;" value="Alterar relatório" class="button">' +
                        '<input type="button"  onclick="$(\'#div' + object.getAttribute('equipamento_id') + '\').next().remove();" style="background-image: url(img/buttons/s_cancel.png);margin-bottom: 5px;float: left;" value="Cancelar" class="button">' +
                        '</div>';
                $("#div" + object.getAttribute('equipamento_id')).after(element);
            });
        }

    }
    else if (object.name === 'pedido_trabalho') {
        $('#dvLoading').hide();
        if (object.value === 'Pedido de trabalho') {
            object.value = 'Cancelar pedido';
            var div = '<div class="field">' +
                    '<label style="width: 120px">Pedido de trabalho:</label>' +
                    '</div>' +
                    '<div class="field">' +
                    '<label style="width: 120px">Prioridade:</label>' +
                    '<select id="pedido_prioridade">' +
                    '<option value="1">Normal</option>' +
                    '<option value="2">Urgente</option>' +
                    '<option value="3">Emergente</option>' +
                    '</select>' +
                    '</div>' +
                    '<div class="field">' +
                    '<label style="width: 120px">Texto:</label>' +
                    '<textarea id="comentario" style="height: 40px;width:280px"> </textarea>' +
                    '</div>';
            ($("#" + object.id).prev().prev().append(div));
        }
        else {
            object.value = 'Pedido de trabalho';
            ($("#" + object.id).prev().prev().children().last().remove());
            $("#" + object.id).prev().prev().children().last().remove();
            $("#" + object.id).prev().prev().children().last().remove();
        }
    }
    else if (object.name === 'cancel') {
        $('#dvLoading').hide();
        $("#div" + object.getAttribute('equipamento_id'))[0].children[3].value = 'Alterar status';
        $("#div" + object.getAttribute('equipamento_id')).next().remove();
    }
    else if (object.name === 'relatorio') {
        $('#dvLoading').hide();
        $("#salvarRelatorioForm").html('<ul id="tab1" class="tabs"></ul>');
        $("#dialog-unidades").dialog('open');
    }
    else if(object==='flip_status'){
       console.log(tipo.src);
       if(tipo.src==='http://localhost/img/status/DONE.png'){
        $.post("index.php/equipamento?change_satus", {
                equipamento: tipo.getAttribute('equipamento_id'),
                status: 'Parada - Disponível',
                descricao: '',
                comentario: ''
            }, function (dat) {
            tipo.src='http://localhost/img/status/VOIDED.png';
            ($("#icon"+tipo.getAttribute('equipamento_id')).next().html('Parada - Disponível'));
       })
    }
       else{
        $.post("index.php/equipamento?change_satus", {
                equipamento: tipo.getAttribute('equipamento_id'),
                status: 'Em Serviço',
                descricao: '',
                comentario: ''
            }, function (dat) {
            tipo.src='http://localhost/img/status/DONE.png';
            $("#icon"+tipo.getAttribute('equipamento_id')).next().html('Em Serviço');
       });
       }

    }
    else if (object.name === 'salvar_status') {
        console.log($("#div" + object.getAttribute('equipamento_id')).next());
        
        detach = false;
        if ($("#" + object.id).prev().children().length === 2) {
            $.post("index.php/equipamento?change_satus", {
                equipamento: object.getAttribute('equipamento_id'),
                status: $("#halt-status" + object.getAttribute('equipamento_id') + " option:selected").html(),
                descricao: '',
                comentario: ''
            }, function (dat) {
                $('#dvLoading').hide();
                var status=$("#halt-status" + object.getAttribute('equipamento_id') + " option:selected").html();
                $("#" + object.getAttribute('equipamento_id')).html(status);
                $("#div" + object.getAttribute('equipamento_id')).next().remove();
                if(status==='Em Serviço' || status==='Em Serviço - Em observação' )
                  $("#div" + object.getAttribute('equipamento_id'))[0].children[1].src='img/status/DONE.png';
              else if(status==='Em Serviço - Com anomalia')
                    $("#div" + object.getAttribute('equipamento_id'))[0].children[1].src='img/status/NOTOK.png';
                else
                  $("#div" + object.getAttribute('equipamento_id'))[0].children[1].src='img/status/VOIDED.png';
            });
        }

        if ($("#" + object.id).prev().children().length === 4) {
            var descricao = $("#descricao option:selected").text();
            var comentario = $("#comentario").val();
            $.post("index.php/equipamento?change_satus", {
                equipamento: object.getAttribute('equipamento_id'),
                status: $("#halt-status" + object.getAttribute('equipamento_id') + " option:selected").html(),
                descricao: descricao,
                comentario: comentario
            }, function (dat) {
                 $('#dvLoading').hide();
                var status=$("#halt-status" + object.getAttribute('equipamento_id') + " option:selected").html();
                $("#" + object.getAttribute('equipamento_id')).html(status);
                $("#div" + object.getAttribute('equipamento_id')).next().remove();
                if(status==='Em Serviço' || status==='Em Serviço - Em observação' )
                  $("#div" + object.getAttribute('equipamento_id'))[0].children[1].src='img/status/DONE.png';
                else if(status==='Em Serviço - Com anomalia')
                    $("#div" + object.getAttribute('equipamento_id'))[0].children[1].src='img/status/NOTOK.png';
                else
                  $("#div" + object.getAttribute('equipamento_id'))[0].children[1].src='img/status/VOIDED.png';
            });
        }
        if ($("#" + object.id).prev().children().length === 5) {
            if ($("#" + object.id).prev().children()[4].children[1].value === ' ') {
                $('#dvLoading').hide();
                alert('Erro : Tem de designar o pedido de trabalho');
            }
            else {
                $.post("index.php/equipamento?change_satus", {
                    equipamento: object.getAttribute('equipamento_id'),
                    status: $("#halt-status" + object.getAttribute('equipamento_id') + " option:selected").html(),
                    descricao: '',
                    comentario: ''
                }, function (dat) {

                    $("#" + object.getAttribute('equipamento_id')).html($("#halt-status" + object.getAttribute('equipamento_id') + " option:selected").html());
                    var prioridade = $("#" + object.id).prev().children()[3].children[1].value;
                    var texto = $("#" + object.id).prev().children()[4].children[1].value;
                    var unidade = object.getAttribute('unidade');
                    var equipamento = object.getAttribute('equipamento_id');
                    $.post("index.php/pedidos_trabalho?save", {
                        prioridade: prioridade,
                        texto: texto,
                        unidade: unidade,
                        equipamento: equipamento
                    }, function (dat) {
                        $('#dvLoading').hide();
                        $("#div" + object.getAttribute('equipamento_id')).next().remove();
                        $("#div" + object.getAttribute('equipamento_id'))[0].children[3].value = 'Alterar status';
                        alert('Pedido de trabalho realizado com sucesso');
                    });
                });
            }
        }
        if ($("#" + object.id).prev().children().length === 7) {
            descricao = $("#descricao option:selected").text();
            comentario = $("#comentario").val();
            if ($("#" + object.id).prev().children()[6].children[1].value === ' ') {
                $('#dvLoading').hide();
                alert('Erro : Tem de designar o pedido de trabalho')
            }
            else {
                $.post("index.php/equipamento?change_satus", {
                    equipamento: object.getAttribute('equipamento_id'),
                    status: $("#halt-status" + object.getAttribute('equipamento_id') + " option:selected").html(),
                    descricao: descricao,
                    comentario: comentario
                }, function (dat) {

                    $("#" + object.getAttribute('equipamento_id')).html($("#halt-status" + object.getAttribute('equipamento_id') + " option:selected").html());
                    var prioridade = $("#" + object.id).prev().children()[5].children[1].value;
                    var texto = $("#" + object.id).prev().children()[6].children[1].value;
                    var unidade = object.getAttribute('unidade');
                    var equipamento = object.getAttribute('equipamento_id');
                    $.post("index.php/pedidos_trabalho?save", {
                        prioridade: prioridade,
                        texto: texto,
                        unidade: unidade,
                        equipamento: equipamento
                    }, function (dat) {
                        $('#dvLoading').hide();
                        $("#div" + object.getAttribute('equipamento_id')).next().remove();
                        $("#div" + object.getAttribute('equipamento_id'))[0].children[3].value = 'Alterar status';
                        alert('Pedido de trabalho realizado com sucesso');
                    });
                });
            }
        }
    }
    else if (object.name === 'halt-status') {
        console.log($("#" + object.id).siblings().length);
        $('#dvLoading').hide();
        if ($("#" + object.id).siblings().length === 3 || $("#" + object.id).siblings().length === 6) {
            $("#" + object.id).next().remove();
            $("#" + object.id).next().remove();
        }
        if ($("#" + object.id)[0][object.value].innerText === 'Parada - Indisponível') {
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
                    '<textarea id="comentario" style="height: 50px;width:280px"> </textarea>' +
                    '</div>');
        }
        else if ($("#" + object.id)[0][object.value].innerText === 'Em Serviço - Com anomalia') {
            $("#" + object.id).after('<div  class="field">' +
                    '<label style="float:left;width: 120px">Anomalia:</label>' +
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
                    '<label style="float:left;width: 120px">Comentários:</label>' +
                    '<textarea id="comentario" style="height: 50px;width:280px"> </textarea>' +
                    '</div>');
        }

    }
}
function subChangeEquipamentoUnidaded(inst) {
    $('#dvLoading').show();
    if (inst.name === 'horas') {
        $.post("index.php/equipamento?horas_de_marcha=0&unidade=" + inst.value, function (data) {
            if ($("#dialog-status-equipamento").dialog("isOpen")) {

            }
            else
                document.getElementById("app").innerHTML = data;
        });
    }
    else if (inst.name === 'instrumentos') {
        $.post("index.php/equipamento?status_instrumentos=0&unidade=" + inst.value, function (data) {
            document.getElementById("app").innerHTML = data;
        });
    }
    else {
        $.post("index.php/equipamento?status_dinamico=0&unidade=" + inst.value, function (data) {
            document.getElementById("app").innerHTML = data;
        });
    }
}








