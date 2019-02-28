<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_DynaProjectManagePage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.DynaBizComp" InitScriptMode="Jsx" PageName="DynaProjectManagePage" BizComp="GTP.AppFrameV2.DynaBizComp.DynaExtensionModule" CustomIcons="['toolbar/GTP_view.png','toolbar/GTP_edit.png','toolbar/GTP_delete.png','toolbar/GTP_accept.png','toolbar/GTP_cancel.png','toolbar/GTP_add.png','toolbar/GTP_delete.png','toolbar/GTP_batchimport.png','toolbar/GTP_settings.png','toolbar/GTP_refresh.png','toolbar/GTP_back.png','toolbar/GTP_enabled.png','toolbar/GTP_disable.png','toolbar/GTP_add.png']" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
    <ExtendData>
      <gtp:ExtendDataItem Key="BizComponent" Value="GTP.AppFrameV2.DynaBizComp.DynaExtensionModule" />
      <gtp:ExtendDataItem Key="S_NeedAuth" Value="false" />
    </ExtendData>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:PageParam ID="pageParam" runat="server" >
    <InputParams>
      <gtp:InputParam Name="moduleName" IsCollection="False" Type="String" Value="" />
    </InputParams>
  </gtp:PageParam>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="DynamicExtensionEdit" Alias="动态属性扩展" Type="GTP.AppFrameV2.DynaBizComp.DynamicExtensionDefinition">
        <Fields>
          <gtp:DataField Name="Id" Alias="弹性域主表ID" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="EntityName" Alias="实体全名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="EntityAlias" Alias="实体别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="BizCompName" Alias="业务表单全名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="BizCompAlias" Alias="业务组件别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="CreateTime" Alias="创建时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="ModifyTime" Alias="最后修改时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="Conditions" Alias="生效条件" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="备注" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertyType" Value="BizRemark" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="ColumnCount" Alias="列数" Type="Int" DefaultValueExpression="3">
          </gtp:DataField>
          <gtp:DataField Name="IsPublished" Alias="是否发布" Type="Boolean" DefaultValueExpression="false">
          </gtp:DataField>
          <gtp:DataField Name="ExtensionName" Alias="方案名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsModified" Alias="是否在调整" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="HasEnabled" Alias="是否上线" Type="Boolean" TrimBlank="true" DefaultValueExpression="false">
          </gtp:DataField>
          <gtp:DataField Name="ReferenceExtension" Alias="参照方案" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="ReferenceExtensionAlias" Alias="参照方案名称" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
        <items>
          <gtp:DataSource Name="DynamicExtensionConditions" Alias="扩展方案条件" Type="GTP.AppFrameV2.DynaBizComp.DynamicExtensionCondition">
            <Fields>
              <gtp:DataField Name="Id" Type="Int" PrimaryKey="true">
              </gtp:DataField>
              <gtp:DataField Name="PropertyName" Alias="属性名" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="PropertyAlias" Alias="属性别名" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="PropertyValue" Alias="属性值" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="OperatorType" Alias="运算符类型" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="DataType" Alias="数据类型" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="PropertyRenderValue" Alias="属性值显示文本" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="DataFullType" Alias="数据类型全名" Type="String" TrimBlank="true">
              </gtp:DataField>
            </Fields>
          </gtp:DataSource>
        </items>
      </gtp:DataSource>
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
          <gtp:DataField Name="MT_FullCode" Alias="全编码" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynamicExtensionCondition" Alias="扩展方案条件" Type="GTP.AppFrameV2.DynaBizComp.DynamicExtensionCondition">
        <Fields>
          <gtp:DataField Name="Id" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="PropertyName" Alias="属性名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="PropertyValue" Alias="属性值" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="OperatorType" Alias="运算符类型" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="DataType" Alias="数据类型" Type="String" TrimBlank="true">
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
              <gtp:Filter Name="filter_MT_FullCode" Field="MT_FullCode" OP="Llk" />
              <gtp:Filter Name="filter_BizCompName" Field="BizCompName" OP="Eq" />
            </Items>
          </gtp:FilterGroup>
        </Filters>
      </gtp:QueryPlan>
    </items>
  </gtp:QueryPlans>
  <gtp:Actions ID="actList" runat="server" >
    <Items>
      <gtp:Action ID="actView" runat="server" Disabled="false" Hidden="false" Handler="actView_Handler" IconCls="ci-toolbar-GTP_view-png" Text="查看" meta:resourcekey="res_2_actView" >
      </gtp:Action>
      <gtp:Action ID="actAddExtension" runat="server" Disabled="false" Hidden="false" Handler="actAddExtension_Handler" Text="新增" meta:resourcekey="res_3_actAddExtension" >
      </gtp:Action>
      <gtp:Action ID="actAddStaticExtension" runat="server" Disabled="false" Hidden="false" Handler="actAddStaticExtension_Handler" Text="新增静态方案" meta:resourcekey="res_4_actAddStaticExtension" >
      </gtp:Action>
      <gtp:Action ID="actEditExtension" runat="server" Disabled="false" Hidden="false" Handler="actEditExtension_Handler" IconCls="ci-toolbar-GTP_edit-png" Text="编辑" meta:resourcekey="res_5_actEditExtension" >
      </gtp:Action>
      <gtp:Action ID="actDeleteExtension" runat="server" Disabled="false" Hidden="false" Handler="actDeleteExtension_Handler" IconCls="ci-toolbar-GTP_delete-png" Text="删除" meta:resourcekey="res_6_actDeleteExtension" >
      </gtp:Action>
      <gtp:Action ID="actAccept" runat="server" Disabled="false" Hidden="false" Handler="actAcceptHandler" IconCls="ci-toolbar-GTP_accept-png" Text="确定" meta:resourcekey="res_7_actAccept" >
      </gtp:Action>
      <gtp:Action ID="actCancel" runat="server" Disabled="false" Hidden="false" Handler="actCancel_Handler" IconCls="ci-toolbar-GTP_cancel-png" Text="取消" meta:resourcekey="res_8_actCancel" >
      </gtp:Action>
      <gtp:Action ID="actAddCondition" runat="server" Disabled="false" Hidden="false" Handler="actAddCondition_Handler" IconCls="ci-toolbar-GTP_add-png" Text="添加" meta:resourcekey="res_9_actAddCondition" >
      </gtp:Action>
      <gtp:Action ID="actRemoveCondition" runat="server" Disabled="false" Hidden="false" Handler="actRemoveCondition_Handler" IconCls="ci-toolbar-GTP_delete-png" Text="移除" meta:resourcekey="res_10_actRemoveCondition" >
      </gtp:Action>
      <gtp:Action ID="actPublish" runat="server" Disabled="false" Hidden="false" Handler="actPublish_Handler" IconCls="ci-toolbar-GTP_batchimport-png" Text="发布" meta:resourcekey="res_11_actPublish" >
      </gtp:Action>
      <gtp:Action ID="actSetProperty" runat="server" Disabled="false" Hidden="false" Handler="actSetProperty_Handler" IconCls="ci-toolbar-GTP_settings-png" Text="配置属性" meta:resourcekey="res_12_actSetProperty" >
      </gtp:Action>
      <gtp:Action ID="actSearchTree" runat="server" Disabled="false" Hidden="false" Handler="actSearchTree_Handler" meta:resourcekey="res_13_actSearchTree" >
      </gtp:Action>
      <gtp:Action ID="actRefreshTree" runat="server" Disabled="false" Hidden="false" Handler="actRefreshTree_Handler" IconCls="ci-toolbar-GTP_refresh-png" meta:resourcekey="res_14_actRefreshTree" >
      </gtp:Action>
      <gtp:Action ID="actRefresh" runat="server" Disabled="false" Hidden="false" Handler="actRefresh_Handler" IconCls="ci-toolbar-GTP_refresh-png" Text="刷新" meta:resourcekey="res_15_actRefresh" >
      </gtp:Action>
      <gtp:Action ID="actSearch" runat="server" Disabled="false" Hidden="false" Handler="actSearch_Handler" meta:resourcekey="res_16_actSearch" >
      </gtp:Action>
      <gtp:Action ID="actBack" runat="server" Disabled="false" Hidden="false" Handler="actBack_Handler" IconCls="ci-toolbar-GTP_back-png" Text="返回" meta:resourcekey="res_17_actBack" >
      </gtp:Action>
      <gtp:Action ID="actEnable" runat="server" Disabled="false" Hidden="false" Handler="actEnable_Handler" IconCls="ci-toolbar-GTP_enabled-png" Text="启用" meta:resourcekey="res_18_actEnable" >
      </gtp:Action>
      <gtp:Action ID="actDisable" runat="server" Disabled="false" Hidden="false" Handler="actDisable_Handler" IconCls="ci-toolbar-GTP_disable-png" Text="停用" meta:resourcekey="res_19_actDisable" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="gridView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnView" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="sbnAddExtension" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnEditExtension" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnDeleteExtension" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnEnable" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnDisable" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSetProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="gridView.col_BizComponentName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_CreateTime" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_EntityName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_ModifyTime" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_Conditions" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_ProjectName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_ColumnNumber" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_Remark" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_IsPublished" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_BizCompAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="windowView" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="containerView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ExtensionName" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_EntityName" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_CopyExtension" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ReferenceExtensionAlias" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Remark" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ColumnCount" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="gridView1" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnAddCondition" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnRemoveCondition" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="gridView1.col_PropertyAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView1.col_PropertyValue" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView1.col_OperatorType" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView1.col_PropertyRenderValue" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="toolbarView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actAccept" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsProject" Hidden="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="gridView.col_BizComponentName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_CreateTime" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_EntityName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_ModifyTime" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_Conditions" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_ProjectName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_ColumnNumber" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_IsPublished" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_BizCompAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnView" Disabled="true" />
          <gtp:StateItem ReferenceName="sbnAddExtension" Disabled="true" />
          <gtp:StateItem ReferenceName="btnEditExtension" Disabled="true" />
          <gtp:StateItem ReferenceName="btnDeleteExtension" Disabled="true" />
          <gtp:StateItem ReferenceName="btnEnable" Disabled="true" />
          <gtp:StateItem ReferenceName="btnDisable" Disabled="true" />
          <gtp:StateItem ReferenceName="btnSetProperty" Disabled="true" />
          <gtp:StateItem ReferenceName="Efd_ExtensionName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_EntityName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_CopyExtension" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_ReferenceExtensionAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_ColumnCount" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView1.col_PropertyAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView1.col_PropertyValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView1.col_OperatorType" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView1.col_PropertyRenderValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnAddCondition" Disabled="true" />
          <gtp:StateItem ReferenceName="btnRemoveCondition" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actAccept" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="true" />
          <gtp:StateItem ReferenceName="tsProject" Disabled="true" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="West" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="true" Width="230" meta:resourcekey="res_20_1" >
        <Items>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_21_2" >
        <Items>
          <gtp:GridPanel ID="gridView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="DynaExtensionQuery" Height="0" AutoCellSizeMode="None" Header="false" HideGroupedColumn="true" meta:resourcekey="res_22_gridView">
            <TopBar>
              <gtp:Toolbar runat="server" ButtonAlign="Left" ID="gridView_toolbar" EnableOverflow="true">
                <Items>
                  <gtp:Button ID="btnView" runat="server" Hidden="true" Action="actView" Text="查看" meta:resourcekey="res_23_btnView" IconCls="ci-toolbar-GTP_view-png">
                  </gtp:Button>
                  <gtp:SplitButton ID="sbnAddExtension" runat="server" Action="actAddStaticExtension" Text="新增" meta:resourcekey="res_24_sbnAddExtension" IconCls="ci-toolbar-GTP_add-png">
                    <Menu>
                      <gtp:Menu runat="server">
                        <Items>
                          <gtp:MenuItem runat="server" ID="SplitButton_menu" Text="静态方案" Action="actAddStaticExtension" meta:resourcekey="res_25_SplitButton_menu" />
                          <gtp:MenuItem runat="server" ID="SplitButton_menu1" Text="动态方案" Action="actAddExtension" meta:resourcekey="res_26_SplitButton_menu1" />
                        </Items>
                      </gtp:Menu>
                    </Menu>
                  </gtp:SplitButton>
                  <gtp:Button ID="btnEditExtension" runat="server" Action="actEditExtension" Text="编辑" meta:resourcekey="res_27_btnEditExtension" IconCls="ci-toolbar-GTP_edit-png">
                  </gtp:Button>
                  <gtp:Button ID="btnDeleteExtension" runat="server" Action="actDeleteExtension" Text="删除" meta:resourcekey="res_28_btnDeleteExtension" IconCls="ci-toolbar-GTP_delete-png">
                  </gtp:Button>
                  <gtp:Button ID="btnEnable" runat="server" Action="actEnable" Text="启用" meta:resourcekey="res_29_btnEnable" IconCls="ci-toolbar-GTP_enabled-png">
                  </gtp:Button>
                  <gtp:Button ID="btnDisable" runat="server" Action="actDisable" Text="停用" meta:resourcekey="res_30_btnDisable" IconCls="ci-toolbar-GTP_disable-png">
                  </gtp:Button>
                  <gtp:Button ID="btnSetProperty" runat="server" Action="actSetProperty" Text="属性配置" meta:resourcekey="res_31_btnSetProperty" IconCls="ci-toolbar-GTP_settings-png">
                  </gtp:Button>
                </Items>
              </gtp:Toolbar>
            </TopBar>
            <BottomBar>
              <gtp:PagingToolbar ID="paging_toolbar" runat="server" EnableOverflow="true">
              </gtp:PagingToolbar>
            </BottomBar>
            <ColumnModel runat="server">
              <Columns>
                <gtp:CheckColumn ColumnID="col_IsPublished" Align="Left" DataIndex="IsPublished" Header="状态" Width="75" Editable="false" meta:resourcekey="res_32_col_IsPublished">
                  <Renderer Handler="col_IsPublished_Renderer" />
                </gtp:CheckColumn>
                <gtp:TextColumn ColumnID="col_ProjectName" Align="Left" DataIndex="ProjectName" Header="方案名称" Width="150" Editable="false" meta:resourcekey="res_33_col_ProjectName">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_BizCompAlias" Align="Left" DataIndex="BizCompAlias" Header="所属业务模块" Width="175" Editable="false" meta:resourcekey="res_34_col_BizCompAlias">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_EntityName" Align="Left" DataIndex="EntityAlias" Header="业务实体" Width="150" Editable="false" meta:resourcekey="res_35_col_EntityName">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_Conditions" Align="Left" DataIndex="Conditions" Header="生效条件" Width="200" Editable="false" meta:resourcekey="res_36_col_Conditions">
                  <Renderer Handler="col_Conditions_Renderer" />
                </gtp:TextColumn>
                <gtp:DateColumn ColumnID="col_ModifyTime" Align="Left" DataIndex="ModifyTime" Header="最后修改时间" Editable="false" meta:resourcekey="res_37_col_ModifyTime">
                </gtp:DateColumn>
                <gtp:TextColumn ColumnID="col_Remark" Align="Left" DataIndex="Remark" Header="备注" Width="200" Editable="false" meta:resourcekey="res_38_col_Remark">
                </gtp:TextColumn>
              </Columns>
            </ColumnModel>
            <View>
              <gtp:GridView runat="server">
              </gtp:GridView>
            </View>
            <Listeners>
              <RowClick Handler="gridView_RowClick" />
            </Listeners>
          </gtp:GridPanel>
        </Items>
      </gtp:Panel>
    </Items>
  </gtp:Viewport>
  <gtp:Window runat="server" ID="windowView" AutoRender="false" Hidden="true" Height="460" Width="440" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_39_windowView"  >
    <Items>
      <gtp:Panel runat="server" ID="containerView" AutoRender="false" Width="440" Layout="border" meta:resourcekey="res_40_containerView">
        <Items>
          <gtp:Panel ID="layoutPanel3" runat="server" Header="false" Title="" Region="North" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="180" meta:resourcekey="res_41_1">
            <Items>
              <gtp:FormPanel ID="entityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:10px;padding-bottom:10px" DataSource="DynamicExtensionEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_42_entityView">
                <LayoutConfig>
                  <gtp:TableLayoutConfig Columns="2" ColumnWidths="[120,280]" MaxColumnWidths="[120,280]" MonitorResize="False">
                  </gtp:TableLayoutConfig>
                </LayoutConfig>
                <Items>
                  <gtp:TextField DataIndex="ExtensionName" ID="Efd_ExtensionName" runat="server" ColSpan="2" FieldLabel="方案名称" AllowBlank="false" MaxLength="255" meta:resourcekey="res_43_Efd_ExtensionName">
                  </gtp:TextField>
                  <gtp:ComboBox DataIndex="EntityName" ID="Efd_EntityName" runat="server" ColSpan="2" FieldLabel="业务实体" AllowBlank="false" Editable="false" meta:resourcekey="res_44_Efd_EntityName">
                    <Listeners>
                      <Select Handler="Efd_EntityName_Select" />
                    </Listeners>
                  </gtp:ComboBox>
                  <gtp:CheckBox ID="Efd_CopyExtension" runat="server" FieldLabel="复制新增" meta:resourcekey="res_45_Efd_CopyExtension">
                    <Listeners>
                      <Check Handler="Efd_CopyExtension_Check" />
                    </Listeners>
                  </gtp:CheckBox>
                  <gtp:LookupField RefPage="/GTP/AppFrameV2/DynaBizComp/DynaProjectLookupPage/DynaProjectLookupPage.aspx" DataIndex="ReferenceExtensionAlias" ID="Efd_ReferenceExtensionAlias" runat="server" FieldLabel="参照方案" meta:resourcekey="res_46_Efd_ReferenceExtensionAlias">
                    <InputMappings>
                      <gtp:LookupInputMapping Target="ReferenceExtensionAlias" Source="OutEntity.ProjectName" IsCollection="False" Type="Entity" />
                      <gtp:LookupInputMapping Target="ReferenceExtension" Source="OutEntity.Id" IsCollection="False" Type="Entity" />
                    </InputMappings>
                    <Features DialogHeight="400" DialogWidth="680" />
                  </gtp:LookupField>
                  <gtp:TextArea DataIndex="Remark" ID="Efd_Remark" runat="server" ColSpan="2" FieldLabel="备注" meta:resourcekey="res_47_Efd_Remark">
                  </gtp:TextArea>
                </Items>
              </gtp:FormPanel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel4" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_48_2">
            <Items>
              <gtp:GridPanel ID="gridView1" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" AutoRender="false" runat="server" DataSource="DynamicExtensionEdit.DynamicExtensionConditions" Title="生效条件" Height="280" AutoCellSizeMode="None" Width="380" HideGroupedColumn="true" meta:resourcekey="res_49_gridView1">
                <TopBar>
                  <gtp:Toolbar runat="server" ButtonAlign="Left" ID="gridView1_toolbar" EnableOverflow="true">
                    <Items>
                      <gtp:Button ID="btnAddCondition" runat="server" Action="actAddCondition" Text="添加" meta:resourcekey="res_50_btnAddCondition" IconCls="ci-toolbar-GTP_add-png">
                      </gtp:Button>
                      <gtp:Button ID="btnRemoveCondition" runat="server" Action="actRemoveCondition" Text="移除" meta:resourcekey="res_51_btnRemoveCondition" IconCls="ci-toolbar-GTP_delete-png">
                      </gtp:Button>
                    </Items>
                  </gtp:Toolbar>
                </TopBar>
                <ColumnModel runat="server">
                  <Columns>
                    <gtp:TextColumn ColumnID="col_PropertyAlias" Align="Left" DataIndex="PropertyAlias" Header="属性名称" Width="150" meta:resourcekey="res_52_col_PropertyAlias">
                      <Editor>
                        <gtp:CustomTriggerField DataIndex="PropertyAlias" ID="gridView1_col_PropertyAlias_editor" runat="server" meta:resourcekey="res_53_gridView1_col_PropertyAlias_editor">
                          <Listeners>
                            <TriggerClick Handler="gridView1_col_PropertyAlias_editor_TriggerClick" />
                          </Listeners>
                        </gtp:CustomTriggerField>
                      </Editor>
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_OperatorType" Align="Left" DataIndex="OperatorType" Header="运算符" meta:resourcekey="res_54_col_OperatorType">
                      <Editor>
                        <gtp:ComboBox DataIndex="OperatorType" ID="gridView1_col_OperatorType_editor" runat="server" meta:resourcekey="res_55_gridView1_col_OperatorType_editor">
                        </gtp:ComboBox>
                      </Editor>
                      <Renderer Handler="col_OperatorType_Renderer" />
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_PropertyRenderValue" Align="Left" DataIndex="PropertyRenderValue" Header="值" Width="160" meta:resourcekey="res_56_col_PropertyRenderValue">
                      <Editor>
                        <gtp:CustomTriggerField DataIndex="PropertyRenderValue" ID="gridView1_col_PropertyRenderValue_editor" runat="server" Editable="false" meta:resourcekey="res_57_gridView1_col_PropertyRenderValue_editor">
                          <Listeners>
                            <TriggerClick Handler="gridView1_col_PropertyValue_editor_TriggerClick" />
                          </Listeners>
                        </gtp:CustomTriggerField>
                      </Editor>
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
          <gtp:Panel ID="layoutPanel5" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="35" meta:resourcekey="res_58_3">
            <Items>
              <gtp:ToolbarPanel ID="toolbarView" AutoRender="false" runat="server">
                <Items>
                  <gtp:CommandToolbar runat="server" ID="toolbarView_toolbar" ButtonAlign="Right">
                    <Items>
                      <gtp:Button ID="btn_actAccept" runat="server" Action="actAccept" Text="确定" meta:resourcekey="res_59_btn_actAccept" IconCls="ci-toolbar-GTP_accept-png">
                      </gtp:Button>
                      <gtp:Button ID="btn_actCancel" runat="server" Action="actCancel" Text="取消" meta:resourcekey="res_60_btn_actCancel" IconCls="ci-toolbar-GTP_cancel-png">
                      </gtp:Button>
                      <gtp:ToolbarSpacer LabelSeparator="" ID="tsProject" runat="server">
                      </gtp:ToolbarSpacer>
                    </Items>
                  </gtp:CommandToolbar>
                </Items>
              </gtp:ToolbarPanel>
            </Items>
          </gtp:Panel>
        </Items>
      </gtp:Panel>
    </Items>
  </gtp:Window>
