var TABS= {
    'CreateTabs': function(){
        //console.log($("#tab"));
        $("#tab").after('<div id="tabs_content" class="tabs_content">');
    },
    'AddTab':function(id,isSelected,content){
        $("#tab").append('<li id="'+id+'" onclick="TABS.SelectTab(this);"><label>'+id+'</label></li>');
        $("#tabs_content").append('<div id="content'+id+'" style="display:none">'+content+'</div>');
        if(isSelected){
            $("#"+id).addClass('tabs_headers_slected');
            TABS.SelectedTab=id;
            $("#content"+id).show();
        }
        else{
            $("#"+id).addClass('tabs_headers');
        }
    },
    'SelectTab':function(elem){
        console.log(TABS.SelectedTab);
        $("#content"+TABS.SelectedTab).hide();
        $(".tabs_headers_slected").addClass('tabs_headers');
        $(".tabs_headers").removeClass('tabs_headers_slected')
        $("#"+elem.id).toggleClass('tabs_headers_slected');
        $("#content"+elem.id).show();
        //$("#tabs_content").html($("#content"+elem.id)[0].innerHTML);
        TABS.SelectedTab=elem.id;
    //$("#"+elem.id).append('<div id="content'+elem.id+'" style="display:none">'+content+'</div>');
    },
    'SelectedTab':''
};
