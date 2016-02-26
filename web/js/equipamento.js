var tipo=0;
var ajaxform_novo_equipamento_options={
    beforeSubmit:ajaxform_novo_equipamento_options_request,
    success:ajaxform_novo_equipamento_options_response
}

function ajaxform_novo_equipamento_options_request(formData, jqForm, options){
    console.log(formData);
    $.post('index.php/equipamento?salvar_novo_dinamico&tipo='+tipo,{
        dados: (formData)
        }, function (data) {
            document.getElementById("app").innerHTML = data;
        $('#dvLoading').hide();
    });
    return false; 
}

function ajaxform_novo_equipamento_options_response(responseText, statusText, xhr, $form){
    conslole.log(responseText);
}

function instrumentos(type){
    if (type == 1) {
        $.post("index.php/equipamento?novo_instrumento=0", function (data) {
            document.getElementById("app").innerHTML = data;
        });
    }
    if(type=='novo_instrumento'){
        tipo=2;
        $('#ajaxform_novo_equipamento').ajaxForm(ajaxform_novo_equipamento_options);
        //$("#ajaxform_novo_equipamento").attr('action', 'index.php/equipamento?salvar_novo_dinamico&tipo=1');
        $("#ajaxform_novo_equipamento").submit(function(e){
            
        });
    }
}

function equipamento_dinamico(type) {
    $('#dvLoading').show();
    if (type == 2) {
        $.post("index.php/equipamento?status_dinamico=0", function (data) {
            document.getElementById("app").innerHTML = data;

        });
    } else if (type == 1) {
        $.post("index.php/equipamento?novo_dinamico=0", function (data) {
            document.getElementById("app").innerHTML = data;
        });
    } else if (type == 3) {
        $.post("index.php/equipamento?horas_de_marcha=0", function (data) {
            document.getElementById("app").innerHTML = data;
        });
    }
    else if (type === 'novo_equipamento_dinamico') {
        tipo=1;
        $('#ajaxform_novo_equipamento').ajaxForm(ajaxform_novo_equipamento_options);
        //$("#ajaxform_novo_equipamento").attr('action', 'index.php/equipamento?salvar_novo_dinamico&tipo=1');
        $("#ajaxform_novo_equipamento").submit(function(e){
            
        });
    }

    if (type.name === 'alterar') {
        detach = false;
        $("#salvarRelatorioForm").html('<ul id="tab1" class="tabs"></ul>');
        $("#dialog-unidades").dialog("open");
    }
}
var last_equipamento;

function subChangeEquipamentoStatus(equipamento, inst) {

    if (inst.name == "status") {
        $('#dvLoading').show();
        $("#ajaxform1").attr('action', 'index.php/equipamento?change_satus_dinamico=0&equipamento=' + equipamento + '&status=' + inst.value);
        $("#ajaxform1").submit();
    } else if (inst.name == "disponibiblidade") {
        if (inst.value == 1) {
            $('#dvLoading').show();
            $("#ajaxform1").attr('action', 'index.php/equipamento?change_satus_dinamico=0&equipamento=' + equipamento + '&status=' + 12);
            $("#ajaxform1").submit();
        } else {
            $("#dialog-indisponibilidade")
                    .data('status', document.getElementById("status").value)
                    .data('inst', inst)
                    .data('equipamento', equipamento)
                    .dialog("open");
        }
    } else if (inst.name == "vermais") {
        $('#historico' + last_equipamento).hide();
        detach = false;
        $.post("index.php/equipamento?history=" + equipamento, function (data) {
            history_data = JSON.parse(data);
            document.getElementById("show_history" + equipamento).innerHTML = '<tr><th>Data</th><th>Turno</th><th style="width: 300px;">Status</th></tr>'
            for (var i = 0; i < history_data.length; i++) {
                document.getElementById("show_history" + equipamento).innerHTML += "<tr><td>" + history_data[i].data + "</td><td>" + history_data[i].turno + "</td><td>" + history_data[i].descricao + "</td></tr>";
                //$("#show_history" + equipamento).append("<tr><td>" + history_data[i].data + "</td><td>" + history_data[i].turno + "</td><td>" + history_data[i].descricao + "</td></tr>");
            }

            $('#historico' + equipamento).show();
            last_equipamento = equipamento;
        });
        //$('#historico' + equipamento).show();

    } else if (inst.name == "alterar") {
        $("#dialog-indisponibilidade")
                .data('equipamento', equipamento)
                .data('inst', inst)
                .dialog("open");
    } else {
        stat = inst.name.split(":");
        console.log(stat[0]);
        if (stat[1] == "servico") {
            $('#dvLoading').show();
            $("#ajaxform1").attr('action', 'index.php/equipamento?change_satus_dinamico=0&equipamento=' + equipamento + '&status=' + 5);
            $("#ajaxform1").submit();
        } else {
            //$("#ajaxform1").attr('action', 'index.php/equipamento?change_satus_dinamico=0&equipamento=' + equipamento + '&status=' + 12);
            $("#dialog-disponibilidade")
                    .data('equipamento', equipamento)
                    .data('inst', inst)
                    .dialog("open");
        }

    }
}
function subChangeEquipamentoUnidaded(inst) {
    $('#dvLoading').show();
    $.post("index.php/equipamento?status_dinamico=0&unidade=" + inst.value, function (data) {
        document.getElementById("app").innerHTML = data;
    });
}

