
var relatorios_passos = [];
var alertas = [];
var steps_array = [];
var last_index = 0;
var update = false;
var processoptions = {
    
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

function processo(type, object) {
    console.log(type.name);
    if(type.name==='imprimir'){
        window.open('http://localhost:8080/index.php/processo?imprimir&proc='+type.getAttribute('proc_id'));
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
        update=true;
        $.post("index.php/processo?novamanobra=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
            CKEDITOR.config.height = 200;
            CKEDITOR.config.width = 750;
            $("#proc_id").val(type.getAttribute('proc_id'))
            while (alert.length > 0) {
                alert.pop();
            }
            
            $.post('index.php/processo?getprocedimentos&proc=' + type.getAttribute('proc_id'), function (data) {
                var proc = JSON.parse(JSON.parse(JSON.parse(data)['manobra']));
                $("#manobra_nome").val(proc[1].nome.value);
                $("#editor").html(JSON.parse(JSON.parse(data)['descricao']));
                initSample();
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
                    $("#passos").append('<div style="margin-top:10px" class="field" index="' + i + '" tipo="passo">' +
                        '<label>Passo ' + i + ':</label>' +
                        '<textarea style="background-color: antiquewhite;height: 50px;width: 750px" name="manobra[passos][passo' + i + ']">' + proc[2]['steps'][i]['step'] + '</textarea>' +
                        '<input type="button" onclick="processo(this);" name="alerta" index="' + i + '" value="Adicionar Alerta" class="submit" style="float:none; width: 100px;margin-bottom: 10px;margin-top: 10px;" />' +
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

function checkStep(index, input) {
    console.log(parseInt($("#procedimentos").children().children().last()[0].children[0].innerText.split(' ')[2]));
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
            last_index = index;
            if(parseInt($("#procedimentos").children().children().last()[0].children[0].innerText.split(' ')[2]) === index){
                $("#procedimentos").after('<h2>Procedimento concluido</h2>');
            }
        }
        else {
            last_index = index - 1;
        }
        if (alertas[index] !== null && alertas.length > 0 && allow) {
            $("#alerta_mensagem").html('-' + alertas[index]['texto']);
            if (alertas[index]['equipamento'])
                $("#alerta_mensagem").append('<br>-Não se esqueça de actualizar o estado do equipamento');
            if (alertas[index]['relatrio'])
                $("#alerta_mensagem").append('<br>-Não se esqueça de actualizar o relatorio');
            $("#dialog-alerta").data('relatorio', alertas[index]['relatrio'])
            .data('equipamento', alertas[index]['equipamento'])
            .data('callback',function(){                       
                })
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
    var editor = CKEDITOR.instances.editor;
    console.log(formData);
    procedimento.push({
        'unidade': formData[0]
        });
    procedimento.push({
        'nome': formData[1]
        });
    var id=formData[formData.length-1].value;
    var content_array = {
        'alertas': alertas, 
        'steps': steps_array
    };
    procedimento.push(content_array);
    if (update) {
        
        $.post("index.php/processo?update=true&id="+id+"&unidade=" + procedimento[0]['unidade']['value'] + '&nome=' + procedimento[1]['nome']['value'], {
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



    