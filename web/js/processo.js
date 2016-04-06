
var relatorios_passos = [];
var alertas = [];
var steps_array = [];
var last_index = 0;
var update = false;
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

    }
    if (type.name === 'maximizar') {
        if (type.value === 'Maximizar editor') {
            type.value = "Restaurar editor"
            $("#app").scrollTo(110);
            var editor = CKEDITOR.instances.editor;
            editor.resize('100%', $("#app")[0].offsetHeight - 40);
        }
        else {
            type.value = 'Maximizar editor';
            $("#app").scrollTo(0);
            var editor = CKEDITOR.instances.editor;
            editor.resize('100%', 200);
        }
    }
    console.log(type.name);
    if (type.name === 'imprimir') {
        window.open('http://localhost:8080/index.php/processo?imprimir&proc=' + type.getAttribute('proc_id'));
    }
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
            if ($("#adicionar_equipamento").parent().parent().children().length > 2) {
                $("#adicionar_equipamento").parent().next().remove();
            }
            $("#dialog-alertas").data('step', type)
            .dialog("open");
        }
        else {
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
                                steps_array[index] = {
                                    'title': title,
                                    'step': $(this)[0].value
                                };
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
    if (type.name === 'editar_proc') {
        update = true;
        $.post("index.php/processo?novamanobra=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
            CKEDITOR.config.height = 200;
            CKEDITOR.config.width = 750;
            $("#proc_id").val(type.getAttribute('proc_id'))
            

            $.post('index.php/processo?getprocedimentos&proc=' + type.getAttribute('proc_id'), function (data) {
                var proc = JSON.parse(JSON.parse(JSON.parse(data)['manobra']));
                $("#manobra_nome").val(proc[1].nome.value);
                $("#editor").html(JSON.parse(JSON.parse(data)['descricao']));
                initSample();
                var editar_alerta='';
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
                    if(alertas[i]!==null)
                        editar_alerta="Editar Alerta";
                    else
                        editar_alerta="Adicionar Alerta";
                    $("#passos").append('<div style="margin-top:10px" class="field" index="' + i + '" tipo="passo">' +
                        '<label>Passo ' + i + ':</label>' +
                        '<textarea style="background-color: antiquewhite;height: 50px;width: 750px" name="manobra[passos][passo' + i + ']">' + proc[2]['steps'][i]['step'] + '</textarea>' +
                        '<input type="button" onclick="processo(this);" name="alerta" index="' + i + '" value="'+editar_alerta+'" class="submit" style="float:none; width: 100px;margin-bottom: 10px;margin-top: 10px;" />' +
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
            //detach=false;
            $.post('index.php/processo?getprocedimentos&proc=' + object.getAttribute('id'), function (data) {
                var proc = JSON.parse(JSON.parse(JSON.parse(data)['manobra']));
                console.log(proc[2]['alertas']);
                alertas = proc[2]['alertas'];
                for (var i = 0; i < proc[2]['steps'].length; i++) {
                    if (proc[2]['steps'][i]['title'] !== '') {
                        $("#procedimentos").append('<tr type="title"><td  colspan="4" style="text-align: center;padding: 5px;"><label>' + proc[2]['steps'][i]['title'] + '</label></td></tr>');
                    }
                    if (i === 0) {
                        $("#procedimentos").append('<tr style="border:2px solid #F37020;border-bottom:0"><td style="width: 80px;"><label> Passo ' + i + '</label></td><td style="padding: 5px;">' + proc[2]['steps'][i]['step'] + '</td><td style="width:150px"></td><td style="width:80px"></td></tr>');
                        $("#procedimentos").append('<tr style="border:2px solid #F37020;border-top:0"><td colspan="4"><input type="button" onclick="checkStep(this,' + (i) + ');" id="salvar' + i + '" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button">'+
                            '</td></tr>');
                        if (alertas[i] !== null) {
                            getAlerta($("#salvar" + i), i);
                        }
                    }
                    else{
                        $("#procedimentos").append('<tr><td style="width: 80px;"><label> Passo ' + i + '</label></td><td style="padding: 5px;">' + proc[2]['steps'][i]['step'] + '</td><td style="width:150px"></td><td style="width:80px"></td></tr>');
                        
                    }
                    
                }
            });
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
        $.post("index.php/processo?novamanobra=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
            CKEDITOR.config.height = 200;
            CKEDITOR.config.width = 750;


            while (alert.length > 0) {
                alert.pop();
            }
            initSample();
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
        $("#" + div.id).css('background-color', '#F37020');
    else
        $("#" + div.id).css('background-color', 'rgb(243, 243, 243)');
}

function checkStep(step, index) {
    console.log(userid);
    if (step.name === 'salvar_passo_proc') {
        if ($("#" + step.id).parent().parent().next().attr('type') === 'title') {
            $("#" + step.id).parent().parent().next().next().css('border', '2px solid #F37020 ')
            .css('border-bottom', '0');
            $("#" + step.id).parent().parent().prev().css('border', '1px solid');
            $("#" + step.id).parent().parent().next().next().after('<tr style="border:2px solid #F37020;border-top:0"><td colspan="4"><input type="button" onclick="checkStep(this,' + (index + 1) + ');" id="salvar' + (index + 1) + '" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button">' +
                '<input type="button" onclick="checkStep(this,' + (index + 1) + ');" id="anular' + (index + 1) + '" name="anular_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left;width:110px" value="Anular anterior" class="button"></td></tr>');
            if (alertas[index + 1] !== null) {
                getAlerta($("#anular" + (index + 1)), index + 1);
            }
            console.log($("#" + step.id).parent().parent().prev())
            $("#" + step.id).parent().parent().remove();
        }
        else {
            $("#" + step.id).parent().parent().next().css('border', '2px solid #F37020 ')
            .css('border-bottom', '0');
            $("#" + step.id).parent().parent().prev().css('border', '1px solid');
            $("#" + step.id).parent().parent().next().after('<tr style="border:2px solid #F37020;border-top:0"><td colspan="4"><input type="button" onclick="checkStep(this,' + (index + 1) + ');" id="salvar' + (index + 1) + '" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button">' +
                '<input type="button" onclick="checkStep(this,' + (index + 1) + ');" id="anular' + (index + 1) + '" name="anular_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left;width:110px" value="Anular anterior" class="button"></td></tr>');
            if (alertas[index + 1] !== null) {
                getAlerta($("#anular" + (index + 1)), index + 1);
            }
            ($("#" + step.id).parent().parent().prev().first().children().first().append('<img style="margin-left:10px" src="img/visto.gif" alt="Smiley face" height="16" width="18">'))
            $("#" + step.id).parent().parent().remove();
        }
    }
    else if (step.name === 'anular_passo_proc') {
        if ($("#" + step.id).parent().parent().prev().prev().attr('type') === 'title') {
            console.log("teste")
            $("#" + step.id).parent().parent().prev().prev().prev().css('border', '2px solid #F37020 ')
            .css('border-bottom', '0');
            $("#" + step.id).parent().parent().prev().css('border', '1px solid');
            $("#" + step.id).parent().parent().prev().prev().prev().after('<tr style="border:2px solid #F37020;border-top:0"><td colspan="4"><input type="button" onclick="checkStep(this,' + (index - 1) + ');" id="salvar' + (index - 1) + '" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button"></td></tr>');
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
            $("#" + step.id).parent().parent().prev().prev().css('border', '2px solid #F37020 ')
            .css('border-bottom', '0');
            $("#" + step.id).parent().parent().prev().css('border', '1px solid');
            $("#" + step.id).parent().parent().prev().prev().after('<tr style="border:2px solid #F37020;border-top:0"><td colspan="4"><input type="button" onclick="checkStep(this,' + (index - 1) + ');" id="salvar' + (index - 1) + '" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button"></td></tr>');
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
    }
}

function checkStep1(input, index) {
    var i = 0;
    var allow = true;
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
                        allow = false;
                        return false;
                    }
                    i++;
                }
            });
        });
        if (input.checked) {
            var last = false;
            last_index = index;
            if (parseInt($("#procedimentos").children().children().last()[0].children[0].innerText.split(' ')[2]) === index) {
                //$("#"+input.id).parent().parent().prev().remove();               
                //$("#procedimentos").after('<br><h2>Procedimento concluido</h2>');
                last = true;
            }
            if (index > 0 && $("#" + input.id).parent().parent().prev().attr('type') !== 'title') {
                $("#" + input.id).parent().parent().prev().remove();
                $("#" + input.id).parent().parent().prev().css('border', '1px solid');
            }
            else {
                $("#" + input.id).parent().parent().prev().prev().remove();
                $("#" + input.id).parent().parent().prev().prev().css('border', '1px solid')
            }
            $("#" + input.id).parent().parent().css('border', '2px solid #F37020 ')
            .css('border-bottom', '0');
            $("#" + input.id).parent().parent().after('<tr style="border:2px solid #F37020;border-top:0"><td colspan="4"><input type="button" onclick="processo(this);" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button"></td></tr>');
        //getAlerta($("#" + input.id),index);
        }
        else {
            last_index = index - 1;
            if (allow) {
                if (parseInt($("#procedimentos").children().children().last()[0].children[0].innerText.split(' ')[2]) === index) {
                    $("#procedimentos").next().next().remove();
                }
                $("#" + input.id).parent().parent().next().remove();
                $("#" + input.id).parent().parent().css('border', '1px solid');
                if (index > 0 && $("#" + input.id).parent().parent().prev().attr('type') !== 'title') {
                    $("#" + input.id).parent().parent().prev().css('border', '2px solid #F37020 ')
                    .css('border-bottom', '0');
                    $("#" + input.id).parent().parent().prev().after('<tr style="border:2px solid #F37020;border-top:0"><td colspan="4"><input type="button" onclick="processo(this);" name="comentarios" style="width: 110px;margin-bottom: 5px;margin-top: 5px;float: left" value="Ver comentários" class="button"></td></tr>');
                    getAlerta($("#" + input.id).parent().parent().prev().children(), index - 1);
                }
                else {
                    $("#" + input.id).parent().parent().prev().prev().css('border', '2px solid #F37020 ')
                    .css('border-bottom', '0');
                    $("#" + input.id).parent().parent().prev().prev().after('<tr style="border:2px solid #F37020;border-top:0"><td colspan="4"><input type="button" onclick="processo(this);" name="salvar_passo_proc" style="margin-bottom: 5px;margin-top: 5px;float: left" value="Salvar" class="button"></td></tr>');
                    getAlerta($("#" + input.id).parent().parent().prev().prev().children(), index - 1);
                }
            }
        }
        if (alertas[index] !== null && alertas.length > 0 && allow) {
            detach = false;
            if (input.checked) {
                getAlerta($("#" + input.id).parent().parent().next().children(), index);
            }
            $("#alerta_mensagem").html('-' + alertas[index]['texto']);
            if (alertas[index]['equipamento'])
                $("#alerta_mensagem").append('<br>-Não se esqueça de actualizar o estado do equipamento');
            if (alertas[index]['relatrio'])
                $("#alerta_mensagem").append('<br>-Não se esqueça de actualizar o relatorio');
            $("#dialog-alerta").data('relatorio', alertas[index]['relatrio'])
            .data('equipamento', alertas[index]['equipamento'])
            .data('callback', function () {
                })
            .dialog('open');
        }
    }
}

