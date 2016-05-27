var relatorio_array = [];
var selected_block;
var number_of_blocks = 0;
var selected_block_top;
var selected_block_left;
var pagina = 0;
var versao = 0;
var unidadesoptions = {
    //success: showResponseUnidades,
    beforeSubmit: showRequestUnidades, // pre-submit callback 
};

var matrix_table_choose = '<div class="field">' +
        '<label>Linhas:</label>' +
        '<select id="linhas" onchange="relatorio(this)">' +
        '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="3">3</option>' +
        '<option value="4">4</option>' +
        '<option value="5">5</option>' +
        '<option value="6">6</option>' +
        '<option value="7">7</option>' +
        '<option value="8">8</option>' +
        '<option value="9">9</option>' +
        '<option value="10">10</option>' +
        '</select>' +
        '</div>' +
        '<div class="field">' +
        '<label>Colunas:</label>' +
        '<select id="colunas" onchange="relatorio(this)">' +
        '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="3">3</option>' +
        '<option value="4">4</option>' +
        '<option value="5">5</option>' +
        '<option value="6">6</option>' +
        '<option value="7">7</option>' +
        '<option value="8">8</option>' +
        '<option value="9">9</option>' +
        '</select>' +
        '</div>';
var matrix_table = '<div id="tabelabloco" class="field">' +
        '<table id="MatrixTable"  width="500" border="0" cellpadding="0" cellspacing="0">' +
        '<tbody id="MatrixTableBody">' +
        '<tr style="height:  20px" >' +
        '<td></td><td onclick="relatorio(this)" style="">ClickMe</td>' +
        '</tr>' +
        '<tr style="height:  20px">' +
        '<td onclick="relatorio(this)">ClickMe</td><td></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';

var escolha_multipla = '<div id="escolhas_multiplas">' +
        '<div  class="field">' +
        '<label>Escolha1:</label>' +
        '<input type="text" style="width: 250px" name="escolha1"/>' +
        '<input type="button" name="adicionar" onclick="relatorio(this);" style="background-image: url(img/buttons/VOIDED.png);height: 20px;padding-right:0px"  class="button">' +
        '</div></div><input type="button" name="adicionar" onclick="relatorio(this);" style="float:left;background-image: url(img/buttons/b_snewtbl.png);height: 20px;margin-top:10px" value="Adicionar linha"  class="button">';

var valores_simples =
        '<div class="field">' +
        '<label>Unidades:</label>' +
        '<select id="select_unidades">' +
        '<option>&nbsp</option>' +
        '<option>Kg/m&sup3</option>' +
        '<option>Kg/Cm&sup2</option>' +
        '<option>ºC</option>' +
        '<option>Nm&sup3/m&sup3</option>' +
        '<option>mol/mol</option>' +
        '<option>ppm</option>' +
        '<option>cm/min</option>' +
        '<option>m&sup3</option>' +
        '<option>º Baumé</option>' +
        '<option>%</option>' +
        '</select>' +
        '</div></div>';

var separador = 5000;
var separator_array = [];


function showRequestUnidades(responseText, statusText, xhr, $form) {
    console.log(statusText);
    detach = false;
    var accao;
    var manobra;
    var comentario;
    if ($("#accao_id").val() === undefined) {
        accao = 0;
        manobra = 0;
    } else {
        accao = $("#accao_id").val();
        manobra = accao.split('-')[1];
    }
    if ($("#comentario").val() === undefined) {
        comentario = '';
    }
    else {
        comentario = $("#comentario").val();
    }
    $.post("index.php/relatorio?salvarrelatorio=true", {
        dados: JSON.stringify(responseText), accao: accao, manobra: manobra, comentario: comentario
    }, function (data) {
        $('#dvLoading').hide();
        if ($("#comentario").val() !== undefined) {
            relatorio(2, -1);
        }

    });
    return false;
}


function eliminar_separador(id, index) {
    console.log($("#containment-wrapper" + pagina));
    $("#containment-wrapper" + pagina).find('#draggable' + id).remove();
    separator_array[index] = null;
}

