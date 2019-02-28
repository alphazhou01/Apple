var UFU_URL_Frame = "Services/FileService/UserFiles/UserFilesUploadDialog.aspx";
var UFU_Frame_Object = new UFU_ModalDialog_Frame("ufu_md", 520, 130, 20, 20, "#ffffff");

function UFU_ShowUploadFrame(divElementID, destDir, destFilename, overWrite, callBack) {
    var divElement = document.getElementById(divElementID);
    if (!divElement) {
        alert("divElementID 参数必须传入某个隐藏div 的 ID");
        return;
    }
    //创建页面元素，先隐藏，需要时再显示
    UFU_Frame_Object.show(divElement, destDir, destFilename, overWrite, callBack);
}
function UFU_UploadFrameCancel() {
    UFU_Frame_Object.close(UFU_UPLOAD_OPRATION_RESULT_CANCELED, "");
}

function UFU_UploadDialogFrameCallback(result, error) {
    UFU_Frame_Object.close(result, error);
}

//模拟模态对话框 =======================================================================

function UFU_ModalDialog_Frame(name, width, height, leftop, topop, color) {
    this.divElementObj = null;
    this.callBack = null;
    this.destDir = null; //存储到的目录
    this.destFilename = null; //新文件名
    this.overWrite = null; //是否覆盖原文件
    this.name = name; //名称
    this.width = width; //窗体宽
    this.height = height; //窗体高
    this.leftop = leftop; //左侧位置
    this.topop = topop; //上部位置
    this.color = color; //整体颜色
    this.show = function (divElement, destDir, destFilename, overWrite, callBack)//显示窗体
    {
        obj.divElementObj = divElement;

        obj.PrepareElements(divElement);

        if (callBack)
            obj.callBack = callBack;
        obj.destDir = destDir; //存储到的目录
        obj.destFilename = destFilename; //新文件名
        obj.overWrite = overWrite; //是否覆盖原文件

        //"Services/FileService/UserFilesUploadDialog.aspx";
        var iframeUrl = UFU_GetLocationRootDir() + UFU_URL_Frame + "?destDir=" + obj.destDir +
             "&destFilename=" + obj.destFilename + "&overWrite=" + obj.overWrite +
              "&dialogType=inFrame&frameCallback=UFU_UploadDialogFrameCallback";
        var iframe = document.getElementById(obj.name + "_iframe");
        iframe.src = iframeUrl;

        //显示
        obj.divElementObj.style.display = "block";

        document.getElementById(obj.name + "_divshow").style.width = obj.width;
        document.getElementById(obj.name + "_divshow").style.height = obj.height;
        document.getElementById(obj.name + "_divshow").style.left = obj.leftop;
        document.getElementById(obj.name + "_divshow").style.top = obj.topop;
        document.getElementById(obj.name + "_mask").style.width = document.body.clientWidth;
        document.getElementById(obj.name + "_mask").style.height = document.body.clientHeight;
        document.getElementById(obj.name + "_divshow").style.visibility = "visible";
        document.getElementById(obj.name + "_mask").style.visibility = "visible";
    };

    this.close = function (result, error)//关闭窗体
    {
        obj.divElementObj.style.display = "none";
        document.getElementById(obj.name + "_divshow").style.width = 0;
        document.getElementById(obj.name + "_divshow").style.height = 0;
        document.getElementById(obj.name + "_divshow").style.left = 0;
        document.getElementById(obj.name + "_divshow").style.top = 0;
        document.getElementById(obj.name + "_mask").style.width = 0;
        document.getElementById(obj.name + "_mask").style.height = 0;
        document.getElementById(obj.name + "_divshow").style.visibility = "hidden";
        document.getElementById(obj.name + "_mask").style.visibility = "hidden";

        if (obj.callBack != null) {
            obj.callBack(result, error);
            obj.callBack = null;
        }

        obj.destDir = null;
        obj.destFilename = null;
        obj.overWrite = null;

        document.getElementById(obj.name + "_iframe").src = "";
    };

    this.PrepareElements = function (element) {

        var tmp = "<div id='" + obj.name + "_divshow' style='position:absolute; left:0; top:0;z-index:10; visibility:hidden;width:0;height:0'>";
        tmp += "<table cellpadding=0 cellspacing=0 border=0 width=100% height=100% >";
        tmp += "<tr>";
        tmp += "<td id='" + obj.name + "_content' valign=top >";
        tmp += "<iframe id='" + obj.name + "_iframe' width='100%' height='130' scrolling=no frameborder='0'></iframe>";
        tmp += "</td>";
        tmp += "</tr>"
        tmp += "</table>";
        tmp += "</div>";
        tmp += "<div  id='" + obj.name + "_mask' style='position:absolute; top:0; left:0; width:0; height:0; background:#666; filter:ALPHA(opacity=50); z-index:9; visibility:hidden'></div>";

        element.innerHTML = tmp;
    };

    var obj = this;
}