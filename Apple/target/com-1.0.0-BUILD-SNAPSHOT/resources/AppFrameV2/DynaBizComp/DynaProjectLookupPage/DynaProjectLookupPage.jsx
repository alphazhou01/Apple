<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_DynaProjectLookupPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.DynaBizComp" InitScriptMode="Jsx" PageName="DynaProjectLookupPage" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:PageParam ID="pageParam" runat="server" >
    <OutputParams>
      <gtp:OutputParam Name="OutEntity" IsCollection="False" Type="Entity" Value="DynaExtensionQuery" />
    </OutputParams>
  </gtp:PageParam>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="DynaExtensionQuery" Alias="弹性域扩展方案" Type="GTP.AppFrameV2.DynaBizComp.DynaExtensionQuery">
        <Fields>
          <gtp:DataField Name="Id" Alias="弹性域主表ID" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="ProjectName" Alias="方案名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="BizCompName" Alias="业务表单全名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="IsPublished" Alias="是否发布" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="CreateTime" Alias="创建时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="EntityName" Alias="实体全名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="ModifyTime" Alias="最后修改时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="Conditions" Alias="生效条件" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ColumnCount" Alias="列数" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="备注" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="S_BizPropertyType" Value="BizRemark" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="EntityAlias" Alias="实体别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="BizCompAlias" Alias="业务组件别名" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
    </items>
  </gtp:DataContext>
  <gtp:QueryPlans ID="queryPlans1" runat="server" >
    <items>
      <gtp:QueryPlan Name="queryPlan" DataSource="DynaExtensionQuery" ExprContext="" PageSize="25" CurrentPage="1">
        <Filters>
          <gtp:FilterGroup Name="filter" Value="And">
            <Items>
              <gtp:Filter Name="filter_BizComponentName" Field="BizCompName" OP="Llk" />
            </Items>
          </gtp:FilterGroup>
        </Filters>
      </gtp:QueryPlan>
    </items>
  </gtp:QueryPlans>
  <gtp:Actions ID="actList" runat="server" >
    <Items>
      <gtp:Action ID="actAccept" runat="server" Disabled="false" Hidden="false" Handler="actAccept_Handler" Text="确定" meta:resourcekey="res_2_actAccept" >
      </gtp:Action>
      <gtp:Action ID="actCancel" runat="server" Disabled="false" Hidden="false" Handler="actCancel_Handler" Text="取消" meta:resourcekey="res_3_actCancel" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="gridView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="gridView.col_ProjectName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_IsPublished" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_ModifyTime" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_Conditions" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_Remark" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_EntityAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_BizCompAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="toolbarView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actAccept" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsAccept" Hidden="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="gridView.col_ProjectName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_IsPublished" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_ModifyTime" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_Conditions" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_EntityAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_BizCompAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btn_actAccept" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="true" />
          <gtp:StateItem ReferenceName="tsAccept" Disabled="true" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="Center" Layout="border" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false">
        <Items>
          <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="West" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="true" Split="true" Width="200" meta:resourcekey="res_4_11" >
            <Items>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel3" runat="server" Header="false" Title="" Region="Center" Layout="border" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false">
            <Items>
              <gtp:Panel ID="layoutPanel4" runat="server" Header="false" Title="" Region="North" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="true" Split="true" meta:resourcekey="res_5_121" >
                <Items>
                </Items>
              </gtp:Panel>
              <gtp:Panel ID="layoutPanel5" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="true" Split="true" meta:resourcekey="res_6_122" >
                <Items>
                  <gtp:GridPanel ID="gridView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="DynaExtensionQuery" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_7_gridView">
                    <ColumnModel runat="server">
                      <Columns>
                        <gtp:CheckColumn ColumnID="col_IsPublished" Align="Left" DataIndex="IsPublished" Header="状态" Width="65" Editable="false" meta:resourcekey="res_8_col_IsPublished">
                          <Renderer Handler="col_IsPublished_Renderer" />
                        </gtp:CheckColumn>
                        <gtp:TextColumn ColumnID="col_ProjectName" Align="Left" DataIndex="ProjectName" Header="方案名称" Width="120" Editable="false" meta:resourcekey="res_9_col_ProjectName">
                        </gtp:TextColumn>
                        <gtp:TextColumn ColumnID="col_BizCompAlias" Align="Left" DataIndex="BizCompAlias" Header="所属业务模块" Width="150" Editable="false" meta:resourcekey="res_10_col_BizCompAlias">
                        </gtp:TextColumn>
                        <gtp:TextColumn ColumnID="col_EntityAlias" Align="Left" DataIndex="EntityAlias" Header="业务实体" Width="150" Editable="false" meta:resourcekey="res_11_col_EntityAlias">
                        </gtp:TextColumn>
                        <gtp:DateColumn ColumnID="col_ModifyTime" Align="Right" DataIndex="ModifyTime" Header="最后修改时间" Editable="false" meta:resourcekey="res_12_col_ModifyTime">
                        </gtp:DateColumn>
                        <gtp:TextColumn ColumnID="col_Conditions" Align="Left" DataIndex="Conditions" Header="生效条件" Width="200" Editable="false" meta:resourcekey="res_13_col_Conditions">
                          <Renderer Handler="col_Conditions_Renderer" />
                        </gtp:TextColumn>
                        <gtp:TextColumn ColumnID="col_Remark" Align="Left" DataIndex="Remark" Header="备注" Editable="false" meta:resourcekey="res_14_col_Remark">
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
          </gtp:Panel>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel6" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="40" meta:resourcekey="res_15_2" >
        <Items>
          <gtp:ToolbarPanel ID="toolbarView" runat="server">
            <Items>
              <gtp:CommandToolbar runat="server" ID="toolbarView_toolbar" ButtonAlign="Right">
                <Items>
                  <gtp:Button ID="btn_actAccept" runat="server" Action="actAccept" Text="确定" meta:resourcekey="res_16_btn_actAccept">
                  </gtp:Button>
                  <gtp:Button ID="btn_actCancel" runat="server" Action="actCancel" Text="取消" meta:resourcekey="res_17_btn_actCancel">
                  </gtp:Button>
                  <gtp:ToolbarSpacer LabelSeparator="" ID="tsAccept" runat="server" Width="10">
                  </gtp:ToolbarSpacer>
                </Items>
              </gtp:CommandToolbar>
            </Items>
          </gtp:ToolbarPanel>
        </Items>
      </gtp:Panel>
    </Items>
  </gtp:Viewport>
