<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"   UICulture="auto" meta:resourcekey="res_0_DynaBizInfoManagePage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
  <head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>动态业务组件管理</title>
  </head>
  <body>
    <gtp:ResourceManager ID="resourceManager" runat="server" PageName="DynaBizInfoManagePage" PageNamespace="GTP.AppFrameV2.DynaBizComp" InitScriptMode="Linked" >
      <Inherits>
        <gtp:Inherit PageFullName="GTP.AppFrameV2.Common.BasePage" />
      </Inherits>
      <Includes>
        <gtp:Include FileName="~/GTP/AppFrame/Common/QueryBox/QueryBox.css" Mode="Style" />
        <gtp:Include FileName="~/GTP/AppFrameV2/DynaBizComp/DynaPropertyManagePage/DynaProperty.css" Mode="Style" />
        <gtp:Include FileName="~/Common/I18N/jsResX/JsRes.aspx?an=GTP.AppFrame.WebSite" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrameV2/Common/JS/AppFrame.Library.js" Mode="Script" />
        <gtp:Include FileName="~/Portal/js/ShowAPI.js" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrameV2/DynaBizComp/FBPage/FBpublic.js" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrameV2/DynaBizComp/FBPage/FBDialogManager.js" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrameV2/DynaBizComp/FBPage/FBGLSet.js" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrameV2/DynaBizComp/FBPage/FBGLSet1.js" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrame/Common/QueryBox/QueryBox.js" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrame/Common/JS/AppFrame.Controls.js" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrameV2/DynaBizComp/DynaProjectManagePage/ModuleTree.js" Mode="Script" />
        <gtp:Resource ResourceFullName="GTP.AppFrameV2.Res" />
      </Includes>
    </gtp:ResourceManager>
  </body>
</html>