<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_DynaRefLookupPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.DynaBizComp" InitScriptMode="Jsx" PageName="DynaRefLookupPage" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:PageParam ID="pageParam" runat="server" >
    <OutputParams>
      <gtp:OutputParam Name="OutEntity" IsCollection="False" Type="Entity" Value="CommonLookupPoco" />
    </OutputParams>
  </gtp:PageParam>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="CommonLookupPoco" Alias="通用参照实体" Type="GTP.AppFrameV2.DynaBizComp.CommonLookupPoco">
        <Fields>
          <gtp:DataField Name="PName" Alias="名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="PAlias" Alias="别名" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
    </items>
  </gtp:DataContext>
  <gtp:Actions ID="actList" runat="server" >
    <Items>
      <gtp:Action ID="actAccept" runat="server" Disabled="false" Hidden="false" Handler="actAccept_Handler" Text="确定" meta:resourcekey="res_2_actAccept" >
      </gtp:Action>
      <gtp:Action ID="actCancel" runat="server" Disabled="false" Hidden="false" Handler="actCancel_Handler" Text="取消" meta:resourcekey="res_3_actCancel" >
      </gtp:Action>
      <gtp:Action ID="actSearch" runat="server" Disabled="false" Hidden="false" meta:resourcekey="res_4_actSearch" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="gridView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsSearch" Hidden="false" />
          <gtp:StateItem ReferenceName="searchField" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="gridView.col_PName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_PAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="toolbarView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actAccept" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsLookup" Hidden="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="gridView.col_PName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_PAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="tsSearch" Disabled="true" />
          <gtp:StateItem ReferenceName="searchField" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actAccept" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="true" />
          <gtp:StateItem ReferenceName="tsLookup" Disabled="true" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_5_1" >
        <Items>
          <gtp:GridPanel ID="gridView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="CommonLookupPoco" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_6_gridView">
            <TopBar>
              <gtp:Toolbar runat="server" ButtonAlign="Left" ID="gridView_toolbar" EnableOverflow="true">
                <Items>
                  <gtp:ToolbarSpacer LabelSeparator="" ID="tsSearch" runat="server" Width="10">
                  </gtp:ToolbarSpacer>
                  <gtp:CustomTriggerField ID="searchField" runat="server" FieldLabel="查询条件" LabelWidth="75" Width="300" meta:resourcekey="res_7_searchField">
                    <Listeners>
                      <TriggerClick Handler="searchField_TriggerClick" />
                      <KeyPress Handler="searchField_KeyPress" />
                    </Listeners>
                  </gtp:CustomTriggerField>
                </Items>
              </gtp:Toolbar>
            </TopBar>
            <ColumnModel runat="server">
              <Columns>
                <gtp:TextColumn ColumnID="col_PAlias" Align="Left" DataIndex="PAlias" Header="名称" Width="170" Editable="false" meta:resourcekey="res_8_col_PAlias">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_PName" Align="Left" DataIndex="PName" Header="编码" Width="300" Editable="false" meta:resourcekey="res_9_col_PName">
                </gtp:TextColumn>
              </Columns>
            </ColumnModel>
            <View>
              <gtp:GridView runat="server">
              </gtp:GridView>
            </View>
            <Listeners>
              <DblClick Handler="gridView_DblClick" />
            </Listeners>
          </gtp:GridPanel>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="40" meta:resourcekey="res_10_2" >
        <Items>
          <gtp:ToolbarPanel ID="toolbarView" runat="server">
            <Items>
              <gtp:CommandToolbar runat="server" ID="toolbarView_toolbar" ButtonAlign="Right">
                <Items>
                  <gtp:Button ID="btn_actAccept" runat="server" Action="actAccept" Text="确定" meta:resourcekey="res_11_btn_actAccept">
                  </gtp:Button>
                  <gtp:Button ID="btn_actCancel" runat="server" Action="actCancel" Text="取消" meta:resourcekey="res_12_btn_actCancel">
                  </gtp:Button>
                  <gtp:ToolbarSpacer LabelSeparator="" ID="tsLookup" runat="server" Width="10">
                  </gtp:ToolbarSpacer>
                </Items>
              </gtp:CommandToolbar>
            </Items>
          </gtp:ToolbarPanel>
        </Items>
      </gtp:Panel>
    </Items>
  </gtp:Viewport>
