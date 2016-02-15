
var relatorios_passos=[];


function processo(type) {
    //console.log($("#passos").children().size());
    if (type.name === 'mostrar_relatorio') {
        if (type.value === 'Mostrar relatório') {
            $("#relatorio" + type.getAttribute('index')).show();
            type.value='Ocultar relatório';
        }
        else{
            $("#relatorio" + type.getAttribute('index')).hide();
            type.value='Mostrar relatório';
        }
    }
    if (type.name === "nova_manobra") {

        var index = $("#passos").children().length + 1;
        $("#passos").append('<div class="field">' +
            '<label>Passo ' + index + ':</label>' +
            '<textarea style="height: 30px;width: 550px" name="manobra[passos][passo' + index + ']"></textarea>' +
            '<input type="button" onclick="processo(this);" name="mostrar_relatorio" index="' + index + '" value="Mostrar relatório" class="submit" style="float:none; width: 100px;margin-bottom: 10px;margin-top: 10px;margin-right: 400px;" />' +
            '<div id="relatorio' + index + '">' +
            '<ul id="tab'+index+'" class="tabs">' +
            ' </ul>' +
            '</div>' +
            '</div>');
        $.post("index.php/processo?type=2", function (data) {
            var content   = (JSON.parse((JSON.parse(data)['template'])))
            
            //document.getElementById("app").innerHTML = data;
            TABS.CreateTabs('tab'+index);
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
                                var bloco = $('<div class="relatrio-manobra"  id="div' + x + index+'"></div>');
                                bloco.css('width', content[i][x]['dimetions']['with']);
                                bloco.css({
                                    'top': (parseInt(content[i][x]['location']['y']) - (top - 5)) + 'px',
                                    'left': content[i][x]['location']['x'],
                                });
                                bloco.css("position", "absolute");
                                bloco.append(content[i][x]['bloco']);
                                element.append(bloco[0].outerHTML);
                                $("#div" + x+index).remove();
                            }
                        }
                    }
                }
                //console.log(element.children());
                if (unidades[j] === $("#unidade option:selected").text().trim())
                    TABS.AddTab(unidades[j], true, element[0].outerHTML,'tab'+index);
                else
                    TABS.AddTab(unidades[j], false, element[0].outerHTML,'tab'+index);
            }
            $("#relatorio"+index).hide();
            
        });
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
    if (type.name === "adicionar") {
        $('#dvLoading').show();
        $("#adicionarManobraForm").attr('action', 'index.php/processo?adicionar=true');
        $("#adicionarManobraForm").submit();
    }
    if (type === 1) {
        $.post("index.php/processo?type=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
        });
    }
    if (type === 2) {
        $.post("index.php/processo?type=" + type, function (data) {
            var content   = (JSON.parse((JSON.parse(data)['template'])))
            $.post("index.php/processo?novamanobra=" + type, function (data) {
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
                                    $("#div" + x+'1').remove();
                                }
                            }
                        }
                    }
                    if (unidades[j] === $("#unidade option:selected").text().trim())
                        TABS.AddTab(unidades[j], true, element[0].outerHTML,'tab1');
                    else
                        TABS.AddTab(unidades[j], false, element[0].outerHTML,'tab1');
                }
                $("#relatorio1").hide();
            });
        });
    }
    if (type === 3) {
        $.post("index.php/processo?type=" + type, function (data) {
            document.getElementById("app").innerHTML = data;
        });
    }
}


