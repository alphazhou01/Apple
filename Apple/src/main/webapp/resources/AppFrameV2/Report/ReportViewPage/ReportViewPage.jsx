<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_ReportViewPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.Report" InitScriptMode="Jsx" PageName="ReportViewPage" PageWidth="640" PageHeight="480" >
    <Listeners>
      <DocumentReady Handler="ReportViewPage_DocumentReady" />
    </Listeners>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:PageParam ID="pageParam" runat="server" >
    <InputParams>
      <gtp:InputParam Name="entityKeyValue" IsCollection="False" Type="String" Value="" />
    </InputParams>
  </gtp:PageParam>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="toolbarView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="cboxSelectReport" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="customView" Disabled="false" Hidden="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="cboxSelectReport" Disabled="true" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" CollapseMode="Mini" Header="false" Title="" Region="North" Layout="fit" Collapsible="false" Border="false" Padding="0" Height="30" Width="2" meta:resourcekey="res_2_1" >
        <Items>
          <gtp:ToolbarPanel ID="toolbarView" runat="server" Header="false">
            <Items>
              <gtp:CommandToolbar runat="server" ID="toolbarView_toolbar" ButtonAlign="Left">
                <Items>
                  <gtp:ComboBox ID="cboxSelectReport" runat="server" FieldLabel="选择报表" LabelWidth="70" EmptyText="请选择报表" Width="410" meta:resourcekey="res_3_cboxSelectReport">
                  </gtp:ComboBox>
                </Items>
              </gtp:CommandToolbar>
            </Items>
          </gtp:ToolbarPanel>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel2" runat="server" CollapseMode="Mini" Header="false" Title="" Region="Center" Layout="fit" Collapsible="false" Border="false" Padding="0" meta:resourcekey="res_4_2" >
        <Items>
          <gtp:Panel runat="server" ID="customView" Header="false" ContentEl="customView_Content">
          </gtp:Panel>
        </Items>
      </gtp:Panel>
    </Items>
  </gtp:Viewport>
