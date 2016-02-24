$(document).ajaxStop(function () {
    if (detach) {
        $('.ui-dialog').detach();
    } else {
        detach = true;
    }


    $("#draggable1").draggable({
        containment: "#containment-wrapper" + pagina,
        scroll: false
    });
    $('#ajaxform1').ajaxForm(function (data) {
        document.getElementById("app").innerHTML = data;
        if ($("#editor").length) {
            initSample();
        }
    });
    $('#ajaxform2').ajaxForm(function (data) {
        document.getElementById("app").innerHTML = data;
    });
    $('#ajaxform3').ajaxForm(function (data) {
        document.getElementById("app").innerHTML = data;
    });

    $('#ajaxform4').ajaxForm(function (data) {
        document.getElementById("area_id").innerHTML = data;
        document.getElementById("app").innerHTML = '<h2>Se esta a ler isto, é porque mudou de area!</h2>' +
    '<h2>Tenha atenção que a partir de agora todas as operações que efectuar serão referentes à area selecionada.</h2>';
    });

    $('#perfilForm').ajaxForm(function (data) {
        window.location = 'index.php?userchange';
    });




    $('#change-status-form').ajaxForm(function (data) {
        document.getElementById("app").innerHTML = data;
        $('#dvLoading').hide();
    });

    var flashes = $("#flashes");
    setTimeout(function () {
        flashes.slideUp("slow");
    }, 3000);

    $(".datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd',
        beforeShow: function (input, inst) {
            if (inst.id === 'datafim' && $('#datainicio').val() == '') {
                alert('Preencha a data de inicio primeiro');
                $("#datafim").datepicker("close");
            }
            var rect = input.getBoundingClientRect();
            console.log(input);

        },
        onClose: function (dateText, inst) {
            if ($('#datafim').val() < $('#datainicio').val() && inst.id == 'datafim') {
                alert("A data de fim não pode ser inferior à de inicio!")
                $('#datafim').val('');
            }
        }

    });

    $("#tabs").tabs();

    $('#dvLoading').hide();

    $("#hora").val(' ')
    var password = $("#password"),
    submit = $("#change-status-form"),
    allFields = $([]).add(password);

    $("#dialog-form").dialog({
        autoOpen: false,
        height: 180,
        width: 350,
        modal: true,
        buttons: {
            "OK": function () {
                //console.log($("#change-status-form")[0].action);
                $("#palavra").attr('value', password.val());
                $('#dvLoading').show();
                $("#change-status-form").submit();
                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });

    $("#login")
    .click(function () {
        $("#change-status-form").attr('action', 'index.php/enclub?encomendar=1&tipo=1');
        $("#enc").attr('value', '1');
        $("#dialog-form").dialog("open");
    });


    $("#dialog-nova-firma").dialog({
        autoOpen: false,
        height: 180,
        width: 350,
        modal: true,
        buttons: {
            "OK": function () {
                $("#ajaxform1").attr('action', 'index.php/add-edit-aut?firma=' + $("#firma").val());
                $('#dvLoading').show();
                $("#ajaxform1").submit();
                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });


   

    $("#dialog-disponibilidade").dialog({
        autoOpen: false,
        height: 180,
        width: 350,
        modal: true,
        buttons: {
            "OK": function () {
                console.log($("#halt-status").val())
                if ($("#halt-status").val() == 2) {
                    $(this).dialog("close");
                    $("#dialog-indisponibilidade")
                    .data('equipamento', $(this).data('equipamento'))
                    .data('inst', $(this).data("inst"))
                    .dialog("open");
                } else {
                    $('#dvLoading').show();
                    $("#ajaxform1").attr('action', 'index.php/equipamento?change_satus_dinamico=0&equipamento=' + $(this).data('equipamento') + '&status=' + 12);
                    $("#ajaxform1").submit();
                    $(this).dialog("close");
                }
            },
            "Cancel": function () {
                console.log($(this).data("inst").name);
                if ($(this).data("inst").name.split(":")[1] == "parada") {
                    $(this).data("inst").checked = false;
                }
                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });


    $("#nova_firma").click(function () {
        $("#dialog-nova-firma").dialog("open");
    });

    $("#dialog-regis-aut").dialog({
        autoOpen: false,
        height: 350,
        width: 250,
        modal: true,
        buttons: {
            "OK": function () {
                $("#ajaxform1").attr('action', 'index.php/regis-aut?tipo=' + aut_type + '&hora=' + $("#hora").val() + '&id=' + id);
                $('#dvLoading').show();
                $("#ajaxform1").submit();
                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });
    $("#dialog-aceitar-manobra").dialog({
        autoOpen: false,
        height: 150,
        width: 300,
        modal: true,
        buttons: {
            "OK": function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });
    $("#dialog-novobloco").dialog({
        autoOpen: false,
        height: 350,
        width: 900,
        modal: true,
        buttons: {
            "OK": function () {
                var bloco = '<label style="width:100%">' + $("#titulo").val() + '</label>';
                pagina = parseInt($("#select_paginas").val()) - 1;
                var pickerwith = 0;
                var pickerheight = 0;
                var tipo;
                $("#bloco").children().each(function () {
                    if ($(this)[0].style.display === 'block') {
                        if ($(this)[0].id === 'tabela') {
                            tipo = 4;
                            $("#MatrixTable" + selected_block).colResizable({
                                disable: true
                            });
                            $("#MatrixTable" + selected_block).find('tr').each(function () {
                                pickerwith = 0;
                                $(this).find('td').each(function () {
                                    if ($(this)[0].cellIndex > 0 && $(this)[0].parentNode.rowIndex > 0) {
                                        $(this).html('<input type="text" style="width:' + ($(this).outerWidth() - 10) + 'px;border: none;" name="' + $("#unidade option:selected").text().trim() + '[' + $("#titulo").val().replace(/ /g, '') + '][' + $(this)[0].parentNode.rowIndex + $(this)[0].cellIndex + ']" />')
                                    }
                                    pickerwith += $(this).outerWidth();
                                });
                            });
                            bloco += $("#tabelabloco" + selected_block).html();
                            pickerheight = $("#MatrixTable" + selected_block).height();
                        }
                        else if ($(this)[0].id === 'multipla') {
                            tipo = 1;
                            pickerheight = 18;
                            var index = 0;
                            bloco += '<ul id="multiplas' + selected_block + '">'
                            pickerwith = $.fn.textWidth($("#titulo").val(), '11px arial') + 18;
                            $("#escolhas_multiplas" + selected_block).children().each(function () {
                                if ($.fn.textWidth($(this)[0].childNodes[1].value, '11px arial') + 18 > pickerwith) {
                                    pickerwith = $.fn.textWidth($(this)[0].childNodes[1].value, '11px arial') + 18;
                                }
                                bloco += '<li><input type="checkbox" name="' + $("#unidade option:selected").text().trim() + '[' + $("#titulo").val().replace(/ /g, '') + '][' + $(this)[0].childNodes[1].value + ']"   value="' + index + '">' + $(this)[0].childNodes[1].value + '</input></li>';
                                index++;
                                pickerheight += 16;
                            });
                            bloco += '</ul>'
                        }
                        else {
                            tipo = 2;
                            pickerwith = $.fn.textWidth($("#titulo").val(), '11px arial') + 62;
                            $(this).children().each(function () {
                                $(this).children().each(function () {
                                    if ($(this)[0].nodeName === "SELECT") {
                                        pickerwith += $.fn.textWidth($(this)[0].value, '11px arial');
                                        bloco += '<div class="feild" style="float:right;line-height:18px;">' + $(this)[0].value + '<input type="text" style="width:50px;float:left;" name="' + $("#unidade option:selected").text().trim() + '[' + $("#titulo").val().replace(/ /g, '') + ']"></div>';
                                    }
                                });
                            });
                        }
                    }
                });
                if (relatorio_array.length > 1 && $(this).data('novo') === "false")
                    relatorio_array[parseInt($(this).data('pagina'))][selected_block] = null;
                relatorio_array[pagina][selected_block] = {
                    "pagina": pagina,
                    "tipo": tipo,
                    "dimetions": {
                        "with": pickerwith,
                        "hieght": pickerheight
                    },
                    "titulo": $("#titulo").val(),
                    "bloco": bloco,
                    "unidade": $("#unidade option:selected").text().trim(),
                    "location": {
                        "x": selected_block_left,
                        "y": selected_block_top
                    }
                };


                $("#containment-wrapper" + pagina).append('<div id="draggable' + selected_block + '" class="draggable">' + bloco + '</div>');
                $("#draggable" + selected_block).css('width', pickerwith);
                $("#draggable" + selected_block).css('hieght', pickerheight);
                $("#draggable" + selected_block).append('<div  name="' + selected_block + '" tipo="' + tipo + '" ondblclick="relatorio(\'picker\',this)"  class="picker"></div>');
                $("#draggable" + selected_block).draggable({
                    containment: "#containment-wrapper" + pagina,
                    scroll: false,
                    stop: function (event, ui) {
                        for (var i = 0; i < ui.helper[0].lastChild.attributes.length; i++) {
                            if (ui.helper[0].lastChild.attributes[i].nodeName === 'name')
                                var index = parseInt(ui.helper[0].lastChild.attributes[i].value);
                        }
                        console.log(relatorio_array);
                        relatorio_array[pagina][index].location.x = ui.position.left + "px";
                        relatorio_array[pagina][index].location.y = ui.position.top + "px";
                    }
                });
                $("#draggable" + selected_block).draggable().css("position", "absolute");
                $("#draggable" + selected_block).css({
                    'top': selected_block_top,
                    'left': selected_block_left,
                });
                $("#tipo").prop("disabled", false);
                $(this).dialog("close");
            },
            "Cancelar": function () {
                if ($(this).data('novo') === "false") {
                    $("#MatrixTable" + selected_block).colResizable({
                        disable: true
                    });
                    $("#containment-wrapper" + pagina).append($(this).data('original')[0].outerHTML);
                    $("#draggable" + selected_block).draggable({
                        containment: "#containment-wrapper" + pagina,
                        scroll: false
                    });
                }
                $("#tipo").prop("disabled", false);
                $(this).dialog("close");
            },
            "Apagar": function () {
                if (selected_block > -1) {
                    relatorio_array[pagina][selected_block] = null;
                }
                $("#tipo").prop("disabled", false);
                allFields.val("").removeClass("ui-state-error");
                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });
    $("#dialog-inserirnomestabbela").dialog({
        autoOpen: false,
        height: 150,
        width: 200,
        modal: true,
        buttons: {
            "OK": function () {
                var that = $(this);
                $('#MatrixTableBody' + selected_block).find('tr').each(function () {
                    $(this).find('td').each(function () {
                        var rowIndex = $(this)[0].parentNode.rowIndex;
                        var cellIndex = $(this)[0].cellIndex;
                        if (rowIndex === that.data('rowIndex') && cellIndex === that.data('cellIndex'))
                            $(this).html('<label style="padding:0;line-height: 14px;">' + $("#nomecampo").val() + '</label>');
                    });
                });
                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });
    $("#dialog-gravarrelatorio").dialog({
        autoOpen: false,
        height: 150,
        width: 200,
        modal: true,
        buttons: {
            "OK": function () {

                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });
    $("#dialog-eliminaspagina").dialog({
        autoOpen: false,
        height: 150,
        width: 300,
        modal: true,
        buttons: {
            "OK": function () {
                var index = parseInt($("#eliminar_paginas").val()) - 1;
                relatorio_array.splice(index, 1);
                $('#dvLoading').show();
                $.post("index.php/relatorio?salvar=true", {
                    "content": JSON.stringify(relatorio_array),
                    "separadores": JSON.stringify(separator_array),
                    "versao": $(this).data('versao')
                }, function (data) {
                    detach = false;
                    $('#dvLoading').hide();
                    relatorio(3);

                });
                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });

    $("#dialog-unidades").dialog({
        autoOpen: false,
        height: 500,
        width: 895,
        modal: true,
        buttons: {
            "Salvar": function () {
                $('#dvLoading').show();
                $('#salvarRelatorioForm').ajaxForm(unidadesoptions);
                $("#salvarRelatorioForm").submit();
                $(this).dialog("close");
            },
            "Cancelar": function () {

            }
        },
        close: function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });
    $("#dialog-unidades").off("dialogopen");
    $("#dialog-unidades").on("dialogopen", function () {
        console.log($(this).data('equipamento'));
        $.post("index.php/relatorio?type=2", function (data) {
            detach = false;
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

                if (dados !== null) {
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
    
    $("#dialog-indisponibilidade").dialog({
        autoOpen: false,
        height: 150,
        width: 370,
        modal: true,
        buttons: {
            "OK": function () {

                $('#dvLoading').show();
                $("#ajaxform1").attr('action', 'index.php/equipamento?change_satus_dinamico=0&equipamento=' + $(this).data('equipamento') + '&status=' + $("#status").val());
                $("#ajaxform1").submit();
                $(this).dialog("close");
            },
            "Alterar relatório":function(){
                detach = false;
                $.post("index.php/equipamento?equipamento-status="+$(this).data('equipamento')+'&status='+$("#status").val(), function (data) {
                    $("#salvarRelatorioForm").html('<ul id="tab1" class="tabs"></ul>');
                    console.log(data);
                    $("#dialog-unidades")
                    .data('equipamento',data)
                    .dialog('open');
                });
                
            },
            "Cancel": function () {
                console.log($(this).data("inst").name);
                if ($(this).data("inst").name === "disponibiblidade") {
                    $(this).data("inst").selectedIndex = "0";
                }
                if ($(this).data("inst").name.split(":")[1] === "parada") {
                    $(this).data("inst").checked = false;
                }

                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.val("").removeClass("ui-state-error");
        }
    });

});
