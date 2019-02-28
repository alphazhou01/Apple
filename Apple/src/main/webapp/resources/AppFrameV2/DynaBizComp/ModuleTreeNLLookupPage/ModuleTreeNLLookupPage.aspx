<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"   UICulture="auto" meta:resourcekey="res_0_ModuleTreeNLLookupPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
  <head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>基类页面</title>
  </head>
  <body>
    <gtp:ResourceManager ID="resourceManager" runat="server" PageName="ModuleTreeNLLookupPage" PageNamespace="GTP.AppFrameV2.DynaBizComp" InitScriptMode="Linked" >
      <Inherits>
        <gtp:Inherit PageFullName="GTP.AppFrameV2.Common.BasePage" />
      </Inherits>
      <Includes>
        <gtp:Include FileName="~/Common/I18N/jsResX/JsRes.aspx?an=GTP.AppFrame.WebSite" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrameV2/Common/JS/AppFrame.Library.js" Mode="Script" />
        <gtp:Include FileName="~/Common/I18N/JsResX/JsRes.aspx?an=GTP.Org.Web" Mode="Script" />
        <gtp:Include FileName="~/ORG/scripts/gjs-all.js" Mode="Script" />
        <gtp:Include FileName="~/ORG/scripts/GTP.View.CategoryManageDialog.js" Mode="Script" />
        <gtp:Include FileName="~/ORG/scripts/Org.Wgt.ViewTypeSelector.js" Mode="Script" />
        <gtp:Include FileName="~/ORG/scripts/Org.Wgt.OrgTypeDlg.js" Mode="Script" />
        <gtp:Include FileName="~/ORG/scripts/Org.TreeView.js" Mode="Script" />
        <gtp:Include FileName="~/Services/FileService/js/GTPFileClient.js" Mode="Script" />
        <gtp:Include FileName="~/ORG/scripts/GTP.Org.ModuleTreeItemDlg.js" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrame/Common/JS/AppFrame.Controls.js" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrameV2/DynaBizComp/DynaProjectManagePage/ModuleTree.js" Mode="Script" />
        <gtp:Include FileName="~/Portal/Manage/js/PTL.Common.js" Mode="Script" />
        <gtp:Include FileName="~/Portal/Manage/js/PTL.Mng.BannerSetting.js" Mode="Script" />
        <gtp:Resource ResourceFullName="GTP.AppFrameV2.Res" />
      </Includes>
    </gtp:ResourceManager>
  </body>
</html>