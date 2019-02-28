<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"
    UICulture="auto" meta:resourcekey="res_0_GWZWPage" %>

<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls"
    TagPrefix="gtp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title></title>
</head>
<body>
    <gtp:ResourceManager UseNull="false" ID="resourceManager" runat="server" PageNamespace="GB.LK.ODM.GWYY"
        PageName="GWZWPage" CustomIcons="['toolbar/GTP_save.png','toolbar/GTP_signature.png','toolbar/GTP_topdf.png','toolbar/GTP_printview.png','toolbar/GTP_preview.png','toolbar/GTP_cancel.png','toolbar/GTP_signnameadd.png','toolbar/GTP_referee.png','toolbar/GTP_template.png','toolbar/GTP_print.png','toolbar/GTP_marksshow.png','toolbar/GTP_markshide.png','toolbar/GTP_tnotation.png','toolbar/GTP_hwannotation.png']"
        InitScriptMode="Linked">
        <includes>
            <gtp:Include FileName="~/Services/FileService/js/GTPFileClient.js" Mode="Script" />
            <gtp:Include FileName="~/Services/FileService/js/GTPFileAttachmentPanel.js" Mode="Script" />
            <gtp:Include FileName="~/Services/ESignature/js/GTPESign.js" Mode="Script" />
            <gtp:Include FileName="./GTPWebOffice.js" Mode="Script" />
        </includes>
    </gtp:ResourceManager>
    <div id="SetCustomView_Content" class="x-panel-content">
        <div id="divoffice" style="width: 100%; height: 100%">
        </div>
    </div>
</body>
</html>
