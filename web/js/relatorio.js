var relatorio_array = [];
var selected_block;
var number_of_blocks = 0;
var selected_block_top;
var selected_block_left;
var matrix_table_choose = '<div class="field">' +
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
        '</div>';
var matrix_table = '<div id="tabelabloco" class="field">' +
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



function relatorio(type, obj) {
    if (type==="salvar"){
         $.post("index.php/relatorio?salvar=true",{"content": JSON.stringify(relatorio_array)}, function (data) {
            //document.getElementById("app").innerHTML = data;
            data=JSON.parse(data);
            console.log(JSON.parse(data['template']));
        });
    }
    
    
    if (type.nodeName === "TD") {
        $("#dialog-inserirnomestabbela")
                .data('cellIndex', type.cellIndex)
                .data('rowIndex', type.parentNode.rowIndex)
                .dialog("open");
    }

    else if (type === 'picker') {
        $("#tipo").prop("disabled", true);
        var tipo = obj.getAttribute('tipo');
        selected_block = obj.getAttribute('name');
        $("#titulo").val(relatorio_array[parseInt(selected_block)].titulo);
        selected_block_top = $("#draggable" + selected_block).css('top');
        selected_block_left = $("#draggable" + selected_block).css('left');
        var original_block = $("#containment-wrapper").find('#draggable' + selected_block);
        var html = $("#containment-wrapper").find('#draggable' + selected_block)[0].childNodes[1].outerHTML;
        $('#draggable' + selected_block).draggable({
            disabled: true
        });
        $("#containment-wrapper").find('#draggable' + selected_block).remove();
        $('#dvLoading').hide();
        $("#dialog-novobloco")
                .data("original", original_block)
                .data("novo","false")
                .dialog("open");
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
            $("#multipla").html(escolha_multipla);
            $("#valores_simples").attr('id', 'valores_simples' + selected_block);
            $("#select_unidades option:selected").text(valores[0].textContent);
        }
    }


    else if (type === 'novobloco') {
        console.log($("#containment-wrapper"));
        number_of_blocks++;
        //var elems = $("#containment-wrapper").children().size();
        $('#dvLoading').hide();
        $("#tipo").val('4').change();
        $("#dialog-novobloco")
                .data("novo","true")
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
        //valores_simples
        //$("#tabela").show();
        selected_block_top = 35;
        selected_block_left = 5;
        selected_block = number_of_blocks;
        tableresize('MatrixTable' + number_of_blocks);
    }

    else if (type.id === 'linhas') {
        $('#dvLoading').hide();
        $("#MatrixTable" + selected_block).colResizable({
            disable: true
        });
        var linha = $("#MatrixTableBody" + selected_block).children()[1].innerHTML;
        console.log($("#MatrixTableBody" + selected_block).children());
        if (($('#MatrixTable' + selected_block + ' tr').length - 1) < type.value) {
            var insert = type.value - ($('#MatrixTable' + selected_block + ' tr').length - 1);
            for (var i = 0; i < insert; i++) {
                $('#MatrixTableBody' + selected_block).append('<tr style="height:  25px">' + linha + '</tr>');
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
        var restore = document.body.innerHTML;
        var printarea = document.getElementById('containment-wrapper').innerHTML;
        document.body.innerHTML = printarea;
        window.print();
        document.body.innerHTML = restore;
        $.post("index.php/relatorio?type=3", function (data) {
            document.getElementById("app").innerHTML = data;
        });
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
            //$("#tabela").html(matrix_table_choose + matrix_table);

            //tableresize('MatrixTable' + selected_block);
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
            document.getElementById("app").innerHTML = data;
        });
    }
    else if (type === 3) {
        $.post("index.php/relatorio?type=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
            console.log((data));
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


