<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_ResetDynaBizInfoPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.DynaBizComp" InitScriptMode="Jsx" PageName="ResetDynaBizInfoPage" CustomIcons="['toolbar/GTP_batchimport.png']" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="DynaBizQuery" Alias="动态业务组件查询" Type="GTP.AppFrameV2.DynaBizComp.DynaBizQuery">
        <Fields>
          <gtp:DataField Name="Id" Alias="主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="BizAlias" Alias="业务名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="BizName" Alias="组件短名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="NameSpace" Alias="命名空间" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="CreatedTime" Alias="创建时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="ModifiedTime" Alias="修改时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="Path" Alias="模块树路径" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="备注" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="State" Alias="状态" Type="String" TrimBlank="true" ValueExpression="$C.frameDeptID">
          </gtp:DataField>
          <gtp:DataField Name="OriginalBizName" Alias="源业务组件全名称" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="BizInfo" Type="">
        <Fields>
          <gtp:DataField Name="Name" Alias="名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Value" Alias="别名" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
    </items>
  </gtp:DataContext>
  <gtp:QueryPlans ID="queryPlans1" runat="server" >
    <items>
      <gtp:QueryPlan Name="queryPlan" DataSource="DynaBizQuery" ExprContext="" PageSize="25" CurrentPage="1">
        <Filters>
          <gtp:FilterGroup Name="filter" Value="And">
            <Items>
              <gtp:Filter Name="filter_OriginalBizName" Field="OriginalBizName" OP="Eq" />
            </Items>
          </gtp:FilterGroup>
        </Filters>
      </gtp:QueryPlan>
    </items>
  </gtp:QueryPlans>
  <gtp:Actions ID="actList" runat="server" >
    <Items>
      <gtp:Action ID="actRePublish" runat="server" Disabled="false" Hidden="false" Handler="actRePublish_Handler" IconCls="ci-toolbar-GTP_batchimport-png" Text="重新发布" Tooltip="重新发布" meta:resourcekey="res_2_actRePublish" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="gridView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="gridView.col_BizAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_BizName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_NameSpace" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_ModifiedTime" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_Path" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_State" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gvInfo" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnRePublish" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="gvInfo.col_Name" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gvInfo.col_Value" Hidden="false" ReadOnly="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY">
        <Items>
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="West" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="true" Width="400" meta:resourcekey="res_3_1" >
        <Items>
          <gtp:GridPanel ID="gvInfo" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="BizInfo" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_4_gvInfo">
            <TopBar>
              <gtp:Toolbar runat="server" ButtonAlign="Left" ID="gvInfo_toolbar" EnableOverflow="true">
                <Items>
                  <gtp:Button ID="btnRePublish" runat="server" Action="actRePublish" Tooltip="重新发布" Text="重新发布" meta:resourcekey="res_5_btnRePublish" IconCls="ci-toolbar-GTP_batchimport-png">
                  </gtp:Button>
                </Items>
              </gtp:Toolbar>
            </TopBar>
            <ColumnModel runat="server">
              <Columns>
                <gtp:TextColumn ColumnID="col_Name" Align="Left" DataIndex="Name" Header="名称" Width="280" Editable="false" meta:resourcekey="res_6_col_Name">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_Value" Align="Left" DataIndex="Value" Header="别名" Editable="false" meta:resourcekey="res_7_col_Value">
                </gtp:TextColumn>
              </Columns>
            </ColumnModel>
            <View>
              <gtp:GridView runat="server">
              </gtp:GridView>
            </View>
            <Listeners>
              <RowClick Handler="gvInfo_RowClick" />
            </Listeners>
          </gtp:GridPanel>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_8_2" >
        <Items>
          <gtp:GridPanel ID="gridView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="DynaBizQuery" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_9_gridView">
            <BottomBar>
              <gtp:PagingToolbar ID="gridView_toolbar1" runat="server" EnableOverflow="true">
              </gtp:PagingToolbar>
            </BottomBar>
            <ColumnModel runat="server">
              <Columns>
                <gtp:TextColumn ColumnID="col_BizAlias" Align="Left" DataIndex="BizAlias" Header="业务名称" Width="220" Editable="false" meta:resourcekey="res_10_col_BizAlias">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_BizName" Align="Left" DataIndex="BizName" Header="组件短名称" Editable="false" meta:resourcekey="res_11_col_BizName">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_NameSpace" Align="Left" DataIndex="NameSpace" Header="命名空间" Editable="false" meta:resourcekey="res_12_col_NameSpace">
                </gtp:TextColumn>
                <gtp:DateColumn ColumnID="col_ModifiedTime" Align="Right" DataIndex="ModifiedTime" Header="修改时间" Editable="false" meta:resourcekey="res_13_col_ModifiedTime">
                </gtp:DateColumn>
                <gtp:TextColumn ColumnID="col_Path" Align="Left" DataIndex="Path" Header="模块树路径" Width="196" Editable="false" meta:resourcekey="res_14_col_Path">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_State" Align="Left" DataIndex="State" Header="状态" Editable="false" meta:resourcekey="res_15_col_State">
                </gtp:TextColumn>
              </Columns>
            </ColumnModel>
            <View>
              <gtp:GridView runat="server">
              </gtp:GridView>
            </View>
          </gtp:GridPanel>
        </Items>
      </gtp:Panel>
    </Items>
  </gtp:Viewport>