function getAlerta(tag, index) {
    var alerta='';
    tag.after('<div style="clear: left;float:left;padding: 5px;" id="alert'+index+'"></div>');
    if (alertas[index]['relatrio']){
       $("#alert"+index).append('<label style="color:red;line-height:18px">-Não se esqueça de actualizar o relatorio</label>');
    }
    if (alertas[index]['equipamento']){
        $("#alert"+index).append('<br><label style="color:red;line-height:18px">-Não se esqueça de actualizar o estado do equipamento</label>');
    }
     $("#alert"+index).append('<div class="field"><label style="float:left;width:120px">Observações:</label><textarea rows="4" cols="40"></textarea></div>');
    if(alertas[index]['equipamento_id']!==''){
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
                $("#alert"+index).children().last().before('<fieldset style="width: 100%;"><div class="field"><label style="float:left;width:120px">Equipamento:</label><p>' + equipamento.equipamento.equipamento + '</p></div>' +
                    '<div class="field"><label style="float:left;width:120px">Status:</label><p>' + equipamento.estado + '</p></div>' +
                    '<div class="field"><label style="float:left;width:120px">Novo status:</label>' + element + '</div><br></fieldset>');

            });
        });
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
    if (update) {

        $.post("index.php/processo?update=true&id=" + id + "&unidade=" + procedimento[0]['unidade']['value'] + '&nome=' + procedimento[1]['nome']['value'], {
            procidimento: JSON.stringify(procedimento),
            descricao: editor.getData()
        }, function (data) {
            $('#dvLoading').hide();
        });
    }
    else {
        $.post("index.php/processo?salvar=true&unidade=" + procedimento[0]['unidade']['value'] + '&nome=' + procedimento[1]['nome']['value'], {
            procidimento: JSON.stringify(procedimento),
            descricao: editor.getData()
        }, function (data) {
            $('#dvLoading').hide();
        });
    }


    return false;
}



    