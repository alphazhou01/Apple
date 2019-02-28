<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"   UICulture="auto" meta:resourcekey="res_0_ReportViewPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
  <head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>查看报表</title>
  </head>
  <body>
    <gtp:ResourceManager ID="resourceManager" runat="server" PageName="ReportViewPage" PageNamespace="GTP.AppFrameV2.Report" InitScriptMode="Linked" >
      <Includes>
        <gtp:Include FileName="~/GTP/Report/ReportMain.js" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrameV2/Common/JS/AppFrame.Library.js" Mode="Script" />
      </Includes>
    </gtp:ResourceManager>
    <div id="customView_Content" class="x-panel-content">
      <div id="frame_Content" class="x-panel-content" style="margin-top: 0px;height:100%; width:100%;">
        <iframe id="__reportView_printIFrame" marginheight="0px" marginwidth="0px" height="100%" name="__reportView_printIFrame" frameborder="false" width="100%" scrolling="no">
        </iframe>
      </div>
    </div>
  </body>
</html>