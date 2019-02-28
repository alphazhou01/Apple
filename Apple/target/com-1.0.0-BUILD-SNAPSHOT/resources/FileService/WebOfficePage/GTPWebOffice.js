var GTPWebOffice = {};
var _webOffTimeCount = 0;
var webOffCallBack = null;
var IWebOffice = null;
var webDivId = null;
GTPWebOffice.CreateObject = function (id, callback) {
    //初始化对象

    var str = "";
    webDivId = id;
    var height = Ext.fly(id).getHeight() + 20;
    var version = GTPFileClient.GetWebOfficeProductName("GTP.Services.FileService", "WebOfficeProductName") || "iWebOffice2006";
    // var version = "IWebOffice2006";
    // $G.dispatcher({
    //     controller: "GB.LK.ODM.GWYY.GWWDCYPage",
    //     action: "GetSysDataByKey",
    //     args: ["GB.LK.ODM.GWSZ.OfficeVersion"],
    //     async: false,
    //     success: function (result) {
    //         if (result == "IWebOffice2009")
    //             version = result;
    //     },
    //     failure: function () {
    //     }
    // });
    if (window.ActiveXObject || Ext.isIE11) {
        //IE 浏览器 ActiveX
        if (version == "iWebOffice2009") {
            try {
                var iweb = new ActiveXObject("iWebOffice2009.HandWriteCtrl");
                str = "<object id='GTPLKWebOffice' style='margin-top:-20px' width='100%' height='" + height + "px' classid='clsid:8B23EA28-2009-402F-92C4-59BE0E063499' />";
                document.getElementById(id).innerHTML = str;
                webOffCallBack = callback;
                GTPWebOffice._loadObject();
                return true;
            }
            catch (e) {
                document.getElementById(id).innerHTML = "为保证您能正确使用office控件，请您按以下步骤操作</br>1.确认已添加信任站点,具体步骤为：打开ie浏览器,工具-internet选项-安全-可信站点-添加</br>2.<A class='down_blk_l png' href='../../../../../ClientFiles/GTP_6_BrowserPlugin_Setup.exe'>下载WEB组件</A>";
                return false;
            }
        }
        else {
            try {
                var iweb = new ActiveXObject("iWebOffice2006x.HandWriteCtrl");
                str = "<object id='GTPLKWebOffice' style='margin-top:-20px' width='100%' height='" + height + "px' classid='clsid:8B23EA28-2006-102F-92C4-59BE0E063499' />";
                document.getElementById(id).innerHTML = str;
                webOffCallBack = callback;
                GTPWebOffice._loadObject();
                return true;
            }
            catch (e) {
                try {
                    var iweb = new ActiveXObject("iWebOffice2006.HandWriteCtrl");
                    str = "<object id='GTPLKWebOffice' style='margin-top:-20px' width='100%' height='" + height + "px'  classid='clsid:8B23EA28-2006-102F-92C4-59BE0E063499' />";
                    document.getElementById(id).innerHTML = str;
                    webOffCallBack = callback;
                    GTPWebOffice._loadObject();
                    return true;
                }
                catch (e) {
                    document.getElementById(id).innerHTML = "为保证您能正确使用office控件，请您按以下步骤操作</br>1.确认已添加信任站点,具体步骤为：打开ie浏览器,工具-internet选项-安全-可信站点-添加</br>2.<A class='down_blk_l png' href='../../../../../ClientFiles/GTP_6_BrowserPlugin_Setup.exe'>下载WEB组件</A>";
                    return false;
                }
            }
        }

    }
    else {
        //处理谷歌浏览器中金格切换到本地word后,再切换回来工具栏不能用
        if (window.addEventListener) {
            try {
                window.addEventListener('blur', function () { document.body.focus(); }, false);
                window.addEventListener('focus',
								function () {
								    var obj = document.getElementById('GTPLKWebOffice');
								    if (obj && document.activeElement == document.body) {
								        obj.ResetFocus();
								    }
								},
							false);
                window.addEventListener('click',
								function () {
								    var obj = document.getElementById('GTPLKWebOffice');
								    if (obj && document.activeElement == document.body) {
								        obj.ResetFocus();
								    }
								},
							false);
            }
            catch (e) { }
        }
        if (version == "iWebOffice2009") {
            document.getElementById(id).innerHTML = "<embed id='GTPLKWebOffice' style='margin-top:-20px' clsid='{8B23EA28-2009-402F-92C4-59BE0E063499}' type='application/x-glodon-gtp-iweboffice-plugin' width='100%' height='" + height + "px' />";
            webOffCallBack = callback;
            GTPWebOffice._loadObject();
            return true;
        }
        else {
            document.getElementById(id).innerHTML = "<embed id='GTPLKWebOffice' style='margin-top:-20px' clsid='{8B23EA28-2006-102F-92C4-59BE0E063499}' type='application/x-glodon-gtp-iweboffice-plugin' width='100%' height='" + height + "px' />";
            webOffCallBack = callback;
            GTPWebOffice._loadObject();
            return true;
        }
    }
};
GTPWebOffice.OpenFile = function (FileMainID, FileGuidID) {
    if (FileMainID && FileGuidID) {
        IWebOffice.WebSetMsgByName("FileMainID", FileMainID);
        IWebOffice.WebSetMsgByName("FileGuidID", FileGuidID);
        if (IWebOffice.WebOpen()) {
            try {
                var WebObject = GTPWebOffice.GetWebObject();
                WebObject.ShowRevisions(false);   //隐藏痕迹
            }
            catch (e)
            { }
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
GTPWebOffice.OpenLocalFileByName = function (FilePath) {
    if (FilePath) {
        if (IWebOffice.WebOpenLocalFile(FilePath)) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
},
GTPWebOffice.OpenServerFile = function (FilePath) {
    if (FilePath) {
        IWebOffice.WebSetMsgByName("FilePath", FilePath);
        if (IWebOffice.WebOpen()) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
GTPWebOffice.SaveFile = function (TableKey, TableName, FileName, FileType, IsEncry, IsCompound) {
    var obj = null;
    if (FileName == undefined)
        FileName = "";
    if (TableKey && TableName) {
        IWebOffice.ShowType = 1;
        IWebOffice.FileName = FileName;
        IWebOffice.WebSetMsgByName("TableKey", TableKey);
        IWebOffice.WebSetMsgByName("TableName", TableName);
        if (FileType) {
            IWebOffice.FileType = FileType;
        }
        if (IsEncry) {
            IWebOffice.WebSetMsgByName("FileEncry", IsEncry);
        }
        if (IsCompound) {
            if (IWebOffice.WebSave()) {
                var FileMainID = IWebOffice.WebGetMsgByName("FileMainID");
                var FileViewGuid = IWebOffice.WebGetMsgByName("FileViewGuid");
                var FileEditGuid = IWebOffice.WebGetMsgByName("FileEditGuid");
                var FileSize = IWebOffice.WebGetMsgByName("FileSize");
                var FileDesc = IWebOffice.WebGetMsgByName("FileDesc");
                var OriginalName = IWebOffice.WebGetMsgByName("OriginalName");
                var FileEncry = IWebOffice.WebGetMsgByName("FileEncry");
                var signResult = "";
                obj = { "FileMainID": FileMainID, "FileViewGuid": FileViewGuid, "FileEditGuid": FileEditGuid, "FileSize": FileSize, "FileDesc": FileDesc, "OriginalName": OriginalName, "FileEncry": FileEncry };
            }
        }
        else {
            if (IWebOffice.WebSave(true)) {
                var FileMainID = IWebOffice.WebGetMsgByName("FileMainID");
                var FileViewGuid = IWebOffice.WebGetMsgByName("FileViewGuid");
                var FileEditGuid = IWebOffice.WebGetMsgByName("FileEditGuid");
                var FileSize = IWebOffice.WebGetMsgByName("FileSize");
                var FileDesc = IWebOffice.WebGetMsgByName("FileDesc");
                var OriginalName = IWebOffice.WebGetMsgByName("OriginalName");
                var FileEncry = IWebOffice.WebGetMsgByName("FileEncry");
                obj = { "FileMainID": FileMainID, "FileViewGuid": FileViewGuid, "FileEditGuid": FileEditGuid, "FileSize": FileSize, "FileDesc": FileDesc, "OriginalName": OriginalName, "FileEncry": FileEncry };
            }
        }
    }
    return obj;
};
GTPWebOffice.SaveAsPDF = function (TableKey, TableName, FileName) {
    var obj = null;
    if (FileName == undefined)
        FileName = "";
    if (TableKey && TableName) {
        IWebOffice.FileName = FileName;
        IWebOffice.WebSetMsgByName("TableKey", TableKey);
        IWebOffice.WebSetMsgByName("TableName", TableName);
        if (IWebOffice.WebSavePDF()) {
            var FileMainID = IWebOffice.WebGetMsgByName("FileMainID");
            var FileViewGuid = IWebOffice.WebGetMsgByName("FileViewGuid");
            var FileEditGuid = IWebOffice.WebGetMsgByName("FileEditGuid");
            var FileSize = IWebOffice.WebGetMsgByName("FileSize");
            var FileDesc = IWebOffice.WebGetMsgByName("FileDesc");
            var OriginalName = IWebOffice.WebGetMsgByName("OriginalName");
            obj = { "FileMainID": FileMainID, "FileViewGuid": FileViewGuid, "FileEditGuid": FileEditGuid, "FileSize": FileSize, "FileDesc": FileDesc, "OriginalName": OriginalName };
        }
    }
    return obj;
};
GTPWebOffice.InsertFile = function (FileMainID, FileGuidID, MarketName) {
    if (FileMainID && FileGuidID && MarketName) {
        IWebOffice.WebSetMsgByName("FileMainID", FileMainID);
        IWebOffice.WebSetMsgByName("FileGuidID", FileGuidID);
        IWebOffice.WebSetMsgByName("MarketName", MarketName);
        if (IWebOffice.WebInsertFile()) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
GTPWebOffice.InsertServerFile = function (FilePath, MarketName) {
    if (FilePath && MarketName) {
        IWebOffice.WebSetMsgByName("FilePath", FilePath);
        IWebOffice.WebSetMsgByName("MarketName", MarketName);
        if (IWebOffice.WebInsertFile()) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};
GTPWebOffice.InsertImage = function (FileMainID, FileGuidID, FileName, MarketName, IsTrans, IsZorder) {
    if (FileName == undefined)
        FileName = "";
    if (MarketName == undefined)
        MarketName = "";
    if (FileMainID && FileGuidID) {
        if (IsTrans == undefined)
            IsTrans = true;
        if (IsZorder != 3) {
            IsZorder = 5;
        }
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var hour = myDate.getHours();
        var minute = myDate.getMinutes();
        var second = myDate.getSeconds();

        var WebObject = GTPWebOffice.GetWebObject();
        var myTime = year + "" + month + "" + day + "" + hour + "" + minute + "" + second;
        //浮动插入
        if (IsZorder != 3) {
            IWebOffice.WebSetMsgByName("FileMainID", FileMainID);
            IWebOffice.WebSetMsgByName("FileGuidID", FileGuidID);
            IWebOffice.WebInsertImage(MarketName, myTime + FileName, IsTrans, IsZorder);
            WebObject.Application_Selection_ShapeRange_ZOrder(IsZorder);
            //调整为100%比例 参数：1、相对比例 2、是否相对原始图片大小 3、比例缩放相对位置（0：左上;1：右下）
            WebObject.Application_Selection_ShapeRange_ScaleHeight(1, 1, 0);
            WebObject.Application_Selection_ShapeRange_ScaleWidth(1, 1, 0);
            return true;
        }
        else {
            var path = GTPFileClient.ShellGetLocalTempDir() + "\\" + myTime + FileName;
            path = path.replace(/\\/g, "\\\\");
            if (!path)
                return;
            GTPFileClient.FileClientDownload(FileMainID, FileGuidID, path, 0, true);
            var bInCell = false;
            var dFontSize = 0;
            var theCellHeight;
            var theCellWidth;

            try {
                dFontSize = WebObject.Application_Selection_Font_Size();
                theCellHeight = WebObject.Application_Selection_Cells_Item_Height(1);
                theCellWidth = WebObject.Application_Selection_Cells_Item_Width(1);
                bInCell = (theCellHeight != undefined && theCellWidth != undefined
                    && theCellHeight > 0 && theCellWidth > 0);
            }
            catch (e) {
                bInCell = false;
            }
            if (bInCell) {
                var theInlineShape = WebObject.Application_ActiveDocument_InlineShapes_AddPictureInCell(path, false, true, true,
            				-1, -1, theCellHeight, theCellWidth, dFontSize, 0);
            }
            else {
                if (dFontSize <= 30)
                    dFontSize = dFontSize + 20;
                var theInlineShape = WebObject.Application_ActiveDocument_InlineShapes_AddPicture(path, false, true, true, dFontSize, -1);
            }
            //WebObject.Application_Selection_SetRange(vStart, vStart);
            //WebObject.Application_ScreenUpdating(true);
        }
    }
    else {
        return false;
    }
};
GTPWebOffice.InsertRemarkImage = function (FileMainID, FileGuidID, FileName, MarketName, IsTrans, IsZorder, Height, zdbh, len, imgwidth, imgheight) {
    if (FileName == undefined)
        FileName = "";
    if (MarketName == undefined)
        MarketName = "";
    if (FileMainID && FileGuidID) {
        //        IWebOffice.WebSetMsgByName("FileMainID", FileMainID);
        //        IWebOffice.WebSetMsgByName("FileGuidID", FileGuidID);
        if (IsTrans == undefined)
            IsTrans = true;
        if (IsZorder != 3) {
            IsZorder = 5;
        }
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var hour = myDate.getHours();
        var minute = myDate.getMinutes();
        var second = myDate.getSeconds();

        var myTime = year + "" + month + "" + day + "" + hour + "" + minute + "" + second;
        var path = GTPFileClient.ShellGetLocalTempDir() + "\\" + myTime + FileName;
        path = path.replace(/\\/g, "\\\\");
        if (!path)
            return;
        GTPFileClient.FileClientDownload(FileMainID, FileGuidID, path, 0, true);
        var bInCell = false;
        var dFontSize = 0;
        var theCellHeight;
        var theCellWidth;
        var WebObject = GTPWebOffice.GetWebObject();
        if (zdbh) {
            WebObject.Application_Selection_GoTo(-1, 0, 0, zdbh);
            WebObject.Application_Selection_MoveLeft(1, 2);
            WebObject.Application_Selection_MoveRight(1, len);
        }

        var theInlineShape = WebObject.Application_ActiveDocument_InlineShapes_AddPicture(path, false, true, false, parseInt(imgheight), parseInt(imgwidth));

        //WebObject.Application_Selection_SetRange(vStart, vStart);
        WebObject.Application_ScreenUpdating(true);
    }
    else {
        return false;
    }
};
GTPWebOffice.CreateNewFile = function () {
    IWebOffice.CreateFile();
};
GTPWebOffice.SaveToLocal = function () {
    IWebOffice.WebSaveLocal();
};
GTPWebOffice.OpenLocalFile = function () {
    IWebOffice.WebOpenLocal();
};
GTPWebOffice.GetBookMark = function (MarketName) {
    if (MarketName == undefined)
        MarketName = "";
    return IWebOffice.WebGetBookMarks(MarketName);
};
GTPWebOffice.SetBookMark = function (MarketName, Value) {
    if (MarketName != undefined && Value != undefined)
        IWebOffice.WebSetBookMarks(MarketName, Value);
};
GTPWebOffice.ClearRevisions = function () {
    return IWebOffice.ClearRevisions();
};
GTPWebOffice.OpenPrint = function () {
    return IWebOffice.WebOpenPrint();
};
GTPWebOffice.Close = function () {
    IWebOffice.WebClose();
};
GTPWebOffice.GetUserName = function () {
    return IWebOffice.UserName;
};
GTPWebOffice.GetUserID = function () {
    return IWebOffice.UserID;
};
GTPWebOffice.GetFileName = function () {
    return IWebOffice.FileName;
};
GTPWebOffice.SetFileName = function (FileName) {
    if (FileName != undefined)
        IWebOffice.FileName = FileName;
};
GTPWebOffice.GetFileType = function () {
    return IWebOffice.FileType;
};
GTPWebOffice.SetFileType = function (FileType) {
    if (FileType != undefined)
        IWebOffice.FileType = FileType;
};
GTPWebOffice.GetEditType = function () {
    return IWebOffice.EditType;
};
GTPWebOffice.SetEditType = function (EditType) {
    if (EditType != undefined)
        IWebOffice.EditType = EditType;
};
GTPWebOffice.GetShowType = function () {
    return IWebOffice.ShowType;
};
GTPWebOffice.SetShowType = function (ShowType) {
    if (ShowType != undefined)
        IWebOffice.ShowType = ShowType;
};
GTPWebOffice.GetPrint = function () {
    return IWebOffice.Print == "0" ? false : true;
};
GTPWebOffice.SetPrint = function (Print) {
    if (Print == undefined)
        return;
    if (Print)
        IWebOffice.Print = "1";
    else
        IWebOffice.Print = "0";
};
GTPWebOffice.GetShowToolBar = function () {
    return IWebOffice.ShowToolBar;
};
GTPWebOffice.SetShowToolBar = function (ShowToolBar) {
    if (ShowToolBar != undefined);
    IWebOffice.ShowToolBar = ShowToolBar;
};
GTPWebOffice.GetCopyType = function () {
    return IWebOffice.CopyType == "0" ? false : true;
};
GTPWebOffice.SetCopyType = function (CopyType) {
    if (CopyType == undefined)
        return;
    if (CopyType)
        IWebOffice.CopyType = "1";
    else
        IWebOffice.CopyType = "0";
};
GTPWebOffice.GetShowMenu = function () {
    return IWebOffice.ShowMenu == "0" ? false : true;
};
GTPWebOffice.SetShowMenu = function (ShowMenu) {
    if (ShowMenu == undefined)
        return;
    if (ShowMenu)
        IWebOffice.ShowMenu = "1";
    else
        IWebOffice.ShowMenu = "0";
};
GTPWebOffice.ShowRevisions = function () {
    if (GTPWebOffice.GetIsProtect()) {
        return;
    }
    var WebObject = GTPWebOffice.GetWebObject();
    WebObject.ShowRevisions(true);
};
GTPWebOffice.HideRevisions = function () {
    if (GTPWebOffice.GetIsProtect()) {
        return;
    }
    var WebObject = GTPWebOffice.GetWebObject();
    WebObject.ShowRevisions(false);
};
GTPWebOffice.Hide = function () {
    IWebOffice.style.display = "none";
};
GTPWebOffice.Show = function () {
    IWebOffice.style.display = "Block";
};
GTPWebOffice.SetProtect = function (value) {
    var WebObject = GTPWebOffice.GetWebObject();
    if (IWebOffice.FileType == ".doc" || IWebOffice.FileType == ".wps")
        return WebObject.Application_ActiveDocument_Protect(2, false, value, false, false) == undefined ? true : false;
    else if (IWebOffice.FileType == ".xls" || IWebOffice.FileType == ".et")
        return WebObject.Application_ActiveSheet_Protect(value, true, true, true) == undefined ? true : false;
    else
        return false;
};
GTPWebOffice.SetNoProtect = function (value) {
    try {
        var WebObject = GTPWebOffice.GetWebObject();
        if (IWebOffice.FileType == ".doc" || IWebOffice.FileType == ".wps") {
            WebObject.Application_ActiveDocument_unProtect(value);
            return true;
        }
        else if (IWebOffice.FileType == ".xls" || IWebOffice.FileType == ".et") {
            WebObject.Application_ActiveSheet_unProtect(value);
            return true;
        }
        else
            return false;
    }
    catch (e) {
        return false;
    }
};
GTPWebOffice.GetStatus = function () {
    return IWebOffice.Status;
};
GTPWebOffice.GetModify = function () {
    return IWebOffice.Modify;
};

GTPWebOffice.GetProtectType = function () {
    var WebObject = GTPWebOffice.GetWebObject();
    return WebObject.ProtectionType();
};
GTPWebOffice.GetIsProtect = function () {
    var WebObject = GTPWebOffice.GetWebObject();
    if (IWebOffice.FileType == ".doc" || IWebOffice.FileType == ".wps")
        return WebObject.ProtectionType() == "-1" ? false : true;
    else if (IWebOffice.FileType == ".xls" || IWebOffice.FileType == ".et") {
        return WebObject.Application_ActiveSheet_Range_AllowEdit("A1") ? false : true;
    }
    else
        return false;
};
GTPWebOffice.VisibleTools = function (str, istrue) {
    if (str) {
        IWebOffice.VisibleTools(str, istrue);
    }
};
GTPWebOffice.GetMaxFileSize = function () {
    return IWebOffice.MaxFileSize;
};
GTPWebOffice.GetPages = function () {
    return IWebOffice.Pages;
};
GTPWebOffice.SetMaxFileSize = function (val) {
    if (val) {
        try {
            IWebOffice.MaxFileSize = 1024 * parseInt(val);
        }
        catch (e)
        { }
    }
};
//增加书签
GTPWebOffice.AddBookMark = function (markname, range) {
    if (GTPWebOffice.GetWebObject())
        GTPWebOffice.GetWebObject().Bookmarks_Add(markname);
};
GTPWebOffice._loadObject = function () {
    if (window.ActiveXObject) //IE 浏览机器
    {
        GTPWebOffice._initObjectIE()
    }
    else { //Chrome 浏览器
        GTPWebOffice._initObjectChrome();
    }
};
GTPWebOffice._initObjectChrome = function () {
    if (_webOffTimeCount >= 5000) //5000毫秒超时
        alert("插件加载超时");
    else {
        IWebOffice = document.getElementById("GTPLKWebOffice");
        var loaded = false;
        try {
            loaded = (IWebOffice != undefined) && (IWebOffice.Status != undefined);
        }
        catch (e) { }
        if (loaded) {
            //控件加载完成，继续下面的处理
            //alert("插件加载用时：" + timeSecCount + " 毫秒");
            GTPWebOffice._initObjectBase();
        }
        else {
            _webOffTimeCount += 200;
            setTimeout("GTPWebOffice._initObjectChrome()", 200);
        }
    }
}
GTPWebOffice._initObjectIE = function () {
    if (!GTPWebOffice._finishObject() && _webOffTimeCount < 5000) {
        setTimeout(GTPWebOffice._initObjectIE, 200);
        _webOffTimeCount += 200;
        return;
    }
    if (_webOffTimeCount >= 5000) {
        if (webDivId) {
            document.getElementById(webDivId).innerHTML = "控件可能被禁用,为保证您能正确使用office控件，请您按以下步骤操作</br>打开ie浏览器,工具-管理加载项-显示所有加载项-找到iWebOffice2006 Control并启用";
            webOffCallBack(false, document.getElementById("GTPLKWebOffice"));
        }
        return;
    }
    try {
        GTPWebOffice._initObjectBase();

    }
    catch (e)
    { }

};
GTPWebOffice._initObjectBase = function () {
    IWebOffice = document.getElementById("GTPLKWebOffice");
    IWebOffice.VisibleTools("新建文件,打开文件,保存文件,全屏,文字批注,手写批注,文档清稿", false);
    //屏蔽快捷打印
    IWebOffice.DisableKey("CTRL+P");

    IWebOffice.WebUrl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + $G.getAppName() + '/GB/LK/Common/ashx/Ajax.ashx';             //设置服务器应用程序Url路径
    IWebOffice.RecordID = 'recordid';              //设置文档的纪录号
    IWebOffice.Template = 'template';              //设置模板编号
    IWebOffice.FileName = '';                      //设置文档名称
    IWebOffice.UserName = '';                      //设置操作文档用户名
    IWebOffice.FileType = '.doc';                  //设置文档类型(.doc,.xls,.wps,.ppt)
    //    try {
    //        var HKEY_Root, HKEY_Path;
    //        HKEY_Root = "HKEY_CLASSES_ROOT";
    //        HKEY_Path = "\\.doc\\";
    //        var Wsh = new ActiveXObject("WScript.Shell");
    //        var ret = Wsh.RegRead(HKEY_Root + HKEY_Path);
    //        if (ret.indexOf("WPS") != -1)
    //            IWebOffice.FileType = '.wps';
    //    } catch (e) {

    //    }
    IWebOffice.EditType = '-1,0,1,1,0,0,1,1';      //设置文档编辑状态:调用方式一：第一位可以为0,1,2,3,4其中：0不可编辑；1可以编辑，无痕迹；2可以编辑，有痕迹，无修订；3可以编辑，有痕迹，有修订；4不可编辑，但可以选择文档内容和复制。第二位可以为0,1其中：0不可手写批注；1可以手写批注（转换批注不受影响）；调用方式二：-1，是否保护，是否显痕，是否保留痕迹，是否打印痕迹，是否显示审阅工具，是否允许拷贝，是否允许手写批注
    IWebOffice.ExtParam = '';                      //设置客户自定义的参数
    IWebOffice.PenColor = 'FF0000';                //设置默认手写批注的颜色
    IWebOffice.PenWidth = '1';                     //设置写字的笔宽度
    IWebOffice.Print = '1';                        //设置是否允许打印，包括文字批注和手写批注
    IWebOffice.ShowToolBar = '0';                  //设置是否显示整个控件工具栏，包括OFFICE的工具栏(false:	自定义工具栏=false,	Office工具栏=true;    true:自定义工具栏=true,Office工具栏=true;    0:自定义工具栏=false,Office工具栏=true;    1:自定义工具栏=true,Office工具栏=true;    2:自定义工具栏=false,Office工具栏=false;    3:自定义工具栏=true,Office工具栏=false;)
    IWebOffice.ShowType = '1';                     //设置载入文档后的界面模式：1文字批注；2手写批注；0文档核稿
    IWebOffice.CopyType = '1';                     //是否可以拷贝
    IWebOffice.ShowMenu = '0';                     //设置是否显示整个菜单
    IWebOffice.Language = 'CH';                    //设置控件显示文字，文字显示选择：CH简体，TW繁体，EN英文
    IWebOffice.ClearType = '1';                    //控制清除手写批注的选项 0:点击选择清除按钮后，将清除整个页面中的手写批注;1:点击清除按钮后，将清除本次打开页面后的所做的手写批注
    IWebOffice.Zoom = '100';                       //控制手写批注状态下的放大缩小比例;范围50-200之间。只控制手写批注的显示比例
    IWebOffice.EnablePrint = '1';                  //是否允许打印，包括文字批注和手写批注
    IWebOffice.ToolsSpace = '0';                   //是否保留工具栏空间
    IWebOffice.ClearPages = 'true';                //重新批注时是否清除批注页面
    IWebOffice.HideName = '';                      //隐藏手写批注的用户;多个用户时用“;”隔开，如："ABC;BBC"
    IWebOffice.Compressed = 'false';               //是否压缩保存，如果采用压缩保存设置为True，否则为False
    IWebOffice.MaxFileSize = '8192';               //设置文件最大允许值，单位k
    IWebOffice.ShowUsers = 'true';                 //是否显示全文批注用户列表
    IWebOffice.ShowWindow = 'true';                //设置是否显示保存及打开窗口
    IWebOffice.ShowAllUsers = 'true';              //是否选中或显示所有签名（签批）人
    IWebOffice.ChangeSize = 'false';               //是否允许在全屏下更改窗口大小
    IWebOffice.PenType = '0';                      //全文批注模式下的笔形选择 0:笔形;1:点形
    IWebOffice.InputText = '';                     //默认文字批注的内容，即打开文字批注时就出现的内容
    IWebOffice.PopInputWindow = 'true';            //手写批注下文字签批是否弹出输入窗口，true弹出窗口，false不弹出窗口
    IWebOffice.InputSign = '';                     //文字批注时可附加在下方的内容，用于附加显示时间等信息
    IWebOffice.UserConfig = 'false';               //用于设置是否保留手写批注的设置
    IWebOffice.AllowEmpty = 'true';                //用于设置保存文档时是否文档内容是空白的，用于控制文档被保存成空白内容的异常问题
    //获取当前用户信息
    GTPWebOffice._getUserInfo();
    webOffCallBack(true, IWebOffice);
};
GTPWebOffice._finishObject = function () {
    try {
        document.getElementById("GTPLKWebOffice").VisibleTools('新建文件', false);
        return true;
    }
    catch (e) {
        return false;
    }
};
GTPWebOffice._getUserInfo = function () {
    // Ext.Ajax.request({
    //     url: '/GB/LK/Common/ashx/UserContext.ashx',
    //     method: 'post',
    //     async: false,
    //     params: { type: "getuserid" },
    //     success: function (form, action) {
    //         var respText = Ext.util.JSON.decode(form.responseText); //字符串变为json格式  
    //         IWebOffice.UserID = respText.data.userId;
    //         IWebOffice.UserName = respText.data.userName;
    //     },
    //     failure: function (response, options) {
    //         IWebOffice.UserID = null;
    //         IWebOffice.UserName = "Unknown";
    //     }
    // });

    var OleWebObject = function (AControl) {
        var Obj = AControl;
        var useNpActiveX = false;
        var bInvoke = (!window.ActiveXObject) && (!useNpActiveX) && (!Ext.isIE11);

        this.Application_Version = function () {
            if (bInvoke)
                return Obj.WebObjectInvoke("Application.Version");
            else
                return Obj.WebObject.Application.Version;
        }

        this.ShowRevisions = function (ASetValue) {
            if (bInvoke)
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("ShowRevisions");
                else
                    Obj.WebObjectInvoke("ShowRevisions", ASetValue);
            else
                if (ASetValue == undefined)
                    return Obj.WebObject.ShowRevisions;
                else
                    Obj.WebObject.ShowRevisions = ASetValue;
        }

        this.ProtectionType = function (ASetValue) {
            if (bInvoke)
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("ProtectionType");
                else
                    Obj.WebObjectInvoke("ProtectionType", ASetValue);
            else
                if (ASetValue == undefined)
                    return Obj.WebObject.ProtectionType;
                else
                    Obj.WebObject.ProtectionType = ASetValue;
        }

        this.Application_ScreenUpdating = function (ASetValue) {
            if (bInvoke)
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("Application.ScreenUpdating");
                else
                    Obj.WebObjectInvoke("Application.ScreenUpdating", ASetValue);
            else
                if (ASetValue == undefined)
                    return Obj.WebObject.Application.ScreenUpdating;
                else
                    Obj.WebObject.Application.ScreenUpdating = ASetValue;
        }

        this.Bookmarks_Count = function () {
            if (bInvoke)
                return Obj.WebObjectInvoke("Bookmarks.Count");
            else
                return Obj.WebObject.Bookmarks.Count;
        }

        this.Bookmarks_Add = function (AName) {
            if (bInvoke)
                return Obj.WebObjectInvoke("Bookmarks.Add", AName);
            else
                return Obj.WebObject.Bookmarks.Add(AName, Obj.WebObject.Application.Selection.Range);
        }

        this.Bookmarks_Delete = function (AName) {
            if (bInvoke)
                return Obj.WebObjectInvoke("Bookmarks.Delete", AName);
            else
                return Obj.WebObject.Bookmarks(AName).Delete();
        }

        this.Bookmarks_Item_Name = function (AIndex) {
            if (bInvoke)
                return Obj.WebObjectInvoke("Bookmarks.Item.Name", AIndex);
            else
                return Obj.WebObject.Bookmarks.Item(AIndex).Name;
        }

        this.ActiveWindow_DisplayScreenTips = function (ASetValue) {
            if (bInvoke) {
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("ActiveWindow.DisplayScreenTips");
                else
                    Obj.WebObjectInvoke("ActiveWindow.DisplayScreenTips", ASetValue);
            }
            else {
                if (ASetValue == undefined)
                    return Obj.WebObject.ActiveWindow.DisplayScreenTips;
                else
                    Obj.WebObject.ActiveWindow.DisplayScreenTips = ASetValue;
            }
        }
        this.ActiveWindow_DisplayVerticalScrollBar = function (ASetValue) {
            if (bInvoke) {
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("ActiveWindow.DisplayVerticalScrollBar");
                else
                    Obj.WebObjectInvoke("ActiveWindow.DisplayVerticalScrollBar", ASetValue);
            }
            else {
                if (ASetValue == undefined)
                    return Obj.WebObject.ActiveWindow.DisplayVerticalScrollBar;
                else
                    Obj.WebObject.ActiveWindow.DisplayVerticalScrollBar = ASetValue;
            }
        }
        this.ActiveWindow_DisplayHorizontalScrollBar = function (ASetValue) {
            if (bInvoke) {
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("ActiveWindow.DisplayHorizontalScrollBar");
                else
                    Obj.WebObjectInvoke("ActiveWindow.DisplayHorizontalScrollBar", ASetValue);
            }
            else {
                if (ASetValue == undefined)
                    return Obj.WebObject.ActiveWindow.DisplayHorizontalScrollBar;
                else
                    Obj.WebObject.ActiveWindow.DisplayHorizontalScrollBar = ASetValue;
            }
        }

        this.Application_ActiveWindow_ActivePane_View_Type = function (ASetValue) {
            if (bInvoke) {
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("Application.ActiveWindow.ActivePane.View.Type");
                else
                    Obj.WebObjectInvoke("Application.ActiveWindow.ActivePane.View.Type", ASetValue);
            }
            else {
                if (ASetValue == undefined)
                    return Obj.WebObject.Application.ActiveWindow.ActivePane.View.Type;
                else
                    Obj.WebObject.Application.ActiveWindow.ActivePane.View.Type = ASetValue;
            }
        }

        this.Application_ActiveDocument_Shapes_Count = function () {
            if (bInvoke)
                return Obj.WebObjectInvoke("Application.ActiveDocument.Shapes.Count");
            else
                return Obj.WebObject.Application.ActiveDocument.Shapes.Count;
        }

        this.Application_ActiveDocument_InlineShapes_AddPictureInCell = function (AFileName, bLinkToFile, bSaveWithDoc, bScacled,
			AImgHeight, AImgWidth, ACellHeigth, ACellWidth, ACellFontSize, ALockAspectRatio) {
            if (bInvoke) {
                return Obj.WebObjectInvoke("Application.ActiveDocument.InlineShapes.AddPicture",
		        	AFileName, bLinkToFile, bSaveWithDoc, bScacled,
							AImgHeight, AImgWidth, ACellHeigth, ACellWidth, ACellFontSize, ALockAspectRatio);
            }
            else {
                var vStart = Obj.WebObject.Application.Selection.Start;
                var vRange = Obj.WebObject.Application.ActiveDocument.Range(vStart, vStart);
                var picShape = Obj.WebObject.Application.ActiveDocument.InlineShapes.AddPicture(AFileName, bLinkToFile, bSaveWithDoc, vRange);
                picShape.Select();
                picShape.PictureFormat.TransparentBackground = 1;
                picShape.PictureFormat.TransparencyColor = 255 * 65536 + 255 * 256 + 255;

                var dCellWidth = ACellWidth - ACellFontSize;
                if (dCellWidth < 0)
                    dCellWidth = 0;

                var dCellHeight = ACellHeigth - ACellFontSize;
                if (dCellHeight < 0)
                    dCellHeight = 0;
                if (dCellHeight < ACellFontSize)
                    dCellHeight = ACellFontSize;

                var dScale;
                if (picShape.Height != 0)
                    dScale = picShape.Width / picShape.Height;
                //设置默认高度
                if (dCellHeight > 10000 && dCellWidth > ACellFontSize + 25)
                    dCellHeight = ACellFontSize + 25;
                if (picShape.Height > dCellHeight || picShape.Width > dCellWidth) //图片比表格大时
                {
                    if (dCellWidth / dScale > dCellHeight)
                        dCellWidth = dCellHeight * dScale;
                    else
                        dCellHeight = dCellWidth / dScale;

                    picShape.LockAspectRatio = ALockAspectRatio;
                    picShape.Width = dCellWidth;
                    picShape.Height = dCellHeight;
                }
            }
        }

        this.Application_ActiveDocument_InlineShapes_AddPicture = function (AFileName, bLinkToFile, bSaveWithDoc, bScacled,
			AImgHeight, AImgWidth) {
            if (bInvoke) {
                return Obj.WebObjectInvoke("Application.ActiveDocument.InlineShapes.AddPicture", AFileName, bLinkToFile, bSaveWithDoc, bScacled,
								AImgHeight, AImgWidth, -1, -1, -1);
            }
            else {
                var vStart = Obj.WebObject.Application.Selection.Start;
                var vRange = Obj.WebObject.Application.ActiveDocument.Range(vStart, vStart);
                var picShape = Obj.WebObject.Application.ActiveDocument.InlineShapes.AddPicture(AFileName, bLinkToFile, bSaveWithDoc, vRange);
                picShape.Select();
                picShape.PictureFormat.TransparentBackground = 1;
                picShape.PictureFormat.TransparencyColor = 255 * 65536 + 255 * 256 + 255;
                if (bScacled != undefined) {
                    if (bScacled) {
                        var dScale = 1;
                        if (picShape.Height != 0)
                            dScale = picShape.Width / picShape.Height;
                        picShape.Height = AImgHeight;
                        picShape.Width = picShape.Height * dScale;
                    }
                    else {
                        picShape.Height = AImgHeight;
                        picShape.Width = AImgWidth;
                    }
                    return picShape;
                }
            }
        }

        this.Application_ActiveDocument_Shapes_Item_Height = function (AItem, ASetValue) {
            if (bInvoke) {
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("Application.ActiveDocument.Shapes.Item.Height", AItem);
                else
                    Obj.WebObjectInvoke("Application.ActiveDocument.Shapes.Item.Height", AItem, ASetValue);
            }
            else {
                if (ASetValue == undefined)
                    return Obj.WebObject.Application.ActiveDocument.Shapes.Item(AItem).Height;
                else
                    Obj.WebObject.Application.ActiveDocument.Shapes.Item(AItem).Height = ASetValue;
            }
        }
        this.Application_ActiveDocument_Shapes_Item_Width = function (AItem, ASetValue) {
            if (bInvoke) {
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("Application.ActiveDocument.Shapes.Item.Width", AItem);
                else
                    Obj.WebObjectInvoke("Application.ActiveDocument.Shapes.Item.Width", AItem, ASetValue);
            }
            else {
                if (ASetValue == undefined)
                    return Obj.WebObject.Application.ActiveDocument.Shapes.Item(AItem).Width;
                else
                    Obj.WebObject.Application.ActiveDocument.Shapes.Item(AItem).Width = ASetValue;
            }
        }

        this.Application_Selection_Start = function (ASetValue) {
            if (bInvoke) {
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("Application.Selection.Start");
                else
                    Obj.WebObjectInvoke("Application.Selection.Start", ASetValue);
            }
            else {
                if (ASetValue == undefined)
                    return Obj.WebObject.Application.Selection.Start;
                else
                    Obj.WebObject.Application.Selection.Start = ASetValue;
            }
        }
        this.Application_Selection_End = function (ASetValue) {
            if (bInvoke) {
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("Application.Selection.End");
                else
                    Obj.WebObjectInvoke("Application.Selection.End", ASetValue);
            }
            else {
                if (ASetValue == undefined)
                    return Obj.WebObject.Application.Selection.End;
                else
                    Obj.WebObject.Application.Selection.End = ASetValue;
            }
        }

        this.Application_Selection_TypeText = function (AText) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.Selection.TypeText", AText);
            }
            else {
                return Obj.WebObject.Application.Selection.TypeText(AText);
            }
        }

        this.Application_Selection_InsertAfter = function (AText) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.Selection.InsertAfter", AText);
            }
            else {
                return Obj.WebObject.Application.Selection.InsertAfter(AText);
            }
        }

        this.Application_Selection_TypeParagraph = function () {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.Selection.TypeParagraph");
            }
            else {
                return Obj.WebObject.Application.Selection.TypeParagraph();
            }
        }

        this.Application_Selection_MoveLeft = function (AUnit, ACount) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.Selection.MoveLeft", AUnit, ACount);
            }
            else {
                Obj.WebObject.Application.Selection.MoveLeft(AUnit, ACount);
            }
        }

        this.Application_Selection_MoveRight = function (AUnit, ACount) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.Selection.MoveRight", AUnit, ACount);
            }
            else {
                Obj.WebObject.Application.Selection.MoveRight(AUnit, ACount);
            }
        }

        this.Application_Selection_GoTo = function (A1, A2, A3, A4) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.Selection.GoTo", A1, A2, A3, A4);
            }
            else {
                Obj.WebObject.Application.Selection.GoTo(A1, A2, A3, A4);
            }
        }

        this.Application_Dialogs_Item_Show = function (ADialogId) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.Dialogs.Item.Show", ADialogId);
            }
            else {
                Obj.WebObject.Application.Dialogs.Item(ADialogId).Show();
            }
        }

        this.Application_ActiveDocument_Protect = function (A1, A2, A3, A4, A5) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.ActiveDocument.Protect", A1, A2, A3, A4, A5);
            }
            else {
                Obj.WebObject.Application.ActiveDocument.Protect(A1, A2, A3, A4, A5);
            }
        }

        this.Application_ActiveDocument_unProtect = function (A1) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.ActiveDocument.unProtect", A1);
            }
            else {
                Obj.WebObject.Application.ActiveDocument.unProtect(A1);
            }
        }

        this.Application_ActiveSheet_Protect = function (A1, A2, A3, A4) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.ActiveSheet.Protect", A1, A2, A3, A4);
            }
            else {
                Obj.WebObject.Application.ActiveSheet.Protect(A1, A2, A3, A4);
            }
        }

        this.Application_ActiveSheet_unProtect = function (A1) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.ActiveSheet.unProtect", A1);
            }
            else {
                Obj.WebObject.Application.ActiveSheet.unProtect(A1);
            }
        }

        this.Application_ActiveSheet_Range_AllowEdit = function (A1) {
            if (bInvoke) {
                return Obj.WebObjectInvoke("Application.ActiveSheet.Range.AllowEdit", A1);
            }
            else {
                return Obj.WebObject.Application.ActiveSheet.Range(A1).AllowEdit;
            }
        }

        this.Application_Selection_ShapeRange_ZOrder = function (A1) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.Selection.ShapeRange.ZOrder", A1);
            }
            else {
                Obj.WebObject.Application.Selection.ShapeRange.ZOrder(A1);
            }
        }

        this.Application_ActiveDocument_Undo = function () {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.ActiveDocument.Undo");
            }
            else {
                Obj.WebObject.Application.ActiveDocument.Undo();
            }
        }

        this.Application_Selection_Font_Size = function (ASetValue) {
            if (bInvoke) {
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("Application.Selection.Font.Size");
                else
                    Obj.WebObjectInvoke("Application.Selection.Font.Size", ASetValue);
            }
            else {
                if (ASetValue == undefined)
                    return Obj.WebObject.Application.Selection.Font.Size;
                else
                    Obj.WebObject.Application.Selection.Font.Size = ASetValue;
            }
        }

        this.Application_Selection_Cells_Item_Height = function (AIndex, ASetValue) {
            if (bInvoke) {
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("Application.Selection.Cells.Item.Height", AIndex);
                else
                    Obj.WebObjectInvoke("Application.Selection.Cells.Item.Height", AIndex, ASetValue);
            }
            else {
                if (ASetValue == undefined)
                    return Obj.WebObject.Application.Selection.Cells.Item(AIndex).Height;
                else
                    Obj.WebObject.Application.Selection.Cells.Item(AIndex).Height = ASetValue;
            }
        }

        this.Application_Selection_Cells_Item_Width = function (AIndex, ASetValue) {
            if (bInvoke) {
                if (ASetValue == undefined)
                    return Obj.WebObjectInvoke("Application.Selection.Cells.Item.Width", AIndex);
                else
                    Obj.WebObjectInvoke("Application.Selection.Cells.Item.Width", AIndex, ASetValue);
            }
            else {
                if (ASetValue == undefined)
                    return Obj.WebObject.Application.Selection.Cells.Item(AIndex).Width;
                else
                    Obj.WebObject.Application.Selection.Cells.Item(AIndex).Width = ASetValue;
            }
        }
        this.Application_Selection_ShapeRange_ScaleHeight = function (A1, A2, A3) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.Selection.ShapeRange.ScaleHeight", A1, A2, A3);
            }
            else {
                Obj.WebObject.Application.Selection.ShapeRange.ScaleHeight(A1, A2, A3);
            }
        }

        this.Application_Selection_ShapeRange_ScaleWidth = function (A1, A2, A3) {
            if (bInvoke) {
                Obj.WebObjectInvoke("Application.Selection.ShapeRange.ScaleWidth", A1, A2, A3);
            }
            else {
                Obj.WebObject.Application.Selection.ShapeRange.ScaleWidth(A1, A2, A3);
            }
        }
    };
    GTPWebOffice._oleObject = null;
    GTPWebOffice.GetWebObject = function () {
        if (GTPWebOffice._oleObject == null) {
            GTPWebOffice._oleObject = new OleWebObject(IWebOffice);
        }
        return GTPWebOffice._oleObject;
    };
}