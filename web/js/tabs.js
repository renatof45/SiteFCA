var TABS= {
    'CreateTabs': function(elem){
        //console.log($("#tab"));
        $("#"+elem).after('<div id="tabs_content'+elem+'" class="tabs_content">');
    },
    'AddTab':function(id,isSelected,content,tab){
        $("#"+tab).append('<li id="'+id+tab+'" onclick="TABS.SelectTab(this);"><label>'+id+'</label></li>');
        $("#tabs_content"+tab).append('<div id="content'+id+tab+'" style="display:none">'+content+'</div>');
        if(isSelected){
            $("#"+id+tab).addClass('tabs_headers_slected');
            TABS.SelectedTab=id+tab;
            $("#content"+id+tab).show();
        }
        else{
            $("#"+id+tab).addClass('tabs_headers');
        }
    },
    'SelectTab':function(elem){
        var parent=($("#"+elem.id)[0].parentElement.id);
        $("#"+parent).children().each(function(){
           console.log($(this)[0].id)
           if($(this)[0].className==='tabs_headers tabs_headers_slected' || $(this)[0].className==='tabs_headers_slected')
               $("#content"+$(this)[0].id).hide();
           $(this).switchClass('tabs_headers_slected','tabs_headers',0); 
        });
        //$("#content"+TABS.SelectedTab).hide();
        //$("#"+TABS.SelectedTab).switchClass('tabs_headers_slected','tabs_headers',0);
        $("#"+elem.id).toggleClass('tabs_headers_slected');
        $("#content"+elem.id).show();
        //$("#tabs_content").html($("#content"+elem.id)[0].innerHTML);
        TABS.SelectedTab=elem.id;
    //$("#"+elem.id).append('<div id="content'+elem.id+'" style="display:none">'+content+'</div>');
    },
    'SelectedTab':''
};
