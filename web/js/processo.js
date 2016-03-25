
var relatorios_passos = [];
var alertas = [];
var steps_array = [];
var last_index = 0;

var processoptions = {
    success: showResponse,
    beforeSubmit: showRequest, // pre-submit callback 
};

function addNewTitle() {
    var index = 0;
    $("#passos").children().each(function () {
        for (var i = 0; i < $(this)[0].attributes.length; i++) {
            if ($(this)[0].attributes[i].name === 'tipo') {
                if ($(this)[0].attributes[i].value === 'passo') {
                    if (parseInt($("#position-title").val()) === index) {
                        ($(this)).before('<div style="margin-top:10px" class="field" tipo="titulo">' +
                                '<label>Titulo intermédio:</label>' +
                                '<textarea style="background-color: aliceblue;height: 35px;width: 750px;" name="manobra[passos][passo1]"></textarea>' +
                                '<input type="button" onclick="processo(this);" name="remover_titulo" index="' + index + '" value="Remover" class="submit" style="float:none; width: 100px;margin-bottom: 10px;margin-top: 10px;margin-right: 10px;" />' +
                                '<div class="clear separator"></div>' +
                                '</div>');

                    }
                    index++;
                    break;
                }
            }
        }

    });
}

function processo(type) {
    //console.log($("#passos").children().size());
    if (type.name === 'mostrar_relatorio') {
        if (type.value === 'Mostrar relatório') {
            $("#relatorio" + type.getAttribute('index')).show();
            type.value = 'Ocultar relatório';
        }
        else {
            $("#relatorio" + type.getAttribute('index')).hide();
            type.value = 'Mostrar relatório';
        }
    }
    if (type.name === 'novo_titulo') {
        var index = 0;
        $("#position-title").html('');
        $("#passos").children().each(function () {
            for (var i = 0; i < $(this)[0].attributes.length; i++) {
                if ($(this)[0].attributes[i].name === 'tipo') {
                    if ($(this)[0].attributes[i].value === 'passo') {
                        $("#position-title").append('<option value="' + index + '">' + index + '</option>');
                        index++;
                        break;
                    }
                }
            }

        });
        $("#dialog-add-title").dialog('open');
    }
    if (type.name === 'mover_passso') {
        var index = 0;
        $("#passos").children().each(function () {

        });
        $("#dialog-move-item").dialog('open');
    }
    if (type.name === 'remover_titulo') {
        var index = (type.getAttribute('index'));
        var found = false;
        $("#passos").children().each(function () {
            for (var i = 0; i < $(this)[0].attributes.length; i++) {
                if ($(this)[0].attributes[i].name === 'tipo') {
                    if ($(this)[0].attributes[i].value === 'titulo') {
                        $(this).children().each(function () {
                            //console.log($(this))
                            if ($(this)[0].nodeName === 'INPUT') {
                                for (var i = 0; i < $(this)[0].attributes.length; i++) {
                                    if ($(this)[0].attributes[i].name === 'index') {
                                        if ($(this)[0].attributes[i].value === index) {
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
                if (found) {
                    $(this).remove();
                    found = false;
                }
            }
        });
    }
    if (type.name === 'remover_passso') {
        var index = (type.getAttribute('index'));
        alertas.splice(parseInt(index), 1);
        var found = false;
        $("#passos").children().each(function () {
            for (var i = 0; i < $(this)[0].attributes.length; i++) {
                if ($(this)[0].attributes[i].name === 'tipo') {
                    if ($(this)[0].attributes[i].value === 'passo') {
                        $(this).children().each(function () {
                            //console.log($(this))
                            if ($(this)[0].nodeName === 'INPUT') {
                                for (var i = 0; i < $(this)[0].attributes.length; i++) {
                                    if ($(this)[0].attributes[i].name === 'index') {
                                        if ($(this)[0].attributes[i].value === index) {
                                            found = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
                if (found) {
                    $(this).remove();
                    found = false;
                }
            }
        });
        index = 0;
        $("#passos").children().each(function () {
            for (var i = 0; i < $(this)[0].attributes.length; i++) {
                if ($(this)[0].attributes[i].name === 'tipo') {
                    if ($(this)[0].attributes[i].value === 'passo') {
                        $(this).children().each(function () {
                            if ($(this)[0].nodeName === 'INPUT') {
                                for (var i = 0; i < $(this)[0].attributes.length; i++) {
                                    if ($(this)[0].attributes[i].name === 'index') {
                                        //console.log($(this)[0].attributes[i]);
                                        $(this)[0].attributes[i].value = index;

                                    }
                                }
                            }
                            else if ($(this)[0].nodeName === 'LABEL') {
                                //console.log($(this));
                                $(this)[0].innerHTML = 'Passo ' + index + ':';
                            }

                        });
                        index++;
                        break;
                    }

                }
            }


        });
    }
    if (type.name === 'alerta') {
        var steps = [];

        $("#passos").children().each(function () {
            for (var i = 0; i < $(this)[0].attributes.length; i++) {
                if ($(this)[0].attributes[i].name === 'tipo') {
                    if ($(this)[0].attributes[i].value === 'passo') {

                    }
                }
            }
        });
        if (type.value === 'Adicionar Alerta') {
            $("#alerta_ralatorio")[0].checked = false;
            $("#alerta_equipamento")[0].checked = false;
            $("#mensagem").val('');
            $("#dialog-alertas").data('step', type)
                    .dialog("open");
        }
        else {
            var step = (alertas[parseInt(type.getAttribute('index'))]);
            console.log(step.relatrio);
            if (step.relatrio)
                $("#alerta_ralatorio")[0].checked = true;
            else
                $("#alerta_ralatorio")[0].checked = false;
            if (step.equipamento)
                $("#alerta_equipamento")[0].checked = true;
            else
                $("#alerta_equipamento")[0].checked = false;
            $("#mensagem").val(step.texto);
            $("#dialog-alertas").data('step', type)
                    .dialog("open");
        }

    }
    if (type === 'adicionar_alerta') {

    }
    if (type.name === "novo_passo") {

        var index = 0;
        $("#passos").children().each(function () {
            for (var i = 0; i < $(this)[0].attributes.length; i++) {
                if ($(this)[0].attributes[i].name === 'tipo') {
                    if ($(this)[0].attributes[i].value === 'passo') {
                        index++;
                    }
                }
            }
        });
        $("#passos").append('<div style="margin-top:10px" class="field" index="' + index + '" tipo="passo">' +
                '<label>Passo ' + index + ':</label>' +
                '<textarea style="background-color: antiquewhite;height: 50px;width: 750px" name="manobra[passos][passo' + index + ']"></textarea>' +
                '<input type="button" onclick="processo(this);" name="alerta" index="' + index + '" value="Adicionar Alerta" class="submit" style="float:none; width: 100px;margin-bottom: 10px;margin-top: 10px;" />' +
                '<input type="button" onclick="processo(this);" name="remover_passso" index="' + index + '" value="Remover passo" class="submit" style="float:none; width: 100px;margin-bottom: 10px;margin-top: 10px;margin-right: 10px;" />' +
                '<div class="clear separator"></div>' +
                '</div>'
                );

    }

    if (type.name === "aceitarmanobra") {
        for (var i = 0; i < $("#passos").children().size(); i++) {
            if (!($("#passos").children()[i].children[1].checked)) {
                $("#dialog-aceitar-manobra").dialog("open");
                break;
            }
        }
    }
    if (type.name === "ocultar") {
        if ($('#relatorio').is(":visible")) {
            $("#relatorio").hide();
            $("#ocultar").val("Mostrar relatorio");
        }
        else {
            $("#relatorio").show();
            $("#ocultar").val("Ocultar relatorio");
        }
    }
    if (type.name === "vermanobra") {
        $('#dvLoading').show();
        $("#ajaxform1").attr('action', 'index.php/processo?manobra=' + $("#manobras").val() + '&unidade=' + $("#unidade option:selected").text());
        $("#ajaxform1").submit();
    }
    if (type.name === "salvar") {
        var index = 0;
        var title = '';
        $("#passos").children().each(function () {
            for (var i = 0; i < $(this)[0].attributes.length; i++) {
                if ($(this)[0].attributes[i].name === 'tipo') {
                    if ($(this)[0].attributes[i].value === 'passo') {
                        $(this).children().each(function () {
                            if ($(this)[0].nodeName === 'TEXTAREA') {
                                steps_array[index] = {'title': title, 'step': $(this)[0].value};
                                title = '';
                                index++;
                            }
                        });
                    }
                    else {
                        $(this).children().each(function () {
                            if ($(this)[0].nodeName === 'TEXTAREA') {
                                title = $(this)[0].value;
                                //title = '';
                            }
                        });
                    }
                }
            }
        });
        $('#adicionarManobraForm').ajaxForm(processoptions);
        $('#dvLoading').show();
        $("#adicionarManobraForm").attr('action', 'index.php/processo?adicionar=true');
        $("#adicionarManobraForm").submit();
    }
    if (type === 1) {
        $.post("index.php/processo?type=" + type, function (data) {
            document.getElementById("app").innerHTML = data;

            $.post('index.php/processo?getprocedimentos', function (data) {
                console.log(JSON.parse(JSON.parse(data)));
                var proc = JSON.parse(JSON.parse(data));
                alertas = proc[2]['alertas'];
                for (var i = 0; i < proc[2]['steps'].length; i++) {
                    if (proc[2]['steps'][i]['title'] !== '') {
                        $("#procedimentos").append('<tr><td colspan="2" style="text-align: center;padding: 5px;"><label>' + proc[2]['steps'][i]['title'] + '</label></td></tr>');
                    }
                    $("#procedimentos").append('<tr><td style="width: 80px;"><input onclick="checkStep(' + i + ',this)" type="checkbox"/> Passo ' + i + '</td><td style="padding: 5px;">' + proc[2]['steps'][i]['step'] + '</td></tr>');
                }
            });
        });
    }
    if (type === 2) {
        $.post("index.php/processo?novamanobra=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
            CKEDITOR.config.height = 200;
            CKEDITOR.config.width = 750;

            initSample();
        });
    }
    if (type === 3) {
        $.post("index.php/processo?type=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
        });
    }
}

function checkStep(index, input) {
    var i = 0;
    if (!input.checked && last_index > index) {
        input.checked = true;
        alert("Não pode desselecionar este passo!");
    }
    else {
        $("#procedimentos").children().each(function () {
            $(this).children().each(function () {
                if ($(this)[0].childNodes.length === 2 && i < index) {
                    if (!$(this)[0].childNodes[0].children[0].checked) {
                        input.checked = false;
                        alert("Tem de aceitar todos os passos anteriores!");
                        return false;
                    }
                    i++;
                }
            });
        });
        if (input.checked) {
            last_index = index;
        }
        else {
            last_index = index - 1;
        }
        if (alertas[index] !== null && alertas.length > 0) {
            console.log(alertas[index]);
            $("#alerta_mensagem").html('-' + alertas[index]['texto']);
            if (alertas[index]['equipamento'])
                $("#alerta_mensagem").append('<br>-Não se esqueça de actualizar o estado do equipamento');
            if (alertas[index]['relatrio'])
                $("#alerta_mensagem").append('<br>-Não se esqueça de actualizar o relatorio');
            $("#dialog-alerta").data('relatorio', alertas[index]['relatrio'])
                    .data('equipamento', alertas[index]['equipamento'])
                    .dialog('open');
        }
    }
}

function selectbloco(bloco) {
    $("#" + bloco.id).css('border', '2px solid');
    //console.log($("#div"+bloco.id));
}

function setbloco(bloco) {
    console.log($("#" + bloco.id));
}

function deselectebloco(bloco) {
    $("#" + bloco.id).css('border', 'none');
}

function showRequest(formData, jqForm, options) {
    var procedimento = [];
    var index = -1;
    var passos = [];
    var editor = CKEDITOR.instances.editor;
    procedimento.push({'unidade': formData[0]});
    procedimento.push({'nome': formData[1]});
    var content_array = {'alertas': alertas, 'steps': steps_array};
    procedimento.push(content_array);
    $.post("index.php/processo?salvar=true&unidade=" + procedimento[0]['unidade']['value'] + '&nome=' + procedimento[1]['nome']['value'], {procidimento: JSON.stringify(procedimento), descricao: editor.getData()}, function (data) {
        $('#dvLoading').hide();
    });
    return false;
}

function showResponse(responseText, statusText, xhr, $form) {

    console.log(responseText);
    $('#adicionarManobraForm').ajaxForm(options, function (data) {
        var relatrio = (JSON.parse(data));
        //console.log(relatrio);
        $.post("index.php/processo?type=2", function (data) {
            var content = (JSON.parse((JSON.parse(data)['template'])));
            $.post("index.php/processo?novamanobra=0", function (data) {
                document.getElementById("app").innerHTML = data;
                TABS.CreateTabs();
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
                                    if (parseInt(content[i][x]['location']['y']) < top) {
                                        top = parseInt(content[i][x]['location']['y']);
                                    }
                                    if (parseInt(content[i][x]['location']['y']) > bottom) {
                                        bottom = parseInt(content[i][x]['location']['y']) + parseInt(content[i][x]['dimetions']['hieght']);
                                    }
                                }
                            }
                        }
                    }
                    //console.log(bottom);
                    bottom = bottom - top + 55;
                    var element = $('<div style="height:' + bottom + 'px"></div>');
                    for (i = 0; i < content.length; i++) {
                        for (x = 0; x < content[i].length; x++) {
                            if (content[i][x] !== null) {
                                if (content[i][x]['unidade'] === unidades[j]) {
                                    var bloco = $('<div class="relatrio-manobra"  id="div' + x + '"></div>');
                                    bloco.css('width', content[i][x]['dimetions']['with']);
                                    bloco.css({
                                        'top': (parseInt(content[i][x]['location']['y']) - (top - 5)) + 'px',
                                        'left': content[i][x]['location']['x'],
                                    });
                                    bloco.css("position", "absolute");
                                    bloco.append(content[i][x]['bloco']);
                                    element.append(bloco[0].outerHTML);
                                    $("#div" + x).remove();
                                }
                            }
                        }
                    }
                    if (j === 0)
                        TABS.AddTab(unidades[j], true, element[0].outerHTML);
                    else
                        TABS.AddTab(unidades[j], false, element[0].outerHTML);
                }
                var element_1 = '';
                var element_2 = '';
                for (var key in relatrio) {
                    if (key !== 'manobra') {
                        element_1 = key;
                        for (var key1 in relatrio[key]) {
                            if ($('[name="' + element_1 + '[' + key1 + ']"]').length > 0) {
                                $('[name="' + element_1 + '[' + key1 + ']"]').val(relatrio[key][key1]);
                            }
                            else {
                                element_2 = '[' + key1 + ']';
                            }
                            for (var key2 in relatrio[key][key1]) {
                                if (jQuery.type(relatrio[key][key1]) === 'object') {
                                    if ($('[name="' + element_1 + element_2 + '[' + key2 + ']"]')[0].type === 'checkbox') {
                                        $('[name="' + element_1 + element_2 + '[' + key2 + ']"]').prop("checked", true);
                                    }
                                    else {
                                        $('[name="' + element_1 + element_2 + '[' + key2 + ']"]').val(relatrio[key][key1][key2]);
                                    }

                                }
                            }
                        }

                    }

                }
            });
        });
    });
}

    