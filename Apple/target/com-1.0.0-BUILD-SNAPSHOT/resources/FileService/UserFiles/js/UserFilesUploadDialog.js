var UFU_URL_Dialog = "Services/FileService/UserFiles/UserFilesUploadDialog.aspx";
var UFU_Dialog_Custom_Callback_Function = null;
var UFU_UploadDialogWindow = null;

function UFU_ShowUploadDialog(destDir, destFilename, overWrite, callBack) {
    UFU_Dialog_Custom_Callback_Function = callBack;

    var key = "";
    var keyObj = UFU_GetAuthorizeKey(destDir, destFilename);
    if (keyObj.error == "")
        key = keyObj.key;
    else {
        UFU_UploadDialogCallback(UFU_UPLOAD_OPRATION_RESULT_FAIL, keyObj.error);
        return;
    }

    var url = UFU_GetLocationRootDir() + UFU_URL_Dialog +
        "?destDir=" + destDir + "&destFilename=" + destFilename +
        "&overWrite=" + overWrite + "&key=" + key;

    if (document.all) //IE   
    {
        var feature = "dialogWidth:500px;dialogHeight:130px;status:no;help:no";
        window.showModalDialog(url, null, feature);
        UFU_GetUploadResultAndProcess(key);
    }
    else {
        //modelessDialog可以将modal换成dialog=yes   
        var feature = "width=500,height=130,menubar=no,toolbar=no,location=no,";
        feature += "scrollbars=no,status=no,modal=yes";
        UFU_UploadDialogWindow = window.open(url, null, feature);
        UFU_UploadDialogWindow.onunload = function () {
            //对话框刚显示时，其内容为 about:blank ,之后才跳转到指定的url ,因此会触发两次 onunload
            if (UFU_UploadDialogWindow && UFU_UploadDialogWindow.document.URL.indexOf("http") == 0) {
                UFU_CloseUploadDialogWindow();
                UFU_GetUploadResultAndProcess(key);
            }
        };
    }
}

function UFU_CloseUploadDialogWindow() {
    if (UFU_UploadDialogWindow != null) {
        UFU_UploadDialogWindow.onunload = null;
        UFU_UploadDialogWindow.close();
        UFU_UploadDialogWindow = null;
    }
}

function UFU_GetUploadResultAndProcess(key) {
    if (UFU_Dialog_Custom_Callback_Function != null) {
        var ret = UFU_QueryUploadResult(key);
        UFU_UploadDialogCallback(ret.result, ret.error);
    }
}

function UFU_UploadDialogCallback(result, error) {
    UFU_CloseUploadDialogWindow();

    if (UFU_Dialog_Custom_Callback_Function != null) {
        UFU_Dialog_Custom_Callback_Function(result, error);
        UFU_Dialog_Custom_Callback_Function = null;
    }
}

function UFU_UploadDialogCancel() {
    UFU_UploadDialogCallback(UFU_UPLOAD_OPRATION_RESULT_CANCELED, "");
}