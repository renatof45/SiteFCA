
var relatorios_passos = [];
var alertas = [];
var steps_array = [];
var last_index = 0;
var proc_id = 0;
var update = false;
var monobra_id;
var processoptions = {
    beforeSubmit: showRequest, // pre-submit callback 
};

var listequipamentos = {
    beforeSubmit: showRequestEquipamentos, // pre-submit callback 
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

function stopScroll() {
    $("#app").css('overflow-y', 'hidden');
}
function showScroll() {
    $("#app").css('overflow-y', 'auto');
}

function processo(type, object) {
    if (type === '3') {

    } else if (type.name === 'relatorio') {
        $('#dvLoading').hide();
        $("#salvarRelatorioForm").html('<ul id="tab1" class="tabs"></ul>');
        $("#dialog-unidades").dialog('open');
    }
    if (type.name === 'maximizar') {
        if (type.value === 'Maximizar editor') {
            type.value = "Restaurar editor"
            $("#app").scrollTo(110);
            var editor = CKEDITOR.instances.editor;
            editor.resize('100%', $("#app")[0].offsetHeight - 40);
        } else {
            type.value = 'Maximizar editor';
            $("#app").scrollTo(0);
            var editor = CKEDITOR.instances.editor;
            editor.resize('100%', 200);
        }
    }
    if (type.name === 'imprimir') {
        window.open('http://localhost:8080/index.php/processo?imprimir&proc=' + type.getAttribute('proc_id'));
    }
    if (type.name === 'mostrar_relatorio') {
        if (type.value === 'Mostrar relatório') {
            $("#relatorio" + type.getAttribute('index')).show();
            type.value = 'Ocultar relatório';
        } else {
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
                            } else if ($(this)[0].nodeName === 'LABEL') {
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
            if ($("#adicionar_equipamento").parent().parent().children().length > 2) {
                $("#adicionar_equipamento").parent().next().remove();
            }
            $("#dialog-alertas").data('step', type)
                    .dialog("open");
        } else {
            var step = (alertas[parseInt(type.getAttribute('index'))]);
            $("#equipamento_value").val(step.equipamento_id);
            $("#equipamento_value").attr('name', step.name);
            if (step.relatrio)
                $("#alerta_ralatorio")[0].checked = true;
            else
                $("#alerta_ralatorio")[0].checked = false;
            if (step.equipamento)
                $("#alerta_equipamento")[0].checked = true;
            else
                $("#alerta_equipamento")[0].checked = false;
            if ($("#adicionar_equipamento").parent().parent().children().length > 2) {
                $("#adicionar_equipamento").parent().next().remove();
            }
            if (step.equipamento_id !== '')
                $("#adicionar_equipamento").parent().after('<div style="margin-top:5px;margin-left:100px;" class="feild"><label>Equipamento:</label><p style="width: 100px;float: left;">' + step.name + '</p><input type="button" onclick="processo(this);" id="eliminar_equipamento" name="eliminar_equipamento"  value="X" class="submit" style="float:none; width: 16px;" /></div>');
            $("#mensagem").val(step.texto);
            $("#dialog-alertas").data('step', type)
                    .dialog("open");
        }
    }
    if (type.name === 'adicionar_equipamento') {
        $("#salvarStatusEquipamneto").html('<ul id="tab2" class="tabs"></ul>');
        detach = false;
        $("#dialog-listar-equipamento").data('callback', function (data) {
            console.log($("#adicionar_equipamento").parent().parent().children());
            if ($("#adicionar_equipamento").parent().parent().children().length > 2) {
                $("#adicionar_equipamento").parent().next().remove();
            }
            $("#adicionar_equipamento").parent().after('<div style="margin-top:5px;margin-left:100px;" class="feild"><label>Equipamento:</label><p style="width: 100px;float: left;">' + data.name + '</p><input type="button" onclick="processo(this);" id="eliminar_equipamento" name="eliminar_equipamento"  value="X" class="submit" style="float:none; width: 16px;" /></div>');
            $("#equipamento_value").val(data.id);
            $("#equipamento_value").attr('name', data.name);
        })
                .dialog("open");
    }
    if (type.name === 'eliminar_equipamento') {
        $("#" + type.id).parent().remove();
        $("#equipamento_value").val('')
        $("#equipamento_value").attr('name', '');
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
        } else {
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
                                steps_array[index] = {
                                    'title': title,
                                    'step': $(this)[0].value
                                };
                                title = '';
                                index++;
                            }
                        });
                    } else {
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
    if (type.name === 'editar_proc') {
        update = true;
        $.post("index.php/processo?novoproc=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
            CKEDITOR.config.height = 200;
            CKEDITOR.config.width = 750;
            $("#proc_id").val(type.getAttribute('proc_id'))


            $.post('index.php/processo?getprocedimentos&proc=' + type.getAttribute('proc_id'), function (data) {
                var proc = JSON.parse(JSON.parse(JSON.parse(data)['manobra']));
                $("#manobra_nome").val(proc[1].nome.value);
                $("#editor").html(JSON.parse(JSON.parse(data)['descricao']));
                initSample();
                var editar_alerta = '';
                var
                        alertas = proc[2]['alertas'];
                for (var i = 0; i < proc[2]['steps'].length; i++) {
                    if (proc[2]['steps'][i]['title'] !== '') {
                        $("#passos").append('<div style="margin-top:10px" class="field" tipo="titulo">' +
                                '<label>Titulo intermédio:</label>' +
                                '<textarea style="background-color: aliceblue;height: 35px;width: 750px;" name="manobra[passos][passo1]">' + proc[2]['steps'][i]['title'] + '</textarea>' +
                                '<input type="button" onclick="processo(this);" name="remover_titulo" index="' + i + '" value="Remover" class="submit" style="float:none; width: 100px;margin-bottom: 10px;margin-top: 10px;margin-right: 10px;" />' +
                                '<div class="clear separator"></div>' +
                                '</div>');
                    }
                    if (alertas[i] !== null)
                        editar_alerta = "Editar Alerta";
                    else
                        editar_alerta = "Adicionar Alerta";
                    $("#passos").append('<div style="margin-top:10px" class="field" index="' + i + '" tipo="passo">' +
                            '<label>Passo ' + i + ':</label>' +
                            '<textarea style="background-color: antiquewhite;height: 50px;width: 750px" name="manobra[passos][passo' + i + ']">' + proc[2]['steps'][i]['step'] + '</textarea>' +
                            '<input type="button" onclick="processo(this);" name="alerta" index="' + i + '" value="' + editar_alerta + '" class="submit" style="float:none; width: 100px;margin-bottom: 10px;margin-top: 10px;" />' +
                            '<input type="button" onclick="processo(this);" name="remover_passso" index="' + i + '" value="Remover passo" class="submit" style="float:none; width: 100px;margin-bottom: 10px;margin-top: 10px;margin-right: 10px;" />' +
                            '<div class="clear separator"></div>' +
                            '</div>'
                            );
                }
            });
        });
    }

    if (type === 'show_proc') {
        $.post("index.php/processo?show_proc=&proc=" + object.getAttribute('id'), function (data) {
            document.getElementById("app").innerHTML = data;
            detach = false;
            $.post('index.php/processo?getprocedimentos&proc=' + object.getAttribute('id'), function (data) {
                monobra_id = moment().format('MMMM Do YYYY, h:mm:ss a').replace(/\s/g, '');
                proc_id = object.getAttribute('id');
                var proc = JSON.parse(JSON.parse(JSON.parse(data)['manobra']));
                alertas = proc[2]['alertas'];
                for (var i = 0; i < proc[2]['steps'].length; i++) {
                    if (proc[2]['steps'][i]['title'] !== '') {
                        $("#procedimentos").append('<tr type="title"><td  colspan="4" style="text-align: center;padding: 5px;"><label>' + proc[2]['steps'][i]['title'] + '</label></td></tr>');
                    }
                    if (i === 0) {
                        $("#procedimentos").append('<tr style="border:2px solid #FA4616;border-bottom:0"><td style="width: 80px;"><label> Passo ' + i + '</label></td><td style="padding: 5px;">' + proc[2]['steps'][i]['step'] + '</td><td style="width:110px"></td><td style="width:120px"></td></tr>');
                        $("#procedimentos").append('<tr style="border:2px solid #FA4616;border-top:0"><td colspan="4">' +
                                '<input type="button" onclick="processo(this,' + (i) + ');" id="relatorio' + i + '" name="relatorio" style="width:110px;margin-bottom: 5px;margin-top: 5px;float: left" value="Alterar relatorio" class="button">' +
                                '<input type="button" onclick="checkStep(this,' + (i) + ');" id="salvar' + i + '" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button">' +
                                '</td></tr>');
                        if (alertas[i] !== null) {
                            getAlerta($("#salvar" + i), i);
                        }
                    } else {
                        $("#procedimentos").append('<tr><td style="width: 80px;"><label> Passo ' + i + '</label></td><td style="padding: 5px;">' + proc[2]['steps'][i]['step'] + '</td><td style="width:110px"></td><td style="width:120px"></td></tr>');

                    }

                }
            });
        });
    }

    if (type === 'show_proc_pending') {
        $.post("index.php/processo?show_proc=&proc=" + object.getAttribute('proc_id'), function (data) {
            document.getElementById("app").innerHTML = data;
            detach = false;
            $.post("index.php/processo?getprocedimentos=&proc=" + object.getAttribute('proc_id'), function (data) {
                var proc = JSON.parse(JSON.parse(JSON.parse(data)['manobra']));
                alertas = proc[2]['alertas'];
                $.post('index.php/processo?getpassos&manobra=' + object.id, function (data) {
                    monobra_id = object.id;
                    proc_id = object.getAttribute('proc_id');
                    var passos = (JSON.parse(data)['passos']);
                    for (var i = 0; i < proc[2]['steps'].length; i++) {
                        if (proc[2]['steps'][i]['title'] !== '') {
                            $("#procedimentos").append('<tr type="title"><td  colspan="4" style="text-align: center;padding: 5px;"><label>' + proc[2]['steps'][i]['title'] + '</label></td></tr>');
                        }
                        if (i === passos.length) {
                            $("#procedimentos").append('<tr style="border:2px solid #FA4616;border-bottom:0"><td style="width: 80px;"><label> Passo ' + i + '</label></td><td style="padding: 5px;">' + proc[2]['steps'][i]['step'] + '</td><td style="width:110px"></td><td style="width:120px"></td></tr>');
                            $("#procedimentos").append('<tr style="border:2px solid #FA4616;border-top:0"><td colspan="4">' +
                                    '<input type="button" onclick="processo(this,' + (i) + ');" id="relatorio' + i + '" name="relatorio" style="width:110px;margin-bottom: 5px;margin-top: 5px;float: left" value="Alterar relatorio" class="button">' +
                                    '<input type="button" onclick="checkStep(this,' + (i) + ');" id="salvar' + i + '" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button">' +
                                    '<input type="button" onclick="checkStep(this,' + (i) + ');" id="anular' + (i) + '" name="anular_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left;width:110px" value="Anular anterior" class="button">' +
                                    '</td></tr>');
                            if (alertas[i] !== null) {
                                getAlerta($("#anular" + i), i);
                            }
                        } else {
                            if (i > passos.length)
                                $("#procedimentos").append('<tr ><td style="width: 80px;"><label> Passo ' + i + '</label></td><td style="padding: 5px;">' + proc[2]['steps'][i]['step'] + '</td><td style="width:110px"></td><td style="width:120px"></td></tr>');
                            else
                                $("#procedimentos").append('<tr owner="' + passos[i].user_id + '"><td style="width: 80px;"><label> Passo ' + i + '</label><img style="margin-left:10px" src="img/status/DONE.png" alt="Smiley face" height="16" width="16"></td><td style="padding: 5px;">' + proc[2]['steps'][i]['step'] + '</td><td style="width:110px">' + passos[i].data + '</td><td style="width:120px">' + passos[i].utilizador + '</td></tr>');
                        }
                    }
                });
            });
        });
    }

    if (type === 5) {
        $.post("index.php/processo?type=5", function (data) {

            document.getElementById("app").innerHTML =
                    '<h1>Procedimentos pendentes</h1><form><ul id="tab2" class="tabs"></ul></form>';
            var unidades = JSON.parse(data)['unidades'];
            var manobras = JSON.parse(data)['manobra'];
            TABS.CreateTabs('tab2');
            for (var i = 0; i < unidades.length; i++) {
                var element = $('<div></div>');
                for (var j = 0; j < manobras.length; j++) {
                    var div = '';
                    if (manobras[j].unidade === unidades[i].id) {
                        div = '<div proc_id="' + manobras[j].proc_id + '" id="' + manobras[j].manobra_id + '" onMouseOut="pointer(this)" onMouseOver="pointer(this)" name="show_proc" onclick="processo(\'show_proc_pending\',this)"  class="field" style="height: 21px;background-color: #F3F3F3;"><label style="width:500px;margin-left:5px;">' + manobras[j].Nome + '</label></div>';
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
    if (type === 1) {
        $.post("index.php/processo?type=1", function (data) {
            document.getElementById("app").innerHTML =
                    '<h1>Procedimentos</h1><form><ul id="tab2" class="tabs"></ul></form>';
            var unidades = JSON.parse(data)['unidades'];
            var manobras = JSON.parse(data)['manobra'];
            TABS.CreateTabs('tab2');
            for (var i = 0; i < unidades.length; i++) {
                var element = $('<div></div>');
                for (var j = 0; j < manobras.length; j++) {
                    var div = '';
                    if (manobras[j].unidade === unidades[i].id) {
                        div = '<div id="' + manobras[j].id + '" onMouseOut="pointer(this)" onMouseOver="pointer(this)" name="show_proc" onclick="processo(\'show_proc\',this)"  class="field" style="height: 21px;background-color: #F3F3F3;"><label style="width:500px;margin-left:5px;">' + manobras[j].nome + '</label></div>';
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
    if (type === 2) {
        $.post("index.php/processo?novoproc=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
            CKEDITOR.config.height = 200;
            CKEDITOR.config.width = 750;

            while (steps_array.length > 0) {
                steps_array.pop();
            }

            while (alert.length > 0) {
                alert.pop();
            }
            initSample();
            var editor = CKEDITOR.instances.editor;
            //editor.resize('100%', 200);
            update = false;
        });
    }
    if (type === 3) {
        $.post("index.php/processo?type=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
        });
    }
}

function pointer(div) {
    if ($("#" + div.id)[0].style.backgroundColor === 'rgb(243, 243, 243)')
        $("#" + div.id).css('background-color', '#FA4616');
    else
        $("#" + div.id).css('background-color', 'rgb(243, 243, 243)');
}

function checkStep(step, index) {
    $("#dvLoading").show();
    if (step.name === 'salvar_passo_proc') {
        var nextStep = function () {
            if (parseInt(($("#procedimentos").children().children().last().prev().children().first().children().html()).split(' ')[2]) === index) {
                $("#" + step.id).parent().parent().prev().css('border', '1px solid');
                $("#" + step.id).parent().parent().prev().first().children().first().append('<img style="margin-left:10px" src="img/status/DONE.png" alt="Smiley face" height="16" width="16">');
                $("#procedimentos").after('<h1>Procedimento concluido</h1>');
                //$("#" + step.id).parent().parent().remove();
                $.post('index.php/processo?updatemanobra&manobra=' + monobra_id, function (data) {
                    ($("#" + step.id).parent().parent().prev().first().children().last().append(username));
                    $("#" + step.id).parent().parent().prev().first().children().last().prev().append(data)
                    $("#" + step.id).parent().parent().remove();
                });
            } else {
                if ($("#" + step.id).parent().parent().next().attr('type') === 'title') {
                    $("#" + step.id).parent().parent().next().next().css('border', '2px solid #FA4616 ')
                            .css('border-bottom', '0');
                    $("#" + step.id).parent().parent().prev().css('border', '1px solid');
                    $("#" + step.id).parent().parent().prev().attr('owner', userid);
                    $("#" + step.id).parent().parent().next().next().after('<tr style="border:2px solid #FA4616;border-top:0"><td colspan="4">' +
                            '<input type="button" onclick="processo(this,' + (index) + ');" id="relatorio' + index + '" name="relatorio" style="width:110px;margin-bottom: 5px;margin-top: 5px;float: left" value="Alterar relatorio" class="button">' +
                            '<input type="button" onclick="checkStep(this,' + (index + 1) + ');" id="salvar' + (index + 1) + '" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button">' +
                            '<input type="button" onclick="checkStep(this,' + (index + 1) + ');" id="anular' + (index + 1) + '" name="anular_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left;width:110px" value="Anular anterior" class="button"></td></tr>');
                    if (alertas[index + 1] !== null) {
                        getAlerta($("#anular" + (index + 1)), index + 1);
                    }
                    $("#" + step.id).parent().parent().remove();
                } else {

                    $("#" + step.id).parent().parent().next().css('border', '2px solid #FA4616 ')
                            .css('border-bottom', '0');
                    $("#" + step.id).parent().parent().prev().css('border', '1px solid');
                    $("#" + step.id).parent().parent().prev().attr('owner', userid);
                    $("#" + step.id).parent().parent().next().after('<tr style="border:2px solid #FA4616;border-top:0"><td colspan="4">' +
                            '<input type="button" onclick="processo(this,' + (index) + ');" id="relatorio' + index + '" name="relatorio" style="width:110px;margin-bottom: 5px;margin-top: 5px;float: left" value="Alterar relatorio" class="button">' +
                            '<input type="button" onclick="checkStep(this,' + (index + 1) + ');" id="salvar' + (index + 1) + '" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button">' +
                            '<input type="button" onclick="checkStep(this,' + (index + 1) + ');" id="anular' + (index + 1) + '" name="anular_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left;width:110px" value="Anular anterior" class="button"></td></tr>');
                    if (alertas[index + 1] !== null) {
                        getAlerta($("#anular" + (index + 1)), index + 1);
                    }
                    ($("#" + step.id).parent().parent().prev().first().children().first().append('<img style="margin-left:10px" src="img/status/DONE.png" alt="Smiley face" height="16" width="16">'))

                }
            }

        };
        if (index === 0) {
            $.post('index.php/processo?novamanobra&proc=' + proc_id, function (data) {
                $.post("index.php/processo?salvar_passo_proc&passo=" + index + "&monobra_id=" + data + "&proc_id=" + proc_id, function (resp) {
                    nextStep();
                    monobra_id = data;
                    console.log($("#" + step.id).parent().parent().prev().first().children().last().append(username));
                    $("#" + step.id).parent().parent().prev().first().children().last().prev().append(resp)
                    $("#" + step.id).parent().parent().remove();
                    $("#dvLoading").hide();
                });
            });
        } else {
            $.post("index.php/processo?salvar_passo_proc&passo=" + index + "&monobra_id=" + monobra_id + "&proc_id=" + proc_id, function (data) {
                nextStep();
                console.log($("#" + step.id).parent().parent().prev().first().children().last().append(username));
                $("#" + step.id).parent().parent().prev().first().children().last().prev().append(data)
                $("#" + step.id).parent().parent().remove();
                $("#dvLoading").hide();
            });
        }
    } else if (step.name === 'anular_passo_proc') {
        var prevStep = function () {
            if ($("#" + step.id).parent().parent().prev().prev().attr('type') === 'title') {

                $("#" + step.id).parent().parent().prev().prev().prev().css('border', '2px solid #FA4616 ')
                        .css('border-bottom', '0');
                $("#" + step.id).parent().parent().prev().css('border', '1px solid');
                $("#" + step.id).parent().parent().prev().prev().prev().children().last().html('');
                $("#" + step.id).parent().parent().prev().prev().prev().children().last().prev().html('');
                $("#" + step.id).parent().parent().prev().prev().prev().after('<tr style="border:2px solid #FA4616;border-top:0"><td colspan="4">' +
                        '<input type="button" onclick="processo(this,' + (index) + ');" id="relatorio' + index + '" name="relatorio" style="width:110px;margin-bottom: 5px;margin-top: 5px;float: left" value="Alterar relatorio" class="button">' +
                        '<input type="button" onclick="checkStep(this,' + (index - 1) + ');" id="salvar' + (index - 1) + '" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button"></td></tr>');
                if ((index - 1) > 0)
                    $("#salvar" + (index - 1)).after('<input type="button" onclick="checkStep(this,' + (index - 1) + ');" id="anular' + (index - 1) + '" name="anular_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left;width:110px" value="Anular anterior" class="button"></td></tr>');
                if (alertas[index - 1] !== null) {
                    if ((index - 1) > 0)
                        getAlerta($("#anular" + (index - 1)), index - 1);
                    else {
                        getAlerta($("#salvar" + (index - 1)), index - 1);
                    }
                }
                $("#" + step.id).parent().parent().prev().prev().prev().first().children().first().children().last().remove();
                $("#" + step.id).parent().parent().remove();

            }
            else {

                $("#" + step.id).parent().parent().prev().prev().css('border', '2px solid #FA4616 ')
                        .css('border-bottom', '0');
                $("#" + step.id).parent().parent().prev().css('border', '1px solid');
                $("#" + step.id).parent().parent().prev().prev().children().last().html('');
                $("#" + step.id).parent().parent().prev().prev().children().last().prev().html('');
                $("#" + step.id).parent().parent().prev().prev().after('<tr style="border:2px solid #FA4616;border-top:0"><td colspan="4">' +
                        '<input type="button" onclick="processo(this,' + (index) + ');" id="relatorio' + index + '" name="relatorio" style="width:110px;margin-bottom: 5px;margin-top: 5px;float: left" value="Alterar relatorio" class="button">' +
                        '<input type="button" onclick="checkStep(this,' + (index - 1) + ');" id="salvar' + (index - 1) + '" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button"></td></tr>');
                if ((index - 1) > 0)
                    $("#salvar" + (index - 1)).after('<input type="button" onclick="checkStep(this,' + (index - 1) + ');" id="anular' + (index - 1) + '" name="anular_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left;width:110px" value="Anular anterior" class="button">');
                if (alertas[index - 1] !== null) {
                    if ((index - 1) > 0)
                        getAlerta($("#anular" + (index - 1)), index - 1);
                    else {
                        getAlerta($("#salvar" + (index - 1)), index - 1);
                    }
                }
                ($("#" + step.id).parent().parent().prev().prev().prev().first().children().first().children().last().remove());
                $("#" + step.id).parent().parent().remove();

            }
        };
        $.post('index.php/processo?deletepassos&manobra=' + monobra_id + '&passo=' + (index - 1), function (data) {
            if ($("#" + step.id).parent().parent().prev().prev().attr('type') === 'title') {
                if ($("#" + step.id).parent().parent().prev().prev().prev().attr('owner') === userid) { 
                    prevStep();
                } else {
                    $("#dvLoading").hide();
                    $("#informacao").html('Não tem permisão para anular este passo!');
                    $("#dialog-informacao").dialog('open');
                }
            }
            else {
                if ($("#" + step.id).parent().parent().prev().prev().attr('owner') === userid) {
                    prevStep();
                }
                else {
                    $("#dvLoading").hide();
                    $("#informacao").html('Não tem permisão para anular este passo!');
                    $("#dialog-informacao").dialog('open');
                }
            }
        });
    }

}



function getAlerta(tag, index) {
    var alerta = '';
    console.log(alertas);
    if (alertas.length > 0) {
        tag.after('<div style="clear: left;float:left;padding: 5px;" id="alert' + index + '"></div>');
        if (alertas[index]['relatrio']) {
            $("#alert" + index).append('<label style="color:red;line-height:18px">-Não se esqueça de actualizar o relatorio</label>');
        }
        if (alertas[index]['equipamento']) {
            $("#alert" + index).append('<br><label style="color:red;line-height:18px">-Não se esqueça de actualizar o estado do equipamento</label>');
        }
        $("#alert" + index).append('<div class="field"><label style="float:left;width:120px">Observações:</label><textarea rows="4" cols="40"></textarea></div>');
        if (alertas[index]['equipamento_id'] !== '') {
            detach = false;
            $.post("index.php/equipamento?get_status_equipamento&equipamento=" + alertas[index]['equipamento_id'], function (data) {
                var equipamento = JSON.parse(data);
                detach = false;
                $.post("index.php/equipamento?get_accoes&tipo=" + equipamento.equipamento.tipo, function (data) {
                    $('#dvLoading').hide();
                    var accoes = JSON.parse(data);
                    var element = '<select onchange="equipamento(this,' + equipamento.equipamento.tipo + ');" id="halt-status' + equipamento.id + '" name="halt-status">';
                    for (var i = 0; i < accoes.length; i++) {
                        element += '<option value="' + i + '">' + accoes[i] + '</option>';
                    }
                    element += '</select>';
                    $("#alert" + index).children().last().before('<fieldset style="width: 100%;"><div class="field"><label style="float:left;width:120px">Equipamento:</label><p>' + equipamento.equipamento.equipamento + '</p></div>' +
                            '<div class="field"><label style="float:left;width:120px">Status:</label><p>' + equipamento.estado + '</p></div>' +
                            '<div class="field"><label style="float:left;width:120px">Novo status:</label>' + element + '</div><br></fieldset>');

                });
            });
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

function showRequestEquipamentos(formData, jqForm, options) {
    console.log(formData);
    return false;
}


function showRequest(formData, jqForm, options) {
    $('#dvLoading').show();
    var procedimento = [];
    var editor = CKEDITOR.instances.editor;
    console.log(formData);
    procedimento.push({
        'unidade': formData[0]
    });
    procedimento.push({
        'nome': formData[1]
    });
    var id = formData[formData.length - 1].value;
    var content_array = {
        'alertas': alertas,
        'steps': steps_array
    };
    procedimento.push(content_array);
    detach = false;
    if (update) {

        $.post("index.php/processo?update=true&id=" + id + "&unidade=" + procedimento[0]['unidade']['value'] + '&nome=' + procedimento[1]['nome']['value'], {
            procidimento: JSON.stringify(procedimento),
            descricao: editor.getData()
        }, function (data) {
            $('#dvLoading').hide();
            $("#informacao").html('Procedimento actulizado!');
            $("#dialog-informacao").dialog('open');
        });
    } else {
        update = true;
        $.post("index.php/processo?salvar=true&unidade=" + procedimento[0]['unidade']['value'] + '&nome=' + procedimento[1]['nome']['value'], {
            procidimento: JSON.stringify(procedimento),
            descricao: editor.getData()
        }, function (data) {
            $('#dvLoading').hide();
            $("#informacao").html('Novo procedimento gravado!');
            $("#dialog-informacao").dialog('open');
        });
    }


    return false;
}



    