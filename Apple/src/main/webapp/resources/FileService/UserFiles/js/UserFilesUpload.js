var UFU_URL_THIS_JS = "Services/FileService/UserFiles/js/UserFilesUpload.js";
var UFU_URL_THIS_JS_SHORT = "js/UserFilesUpload.js";
var UFU_URL_GetAuthorizeKey = "Services/FileService/UserFiles/GetAuthorizeKey.ashx";
var UFU_URL_Upload = "Services/FileService/UserFiles/UserFilesUpload.ashx";
var UFU_DIALOG_FLAG_ID = "DialogType_80363B9A5231433EB63943337B32A63";
var UFU_UPLOAD_OPRATION_RESULT_SUCCESS = "success";
var UFU_UPLOAD_OPRATION_RESULT_FAIL = "fail";
var UFU_UPLOAD_OPRATION_RESULT_CANCELED = "canceled";

//返回对象 {success:true;fileExists:true;error:"errmsg"}
function UFU_GetAuthorizeKey(destDir, destFilename) {
    var handlerUrl = UFU_GetLocationRootDir() + UFU_URL_GetAuthorizeKey;
    var param = "?destDir=" + destDir + "&destFilename=" + destFilename + "&m=" + Date();
    var response = UFU_XmlHttpGetStr(handlerUrl + param);
    return UFU_DecodeJson(response);
}

function UFU_FileExistsAtServer(destDir, destFilename) {
    var handlerUrl = UFU_GetLocationRootDir() + UFU_URL_GetAuthorizeKey;
    var param = "?destDir=" + destDir + "&destFilename=" + destFilename +
         "&cmd=checkFileExists&m=" + Date();
    var response = UFU_XmlHttpGetStr(handlerUrl + param);
    var result = UFU_DecodeJson(response);
    return result.success && result.fileExists;
}

//ajax 请求，询问服务器上传是否成功
function UFU_QueryUploadResult(key) {
    var handlerUrl = UFU_GetLocationRootDir() + UFU_URL_GetAuthorizeKey;
    var param = "?cmd=queryUplaodResult&key=" + key + "&m=" + Date();
    var response = UFU_XmlHttpGetStr(handlerUrl + param);
    return UFU_DecodeJson(response);
}

//在 form 进行 submit 之前，指定 post 目标页面
function UFU_ProcessBeforeFormSubmit(form) {
    var destDir = document.getElementById("destDir").value;
    var destFilename = document.getElementById("destFilename").value;
    //如果 document.getElementById("80363B9A5231433EB63943337B32A63") 存在，
    //则说明目前为 UserFilesUploadDialog.aspx,不用再获取 key
    var needGetKey = true;
    if (document.getElementById(UFU_DIALOG_FLAG_ID) &&
        (document.getElementById(UFU_DIALOG_FLAG_ID).value != "inFrame"))
        needGetKey = false;

    if (needGetKey) {
        var keyObj = UFU_GetAuthorizeKey(destDir, destFilename);
        if (keyObj.error == "")
            document.getElementById("key").value = keyObj.key;
        else
            return false;
    }

    var handlerUrl = UFU_GetLocationRootDir() + UFU_URL_Upload;
    form.action = handlerUrl;

    return true;
}

// ajax 相关============================================================================

function UFU_CreateXmlHttpRequest() {
    var xmlHttpObj = null;
    if (window.ActiveXObject) {
        try {
            xmlHttpObj = new ActiveXObject("Msxml2.XMLHTTP")
        }
        catch (e) {
            try {
                xmlHttpObj = new ActiveXObject("Microsoft.XMLHTTP")
            }
            catch (e2) {
            }
        }
    }
    else if (window.XMLHttpRequest) {
        xmlHttpObj = new XMLHttpRequest();
    }
    return xmlHttpObj;
}

function UFU_XmlHttpGetStr(AUrl) {
    var xmlHttpObj = UFU_CreateXmlHttpRequest();
    if (xmlHttpObj) {
        xmlHttpObj.open("GET", AUrl, false);
        xmlHttpObj.send("get");
        return xmlHttpObj.responseText;
    }
    else {
        return "";
    }
}

function UFU_DecodeJson(json) {
    return eval("(" + json + ");");
}

function UFU_GetLocationRootDir() {
    //通过比较当前脚本的相对路径设置和当前页面的链接，得到当前的网站的根目录    
    var currentPageUrl = document.URL;

    //fireFox 不支持 document.scripts
    var js = document.getElementsByTagName("script");
    var jsPath;
    for (var i = js.length; i > 0; i--) {
        jsPath = js[i - 1].src;
        if (jsPath.toLowerCase().indexOf(UFU_URL_THIS_JS.toLowerCase()) > -1) {
            return jsPath.substring(0, jsPath.toLowerCase().lastIndexOf(UFU_URL_THIS_JS.toLowerCase()))
            break;
        }
        else if (jsPath.toLowerCase() == UFU_URL_THIS_JS_SHORT.toLowerCase()) {
            return "../../../";
        }
    }
    return "";
}