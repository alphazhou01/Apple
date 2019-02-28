<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"   UICulture="auto" meta:resourcekey="res_0_FlowTrackPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
  <head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>流转历史</title>
  </head>
  <body>
    <gtp:ResourceManager ID="resourceManager" runat="server" PageName="FlowTrackPage" PageNamespace="GTP.AppFrameV2.Flow" InitScriptMode="Linked" >
      <Inherits>
        <gtp:Inherit PageFullName="GTP.AppFrameV2.Common.BasePage" />
        <gtp:Inherit PageFullName="GTP.AppFrameV2.Flow.FlowTrackBasePage" />
      </Inherits>
      <Includes>
        <gtp:Include FileName="~/Common/I18N/jsResX/JsRes.aspx?an=GTP.AppFrame.WebSite" Mode="Script" />
        <gtp:Include FileName="~/GTP/AppFrameV2/Common/JS/AppFrame.Library.js" Mode="Script" />
        <gtp:Resource ResourceFullName="GTP.AppFrameV2.Res" />
      </Includes>
      <Enums>
        <gtp:ResEnum EnumType="GTP.Workflow.Tasks.TaskKind" />
        <gtp:ResEnum EnumType="GTP.Workflow.Tasks.MessageKind" />
        <gtp:ResEnum EnumType="GTP.Workflow.Tasks.TaskStatus" />
      </Enums>
    </gtp:ResourceManager>
    <div id="customView_Content" class="x-panel-content">
      <iframe id="fly" frameborder="0" width="100%" height="100%" src="#">
      </iframe>
    </div>
  </body>
</html>