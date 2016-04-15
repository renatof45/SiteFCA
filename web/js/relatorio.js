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
    '<input type="button" name="adicionar" onclick="relatorio(this);" style="font-weight: bolder;width: 20px;height: 16px;margin-top: 2px;padding-bottom: 1px;"  value="+" class="button">' +
    '</div></div>';

var valores_simples =
    '<div class="field">' +
    '<label>Unidades:</label>' +
    '<select id="select_unidades">' +
    '<option>m2</option>' +
    '<option>Kg/Cm2</option>' +
    '<option>Cº</option>' +
    '</select>' +
    '</div></div>';

var separador = 5000;
var separator_array = [];


function showRequestUnidades(responseText, statusText, xhr, $form) {
    detach = false;
    $.post("index.php/relatorio?salvarrelatorio=true", {
        dados: JSON.stringify(responseText)
    }, function (data) {
        $('#dvLoading').hide();
    });
    return false;
}


function eliminar_separador(id, index) {
    console.log($("#containment-wrapper" + pagina));
    $("#containment-wrapper" + pagina).find('#draggable' + id).remove();
    separator_array[index] = null;
}

function relatorio(type, obj) {
    if (type === 'salvar_relatorio') {
        $('#dvLoading').show();
        $('#salvarRelatorioForm').ajaxForm(unidadesoptions);
        $("#salvarRelatorioForm").submit();
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
    }

    else if (type === 'picker') {
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
        }
        else if (tipo === '1') {
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
                    '<input type="button" name="adicionar" onclick="relatorio(this);" style="font-weight: bolder;width: 20px;height: 16px;margin-top: 2px;padding-bottom: 1px;"  value="+" class="button">' +
                    '</div>');
            }
        }
        else if (tipo === '2') {
            var valores = $.parseHTML(html);
            $("#tipo").val((tipo)).change();
            $("#tabela").hide();
            $("#multipla").hide();
            $("#valores").html(valores_simples);
            $("#valores_simples").attr('id', 'valores_simples' + selected_block);
            $("#select_unidades option:selected").text(valores[0].textContent);
        }
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
    }

    else if (type.id === 'linhas') {
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
        }
        else {
            var remove = ($('#MatrixTable tr').length - 1) - type.value;
            for (i = 0; i < remove; i++) {
                $("#MatrixTableBody" + selected_block).children()[$('#MatrixTable' + selected_block + ' tr').length - 1].remove();
            }
        }
        tableresize('MatrixTable' + selected_block);
    }

    else if (type.id === 'colunas') {
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
        }
        else {
            var remove = (length - 1) - type.value;
            for (i = 0; i < remove; i++) {
                length = $('#MatrixTableBody' + selected_block).children()[0].children.length;
                $('#MatrixTableBody' + selected_block).find('tr').each(function () {
                    $(this).find('td').eq(length - 1).remove();
                });
            }
        }
        tableresize('MatrixTable' + selected_block);
    }

    else if (type === 'imprimir') {
        window.open('http://localhost:8080/index.php/relatorio?imprimir&versao=' + versao);
    }

    else if (type.name === "tipo") {
        if (type.value === '1') {

            $("#multipla").css('display', 'block');
            $("#tabela").hide();
            $("#valores").hide();
        }
        else if (type.value === '4') {

            $("#valores").hide();
            $("#multipla").hide();
            $("#tabela").show();
        }
        else if (type.value === '2') {
            $("#tabela").hide();
            $("#multipla").hide();
            $("#valores").css('display', 'block');
        }
    }

    else if (type.name === "adicionar") {
        $('#dvLoading').hide();
        var elems = $("#escolhas_multiplas" + selected_block).children().size();
        $("#escolhas_multiplas" + selected_block).append('<div class="field">' +
            '<label>Escolha' + (elems + 1) + ':</label>' +
            '<input type="text" style="width: 250px" id="escolhas_multiplas' + selected_block + '_' + (elems + 1) + ')"/>' +
            '<input type="button" name="adicionar" onclick="relatorio(this);" style="font-weight: bolder;width: 20px;height: 16px;margin-top: 2px;padding-bottom: 1px;"  value="+" class="button">' +
            '</div>');
    }

    else if (type === 1) {
        $.post("index.php/relatorio?type=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
        });
    } else if (type === 2) {
        $.post("index.php/relatorio?type=" + type, function (data) {
            var content = (JSON.parse((JSON.parse(data)['template'])));
            $.post("index.php/relatorio?unidades=" + type, function (data) {
                document.getElementById("app").innerHTML = data;
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
                    if (j == 0)
                        TABS.AddTab(unidades[j], true, element[0].outerHTML, 'tab1');
                    else
                        TABS.AddTab(unidades[j], false, element[0].outerHTML, 'tab1');
                }
                $.post('index.php/relatorio?getlastrelatorio', function (data) {
                    $('#dvLoading').hide();
                    versao = (JSON.parse(data)['versao']);
                    var partial = (JSON.parse(data));
                    var dados = (JSON.parse(partial['dados']));

                    if (dados != null) {
                        for (i = 0; i < dados.length; i++) {
                            if (dados[i]['type'] === "checkbox") {
                                $('[name="' + dados[i]['name'] + '"]').prop("checked", true);
                            }
                            else
                                ($('[name="' + dados[i]['name'] + '"]').val(dados[i]['value']));
                        }
                    }
                });
            });
        });
    }
    else if (type === 3) {
        $.post("index.php/relatorio?getteemplate=" + type, function (data) {

            document.getElementById("app").innerHTML = data;
            $.post("index.php/relatorio?type=" + type, function (data) {
                console.log(data);
                versao = (JSON.parse(data)['versao']);
                if (data !== 'null') {
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
                                        console.log(index);
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
                    }
                    else
                        separator_array = [];
                }
                else {
                    relatorio_array[0] = [];
                    $("#paginas").html('<span><h2 style="margin-bottom: 0px;margin-top: 0px">Página 1</h2><div onmouseover="pagina = 0;" class="containment-wrapper"  id="containment-wrapper0"></div></span>')
                }
            });
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


