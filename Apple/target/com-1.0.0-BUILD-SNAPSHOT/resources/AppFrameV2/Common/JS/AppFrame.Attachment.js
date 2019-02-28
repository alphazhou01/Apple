////////////////////////////////////////////////////////////////  
// 功能名称：附件的的相关操作
// 功能说明：
// 备注：使用附件功能必须引用附件管理中GTPFileClient.js文件
////////////////////////////////////////////////////////////////
Ext.namespace("Ext.AppFrame.Attachment");
//给选中数据赋值，针对文件实体必须的属性
Ext.AppFrame.Attachment.SetFileValues = function (UploadInfo, DataSource, IsShare) {
    Gtp.util.DataSource.setFieldValue(DataSource, "Name", UploadInfo.Files[0].FileName);
    Gtp.util.DataSource.setFieldValue(DataSource, "FileID", UploadInfo.Files[0].FileID);
    Gtp.util.DataSource.setFieldValue(DataSource, "ViewGuid", UploadInfo.Files[0].ViewGuid);
    Gtp.util.DataSource.setFieldValue(DataSource, "EditGuid", UploadInfo.Files[0].EditGuid);
    Gtp.util.DataSource.setFieldValue(DataSource, "CreateTime", (new Date()).format("Y-m-d H:m:s"));
    Gtp.util.DataSource.setFieldValue(DataSource, "FileSize", UploadInfo.Files[0].FileSize + "字节");
    Gtp.util.DataSource.setFieldValue(DataSource, "DisplayName", UploadInfo.Files[0].FileName);
    if (IsShare) {
        Gtp.util.DataSource.setFieldValue(DataSource, "ShareCount", 1);
    }
    else {
        Gtp.util.DataSource.setFieldValue(DataSource, "ShareCount", 0);
    }
    if (UploadInfo.Result == "0") {
        Gtp.util.DataSource.setFieldValue(DataSource, "FileExist", true);
    }
    else {
        Gtp.util.DataSource.setFieldValue(DataSource, "FileExist", false);
    }
};

//删除文件
Ext.AppFrame.Attachment.DeleteFile = function (FileID, EditGuid, FileName) {
    GTPFileClient.FileClientSetOptionSilent(false);
    var result = GTPFileClient.FileClientDelete(FileID, EditGuid, FileName, true);
    return result;
};

//打开文件查看
Ext.AppFrame.Attachment.ViewFile = function (FileID, FileName, ViewGUID) {
    var LocalTempDir = GTPFileClient.ShellGetLocalTempDir();
    LocalTempDir = LocalTempDir + "\\" + FileName;
    GTPFileClient.FileClientSetOptionSilent(false);
    var result = GTPFileClient.FileClientDownload(FileID, ViewGUID, LocalTempDir, 0, true);
    if (!result) {
        return null;
    }
    if (result.Result == "0") {
        GTPFileClient.ShellExecute(LocalTempDir);
    }
    else {
        Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, "服务器文件错误！");
    }
};

//下载文件
Ext.AppFrame.Attachment.DownloadFile = function (FileID, FileName, ViewGUID) {
    var folderPath = GTPFileClient.ShellDialogSelectFolder("选择保存路径", folder);
    if (!folderPath || folderPath.length < 1)
        return;
    var folder = folderPath + "\\";
    var filePath = folder + FileName; // "ExcelInteractConfig.xml"; // fileInfo.Files[0].FileName;
    GTPFileClient.FileClientSetOptionSilent(false);
    var result = GTPFileClient.FileClientDownload(FileID, ViewGUID, filePath, 0, true);
    if (!result) {
        return;
    }
    if (result.Result != "0") {
        Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, result.ErrorMessage);
    }
};

//上传文件
Ext.AppFrame.Attachment.FileClientUpload = function (LocalFilePath) {
    GTPFileClient.FileClientSetOptionSilent(false);
    var uploadInfo = GTPFileClient.FileClientUpload(LocalFilePath, "", "", "", "", "", 0, true);
    if (!uploadInfo) {
        Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, "服务器连接错误！");
        return null;
    }
    if (uploadInfo.Result == "-1") {
        Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, uploadInfo.ErrorMessage);
        return null;
    }
    if (uploadInfo.Result == "-2") {
        Gtp.net.MessageBox.error(GTP.AppFrameV2.Res.PageError, uploadInfo.ErrorMessage);
        return null;
    }
    return uploadInfo;
};

//选择文件
Ext.AppFrame.Attachment.SelectFiles = function () {
    var fileInfo = GTPFileClient.ShellDialogSelectFiles("", "", "(*.*)|*.*", 0, "", false);
    if (fileInfo == null)
        return null;
    if (fileInfo.Result == false)
        return null;
    return fileInfo;
};

//通过文件ID，文件查询码，操作码判断文件是否存在
Ext.AppFrame.Attachment.CheckFileExsit = function (FileID, ViewGUID, EditGuid) {
    var exist = true;
    if (!FileID || FileID.length < 1)
        return false;
    if (!ViewGUID || ViewGUID.length < 1)
        return false;
    if (!EditGuid || EditGuid.length < 1)
        return false;
    return exist;
};

//*查询附件列表*
Ext.AppFrame.Attachment.ViewAttach = function (recordID, entityName, state) {
    if (recordID == undefined || recordID == 0) return;
    var absoluteUrl = $G.getPageURLByFullName("GTP.AppFrame.AttachPage");
    var parameters = { "EntityName": entityName, "state": state, "ID": recordID };
    var data = Gtp.net.Global.open({
        url: absoluteUrl,
        target: "_modal",
        parameters: parameters,
        features: { dialogWidth: "700px", dialogHeight: "410px" }
    });
};



