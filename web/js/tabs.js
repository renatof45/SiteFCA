var TABS= {
    'CreateTabs': function(){
        //console.log($("#tab"));
        $("#tab").after('<div id="tabs_content" class="tabs_content">');
    },
    'AddTab':function(id,isSelected,content){
        $("#tab").append('<li id="'+id+'" onclick="TABS.SelectTab(this);"><label>'+id+'</label></li>');
        $("#"+id).append('<div id="content'+id+'" style="display:none">'+content+'</div>');
        if(isSelected){
            $("#"+id).addClass('tabs_headers_slected');
            $("#tabs_content").html(content);
        }
        else{
            $("#"+id).addClass('tabs_headers');
        }
    },
    'SelectTab':function(elem){
        console.log(elem.id);
        $(".tabs_headers_slected").addClass('tabs_headers');
        $(".tabs_headers").removeClass('tabs_headers_slected')
        $("#"+elem.id).toggleClass('tabs_headers_slected');
        $("#tabs_content").html($("#content"+elem.id)[0].innerHTML);
        //$("#"+elem.id).append('<div id="content'+elem.id+'" style="display:none">'+content+'</div>');
    }
};
