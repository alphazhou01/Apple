<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_DynaDictLookUpPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.DynaBizComp" InitScriptMode="Jsx" PageName="DynaDictLookUpPage" CustomIcons="['toolbar/GTP_query.png','toolbar/GTP_accept.png','toolbar/GTP_cancel.png']" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:PageParam ID="pageParam" runat="server" >
    <OutputParams>
      <gtp:OutputParam Name="OutEntity" IsCollection="False" Type="Entity" Value="DynaDictPoco" />
    </OutputParams>
  </gtp:PageParam>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="DynaDictPoco" Alias="弹性域字典Poco" Type="GTP.AppFrameV2.DynaBizComp.DynaDictPoco">
        <Fields>
          <gtp:DataField Name="DictCName" Alias="字典名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="DictFullCode" Alias="字典编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="DictRemark" Alias="描述" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="SearchEntity" Alias="查询条件" Type="">
        <Fields>
          <gtp:DataField Name="DictCName" Alias="字典名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="DictFullCode" Alias="字典编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="DictRemark" Alias="描述" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
    </items>
  </gtp:DataContext>
  <gtp:Actions ID="actList" runat="server" >
    <Items>
      <gtp:Action ID="actSearch" runat="server" Disabled="false" Hidden="false" Handler="actSearch_Handler" IconCls="ci-toolbar-GTP_query-png" Text="查询" meta:resourcekey="res_2_actSearch" >
      </gtp:Action>
      <gtp:Action ID="actAccept" runat="server" Disabled="false" Hidden="false" Handler="actAccept_Handler" IconCls="ci-toolbar-GTP_accept-png" Text="确定" meta:resourcekey="res_3_actAccept" >
      </gtp:Action>
      <gtp:Action ID="actCancel" runat="server" Disabled="false" Hidden="false" Handler="actCancel_Handler" IconCls="ci-toolbar-GTP_cancel-png" Text="取消" meta:resourcekey="res_4_actCancel" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="gridView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnAccept" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnCancel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsDictLookUp" Hidden="false" />
          <gtp:StateItem ReferenceName="gridView.col_DictCName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_DictFullCode" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_DictRemark" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="entityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DictCName" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DictFullCode" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DictRemark" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_" Disabled="false" Hidden="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="gridView.col_DictCName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_DictFullCode" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_DictRemark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnAccept" Disabled="true" />
          <gtp:StateItem ReferenceName="btnCancel" Disabled="true" />
          <gtp:StateItem ReferenceName="tsDictLookUp" Disabled="true" />
          <gtp:StateItem ReferenceName="Efd_DictCName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_DictFullCode" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_DictRemark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_" ReadOnly="true" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="West" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="true" Width="170" meta:resourcekey="res_5_1" >
        <Items>
          <gtp:FormPanel ID="entityView" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:20px;padding-bottom:10px" DataSource="SearchEntity" LabelWidth="60" LabelAlign="Left" meta:resourcekey="res_6_entityView">
            <LayoutConfig>
              <gtp:TableLayoutConfig Columns="2" ColumnWidths="[50,100]" MaxColumnWidths="[300,100]" MonitorResize="False">
              </gtp:TableLayoutConfig>
            </LayoutConfig>
            <Items>
              <gtp:TextField DataIndex="DictCName" ID="Efd_DictCName" runat="server" ColSpan="2" FieldLabel="名称" LabelWidth="45" meta:resourcekey="res_7_Efd_DictCName">
              </gtp:TextField>
              <gtp:TextField DataIndex="DictFullCode" ID="Efd_DictFullCode" runat="server" ColSpan="2" FieldLabel="编码" LabelWidth="45" meta:resourcekey="res_8_Efd_DictFullCode">
              </gtp:TextField>
              <gtp:TextField DataIndex="DictRemark" ID="Efd_DictRemark" runat="server" ColSpan="2" FieldLabel="描述" LabelWidth="45" meta:resourcekey="res_9_Efd_DictRemark">
              </gtp:TextField>
              <gtp:Label ID="entityView_category_R4C1" runat="server" meta:resourcekey="res_10_entityView_category_R4C1">
              </gtp:Label>
              <gtp:Button ID="Efd_" runat="server" Action="actSearch" Text="查询" meta:resourcekey="res_11_Efd_" IconCls="ci-toolbar-GTP_query-png">
              </gtp:Button>
            </Items>
          </gtp:FormPanel>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_12_2" >
        <Items>
          <gtp:GridPanel ID="gridView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="DynaDictPoco" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_13_gridView">
            <BottomBar>
              <gtp:CommandToolbar runat="server" ID="gridView_toolbar" ButtonAlign="Right">
                <Items>
                  <gtp:Button ID="btnAccept" runat="server" Action="actAccept" Text="确定" meta:resourcekey="res_14_btnAccept" IconCls="ci-toolbar-GTP_accept-png">
                  </gtp:Button>
                  <gtp:Button ID="btnCancel" runat="server" Action="actCancel" Text="取消" meta:resourcekey="res_15_btnCancel" IconCls="ci-toolbar-GTP_cancel-png">
                  </gtp:Button>
                  <gtp:ToolbarSpacer LabelSeparator="" ID="tsDictLookUp" runat="server" Width="10">
                  </gtp:ToolbarSpacer>
                </Items>
              </gtp:CommandToolbar>
            </BottomBar>
            <ColumnModel runat="server">
              <Columns>
                <gtp:TextColumn ColumnID="col_DictCName" Align="Left" DataIndex="DictCName" Header="字典名称" Width="120" Editable="false" meta:resourcekey="res_16_col_DictCName">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_DictFullCode" Align="Left" DataIndex="DictFullCode" Header="字典编码" Width="120" Editable="false" meta:resourcekey="res_17_col_DictFullCode">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_DictRemark" Align="Left" DataIndex="DictRemark" Header="描述" Width="160" Editable="false" meta:resourcekey="res_18_col_DictRemark">
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
    </Items>
  </gtp:Viewport>
