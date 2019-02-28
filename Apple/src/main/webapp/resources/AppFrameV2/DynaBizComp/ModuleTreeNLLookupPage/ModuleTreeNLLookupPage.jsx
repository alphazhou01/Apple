<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_ModuleTreeNLLookupPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.DynaBizComp" InitScriptMode="Jsx" PageName="ModuleTreeNLLookupPage" CustomIcons="['toolbar/GTP_accept.png','toolbar/GTP_cancel.png','toolbar/GTP_refresh.png','toolbar/GTP_add.png']" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="GTPEntity" Type="">
        <Fields>
          <gtp:DataField Name="ModuleTreeID" Alias="模块树主键" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="ModuleTreeName" Alias="模块路径" Type="String">
          </gtp:DataField>
          <gtp:DataField Name="ModuleName" Alias="模块名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ModuleTreeFullName" Alias="模块全名称" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
    </items>
  </gtp:DataContext>
  <gtp:Actions ID="actList" runat="server" >
    <Items>
      <gtp:Action ID="actOK" runat="server" Disabled="false" Hidden="false" Handler="actOK_Handler" IconCls="ci-toolbar-GTP_accept-png" Text="确定" meta:resourcekey="res_2_actOK" >
      </gtp:Action>
      <gtp:Action ID="actCancel" runat="server" Disabled="false" Hidden="false" Handler="actCancel_Handler" IconCls="ci-toolbar-GTP_cancel-png" Text="取消" meta:resourcekey="res_3_actCancel" >
      </gtp:Action>
      <gtp:Action ID="act" runat="server" Disabled="false" Hidden="false" IconCls="ci-toolbar-GTP_refresh-png" meta:resourcekey="res_4_act" >
      </gtp:Action>
      <gtp:Action ID="act1" runat="server" Disabled="false" Hidden="false" IconCls="ci-toolbar-GTP_add-png" meta:resourcekey="res_5_act1" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="toolbarView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ToolbarFill" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actOK" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="false" Hidden="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="ToolbarFill" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actOK" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="true" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_6_1" >
        <Items>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="28" meta:resourcekey="res_7_2" >
        <Items>
          <gtp:ToolbarPanel ID="toolbarView" runat="server">
            <Items>
              <gtp:Toolbar runat="server" ButtonAlign="Right" ID="toolbarView_toolbar" EnableOverflow="true" Cls="g-toolbar">
                <Items>
                  <gtp:ToolbarFill LabelSeparator="" ID="ToolbarFill" runat="server">
                  </gtp:ToolbarFill>
                  <gtp:Button ID="btn_actOK" runat="server" Action="actOK" Text="确定" meta:resourcekey="res_8_btn_actOK" IconCls="ci-toolbar-GTP_accept-png">
                  </gtp:Button>
                  <gtp:Button ID="btn_actCancel" runat="server" Action="actCancel" Text="取消" meta:resourcekey="res_9_btn_actCancel" IconCls="ci-toolbar-GTP_cancel-png">
                  </gtp:Button>
                </Items>
              </gtp:Toolbar>
            </Items>
          </gtp:ToolbarPanel>
        </Items>
      </gtp:Panel>
    </Items>
  </gtp:Viewport>
