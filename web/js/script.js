$(document).ajaxStop(function () {
    if (detach) {
        $('.ui-dialog').detach();
    } else {
        detach = true;
    }


    $("#draggable1").draggable({
        containment: "#containment-wrapper",
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

    $('#adicionarManobraForm').ajaxForm(function (data) {
        var relatrio = (JSON.parse(data));
        console.log(relatrio);
        $.post("index.php/processo?type=2", function (data) {
            //document.getElementById("app").innerHTML = data;
            var content = (JSON.parse((JSON.parse(data)['template'])))
            $.post("index.php/processo?novamanobra=0", function (data) {
                document.getElementById("app").innerHTML = data;
                //console.log($("#unidade option:selected").text().trim());

                for (var i = 0; i < content.length; i++) {

                    if (content[i] !== null) {

                        if (content[i]['unidade'] === $("#unidade option:selected").text().trim()) {
                            //console.log(content[i]['bloco']);
                            $("#relatorio").append('<div class="relatrio-manobra"  id=div' + i + '></div>')
                            $("#div" + i).css('width', content[i]['dimetions']['with']);
                            
                            $("#div" + i).css({
                                'top': content[i]['location']['y'],
                                'left': content[i]['location']['x'],
                            });
                           
                            $("#div" + i).css("position", "absolute");
                            $("#div" + i).append(content[i]['bloco']);
                        }
                    }
                }
                var element_1='';
                var element_2='';
                for (var key in relatrio) {
                    //console.log(relatrio[key]);
                    if(key!=='manobra'){
                        element_1=key;
                        for (var key1 in relatrio[key]) {
                            
                            if($('[name="'+element_1+'['+key1+']"]').length>0){
                                
                                $('[name="'+element_1+'['+key1+']"]').val(relatrio[key][key1]);
                            }
                            else{
                                element_2='['+key1+']';
                            }
                            for (var key2 in relatrio[key][key1]) {
                                if(jQuery.type(relatrio[key][key1])=='object'){
                                    if($('[name="'+element_1+element_2+'['+key2+']"]')[0].type==='checkbox'){
                                        $('[name="'+element_1+element_2+'['+key2+']"]').prop("checked", true );
                                    }
                                    else{
                                        $('[name="'+element_1+element_2+'['+key2+']"]').val(relatrio[key][key1][key2]);
                                    }
                                   
                                }
                            }
                        }
                
                    }
            
                }
            });
        });
       
        
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
            if (inst.id == 'datafim' && $('#datainicio').val() == '') {
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
        //console.log($("#change-status-form"));
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


    $("#dialog-indisponibilidade").dialog({
        autoOpen: false,
        height: 180,
        width: 350,
        modal: true,
        buttons: {
            "OK": function () {

                $('#dvLoading').show();
                $("#ajaxform1").attr('action', 'index.php/equipamento?change_satus_dinamico=0&equipamento=' + $(this).data('equipamento') + '&status=' + $("#status").val());
                $("#ajaxform1").submit();
                $(this).dialog("close");
            },
            "Cancel": function () {
                console.log($(this).data("inst").name);
                if ($(this).data("inst").name == "disponibiblidade") {
                    $(this).data("inst").selectedIndex = "0";
                }
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
                console.log($("#titulo").val().replace(/ /g, ''));
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
                                        console.log($("#titulo").val().trim());
                                        $(this).html('<input type="text" style="width:' + ($(this).outerWidth() - 10) + 'px;border: none;" name="' + $("#unidade option:selected").text().trim() + '[' + $("#titulo").val().replace(/ /g, '') + '][' + $(this)[0].parentNode.rowIndex + $(this)[0].cellIndex + ']" />')
                                    }
                                    pickerwith += $(this).outerWidth();
                                //console.log($(this));
                                });
                            //return false;
                            });
                            bloco += $("#tabelabloco" + selected_block).html();
                            pickerheight = $("#MatrixTable" + selected_block).height();
                        }
                        else if ($(this)[0].id === 'multipla') {
                            tipo = 1;
                            var index = 0;
                            bloco += '<ul id="multiplas' + selected_block + '">'
                            pickerwith = $.fn.textWidth($("#titulo").val(), '11px arial') + 18;
                            $("#escolhas_multiplas" + selected_block).children().each(function () {
                                if ($.fn.textWidth($(this)[0].childNodes[1].value, '11px arial') + 18 > pickerwith) {
                                    pickerwith = $.fn.textWidth($(this)[0].childNodes[1].value, '11px arial') + 18;
                                }
                                bloco += '<li><input type="checkbox" name="' + $("#unidade option:selected").text().trim() + '[' + $("#titulo").val().replace(/ /g, '') + '][' + $(this)[0].childNodes[1].value + ']"   value="' + index + '">' + $(this)[0].childNodes[1].value + '</input></li>';
                                index++;
                            });
                            bloco += '</ul>'
                        //console.log(bloco);
                        }
                        else {
                            tipo = 2;
                            pickerwith = $.fn.textWidth($("#titulo").val(), '11px arial') + 62;
                            $(this).children().each(function () {
                                $(this).children().each(function () {
                                    if ($(this)[0].nodeName === "SELECT") {
                                        pickerwith += $.fn.textWidth($(this)[0].value, '11px arial');
                                        bloco += '<div class="feild"  style="float:right;line-height: 18px;">' + $(this)[0].value + '<input type="text" style="width:50px;float: left;" name="' + $("#unidade option:selected").text().trim() + '[' + $("#titulo").val().replace(/ /g, '') + ']"></div>';
                                    }
                                });
                            });
                        }
                    }
                });
                relatorio_array[selected_block] = {
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
                $("#containment-wrapper").append('<div id="draggable' + selected_block + '" class="draggable">' + bloco + '</div>');
                $("#draggable" + selected_block).css('width', pickerwith);
                $("#draggable" + selected_block).css('hieght', pickerheight);
                $("#draggable" + selected_block).append('<div  name="' + selected_block + '" tipo="' + tipo + '" ondblclick="relatorio(\'picker\',this)"  class="picker"></div>');
                $("#draggable" + selected_block).draggable({
                    containment: "#containment-wrapper",
                    scroll: false,
                    stop: function (event, ui) {
                        var index = parseInt(ui.helper[0].lastChild.attributes[0].value);
                        relatorio_array[index].location.x = ui.position.left;
                        relatorio_array[index].location.y = ui.position.top;
                    //console.log(relatorio_array[index]);
                    }
                });
                $("#draggable" + selected_block).draggable().css("position", "absolute");
                $("#draggable" + selected_block).css({
                    'top': selected_block_top,
                    'left': selected_block_left,
                });
                $("#tipo").prop("disabled", false);
                //console.log(relatorio_array);
                $(this).dialog("close");
            },
            "Cancelar": function () {
                if ($(this).data('novo') === "false") {
                    $("#MatrixTable" + selected_block).colResizable({
                        disable: true
                    });
                    $("#containment-wrapper").append($(this).data('original')[0].outerHTML);
                    $("#draggable" + selected_block).draggable({
                        containment: "#containment-wrapper",
                        scroll: false
                    });
                }
                //console.log($(this).data('original'));
                $("#tipo").prop("disabled", false);
                $(this).dialog("close");
            },
            "Apagar": function () {
                if (selected_block > -1) {
                    relatorio_array[selected_block] = null;

                }
                $("#tipo").prop("disabled", false);
                console.log(relatorio_array);
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

});