function relatorio(type, obj) {

    if (type.name === 'apagar_versao') {
        $('#dvLoading').show();
        $.post('index.php/relatorio?deleteversao&versao=' + type.getAttribute('versao'), function () {
            $.post("index.php/relatorio?getversoes=" + type, function (data) {
                //console.log(JSON.parse(data));
                document.getElementById("app").innerHTML = data;
            });
        });
    }
    if (type.name === 'nova_versao') {
        $("#dialog-novaversao").dialog('open');
    }
    if (type.name === 'set_as_default') {
        $('#dvLoading').show();
        $.post('index.php/relatorio?setdefaultversao=' + type.getAttribute('versao'), function () {
            $.post("index.php/relatorio?getversoes=" + type, function (data) {
                //console.log(JSON.parse(data));
                document.getElementById("app").innerHTML = data;
            });
        });
    }
    if (type === 'salvar_relatorio') {
        $("#dialog-comentario-relatorio").data('callback', function () {
            $('#dvLoading').show();
            $('#salvarRelatorioForm').ajaxForm(unidadesoptions);
            $("#salvarRelatorioForm").submit();
        })
                .dialog('open');

    }
    if (type === 'pagina') {
        var id = $("#paginas").children().length;
        $("#paginas").append('<span><h2 style="margin-bottom: 0px; margin-top: 0px">Página ' + (id + 1) + ':</h2>' +
                '<div onmouseover="pagina = ' + id + ';" class="containment-wrapper"  id="containment-wrapper' + id + '"></div></span>')
        relatorio_array[id] = [];
        $.post("index.php/relatorio?salvar=true", {
            "content": JSON.stringify(relatorio_array),
            "versao": versao,
            "separadores": JSON.stringify(separator_array)
        }, function (data) {
            detach = false;
            $('#dvLoading').hide();

        });
    }

    if (type === 'eliminar') {
        $("#eliminar_paginas").html('');
        for (var i = 0; i < relatorio_array.length; i++) {
            $("#eliminar_paginas").append('<option value="' + (i + 1) + '">' + (i + 1) + '</option>');
        }
        $("#dialog-eliminaspagina")
                .data('versao', versao)
                .dialog('open');
    }

    if (type === 'separador') {
        separador++;
        separator_array.push({
            'pagina': pagina,
            'top': 35
        })
        $("#containment-wrapper" + pagina).append('<div ondblclick="eliminar_separador(' + separador + ',' + (separator_array.length - 1) + ');" index="' + (separator_array.length - 1) + '" id="draggable' + separador + '" class="draggable"><div style="width:860px;border-top:1px solid"></div></div>');
        $("#draggable" + separador).draggable({
            containment: "#containment-wrapper" + pagina,
            scroll: false,
            axis: "y",
            stop: function (event, ui) {
                for (var i = 0; i < ui.helper[0].attributes.length; i++) {
                    if (ui.helper[0].attributes[i].nodeName === 'index')
                        var index = parseInt(ui.helper[0].attributes[i].value);
                }
                console.log(ui);
                separator_array[index].top = parseInt(ui.helper[0].offsetTop);
            }
        });
        $("#draggable" + separador).draggable().css("position", "absolute");
        $("#draggable" + separador).css({
            'top': 35,
            'left': 0,
        });
    }

    if (type === "salvar") {
        $('#dvLoading').show();
        $.post("index.php/relatorio?salvar=true", {
            "content": JSON.stringify(relatorio_array),
            "versao": versao,
            "separadores": JSON.stringify(separator_array)
        }, function (data) {
            detach = false;
            $('#dvLoading').hide();
            $("#dialog-gravarrelatorio").dialog('open');
        });
    }


    if (type.nodeName === "TD") {
        $("#dialog-inserirnomestabbela")
                .data('cellIndex', type.cellIndex)
                .data('rowIndex', type.parentNode.rowIndex)
                .dialog("open");
    } else if (type === 'picker') {
        $("#select_paginas").html('');
        for (var i = 0; i < relatorio_array.length; i++) {
            $("#select_paginas").append('<option value="' + (i + 1) + '">' + (i + 1) + '</option>');
        }
        $("#select_paginas").val((pagina + 1)).change();
        $("#tipo").prop("disabled", true);
        var tipo = obj.getAttribute('tipo');
        selected_block = obj.getAttribute('name');
        $("#titulo").val(relatorio_array[pagina][parseInt(selected_block)].titulo);
        selected_block_top = $("#draggable" + selected_block).css('top');
        selected_block_left = $("#draggable" + selected_block).css('left');
        var original_block = $("#containment-wrapper" + pagina).find('#draggable' + selected_block);
        $('#draggable' + selected_block).draggable({
            disabled: true
        });
        $("#MatrixTable" + selected_block).find('tr').each(function () {
            pickerwith = 0;
            $(this).find('td').each(function () {
                if ($(this)[0].cellIndex > 0 && $(this)[0].parentNode.rowIndex > 0) {
                    $(this).html('')
                }
                pickerwith += $(this).outerWidth();
            });
        });
        var html = $("#containment-wrapper" + pagina).find('#draggable' + selected_block)[0].childNodes[1].outerHTML;
        $("#containment-wrapper" + pagina).find('#draggable' + selected_block).remove();
        $('#dvLoading').hide();
        $("#dialog-novobloco")
                .data("original", original_block)
                .data("novo", "false")
                .data("pagina", $("#select_paginas").val() - 1)
                .dialog("open");
        document.getElementById("unidade").value = relatorio_array[pagina][parseInt(selected_block)].unidade;
        if (tipo === '4') {
            $("#tipo").val((tipo)).change();
            $("#multipla").hide();
            $("#valores").hide();
            $("#tabela").html(matrix_table_choose + '<div id="tabelabloco" class="field">' + html + '<div>');
            $("#MatrixTable").attr('id', 'MatrixTable' + selected_block);
            $("#MatrixTableBody").attr('id', 'MatrixTableBody' + selected_block);
            $("#tabelabloco").attr('id', 'tabelabloco' + selected_block);
            $("#tabela").show();
            tableresize('MatrixTable' + selected_block);
        } else if (tipo === '1') {
            $("#tipo").val((tipo)).change();
            $("#multipla").show();
            $("#tabela").hide();
            $("#valores").hide();
            $("#multipla").html(escolha_multipla);
            $("#escolhas_multiplas").attr('id', 'escolhas_multiplas' + selected_block);
            $("#escolhas_multiplas" + selected_block)[0].children[0].remove();
            var multiplas = $.parseHTML(html);
            console.log(multiplas);
            console.log(multiplas[0].children[0].childNodes);
            for (var i = 0; i < multiplas[0].children.length; i++) {
                $("#escolhas_multiplas" + selected_block).append('<div class="field">' +
                        '<label>Escolha' + (i + 1) + ':</label>' +
                        '<input type="text" style="width: 250px" id="escolhas_multiplas' + selected_block + '_' + (i + 1) + ')" value="' + multiplas[0].children[i].childNodes[1].nodeValue + '"/>' +
                        '<input type="button" name="remover_linha" onclick="relatorio(this);" style="background-image: url(img/buttons/VOIDED.png);height: 20px;padding-right:0px"  class="button">' +
                        '</div>');
            }
        } else if (tipo === '2') {
            var valores = $.parseHTML(html);
            $("#tipo").val((tipo)).change();
            $("#tabela").hide();
            $("#multipla").hide();
            $("#valores").html(valores_simples);
            $("#valores_simples").attr('id', 'valores_simples' + selected_block);
            $("#select_unidades option:selected").text(valores[0].textContent);
        }
    }
    else if (type.name === "remover_linha") {
        console.log(type);
    }

    else if (type === 'novobloco') {
        number_of_blocks++;
        $('#dvLoading').hide();
        $("#tipo").val('4').change();
        $("#select_paginas").html();
        for (var i = 0; i < relatorio_array.length; i++) {
            $("#select_paginas").append('<option value="' + (i + 1) + '">' + (i + 1) + '</option>');
        }
        $("#dialog-novobloco")
                .data("novo", "true")
                .dialog("open");
        $("#multipla").hide();
        $("#tabela").html(matrix_table_choose + matrix_table);
        $("#multipla").html(escolha_multipla);
        $("#valores").html(valores_simples);
        $("#MatrixTable").attr('id', 'MatrixTable' + number_of_blocks);
        $("#MatrixTableBody").attr('id', 'MatrixTableBody' + number_of_blocks);
        $("#tabelabloco").attr('id', 'tabelabloco' + number_of_blocks);
        $("#escolhas_multiplas").attr('id', 'escolhas_multiplas' + number_of_blocks);
        $("#valores_simples").attr('id', 'valores_simples' + number_of_blocks);
        selected_block_top = 10 + "px";
        selected_block_left = 5 + "px";
        selected_block = number_of_blocks;
        tableresize('MatrixTable' + number_of_blocks);
    } else if (type.id === 'linhas') {
        $('#dvLoading').hide();
        $("#MatrixTable" + selected_block).colResizable({
            disable: true
        });
        var linha = $("#MatrixTableBody" + selected_block).children()[1].innerHTML;
        if (($('#MatrixTable' + selected_block + ' tr').length - 1) < type.value) {
            var insert = type.value - ($('#MatrixTable' + selected_block + ' tr').length - 1);
            for (var i = 0; i < insert; i++) {
                $('#MatrixTableBody' + selected_block).append('<tr style="height:  20px">' + linha + '</tr>');
            }
        } else {
            var remove = ($('#MatrixTable tr').length - 1) - type.value;
            for (i = 0; i < remove; i++) {
                $("#MatrixTableBody" + selected_block).children()[$('#MatrixTable' + selected_block + ' tr').length - 1].remove();
            }
        }
        tableresize('MatrixTable' + selected_block);
    } else if (type.id === 'colunas') {
        $("#MatrixTable" + selected_block).colResizable({
            disable: true
        });
        $('#dvLoading').hide();
        var length = $('#MatrixTableBody' + selected_block).children()[0].children.length;
        if (length - 1 < type.value) {
            var insert = type.value - (length - 1);
            for (var i = 0; i < insert; i++) {
                length = $('#MatrixTableBody' + selected_block).children()[0].children.length;
                $('#MatrixTableBody' + selected_block).find('tr').each(function () {
                    if ($(this).find('td').eq(length - 1)[0].parentNode.rowIndex === 0)
                        $(this).find('td').eq(length - 1).after('<td onclick="relatorio(this)" style="width: 50px">Click Me</td>');
                    else
                        $(this).find('td').eq(length - 1).after('<td ></td>');
                });
            }
        } else {
            var remove = (length - 1) - type.value;
            for (i = 0; i < remove; i++) {
                length = $('#MatrixTableBody' + selected_block).children()[0].children.length;
                $('#MatrixTableBody' + selected_block).find('tr').each(function () {
                    $(this).find('td').eq(length - 1).remove();
                });
            }
        }
        tableresize('MatrixTable' + selected_block);
    } else if (type === 'imprimir') {
        window.open('http://localhost/SiteFCA-master/web/index.php/relatorio?imprimir&versao=' + versao);
    } else if (type.name === "tipo") {
        if (type.value === '1') {

            $("#multipla").css('display', 'block');
            $("#tabela").hide();
            $("#valores").hide();
        } else if (type.value === '4') {

            $("#valores").hide();
            $("#multipla").hide();
            $("#tabela").show();
        } else if (type.value === '2') {
            $("#tabela").hide();
            $("#multipla").hide();
            $("#valores").css('display', 'block');
        }
    } else if (type.name === "adicionar") {
        $('#dvLoading').hide();
        var elems = $("#escolhas_multiplas" + selected_block).children().size();
        $("#escolhas_multiplas" + selected_block).append('<div class="field">' +
                '<label>Escolha' + (elems + 1) + ':</label>' +
                '<input type="text" style="width: 250px" id="escolhas_multiplas' + selected_block + '_' + (elems + 1) + ')"/>' +
                '<input type="button" name="adicionar" onclick="relatorio(this);" style="background-image: url(img/buttons/VOIDED.png);height: 20px;padding-right:0px"  class="button">' +
                '</div>');
    }  else if (type === 2) {

        var tab='';
        $.post("index.php/relatorio?unidades=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
            var index;
            var versao_check;
            if (jQuery.type((obj)) === 'object') {
                index = obj.getAttribute('index');
                versao_check = true;
                tab=TABS.SelectedTab;
            }
            else {
                index = obj;
                versao_check = false;
            }
            if (parseInt(index) - 1 < -1) {
                index = -1;
            }
            $.post("index.php/relatorio?checkversao", function (result) {
                if (result !== 'null') {
                    $.post('index.php/relatorio?getlastrelatorio&index=' + index, function (data) {
                        if (data !== 'null') {
                            var header = function () {
                                if (JSON.parse(data) !== null) {

                                    var partial = (JSON.parse(data)['relatorio']);
                                    dados = (JSON.parse(partial['dados']));
                                    if (JSON.parse(data)['manobra'] !== '0') {
                                        var passo = JSON.parse(JSON.parse(JSON.parse(data)['manobra']['manobra']));
                                        var accao = "<form style=\"margin-bottom:10px\"><fieldset>" +
                                                "<div class=\"field\"></div><label>Utilizador:</label><p>" + JSON.parse(data)['relatorio'].Nome + "</p>" +
                                                "<div class=\"field\"></div><label>Data/Hora:</label><p>" + JSON.parse(data)['relatorio'].data + "</p>" +
                                                "<div class=\"field\"></div><label>Procedimento:</label><p>" + JSON.parse(data)['manobra'].nome + "</p>" +
                                                "<div class=\"field\"></div><label style=\"padding-bottom: 20px;\">Acção:</label><p>" + passo[2].steps[parseInt(partial['accao'].split('-')[0])].step + "</p>" +
                                                "</fieldset></form>";
                                        $("#dados").html(accao);
                                    }
                                    else {
                                        var accao = "<form style=\"margin-bottom:10px\"><fieldset>" +
                                                "<div class=\"field\"></div><label>Utilizador:</label><p>" + JSON.parse(data)['relatorio'].Nome + "</p>" +
                                                "<div class=\"field\"></div><label>Data/Hora:</label><p>" + JSON.parse(data)['relatorio'].data + "</p>" +
                                                "<div class=\"field\"></div><label style=\"padding-bottom: 20px;\">Acção:</label><p>" + JSON.parse(data)['relatorio'].comentario + "</p>" +
                                                "</fieldset></form>";
                                        $("#dados").html(accao);
                                    }
                                }
                            };

                            $('#dvLoading').hide();
                            var dados = null;
                            if (versao_check) {
                                $("[name='anterior']").attr('index', (parseInt(index) + 1));
                                $("[name='proximo']").attr('index', (parseInt(index) - 1));
                                versao = (JSON.parse(data)['relatorio']['versao']);
                                header();
                            }
                            else if (result !== 'null' && JSON.parse(result)['check'] === 'false') {
                                $("[name='anterior']").attr('index', -1);
                                $("[name='proximo']").attr('index', -1);
                                $("#dados").html('<h3 style="color:red;margin-top:10px">Aviso!</h3>' +
                                        '<p >A actual versão do relatório é diferente da ultima versão gravada!' +
                                        '<p>Actual versão:          ' + JSON.parse(result)['versao'] + '</p>' +
                                        '<p>Ultima versão gravada:  ' + (JSON.parse(data)['relatorio']['versao']) + '</p>' +
                                        '<p style="margin-bottom:10px">Por incompatibilidade entre verões, o relatório terá de ser preenchido novamente!</p>');
                                versao = JSON.parse(result)['versao'];
                            }
                            else {
                                versao = (JSON.parse(data)['relatorio']['versao']);
                                $("[name='anterior']").attr('index', (parseInt(index) + 1));
                                $("[name='proximo']").attr('index', (parseInt(index) - 1));
                                header();
                            }


                            $.post("index.php/relatorio?type=2&versao=" + versao, function (data) {
                                if (data !== 'null' && JSON.parse(data)['template'] !== '') {
                                    var content = (JSON.parse((JSON.parse(data)['template'])));
                                    TABS.CreateTabs('tab1');
                                    var unidades = [];
                                    for (var i = 0; i < content.length; i++) {
                                        for (var j = 0; j < content[i].length; j++) {
                                            if (content[i][j] !== null) {
                                                unidades.push(content[i][j]['unidade'])
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                    var found = false;
                                    for (i = 0; i < content.length; i++) {
                                        for (var x = 0; x < content[i].length; x++) {
                                            for (j = 0; j < unidades.length; j++) {
                                                if (content[i][x] !== null) {
                                                    if (content[i][x]['unidade'] === unidades[j]) {
                                                        found = true;
                                                        break;
                                                    }
                                                }
                                            }

                                            if (!found && content[i][x] !== null) {
                                                unidades.push(content[i][x]['unidade']);
                                            }
                                            found = false;
                                        }
                                    }
                                    unidades.sort();
                                    for (j = 0; j < unidades.length; j++) {
                                        var top = 1000000;
                                        var bottom = -1;
                                        for (i = 0; i < content.length; i++) {
                                            for (x = 0; x < content[i].length; x++) {
                                                if (content[i][x] !== null) {
                                                    if (content[i][x]['unidade'] === unidades[j]) {
                                                        //console.log(parseInt(content[i]['location']['y']))
                                                        if (parseInt(content[i][x]['location']['y']) < top) {
                                                            top = parseInt(content[i][x]['location']['y']);
                                                        }
                                                        if (parseInt(content[i][x]['location']['y']) > bottom) {
                                                            bottom = parseInt(content[i][x]['location']['y']) + content[i][x]['dimetions']['hieght'];
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        bottom = bottom - top + 55;
                                        var element = $('<div style="height:' + bottom + 'px"></div>');
                                        for (i = 0; i < content.length; i++) {
                                            for (x = 0; x < content[i].length; x++) {
                                                if (content[i][x] !== null) {
                                                    if (content[i][x]['unidade'] === unidades[j]) {
                                                        var bloco = $('<div class="relatrio-manobra"  id="div' + x + '1"></div>');
                                                        bloco.css('width', content[i][x]['dimetions']['with']);
                                                        bloco.css({
                                                            'top': (parseInt(content[i][x]['location']['y']) - (top - 5)) + 'px',
                                                            'left': content[i][x]['location']['x'],
                                                        });
                                                        bloco.css("position", "absolute");
                                                        bloco.append(content[i][x]['bloco']);
                                                        element.append(bloco[0].outerHTML);
                                                        $("#div" + x + '1').remove();
                                                    }
                                                }
                                            }
                                        }
                                        if (j == 0 && tab==='')
                                            TABS.AddTab(unidades[j], true, element[0].outerHTML, 'tab1');
                                        else if(tab===unidades[j]+'tab1')
                                            TABS.AddTab(unidades[j], true, element[0].outerHTML, 'tab1');
                                        else
                                            TABS.AddTab(unidades[j], false, element[0].outerHTML, 'tab1');
                                    }

                                    if (dados != null) {
                                        for (i = 0; i < dados.length; i++) {
                                            if (dados[i]['type'] === "checkbox") {
                                                $('[name="' + dados[i]['name'] + '"]').prop("checked", true);
                                            } else
                                                ($('[name="' + dados[i]['name'] + '"]').val(dados[i]['value']));
                                        }
                                    }
                                } else {
                                    $.post("index.php/relatorio?unidades=" + type, function (data) {
                                        document.getElementById("app").innerHTML = data;
                                    });
                                }
                            });
                        } else {
                            $("#dados").html('<h3>Sem mais dados disponiveis!</h3>');
                        }
                    });


                } else {
                    $.post("index.php/relatorio?unidades=" + type, function (data) {
                        document.getElementById("app").innerHTML = data;
                    });
                }
            });
        });
    } else if (type.name === 'editar_versao') {
        $.post("index.php/relatorio?getteemplate&user=" + type.getAttribute('user'), function (data) {

            document.getElementById("app").innerHTML = data;
            $.post("index.php/relatorio?type=3&versao=" + type.getAttribute('versao'), function (data) {
                versao = (JSON.parse(data)['versao']);
                if (data !== 'null' && JSON.parse(data)['template'] !== '') {
                    number_of_blocks = 0;
                    relatorio_array = (JSON.parse((JSON.parse(data)['template'])));
                    //console.log(relatorio_array[1]) ;
                    separator_array = (JSON.parse((JSON.parse(data)['separadores'])));

                    for (var j = 0; j < relatorio_array.length; j++) {
                        $("#paginas").append('<span><h2 style="margin-bottom: 0px;margin-top: 0px">Página ' + (j + 1) + '</h2><div onmouseover="pagina = ' + j + ';" class="containment-wrapper"  id="containment-wrapper' + j + '"></div></span>')
                        for (var i = 0; i < relatorio_array[j].length; i++) {
                            number_of_blocks++;
                            if (relatorio_array[j][i] !== null) {
                                $("#containment-wrapper" + j).append('<div id="draggable' + i + '" class="draggable">' + relatorio_array[j][i]['bloco'] + '</div>');
                                $("#draggable" + i).css('width', relatorio_array[j][i]['dimetions']['with']);
                                $("#draggable" + i).append('<div  name="' + i + '" tipo="' + relatorio_array[j][i]['tipo'] + '" ondblclick="relatorio(\'picker\',this)"  class="picker"></div>');
                                $("#draggable" + i).draggable({
                                    containment: "#containment-wrapper" + j,
                                    scroll: false,
                                    stop: function (event, ui) {
                                        for (var i = 0; i < ui.helper[0].lastChild.attributes.length; i++) {
                                            if (ui.helper[0].lastChild.attributes[i].nodeName === 'name')
                                                var index = parseInt(ui.helper[0].lastChild.attributes[i].value);
                                        }
                                        relatorio_array[pagina][index].location.x = ui.position.left + 'px';
                                        relatorio_array[pagina][index].location.y = ui.position.top + 'px';
                                    }
                                });
                                $("#draggable" + i).draggable().css("position", "absolute");
                                $("#draggable" + i).css({
                                    'top': relatorio_array[j][i]['location']['y'],
                                    'left': relatorio_array[j][i]['location']['x'],
                                });
                            }
                        }
                    }

                    separador = 5000;
                    if (separator_array !== null) {
                        for (i = 0; i < separator_array.length; i++) {
                            if (separator_array[i] != null) {
                                separador++;
                                $("#containment-wrapper" + separator_array[i]['pagina']).append('<div ondblclick="eliminar_separador(' + (separador) + ',' + i + ');" index="' + i + '" id="draggable' + separador + '" class="draggable"><div style="width:860px;border-top: 1px solid"></div></div>');
                                $("#draggable" + separador).draggable({
                                    containment: "#containment-wrapper" + separator_array[i]['pagina'],
                                    scroll: false,
                                    axis: "y",
                                    stop: function (event, ui) {
                                        for (var i = 0; i < ui.helper[0].attributes.length; i++) {
                                            if (ui.helper[0].attributes[i].nodeName === 'index')
                                                var index = parseInt(ui.helper[0].attributes[i].value);
                                        }
                                        separator_array[index].top = parseInt(ui.helper[0].offsetTop);
                                    }
                                });
                                $("#draggable" + separador).draggable().css("position", "absolute");
                                $("#draggable" + separador).css({
                                    'top': parseInt(separator_array[i].top),
                                    'left': 0,
                                });
                            }
                        }
                    } else
                        separator_array = [];
                } else {
                    relatorio_array[0] = [];
                    $("#paginas").html('<span><h2 style="margin-bottom: 0px;margin-top: 0px">Página 1</h2><div onmouseover="pagina = 0;" class="containment-wrapper"  id="containment-wrapper0"></div></span>')
                }
            });
        });

    } else if (type === 4) {
        $.post("index.php/relatorio?getversoes=" + type, function (data) {
            //console.log(JSON.parse(data));
            document.getElementById("app").innerHTML = data;
        });
    }
    else if (type === 1) {
        $.post("index.php/relatorio?type=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
            
        });
    }
}

function tableresize(id) {

    $("#" + id).colResizable({
        liveDrag: true,
        gripInnerHtml: "<div class='grip'></div>",
        draggingClass: "dragging",
        fixed: false,
    });

}/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


