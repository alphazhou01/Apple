<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_DynaBizInfoManagePage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.DynaBizComp" InitScriptMode="Jsx" PageName="DynaBizInfoManagePage" BizComp="GTP.AppFrameV2.DynaBizComp.DynaBizModule" CustomIcons="['toolbar/GTP_add.png','toolbar/GTP_edit.png','toolbar/GTP_delete.png','toolbar/GTP_batchimport.png','workflow/GTP_delete.png','toolbar/GTP_up.png','toolbar/GTP_down.png','toolbar/GTP_transfer.png','toolbar/GTP_edit.png','toolbar/GTP_refresh.png','toolbar/GTP_addchild.png','toolbar/GTP_decline.png']" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
    <ExtendData>
      <gtp:ExtendDataItem Key="BizComponent" Value="GTP.AppFrameV2.DynaBizComp.DynaBizModule" />
      <gtp:ExtendDataItem Key="S_NeedAuth" Value="false" />
    </ExtendData>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:PageParam ID="pageParam" runat="server" >
    <InputParams>
      <gtp:InputParam Name="SetRef" IsCollection="False" Type="Boolean" Value="true" />
    </InputParams>
  </gtp:PageParam>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="DynaBizQuery" Type="GTP.AppFrameV2.DynaBizComp.DynaBizQuery">
        <Fields>
          <gtp:DataField Name="Id" Alias="主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="BizAlias" Alias="模块名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="BizName" Alias="模块编码" Type="String" TrimBlank="true">
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
          <gtp:DataField Name="MT_FullCode" Alias="全编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsPublish" Alias="已发布" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynaBizInfo" Alias="动态业务组件" Type="GTP.AppFrameV2.DynaBizComp.DynaBizInfo">
        <Fields>
          <gtp:DataField Name="Id" Alias="主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="BizAlias" Alias="业务名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="BizName" Alias="组件短名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="NameSpace" Alias="命名空间" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Path" Alias="模块树路径" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="备注" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ModifiedTime" Alias="修改时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="CreatedTime" Alias="创建时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="State" Alias="状态" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="OriginalBizName" Alias="源业务组件全名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsAuthShare" Alias="支持权限共享" Type="Boolean" DefaultValueExpression="false">
          </gtp:DataField>
          <gtp:DataField Name="OriginalBizAlias" Alias="模板名称" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynaPropertyList" Alias="动态属性定义" Type="GTP.AppFrameV2.DynaBizComp.DynamicPropertyDefinition">
        <Fields>
          <gtp:DataField Name="Id" Alias="扩展属性主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="PropertyName" Alias="属性名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="PropertyAlias" Alias="显示名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FieldName" Alias="字段名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="DataType" Alias="数据类型" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Length" Alias="长度" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="Scale" Alias="小数位数" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="IsNullable" Alias="是否允许为空" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsHideComponent" Alias="是否隐藏控件" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="DefaultValue" Alias="默认值" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FormulaValue" Alias="计算表达式" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsReadOnly" Alias="是否只读" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsQuery" Alias="是否可查询" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsFilter" Alias="是否可过滤" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsOrder" Alias="是否可排序" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="OrderNum" Alias="顺序号" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="RowSpan" Alias="行跨度" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="ColumnSpan" Alias="列跨度" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="ColumnWidth" Alias="列宽度" Type="Int">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertyType" Value="BizQuantity" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="MaxNumber" Alias="最大值" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="MinNumber" Alias="最小值" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="DateFormat" Alias="日期格式" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FullTypeName" Alias="字典名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="TypeAlias" Alias="字典别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsCollection" Alias="字典集合" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsMulti" Alias="是否为多行文本" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="MoneySymbolic" Alias="货币符号" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="UseThousands" Alias="使用千分位" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="AllowNegative" Alias="允许负数" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsUicode" Alias="是否使用Unicode" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="State" Alias="字段状态" Type="String" TrimBlank="true" DefaultValueExpression="'created'">
          </gtp:DataField>
          <gtp:DataField Name="ExtensionId" Alias="方案id" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="TrueText" Alias="真值文本" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FalseText" Alias="假值文本" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FuzzyField" Alias="模糊查询" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="GridColWidth" Alias="列表列宽" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="IsEditable" Alias="允许编辑" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="RefPageName" Alias="参照页面" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="RefPageAlias" Alias="参照页面别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="RefRemark" Alias="描述" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="RefPageParams" Alias="参照页面参数信息" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsManualField" Alias="人工录入" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsEnable" Alias="是否启用" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsNotNullable" Alias="必填" Type="Boolean" ValueExpression="IIf(IsNullable,false,true)">
          </gtp:DataField>
          <gtp:DataField Name="NameAlias" Alias="列表显示名称" Type="String" TrimBlank="true" ValueExpression="PropertyAlias+'('+PropertyName+')'">
          </gtp:DataField>
          <gtp:DataField Name="IsRef" Alias="参照" Type="Boolean" ValueExpression="IIf(RefPageName==null||RefPageName=='',false,true)">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynaPropertyEdit" Alias="动态属性定义" Type="GTP.AppFrameV2.DynaBizComp.DynamicPropertyDefinition">
        <Fields>
          <gtp:DataField Name="Id" Alias="扩展属性主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="PropertyName" Alias="属性名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="PropertyAlias" Alias="显示名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FieldName" Alias="字段名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="DataType" Alias="数据类型" Type="String" TrimBlank="true" DefaultValueExpression="'string'">
          </gtp:DataField>
          <gtp:DataField Name="Length" Alias="长度" Type="Int" DefaultValueExpression="255">
          </gtp:DataField>
          <gtp:DataField Name="Scale" Alias="小数位数" Type="Int" DefaultValueExpression="2">
          </gtp:DataField>
          <gtp:DataField Name="DisplayDecimalPrecision" Alias="显示位数" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="IsNullable" Alias="是否允许为空" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="IsShowPad" Alias="是否末位补零" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsHideComponent" Alias="是否隐藏控件" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsEditable" Alias="允许编辑" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="DefaultValue" Alias="默认值" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FormulaValue" Alias="计算表达式" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsReadOnly" Alias="是否只读" Type="Boolean" DefaultValueExpression="false">
          </gtp:DataField>
          <gtp:DataField Name="IsQuery" Alias="是否可查询" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="IsFilter" Alias="是否可过滤" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="IsOrder" Alias="是否可排序" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="OrderNum" Alias="顺序号" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="RowSpan" Alias="行跨度" Type="Int" DefaultValueExpression="1">
          </gtp:DataField>
          <gtp:DataField Name="ColumnSpan" Alias="列跨度" Type="Int" DefaultValueExpression="1">
          </gtp:DataField>
          <gtp:DataField Name="ColumnWidth" Alias="列宽度" Type="Int">
            <CustomConfig>
              <gtp:ConfigItem Name="S_BizPropertyType" Value="BizQuantity" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="MaxNumber" Alias="最大值" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="MinNumber" Alias="最小值" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="DateFormat" Alias="日期格式" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FullTypeName" Alias="字典名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="TypeAlias" Alias="字典别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsCollection" Alias="字典集合" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsMulti" Alias="是否为多行文本" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="MoneySymbolic" Alias="货币符号" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="UseThousands" Alias="使用千分位" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="AllowNegative" Alias="允许负数" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="IsUicode" Alias="是否使用Unicode" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="State" Alias="字段状态" Type="String" TrimBlank="true" DefaultValueExpression="'created'">
          </gtp:DataField>
          <gtp:DataField Name="ExtensionId" Alias="方案id" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="TrueText" Alias="真值文本" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FalseText" Alias="假值文本" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FuzzyField" Alias="模糊查询" Type="Boolean" DefaultValueExpression="false">
          </gtp:DataField>
          <gtp:DataField Name="GridColWidth" Alias="列表列宽" Type="Int" DefaultValueExpression="100">
          </gtp:DataField>
          <gtp:DataField Name="IsManualField" Alias="人工录入" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="IsEnable" Alias="是否启用" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynaEntityPoco" Alias="业务实体" Type="GTP.AppFrameV2.DynaBizComp.DynaEntityPoco">
        <Fields>
          <gtp:DataField Name="EntityName" Alias="实体名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="EntityAlias" Alias="实体别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="EntityFullName" Alias="实体全名称" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynamicReferenceObject" Alias="动态属性定义" Type="GTP.AppFrameV2.DynaBizComp.DynamicPropertyDefinition">
        <Fields>
          <gtp:DataField Name="Id" Alias="扩展属性主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="RefPageName" Alias="参照页面" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="RefPageAlias" Alias="参照页面别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="RefRemark" Alias="描述" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="RefPageParams" Alias="参照页面参数信息" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
        <items>
          <gtp:DataSource Name="PropertyMapping" Alias="属性映射明细" Type="">
            <Fields>
              <gtp:DataField Name="Name" Alias="属性名称" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="Alias" Alias="属性别名" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="SourceId" Alias="映射属性" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="Type" Alias="属性类型" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="SourceName" Alias="映射属性名称" Type="String" TrimBlank="true">
              </gtp:DataField>
            </Fields>
          </gtp:DataSource>
          <gtp:DataSource Name="PageParam" Alias="传入参数明细" Type="">
            <Fields>
              <gtp:DataField Name="Name" Alias="参数名称" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="Alias" Alias="参数别名" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="ParamValue" Alias="参数值" Type="String" TrimBlank="true">
              </gtp:DataField>
              <gtp:DataField Name="Type" Alias="类型" Type="String" TrimBlank="true">
              </gtp:DataField>
            </Fields>
          </gtp:DataSource>
        </items>
      </gtp:DataSource>
      <gtp:DataSource Name="PropertyList" Alias="实体映射导入列表" Type="">
        <Fields>
          <gtp:DataField Name="PropertyName" Alias="编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="PropertyAlias" Alias="名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Type" Alias="类型" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynaBizInfoEdit" Alias="动态业务组件" Type="GTP.AppFrameV2.DynaBizComp.DynaBizInfo">
        <Fields>
          <gtp:DataField Name="Id" Alias="主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="BizAlias" Alias="业务名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="BizName" Alias="组件短名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="NameSpace" Alias="命名空间" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Path" Alias="模块树路径" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="备注" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ModifiedTime" Alias="修改时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="OriginalBizName" Alias="源业务组件全名称" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
    </items>
  </gtp:DataContext>
  <gtp:QueryPlans ID="queryPlans1" runat="server" >
    <items>
      <gtp:QueryPlan Name="queryPlan" DataSource="DynaBizQuery" ExprContext="" PageSize="25" CurrentPage="1">
        <Filters>
          <gtp:FilterGroup Name="filter" Value="Or">
            <Items>
              <gtp:Filter Name="filter_MT_FullCode_LLK" Field="MT_FullCode" OP="Llk" />
              <gtp:Filter Name="filter_MT_FullCode_Eq" Field="MT_FullCode" OP="Eq" />
            </Items>
          </gtp:FilterGroup>
        </Filters>
      </gtp:QueryPlan>
    </items>
  </gtp:QueryPlans>
  <gtp:Actions ID="actList" runat="server" >
    <Items>
      <gtp:Action ID="actAddBizInfo" runat="server" Disabled="false" Hidden="false" Handler="actAddBizInfo_Handler" IconCls="ci-toolbar-GTP_add-png" Text="新建" meta:resourcekey="res_2_actAddBizInfo" >
      </gtp:Action>
      <gtp:Action ID="actEditBizInfo" runat="server" Disabled="false" Hidden="false" Handler="actEditBizInfo_Handler" IconCls="ci-toolbar-GTP_edit-png" Text="编辑" meta:resourcekey="res_3_actEditBizInfo" >
      </gtp:Action>
      <gtp:Action ID="actDeleteBizInfo" runat="server" Disabled="false" Hidden="false" Handler="actDeleteBizInfo_Handler" IconCls="ci-toolbar-GTP_delete-png" Text="删除" meta:resourcekey="res_4_actDeleteBizInfo" >
      </gtp:Action>
      <gtp:Action ID="actPublish" runat="server" Disabled="false" Hidden="false" Handler="actPublish_Handler" IconCls="ci-toolbar-GTP_batchimport-png" Text="发布" meta:resourcekey="res_5_actPublish" >
      </gtp:Action>
      <gtp:Action ID="actSetProperty" runat="server" Disabled="false" Hidden="false" Handler="actSetProperty_Handler" Text="下一步" meta:resourcekey="res_6_actSetProperty" >
      </gtp:Action>
      <gtp:Action ID="actSetModule" runat="server" Disabled="false" Hidden="false" Handler="actSetModule_Handler" Text="上一步" meta:resourcekey="res_7_actSetModule" >
      </gtp:Action>
      <gtp:Action ID="actSaveInfo" runat="server" Disabled="false" Hidden="false" Handler="actSaveInfo_Handler" Text="完成" meta:resourcekey="res_8_actSaveInfo" >
      </gtp:Action>
      <gtp:Action ID="actAddProperty" runat="server" Disabled="false" Hidden="false" Handler="actAddProperty_Handler" IconCls="ci-toolbar-GTP_add-png" Text="新增" meta:resourcekey="res_9_actAddProperty" >
      </gtp:Action>
      <gtp:Action ID="actEditProperty" runat="server" Disabled="false" Hidden="false" Handler="actEditProperty_Handler" IconCls="ci-toolbar-GTP_edit-png" Text="编辑" meta:resourcekey="res_10_actEditProperty" >
      </gtp:Action>
      <gtp:Action ID="actRemoveProperty" runat="server" Disabled="false" Hidden="false" Handler="actRemoveProperty_Handler" IconCls="ci-workflow-GTP_delete-png" Text="移除" meta:resourcekey="res_11_actRemoveProperty" >
      </gtp:Action>
      <gtp:Action ID="actCancel" runat="server" Disabled="false" Hidden="false" Handler="actCancel_Handler" Text="取消" meta:resourcekey="res_12_actCancel" >
      </gtp:Action>
      <gtp:Action ID="actSaveProperty" runat="server" Disabled="false" Hidden="false" Handler="actSaveProperty_Handler" Text="保存" meta:resourcekey="res_13_actSaveProperty" >
      </gtp:Action>
      <gtp:Action ID="actCancelProperty" runat="server" Disabled="false" Hidden="false" Handler="actCancelProperty_Handler" Text="取消" meta:resourcekey="res_14_actCancelProperty" >
      </gtp:Action>
      <gtp:Action ID="actSavePropertys" runat="server" Disabled="false" Hidden="false" Handler="actSavePropertys_Handler" Text="保存并继续" meta:resourcekey="res_15_actSavePropertys" >
      </gtp:Action>
      <gtp:Action ID="actOk" runat="server" Disabled="false" Hidden="false" Handler="actOk_Handler" Text="确定" meta:resourcekey="res_16_actOk" >
      </gtp:Action>
      <gtp:Action ID="actSetReferenceInfo" runat="server" Disabled="false" Hidden="false" Handler="actSetReferenceInfo_Handler" Text="设置参照" meta:resourcekey="res_17_actSetReferenceInfo" >
      </gtp:Action>
      <gtp:Action ID="actRemoveReference" runat="server" Disabled="false" Hidden="false" Handler="actRemoveReference_Handler" Text="取消参照" meta:resourcekey="res_18_actRemoveReference" >
      </gtp:Action>
      <gtp:Action ID="actSaveReferenceInfo" runat="server" Disabled="false" Hidden="false" Handler="actSaveReferenceInfo_Handler" Text="确定" meta:resourcekey="res_19_actSaveReferenceInfo" >
      </gtp:Action>
      <gtp:Action ID="actCancelReference" runat="server" Disabled="false" Hidden="false" Handler="actCancelReference_Handler" Text="取消" meta:resourcekey="res_20_actCancelReference" >
      </gtp:Action>
      <gtp:Action ID="actAddProMaping" runat="server" Disabled="false" Hidden="false" Handler="actAddProMaping_Handler" Text="添加映射" meta:resourcekey="res_21_actAddProMaping" >
      </gtp:Action>
      <gtp:Action ID="actRemoveProMapping" runat="server" Disabled="false" Hidden="false" Handler="actRemoveProMapping_Handler" Text="移除映射" meta:resourcekey="res_22_actRemoveProMapping" >
      </gtp:Action>
      <gtp:Action ID="actAddPageParam" runat="server" Disabled="false" Hidden="false" Handler="actAddPageParam_Handler" Text="添加参数" meta:resourcekey="res_23_actAddPageParam" >
      </gtp:Action>
      <gtp:Action ID="actRemovePageParam" runat="server" Disabled="false" Hidden="false" Handler="actRemovePageParam_Handler" Text="移除参数" meta:resourcekey="res_24_actRemovePageParam" >
      </gtp:Action>
      <gtp:Action ID="actSelectProperties" runat="server" Disabled="false" Hidden="false" Handler="actSelectProperties_Handler" Text="确定" meta:resourcekey="res_25_actSelectProperties" >
      </gtp:Action>
      <gtp:Action ID="actCancelSelect" runat="server" Disabled="false" Hidden="false" Handler="actCancelSelect_Handler" Text="取消" meta:resourcekey="res_26_actCancelSelect" >
      </gtp:Action>
      <gtp:Action ID="actMoveUp" runat="server" Disabled="false" Hidden="false" Handler="actMoveUp_Handler" IconCls="ci-toolbar-GTP_up-png" Text="上移" meta:resourcekey="res_27_actMoveUp" >
      </gtp:Action>
      <gtp:Action ID="actMoveDown" runat="server" Disabled="false" Hidden="false" Handler="actMoveDown_Handler" IconCls="ci-toolbar-GTP_down-png" Text="下移" meta:resourcekey="res_28_actMoveDown" >
      </gtp:Action>
      <gtp:Action ID="actSetFormulaValue" runat="server" Disabled="false" Hidden="false" Handler="actSetFormulaValue_Handler" meta:resourcekey="res_29_actSetFormulaValue" >
      </gtp:Action>
      <gtp:Action ID="actSetDefaultValue" runat="server" Disabled="false" Hidden="false" Handler="actSetDefaultValue_Handler" meta:resourcekey="res_30_actSetDefaultValue" >
      </gtp:Action>
      <gtp:Action ID="actUpgrade" runat="server" Disabled="false" Hidden="false" Handler="actUpgrade_Handler" IconCls="ci-toolbar-GTP_transfer-png" Text="升级" Tooltip="升级业务组件" meta:resourcekey="res_31_actUpgrade" >
      </gtp:Action>
      <gtp:Action ID="actUpdateBizInfo" runat="server" Disabled="false" Hidden="false" Handler="actUpdateBizInfo_Handler" Text="保存" meta:resourcekey="res_32_actUpdateBizInfo" >
      </gtp:Action>
      <gtp:Action ID="actCancelUpdate" runat="server" Disabled="false" Hidden="false" Handler="actCancelUpdate_Handler" Text="取消" meta:resourcekey="res_33_actCancelUpdate" >
      </gtp:Action>
      <gtp:Action ID="actSetBizInfo" runat="server" Disabled="false" Hidden="false" Handler="actSetBizInfo_Handler" IconCls="ci-toolbar-GTP_edit-png" Text="编辑" meta:resourcekey="res_34_actSetBizInfo" >
      </gtp:Action>
      <gtp:Action ID="act" runat="server" Disabled="false" Hidden="false" IconCls="ci-toolbar-GTP_refresh-png" meta:resourcekey="res_35_act" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="bizInfoListView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsSearch" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnAddBizInfo" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSetBizInfo" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnDeleteBizInfo" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnPublish" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnUpgrade" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="bizInfoListView.col_Alias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="bizInfoListView.col_ModifiedTime" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="bizInfoListView.col_Nane" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="bizInfoListView.col_Path" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="bizInfoListView.col_Remark" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="bizInfoListView.col_IsPublish" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="editWindow" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="propertyWindow" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="ctEditView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="editView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_BizAlias" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_BizName" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_OriginalBizAlias" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Path" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsAuthShare" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Remark" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityListView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityListView.col_EntityAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="propertyListView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnAddProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnEditProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnRemoveProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsEdit" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSetReferenceInfo" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnRemoveReference" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsRef" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="sbMoveUp" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="sbMoveDown" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnPMoveUp" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnPMoveDown" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="propertyListView.col_DataType" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsReadOnly" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsQuery" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsFilter" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsOrder" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsNotNullable" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="propertyListView.col_NameAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsRef" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="toolbarView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actSetProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsStepOne" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actSetModule" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actSaveInfo" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnCancel2" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsStepTwo" Hidden="false" />
          <gtp:StateItem ReferenceName="ctPropertyView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="baseEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_PropertyAlias" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_PropertyName" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DataType" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="stringEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Length" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsMulti" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="longEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_MinLong" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_MaxLong" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_UseThousandsLong" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_AllowNegativeLong" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="decimalEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Scale" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DisplayDecimalPrecision" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_MinDecimal" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_MaxDecimal" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_MoneySymbolic" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsShowPad" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_AllowNegativeDecimal" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_UseThousandsDecimal" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="boolEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_FalseText" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_TrueText" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="dateEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DateFormat" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="dictEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_TypeAlias" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsCollection" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsEditable" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="styleEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="styleEntityView_category_R1C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsManualField" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsNullable" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsReadOnly" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsHideComponent" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_RowSpan" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ColumnSpan" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="styleEntityView_category_R7C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsQuery" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_GridColWidth" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_FuzzyField" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsFilter" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsOrder" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="formulaEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DefaultValue" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_btnDefaultValue" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_FormulaValue" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_btnFormulaValue" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="toolbarView2" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnOk" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnSaveProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSavePropertys" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnCancelProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ToolbarSpacer" Hidden="false" />
          <gtp:StateItem ReferenceName="windowView" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="containerView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="refObjectView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_RefPageAlias" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_RefRemark" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsEditable2" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tabView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tabView_tab" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="tabView_tab1" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="refPropertyMapingView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnAddPropertyMap" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnRemoveMap" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="refPropertyMapingView.col_PropertyAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="refPropertyMapingView.col_SourceName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="refPageParamView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnAddPageParam" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnRemoveParam" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="refPageParamView.col_ParamAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="refPageParamView.col_ParamValue" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="toolbarView1" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actSaveReferenceInfo" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actCancelReference" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsRefObject" Hidden="false" />
          <gtp:StateItem ReferenceName="windowView1" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="PropertySelectView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSelect" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnCancelSelect" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsSelect" Hidden="false" />
          <gtp:StateItem ReferenceName="PropertySelectView.col_PropertyName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="PropertySelectView.col_PropertyAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="bizEditWindow" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="bizInfoEditView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnUpdateBizInfo" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnCancelUpdate" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsUpdateBizInfo" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_E_BizAlias" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_E_BizName" ReadOnly="true" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_E_Path" ReadOnly="true" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_E_Remark" ReadOnly="false" Hidden="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="bizInfoListView.col_Alias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="bizInfoListView.col_ModifiedTime" ReadOnly="true" />
          <gtp:StateItem ReferenceName="bizInfoListView.col_Nane" ReadOnly="true" />
          <gtp:StateItem ReferenceName="bizInfoListView.col_Path" ReadOnly="true" />
          <gtp:StateItem ReferenceName="bizInfoListView.col_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="bizInfoListView.col_IsPublish" ReadOnly="true" />
          <gtp:StateItem ReferenceName="tsSearch" Disabled="true" />
          <gtp:StateItem ReferenceName="btnAddBizInfo" Disabled="true" />
          <gtp:StateItem ReferenceName="btnSetBizInfo" Disabled="true" />
          <gtp:StateItem ReferenceName="btnDeleteBizInfo" Disabled="true" />
          <gtp:StateItem ReferenceName="btnPublish" Disabled="true" />
          <gtp:StateItem ReferenceName="btnUpgrade" Disabled="true" />
          <gtp:StateItem ReferenceName="Efd_BizAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_BizName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_OriginalBizAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_Path" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsAuthShare" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityListView.col_EntityAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="propertyListView.col_DataType" ReadOnly="true" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsReadOnly" ReadOnly="true" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsQuery" ReadOnly="true" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsFilter" ReadOnly="true" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsOrder" ReadOnly="true" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsNotNullable" ReadOnly="true" />
          <gtp:StateItem ReferenceName="propertyListView.col_NameAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="propertyListView.col_IsRef" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnAddProperty" Disabled="true" />
          <gtp:StateItem ReferenceName="btnEditProperty" Disabled="true" />
          <gtp:StateItem ReferenceName="btnRemoveProperty" Disabled="true" />
          <gtp:StateItem ReferenceName="tsEdit" Disabled="true" />
          <gtp:StateItem ReferenceName="btnSetReferenceInfo" Disabled="true" />
          <gtp:StateItem ReferenceName="btnRemoveReference" Disabled="true" />
          <gtp:StateItem ReferenceName="tsRef" Disabled="true" />
          <gtp:StateItem ReferenceName="sbMoveUp" Disabled="true" />
          <gtp:StateItem ReferenceName="sbMoveDown" Disabled="true" />
          <gtp:StateItem ReferenceName="btnPMoveUp" Disabled="true" />
          <gtp:StateItem ReferenceName="btnPMoveDown" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actSetProperty" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="true" />
          <gtp:StateItem ReferenceName="tsStepOne" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actSetModule" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actSaveInfo" Disabled="true" />
          <gtp:StateItem ReferenceName="btnCancel2" Disabled="true" />
          <gtp:StateItem ReferenceName="tsStepTwo" Disabled="true" />
          <gtp:StateItem ReferenceName="Efd_PropertyAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_PropertyName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_DataType" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_Length" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsMulti" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_MinLong" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_MaxLong" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_UseThousandsLong" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_AllowNegativeLong" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_Scale" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_DisplayDecimalPrecision" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_MinDecimal" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_MaxDecimal" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_MoneySymbolic" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsShowPad" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_AllowNegativeDecimal" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_UseThousandsDecimal" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_FalseText" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_TrueText" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_DateFormat" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_TypeAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsCollection" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsEditable" ReadOnly="true" />
          <gtp:StateItem ReferenceName="styleEntityView_category_R1C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsManualField" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsNullable" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsReadOnly" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsHideComponent" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_RowSpan" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_ColumnSpan" ReadOnly="true" />
          <gtp:StateItem ReferenceName="styleEntityView_category_R7C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsQuery" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_GridColWidth" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_FuzzyField" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsFilter" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsOrder" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_DefaultValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_btnDefaultValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_FormulaValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_btnFormulaValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnOk" Disabled="true" />
          <gtp:StateItem ReferenceName="btnSaveProperty" Disabled="true" />
          <gtp:StateItem ReferenceName="btnSavePropertys" Disabled="true" />
          <gtp:StateItem ReferenceName="btnCancelProperty" Disabled="true" />
          <gtp:StateItem ReferenceName="ToolbarSpacer" Disabled="true" />
          <gtp:StateItem ReferenceName="Efd_RefPageAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_RefRemark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsEditable2" ReadOnly="true" />
          <gtp:StateItem ReferenceName="refPropertyMapingView.col_PropertyAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="refPropertyMapingView.col_SourceName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnAddPropertyMap" Disabled="true" />
          <gtp:StateItem ReferenceName="btnRemoveMap" Disabled="true" />
          <gtp:StateItem ReferenceName="refPageParamView.col_ParamAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="refPageParamView.col_ParamValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnAddPageParam" Disabled="true" />
          <gtp:StateItem ReferenceName="btnRemoveParam" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actSaveReferenceInfo" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actCancelReference" Disabled="true" />
          <gtp:StateItem ReferenceName="tsRefObject" Disabled="true" />
          <gtp:StateItem ReferenceName="PropertySelectView.col_PropertyName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="PropertySelectView.col_PropertyAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnSelect" Disabled="true" />
          <gtp:StateItem ReferenceName="btnCancelSelect" Disabled="true" />
          <gtp:StateItem ReferenceName="tsSelect" Disabled="true" />
          <gtp:StateItem ReferenceName="Efd_E_BizAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_E_BizName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_E_Path" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_E_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnUpdateBizInfo" Disabled="true" />
          <gtp:StateItem ReferenceName="btnCancelUpdate" Disabled="true" />
          <gtp:StateItem ReferenceName="tsUpdateBizInfo" Disabled="true" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="West" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="true" Width="230" meta:resourcekey="res_36_1" >
        <Items>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_37_2" >
        <Items>
          <gtp:GridPanel ID="bizInfoListView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="DynaBizQuery" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_38_bizInfoListView">
            <TopBar>
              <gtp:Toolbar runat="server" ButtonAlign="Left" ID="bizInfoListView_toolbar" EnableOverflow="true">
                <Items>
                  <gtp:ToolbarSeparator LabelSeparator="" ID="tsSearch" runat="server">
                  </gtp:ToolbarSeparator>
                  <gtp:Button ID="btnAddBizInfo" runat="server" Action="actAddBizInfo" Text="新建" meta:resourcekey="res_39_btnAddBizInfo" IconCls="ci-toolbar-GTP_add-png">
                  </gtp:Button>
                  <gtp:Button ID="btnSetBizInfo" runat="server" Action="actSetBizInfo" Text="编辑" meta:resourcekey="res_40_btnSetBizInfo" IconCls="ci-toolbar-GTP_edit-png">
                  </gtp:Button>
                  <gtp:Button ID="btnDeleteBizInfo" runat="server" Action="actDeleteBizInfo" Text="删除" meta:resourcekey="res_41_btnDeleteBizInfo" IconCls="ci-toolbar-GTP_delete-png">
                  </gtp:Button>
                  <gtp:Button ID="btnPublish" runat="server" Action="actPublish" Text="发布" meta:resourcekey="res_42_btnPublish" IconCls="ci-toolbar-GTP_batchimport-png">
                  </gtp:Button>
                  <gtp:Button ID="btnUpgrade" runat="server" Hidden="true" Action="actUpgrade" Tooltip="升级业务组件" Text="升级" meta:resourcekey="res_43_btnUpgrade" IconCls="ci-toolbar-GTP_transfer-png">
                  </gtp:Button>
                </Items>
              </gtp:Toolbar>
            </TopBar>
            <BottomBar>
              <gtp:PagingToolbar ID="bizInfoListView_toolbar1" runat="server" EnableOverflow="true">
              </gtp:PagingToolbar>
            </BottomBar>
            <ColumnModel runat="server">
              <Columns>
                <gtp:TextColumn ColumnID="col_Alias" Align="Left" DataIndex="BizAlias" Header="模块名称" Width="150" Editable="false" meta:resourcekey="res_44_col_Alias">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_Nane" Align="Left" DataIndex="BizName" Header="模块编码" Width="150" Editable="false" meta:resourcekey="res_45_col_Nane">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_Path" Align="Left" DataIndex="Path" Header="模块树路径" Width="277" Editable="false" meta:resourcekey="res_46_col_Path">
                </gtp:TextColumn>
                <gtp:DateColumn ColumnID="col_ModifiedTime" Align="Right" DataIndex="ModifiedTime" Header="创建时间" Editable="false" meta:resourcekey="res_47_col_ModifiedTime">
                </gtp:DateColumn>
                <gtp:TextColumn ColumnID="col_IsPublish" Align="Left" DataIndex="IsPublish" Header="已发布" Width="74" Editable="false" meta:resourcekey="res_48_col_IsPublish">
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_Remark" Align="Left" DataIndex="Remark" Header="备注" Width="200" Editable="false" meta:resourcekey="res_49_col_Remark">
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
  <gtp:Window runat="server" ID="editWindow" AutoRender="false" Title="新增业务" Hidden="true" Height="300" Width="640" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_50_editWindow"  >
    <Items>
      <gtp:Panel runat="server" ID="ctEditView" AutoRender="false" Layout="border" meta:resourcekey="res_51_ctEditView">
        <Items>
          <gtp:Panel ID="layoutPanel3" runat="server" Header="false" Title="" Region="Center" Layout="border" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false">
            <Items>
              <gtp:Panel ID="layoutPanel4" runat="server" Header="false" Title="" Region="West" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Hidden="true" Width="150" meta:resourcekey="res_52_11">
                <Items>
                  <gtp:GridPanel ID="entityListView" Style="margin-left:5.0px;margin-right:0px;margin-top:0px;margin-bottom:0px" AutoRender="false" runat="server" DataSource="DynaEntityPoco" Title="业务实体" Height="0" AutoCellSizeMode="None" Width="120" Header="false" HideGroupedColumn="true" meta:resourcekey="res_53_entityListView">
                    <ColumnModel runat="server">
                      <Columns>
                        <gtp:TextColumn ColumnID="col_EntityAlias" Align="Left" DataIndex="EntityAlias" Header="业务实体" Width="142" Editable="false" meta:resourcekey="res_54_col_EntityAlias">
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
              <gtp:Panel ID="layoutPanel5" runat="server" Header="false" Title="" Region="Center" Layout="card" ActiveIndex="0" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_55_12">
                <Items>
                  <gtp:FormPanel ID="editView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:20px;padding-right:0px;&#xD;&#xA;  padding-top:20.0px;padding-bottom:0px" DataSource="DynaBizInfo" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_56_editView">
                    <LayoutConfig>
                      <gtp:TableLayoutConfig Columns="3" ColumnWidths="[80,200,280]" MaxColumnWidths="[80,200,280]" MonitorResize="False">
                      </gtp:TableLayoutConfig>
                    </LayoutConfig>
                    <Items>
                      <gtp:TextField DataIndex="BizAlias" ID="Efd_BizAlias" runat="server" ColSpan="2" FieldLabel="业务名称" LabelWidth="75" LabelAlign="Right" AllowBlank="false" MaxLength="255" meta:resourcekey="res_57_Efd_BizAlias">
                      </gtp:TextField>
                      <gtp:TextField DataIndex="BizName" ID="Efd_BizName" runat="server" FieldLabel="业务编码" LabelWidth="75" AllowBlank="false" MaxLength="255" meta:resourcekey="res_58_Efd_BizName">
                      </gtp:TextField>
                      <gtp:LookupField RefPage="/GTP/AppFrameV2/DynaBizComp/DynaBizModuleLookupPage/DynaBizModuleLookupPage.aspx" DataIndex="OriginalBizAlias" ID="Efd_OriginalBizAlias" runat="server" ColSpan="3" FieldLabel="模板名称" LabelWidth="75" LabelAlign="Right" AllowBlank="false" meta:resourcekey="res_59_Efd_OriginalBizAlias">
                        <InputMappings>
                          <gtp:LookupInputMapping Target="OriginalBizAlias" Source="OutEntity.ModuleAlias" IsCollection="False" Type="Entity" />
                          <gtp:LookupInputMapping Target="OriginalBizName" Source="OutEntity.ModuleFullName" IsCollection="False" Type="Entity" />
                        </InputMappings>
                        <Features DialogHeight="400" DialogWidth="680" />
                        <Listeners>
                          <AfterLookup Handler="Efd_OriginalBizAlias_AfterLookup" />
                        </Listeners>
                      </gtp:LookupField>
                      <gtp:CustomTriggerField DataIndex="Path" ID="Efd_Path" runat="server" ColSpan="3" FieldLabel="模块树路径" LabelWidth="75" LabelAlign="Right" AllowBlank="false" Editable="false" meta:resourcekey="res_60_Efd_Path">
                        <Listeners>
                          <TriggerClick Handler="Efd_Path_TriggerClick" />
                        </Listeners>
                      </gtp:CustomTriggerField>
                      <gtp:Label ID="editView_category_R4C1" runat="server" meta:resourcekey="res_61_editView_category_R4C1">
                      </gtp:Label>
                      <gtp:CheckBox DataIndex="IsAuthShare" ID="Efd_IsAuthShare" runat="server" ColSpan="2" FieldLabel="支持权限共享" HideLabel="true" BoxLabel="支持权限共享" meta:resourcekey="res_62_Efd_IsAuthShare">
                      </gtp:CheckBox>
                      <gtp:TextArea DataIndex="Remark" ID="Efd_Remark" runat="server" ColSpan="3" FieldLabel="备注" LabelWidth="75" LabelAlign="Right" MaxLength="2000" meta:resourcekey="res_63_Efd_Remark">
                      </gtp:TextArea>
                    </Items>
                  </gtp:FormPanel>
                  <gtp:GridPanel ID="propertyListView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" AutoRender="false" runat="server" DataSource="DynaPropertyList" Title="业务属性" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_64_propertyListView">
                    <TopBar>
                      <gtp:Toolbar runat="server" ButtonAlign="Left" ID="propertyListView_toolbar" EnableOverflow="true">
                        <Items>
                          <gtp:Button ID="btnAddProperty" runat="server" Action="actAddProperty" Text="新增" meta:resourcekey="res_65_btnAddProperty" IconCls="ci-toolbar-GTP_add-png">
                          </gtp:Button>
                          <gtp:Button ID="btnEditProperty" runat="server" Action="actEditProperty" Text="编辑" meta:resourcekey="res_66_btnEditProperty" IconCls="ci-toolbar-GTP_edit-png">
                          </gtp:Button>
                          <gtp:Button ID="btnRemoveProperty" runat="server" Action="actRemoveProperty" Text="移除" meta:resourcekey="res_67_btnRemoveProperty" IconCls="ci-workflow-GTP_delete-png">
                          </gtp:Button>
                          <gtp:ToolbarSeparator LabelSeparator="" ID="tsEdit" runat="server">
                          </gtp:ToolbarSeparator>
                          <gtp:Button ID="btnSetReferenceInfo" runat="server" Action="actSetReferenceInfo" Text="设置参照" meta:resourcekey="res_68_btnSetReferenceInfo" IconCls="ci-toolbar-GTP_addchild-png">
                          </gtp:Button>
                          <gtp:Button ID="btnRemoveReference" runat="server" Action="actRemoveReference" Text="取消参照" meta:resourcekey="res_69_btnRemoveReference" IconCls="ci-toolbar-GTP_decline-png">
                          </gtp:Button>
                          <gtp:ToolbarSeparator LabelSeparator="" ID="tsRef" runat="server">
                          </gtp:ToolbarSeparator>
                          <gtp:SplitButton ID="sbMoveUp" runat="server" Hidden="true" Action="actMoveUp" Text="上移" meta:resourcekey="res_70_sbMoveUp" IconCls="ci-toolbar-GTP_up-png">
                            <Menu>
                              <gtp:Menu runat="server">
                                <Items>
                                  <gtp:MenuItem runat="server" ID="gridView_toolbar_sbMoveUp_menu" Text="上移一层" Action="actMoveUp" meta:resourcekey="res_71_gridView_toolbar_sbMoveUp_menu" />
                                  <gtp:MenuItem runat="server" ID="gridView_toolbar_sbMoveUp_menu1" Text="置于顶层" Action="actMoveUp" meta:resourcekey="res_72_gridView_toolbar_sbMoveUp_menu1" />
                                </Items>
                              </gtp:Menu>
                            </Menu>
                          </gtp:SplitButton>
                          <gtp:SplitButton ID="sbMoveDown" runat="server" Hidden="true" Action="actMoveDown" Text="下移" meta:resourcekey="res_73_sbMoveDown" IconCls="ci-toolbar-GTP_down-png">
                            <Menu>
                              <gtp:Menu runat="server">
                                <Items>
                                  <gtp:MenuItem runat="server" ID="gridView_toolbar_sbMoveDown_menu" Text="下移一层" Action="actMoveDown" meta:resourcekey="res_74_gridView_toolbar_sbMoveDown_menu" />
                                  <gtp:MenuItem runat="server" ID="gridView_toolbar_sbMoveDown_menu1" Text="置于底层" Action="actMoveDown" meta:resourcekey="res_75_gridView_toolbar_sbMoveDown_menu1" />
                                </Items>
                              </gtp:Menu>
                            </Menu>
                          </gtp:SplitButton>
                          <gtp:Button ID="btnPMoveUp" runat="server" Action="actMoveUp" Text="上移" meta:resourcekey="res_76_btnPMoveUp" IconCls="ci-toolbar-GTP_up-png">
                          </gtp:Button>
                          <gtp:Button ID="btnPMoveDown" runat="server" Action="actMoveDown" Text="下移" meta:resourcekey="res_77_btnPMoveDown" IconCls="ci-toolbar-GTP_down-png">
                          </gtp:Button>
                        </Items>
                      </gtp:Toolbar>
                    </TopBar>
                    <ColumnModel runat="server">
                      <Columns>
                        <gtp:TextColumn ColumnID="col_NameAlias" Align="Left" DataIndex="NameAlias" Header="显示名称" Width="125" Editable="false" meta:resourcekey="res_78_col_NameAlias">
                        </gtp:TextColumn>
                        <gtp:TextColumn ColumnID="col_DataType" Align="Left" DataIndex="DataType" Header="数据类型" Width="60" Editable="false" meta:resourcekey="res_79_col_DataType">
                          <Renderer Handler="col_DataType_Renderer" />
                        </gtp:TextColumn>
                        <gtp:CheckColumn ColumnID="col_IsRef" Align="Left" DataIndex="IsRef" Header="参照" Width="40" Editable="false" meta:resourcekey="res_80_col_IsRef">
                        </gtp:CheckColumn>
                        <gtp:CheckColumn ColumnID="col_IsNotNullable" Align="Left" DataIndex="IsNotNullable" Header="必填" Width="40" Editable="false" meta:resourcekey="res_81_col_IsNotNullable">
                        </gtp:CheckColumn>
                        <gtp:CheckColumn ColumnID="col_IsReadOnly" Align="Left" DataIndex="IsReadOnly" Header="只读" Width="40" Editable="false" meta:resourcekey="res_82_col_IsReadOnly">
                        </gtp:CheckColumn>
                        <gtp:CheckColumn ColumnID="col_IsQuery" Align="Left" DataIndex="IsQuery" Header="列表显示" Width="60" Editable="false" meta:resourcekey="res_83_col_IsQuery">
                        </gtp:CheckColumn>
                        <gtp:CheckColumn ColumnID="col_IsFilter" Align="Left" DataIndex="IsFilter" Header="可过滤" Width="50" Editable="false" meta:resourcekey="res_84_col_IsFilter">
                        </gtp:CheckColumn>
                        <gtp:CheckColumn ColumnID="col_IsOrder" Align="Left" DataIndex="IsOrder" Header="可排序" Width="50" Editable="false" meta:resourcekey="res_85_col_IsOrder">
                        </gtp:CheckColumn>
                      </Columns>
                    </ColumnModel>
                    <View>
                      <gtp:GridView runat="server">
                      </gtp:GridView>
                    </View>
                    <Listeners>
                      <RowDblClick Handler="propertyListView_RowDblClick" />
                    </Listeners>
                  </gtp:GridPanel>
                </Items>
              </gtp:Panel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel6" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="35" meta:resourcekey="res_86_2">
            <Items>
              <gtp:ToolbarPanel ID="toolbarView" AutoRender="false" runat="server">
                <Items>
                  <gtp:CommandToolbar runat="server" ID="first_toolbar" ButtonAlign="Right">
                    <Items>
                      <gtp:Button ID="btn_actSetProperty" runat="server" Width="60" Action="actSetProperty" Text="下一步" Cls="g-btn-recommend" meta:resourcekey="res_87_btn_actSetProperty">
                      </gtp:Button>
                      <gtp:Button ID="btn_actCancel" runat="server" Width="60" Action="actCancel" Text="取消" meta:resourcekey="res_88_btn_actCancel">
                      </gtp:Button>
                      <gtp:ToolbarSpacer LabelSeparator="" ID="tsStepOne" runat="server" Width="5">
                      </gtp:ToolbarSpacer>
                    </Items>
                  </gtp:CommandToolbar>
                  <gtp:CommandToolbar runat="server" ID="second_toolbar" ButtonAlign="Right" Hidden="true">
                    <Items>
                      <gtp:Button ID="btn_actSetModule" runat="server" Width="60" Action="actSetModule" Text="上一步" meta:resourcekey="res_89_btn_actSetModule">
                      </gtp:Button>
                      <gtp:Button ID="btn_actSaveInfo" runat="server" Width="60" Action="actSaveInfo" Text="完成" Cls="g-btn-recommend" meta:resourcekey="res_90_btn_actSaveInfo">
                      </gtp:Button>
                      <gtp:Button ID="btnCancel2" runat="server" Width="60" Action="actCancel" Text="取消" meta:resourcekey="res_91_btnCancel2">
                      </gtp:Button>
                      <gtp:ToolbarSpacer LabelSeparator="" ID="tsStepTwo" runat="server">
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
  <gtp:Window runat="server" ID="propertyWindow" AutoRender="false" Title="字段设置" Hidden="true" Height="445" Width="670" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_92_propertyWindow"  >
    <Items>
      <gtp:Panel runat="server" ID="ctPropertyView" AutoRender="false" Layout="border" meta:resourcekey="res_93_ctPropertyView">
        <Items>
          <gtp:Panel ID="layoutPanel7" runat="server" Header="false" Title="" Region="Center" Layout="border" Border="true" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false">
            <Items>
              <gtp:Panel ID="layoutPanel8" runat="server" Header="false" Title="" Region="North" Layout="border" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="240">
                <Items>
                  <gtp:Panel ID="layoutPanel9" runat="server" Header="false" Title="" Region="Center" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="105" meta:resourcekey="res_94_111">
                    <Items>
                      <gtp:FormPanel ID="baseEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:10px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_95_baseEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="2" ColumnWidths="[205,205]" MaxColumnWidths="[205,205]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:TextField DataIndex="PropertyAlias" ID="Efd_PropertyAlias" runat="server" FieldLabel="显示名称" LabelWidth="75" AllowBlank="false" MaxLength="255" meta:resourcekey="res_96_Efd_PropertyAlias">
                          </gtp:TextField>
                          <gtp:TextField DataIndex="PropertyName" ID="Efd_PropertyName" runat="server" FieldLabel="属性编码" LabelWidth="75" AllowBlank="false" MaxLength="255" meta:resourcekey="res_97_Efd_PropertyName">
                          </gtp:TextField>
                          <gtp:ComboBox DataIndex="DataType" ID="Efd_DataType" runat="server" FieldLabel="数据类型" LabelWidth="75" AllowBlank="false" Editable="false" meta:resourcekey="res_98_Efd_DataType">
                            <Items>
                              <gtp:ListItem Text="文本" Value="string" meta:resourcekey="res_99_listItem" />
                              <gtp:ListItem Text="整数" Value="long" meta:resourcekey="res_100_listItem1" />
                              <gtp:ListItem Text="小数" Value="decimal" meta:resourcekey="res_101_listItem2" />
                              <gtp:ListItem Text="是否" Value="boolean" meta:resourcekey="res_102_listItem3" />
                              <gtp:ListItem Text="日期" Value="datetime" meta:resourcekey="res_103_listItem4" />
                              <gtp:ListItem Text="字典" Value="datadict" meta:resourcekey="res_104_listItem5" />
                            </Items>
                            <Listeners>
                              <Select Handler="Efd_DataType_Select" />
                            </Listeners>
                          </gtp:ComboBox>
                          <gtp:Label ID="baseEntityView_category_R2C2" runat="server" meta:resourcekey="res_105_baseEntityView_category_R2C2">
                          </gtp:Label>
                        </Items>
                      </gtp:FormPanel>
                    </Items>
                  </gtp:Panel>
                  <gtp:Panel ID="layoutPanel10" runat="server" Header="false" Title="" Region="South" Layout="card" ActiveIndex="0" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="140" Width="388" meta:resourcekey="res_106_112">
                    <Items>
                      <gtp:FormPanel ID="stringEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_107_stringEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="1" ColumnWidths="[330]" MaxColumnWidths="[330]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:NumberField DataIndex="Length" ID="Efd_Length" runat="server" FieldLabel="长度" LabelWidth="75" MaxLength="10" meta:resourcekey="res_108_Efd_Length">
                          </gtp:NumberField>
                          <gtp:CheckBox DataIndex="IsMulti" ID="Efd_IsMulti" runat="server" FieldLabel="多行文本" LabelWidth="75" meta:resourcekey="res_109_Efd_IsMulti">
                          </gtp:CheckBox>
                        </Items>
                      </gtp:FormPanel>
                      <gtp:FormPanel ID="longEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_110_longEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="2" ColumnWidths="[165,165]" MaxColumnWidths="[165,165]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:TextField DataIndex="MinNumber" ID="Efd_MinLong" runat="server" FieldLabel="最小值" LabelWidth="75" meta:resourcekey="res_111_Efd_MinLong">
                          </gtp:TextField>
                          <gtp:TextField DataIndex="MaxNumber" ID="Efd_MaxLong" runat="server" FieldLabel="最大值" LabelWidth="70" meta:resourcekey="res_112_Efd_MaxLong">
                          </gtp:TextField>
                          <gtp:CheckBox DataIndex="UseThousands" ID="Efd_UseThousandsLong" runat="server" FieldLabel="显示千分位" LabelWidth="75" HideLabel="true" BoxLabel="显示千分位" meta:resourcekey="res_113_Efd_UseThousandsLong">
                          </gtp:CheckBox>
                          <gtp:Label ID="longEntityView_category_R2C2" runat="server" meta:resourcekey="res_114_longEntityView_category_R2C2">
                          </gtp:Label>
                          <gtp:CheckBox DataIndex="AllowNegative" ID="Efd_AllowNegativeLong" runat="server" FieldLabel="允许负数" LabelWidth="110" HideLabel="true" BoxLabel="允许负数" meta:resourcekey="res_115_Efd_AllowNegativeLong">
                          </gtp:CheckBox>
                          <gtp:Label ID="longEntityView_category_R3C2" runat="server" meta:resourcekey="res_116_longEntityView_category_R3C2">
                          </gtp:Label>
                        </Items>
                      </gtp:FormPanel>
                      <gtp:FormPanel ID="decimalEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_117_decimalEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="2" ColumnWidths="[165,165]" MaxColumnWidths="[165,165]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:NumberField DataIndex="Scale" ID="Efd_Scale" runat="server" FieldLabel="小数位数" LabelWidth="65" MaxLength="10" meta:resourcekey="res_118_Efd_Scale">
                          </gtp:NumberField>
                          <gtp:NumberField DataIndex="DisplayDecimalPrecision" ID="Efd_DisplayDecimalPrecision" runat="server" Style="text-align:right" FieldLabel="显示位数" LabelWidth="70" MaxLength="10" meta:resourcekey="res_119_Efd_DisplayDecimalPrecision">
                          </gtp:NumberField>
                          <gtp:TextField DataIndex="MinNumber" ID="Efd_MinDecimal" runat="server" FieldLabel="最小值" LabelWidth="65" meta:resourcekey="res_120_Efd_MinDecimal">
                          </gtp:TextField>
                          <gtp:TextField DataIndex="MaxNumber" ID="Efd_MaxDecimal" runat="server" FieldLabel="最大值" LabelWidth="70" meta:resourcekey="res_121_Efd_MaxDecimal">
                          </gtp:TextField>
                          <gtp:ComboBox DataIndex="MoneySymbolic" ID="Efd_MoneySymbolic" runat="server" FieldLabel="货币符号" LabelWidth="65" Editable="false" meta:resourcekey="res_122_Efd_MoneySymbolic">
                            <Items>
                              <gtp:ListItem Text="¥" Value="¥" meta:resourcekey="res_123_listItem" />
                              <gtp:ListItem Text="$" Value="$" meta:resourcekey="res_124_listItem1" />
                              <gtp:ListItem Text="£" Value="£" meta:resourcekey="res_125_listItem2" />
                              <gtp:ListItem Text="€" Value="€" meta:resourcekey="res_126_listItem3" />
                            </Items>
                          </gtp:ComboBox>
                          <gtp:CheckBox DataIndex="IsShowPad" LabelSeparator="&amp;nbsp;" ID="Efd_IsShowPad" runat="server" FieldLabel="末位补零" LabelWidth="70" HideLabel="true" BoxLabel="末位补零" meta:resourcekey="res_127_Efd_IsShowPad">
                          </gtp:CheckBox>
                          <gtp:CheckBox DataIndex="AllowNegative" ID="Efd_AllowNegativeDecimal" runat="server" FieldLabel="允许负数" LabelWidth="65" HideLabel="true" BoxLabel="允许负数" meta:resourcekey="res_128_Efd_AllowNegativeDecimal">
                          </gtp:CheckBox>
                          <gtp:CheckBox DataIndex="UseThousands" ID="Efd_UseThousandsDecimal" runat="server" FieldLabel="显示千分位" LabelWidth="70" HideLabel="true" BoxLabel="显示千分位" meta:resourcekey="res_129_Efd_UseThousandsDecimal">
                          </gtp:CheckBox>
                        </Items>
                      </gtp:FormPanel>
                      <gtp:FormPanel ID="boolEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_130_boolEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="1" ColumnWidths="[330]" MaxColumnWidths="[330]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                        </Items>
                      </gtp:FormPanel>
                      <gtp:FormPanel ID="dateEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_131_dateEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="1" ColumnWidths="[330]" MaxColumnWidths="[330]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:ComboBox DataIndex="DateFormat" ID="Efd_DateFormat" runat="server" FieldLabel="日期格式" LabelWidth="75" meta:resourcekey="res_132_Efd_DateFormat">
                            <Items>
                              <gtp:ListItem Text="Y-m-d" Value="Y-m-d" meta:resourcekey="res_133_listItem" />
                              <gtp:ListItem Text="m/d/Y" Value="m/d/Y" meta:resourcekey="res_134_listItem1" />
                              <gtp:ListItem Text="n/j/Y" Value="n/j/Y" meta:resourcekey="res_135_listItem2" />
                              <gtp:ListItem Text="Y年m月d日" Value="Y年m月d日" meta:resourcekey="res_136_listItem3" />
                              <gtp:ListItem Text="Y年n月j日" Value="Y年n月j日" meta:resourcekey="res_137_listItem4" />
                              <gtp:ListItem Text="Y-m-d (星期l)" Value="Y-m-d (星期l)" meta:resourcekey="res_138_listItem5" />
                              <gtp:ListItem Text="Y年m月d日 H时i分" Value="Y年m月d日 H时i分" meta:resourcekey="res_139_listItem6" />
                              <gtp:ListItem Text="Y年m月d日 H时i分s秒" Value="Y年m月d日 H时i分s秒" meta:resourcekey="res_140_listItem7" />
                              <gtp:ListItem Text="j日G时" Value="j日G时" meta:resourcekey="res_141_listItem8" />
                              <gtp:ListItem Text="H:i" Value="H:i" meta:resourcekey="res_142_listItem9" />
                              <gtp:ListItem Text="H:i:s" Value="H:i:s" meta:resourcekey="res_143_listItem10" />
                              <gtp:ListItem Text="H时i分" Value="H时i分" meta:resourcekey="res_144_listItem11" />
                            </Items>
                          </gtp:ComboBox>
                        </Items>
                      </gtp:FormPanel>
                      <gtp:FormPanel ID="dictEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:0.0px;padding-bottom:0.0px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_145_dictEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="1" ColumnWidths="[330]" MaxColumnWidths="[330]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:LookupField RefPage="/GTP/AppFrameV2/DynaBizComp/DynaDictLookUpPage/DynaDictLookUpPage.aspx" DataIndex="TypeAlias" ID="Efd_TypeAlias" runat="server" FieldLabel="对应字典" LabelWidth="75" AllowBlank="false" MaxLength="255" meta:resourcekey="res_146_Efd_TypeAlias">
                            <InputMappings>
                              <gtp:LookupInputMapping Target="FullTypeName" Source="OutEntity.DictFullCode" IsCollection="False" Type="Entity" />
                              <gtp:LookupInputMapping Target="TypeAlias" Source="OutEntity.DictCName" IsCollection="False" Type="Entity" />
                            </InputMappings>
                            <Features DialogHeight="370" DialogWidth="610" />
                            <Listeners>
                              <AfterLookup Handler="Efd_TypeAlias_AfterLookup" />
                            </Listeners>
                          </gtp:LookupField>
                          <gtp:CheckBox DataIndex="IsCollection" ID="Efd_IsCollection" runat="server" FieldLabel="允许多选" LabelWidth="75" meta:resourcekey="res_147_Efd_IsCollection">
                          </gtp:CheckBox>
                          <gtp:CheckBox DataIndex="IsEditable" LabelSeparator="&amp;nbsp;" ID="Efd_IsEditable" runat="server" FieldLabel="允许编辑" LabelWidth="75" meta:resourcekey="res_148_Efd_IsEditable">
                          </gtp:CheckBox>
                        </Items>
                      </gtp:FormPanel>
                    </Items>
                  </gtp:Panel>
                </Items>
              </gtp:Panel>
              <gtp:Panel ID="layoutPanel11" runat="server" Header="false" Title="" Region="Center" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_149_12">
                <Items>
                  <gtp:FormPanel ID="formulaEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:13px;padding-right:10px;&#xD;&#xA;  padding-top:25px;padding-bottom:10px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_150_formulaEntityView">
                    <LayoutConfig>
                      <gtp:TableLayoutConfig Columns="2" ColumnWidths="[320,80]" MaxColumnWidths="[320,80]" MonitorResize="True">
                      </gtp:TableLayoutConfig>
                    </LayoutConfig>
                    <Items>
                      <gtp:ComboBox DataIndex="DefaultValue" ID="Efd_DefaultValue" runat="server" FieldLabel="默认值" LabelWidth="75" meta:resourcekey="res_151_Efd_DefaultValue">
                      </gtp:ComboBox>
                      <gtp:Button ID="Efd_btnDefaultValue" runat="server" Action="actSetDefaultValue" Text="高级" meta:resourcekey="res_152_Efd_btnDefaultValue">
                      </gtp:Button>
                      <gtp:ComboBox DataIndex="FormulaValue" ID="Efd_FormulaValue" runat="server" FieldLabel="计算表达式" LabelWidth="75" meta:resourcekey="res_153_Efd_FormulaValue">
                      </gtp:ComboBox>
                      <gtp:Button ID="Efd_btnFormulaValue" runat="server" Action="actSetFormulaValue" Text="高级" meta:resourcekey="res_154_Efd_btnFormulaValue">
                      </gtp:Button>
                    </Items>
                  </gtp:FormPanel>
                </Items>
              </gtp:Panel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel12" runat="server" Header="false" Title="" Region="East" Border="true" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="315" Width="230" meta:resourcekey="res_155_2">
            <Items>
              <gtp:FormPanel ID="styleEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:0.0px;padding-bottom:10px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_156_styleEntityView">
                <LayoutConfig>
                  <gtp:TableLayoutConfig Columns="2" ColumnWidths="[25,175]" MaxColumnWidths="[25,175]" MonitorResize="False">
                  </gtp:TableLayoutConfig>
                </LayoutConfig>
                <Items>
                  <gtp:Label ID="styleEntityView_category_R1C1_" runat="server" ColSpan="2" FieldLabel="表单设置" HideLabel="true" Text="表单设置" meta:resourcekey="res_157_styleEntityView_category_R1C1_" TextStyle="font-size:13px;font-weight: bold;">
                  </gtp:Label>
                  <gtp:CheckBox DataIndex="IsManualField" LabelSeparator="&amp;nbsp;" ID="Efd_IsManualField" runat="server" ColSpan="2" FieldLabel="人工录入" LabelWidth="1" HideLabel="true" BoxLabel="人工录入" meta:resourcekey="res_158_Efd_IsManualField">
                  </gtp:CheckBox>
                  <gtp:Label ID="styleEntityView_category_R3C1" runat="server" meta:resourcekey="res_159_styleEntityView_category_R3C1">
                  </gtp:Label>
                  <gtp:CheckBox DataIndex="IsNullable" LabelSeparator="&amp;nbsp;" ID="Efd_IsNullable" runat="server" FieldLabel="允许为空" LabelWidth="1" HideLabel="true" BoxLabel="允许为空" meta:resourcekey="res_160_Efd_IsNullable">
                  </gtp:CheckBox>
                  <gtp:CheckBox DataIndex="IsReadOnly" LabelSeparator="&amp;nbsp;" ID="Efd_IsReadOnly" runat="server" ColSpan="2" FieldLabel="只读" LabelWidth="1" HideLabel="true" BoxLabel="只读" meta:resourcekey="res_161_Efd_IsReadOnly">
                  </gtp:CheckBox>
                  <gtp:CheckBox DataIndex="IsHideComponent" LabelSeparator="&amp;nbsp;" ID="Efd_IsHideComponent" runat="server" ColSpan="2" FieldLabel="隐藏控件" LabelWidth="1" HideLabel="true" BoxLabel="隐藏控件" meta:resourcekey="res_162_Efd_IsHideComponent">
                  </gtp:CheckBox>
                  <gtp:NumberField DataIndex="RowSpan" ID="Efd_RowSpan" runat="server" ColSpan="2" FieldLabel="行跨度" LabelWidth="50" MaxLength="10" MinValue="1" AllowDecimals="false" AllowNegative="false" DecimalPrecision="0" meta:resourcekey="res_163_Efd_RowSpan">
                  </gtp:NumberField>
                  <gtp:NumberField DataIndex="ColumnSpan" ID="Efd_ColumnSpan" runat="server" ColSpan="2" FieldLabel="列跨度" LabelWidth="50" MaxLength="10" MinValue="1" AllowDecimals="false" AllowNegative="false" DecimalPrecision="0" meta:resourcekey="res_164_Efd_ColumnSpan">
                  </gtp:NumberField>
                  <gtp:Label ID="styleEntityView_category_R7C1_" runat="server" ColSpan="2" FieldLabel="列表设置" HideLabel="true" Text="列表设置" meta:resourcekey="res_165_styleEntityView_category_R7C1_" TextStyle="font-size:13px;font-weight: bold;">
                  </gtp:Label>
                  <gtp:CheckBox DataIndex="IsQuery" ID="Efd_IsQuery" runat="server" ColSpan="2" FieldLabel="列表显示" LabelWidth="65" HideLabel="true" BoxLabel="列表显示" meta:resourcekey="res_166_Efd_IsQuery">
                  </gtp:CheckBox>
                  <gtp:Label ID="styleEntityView_category_R10C1" runat="server" meta:resourcekey="res_167_styleEntityView_category_R10C1">
                  </gtp:Label>
                  <gtp:NumberField DataIndex="GridColWidth" ID="Efd_GridColWidth" runat="server" FieldLabel="列表列宽" LabelWidth="75" MaxLength="10" MaxValue="1000" MinValue="40" AllowDecimals="false" AllowNegative="false" meta:resourcekey="res_168_Efd_GridColWidth">
                  </gtp:NumberField>
                  <gtp:CheckBox DataIndex="FuzzyField" ID="Efd_FuzzyField" runat="server" ColSpan="2" FieldLabel="快速查询" LabelWidth="75" HideLabel="true" BoxLabel="支持快速查询" meta:resourcekey="res_169_Efd_FuzzyField">
                  </gtp:CheckBox>
                  <gtp:CheckBox DataIndex="IsFilter" ID="Efd_IsFilter" runat="server" ColSpan="2" FieldLabel="支持过滤" LabelWidth="65" HideLabel="true" BoxLabel="支持过滤" meta:resourcekey="res_170_Efd_IsFilter">
                  </gtp:CheckBox>
                  <gtp:CheckBox DataIndex="IsOrder" ID="Efd_IsOrder" runat="server" ColSpan="2" FieldLabel="支持排序" LabelWidth="65" HideLabel="true" BoxLabel="支持排序" meta:resourcekey="res_171_Efd_IsOrder">
                  </gtp:CheckBox>
                </Items>
              </gtp:FormPanel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel13" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="35" meta:resourcekey="res_172_3">
            <Items>
              <gtp:ToolbarPanel ID="toolbarView2" AutoRender="false" runat="server">
                <Items>
                  <gtp:CommandToolbar runat="server" ID="toolbarView2_toolbar" ButtonAlign="Right">
                    <Items>
                      <gtp:Button ID="btnOk" runat="server" Hidden="true" Width="60" Action="actOk" Text="确定" Cls="g-btn-recommend" meta:resourcekey="res_173_btnOk">
                      </gtp:Button>
                      <gtp:Button ID="btnSaveProperty" runat="server" Width="60" Action="actSaveProperty" Text="添加" Cls="g-btn-recommend" meta:resourcekey="res_174_btnSaveProperty">
                      </gtp:Button>
                      <gtp:Button ID="btnSavePropertys" runat="server" Width="60" Action="actSavePropertys" Text="添加并继续" meta:resourcekey="res_175_btnSavePropertys">
                      </gtp:Button>
                      <gtp:Button ID="btnCancelProperty" runat="server" Width="60" Action="actCancelProperty" Text="取消" meta:resourcekey="res_176_btnCancelProperty">
                      </gtp:Button>
                      <gtp:ToolbarSpacer LabelSeparator="" ID="ToolbarSpacer" runat="server" Width="10">
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
  <gtp:Window runat="server" ID="windowView" AutoRender="false" Title="参照设置" Hidden="true" Height="375" Width="400" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_177_windowView"  >
    <Items>
      <gtp:Panel runat="server" ID="containerView" AutoRender="false" Layout="border" meta:resourcekey="res_178_containerView">
        <Items>
          <gtp:Panel ID="layoutPanel14" runat="server" Header="false" Title="" Region="North" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="120" meta:resourcekey="res_179_1">
            <Items>
              <gtp:FormPanel ID="refObjectView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:20px;padding-right:10px;&#xD;&#xA;  padding-top:20px;padding-bottom:10px" DataSource="DynamicReferenceObject" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_180_refObjectView">
                <LayoutConfig>
                  <gtp:TableLayoutConfig Columns="1" ColumnWidths="[320]" MaxColumnWidths="[320]" MonitorResize="True">
                  </gtp:TableLayoutConfig>
                </LayoutConfig>
                <Items>
                  <gtp:LookupField RefPage="/GTP/AppFrameV2/DynaBizComp/DynaRefLookupPage/DynaRefLookupPage.aspx" DataIndex="RefPageAlias" ID="Efd_RefPageAlias" runat="server" FieldLabel="参照页面" LabelWidth="75" I18n="false" meta:resourcekey="res_181_Efd_RefPageAlias">
                    <InputMappings>
                      <gtp:LookupInputMapping Target="RefPageName" Source="OutEntity.PName" IsCollection="False" Type="Entity" />
                      <gtp:LookupInputMapping Target="RefPageAlias" Source="OutEntity.PAlias" IsCollection="False" Type="Entity" />
                    </InputMappings>
                    <Listeners>
                      <Change Handler="Efd_RefPageAlias_Change" />
                    </Listeners>
                  </gtp:LookupField>
                  <gtp:TextField DataIndex="RefRemark" ID="Efd_RefRemark" runat="server" FieldLabel="描述" LabelWidth="75" MaxLength="500" meta:resourcekey="res_182_Efd_RefRemark">
                  </gtp:TextField>
                  <gtp:CheckBox DataIndex="IsEditable" LabelSeparator="&amp;nbsp;" ID="Efd_IsEditable2" runat="server" FieldLabel="允许编辑" LabelWidth="75" meta:resourcekey="res_183_Efd_IsEditable2">
                  </gtp:CheckBox>
                </Items>
              </gtp:FormPanel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel15" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_184_2">
            <Items>
              <gtp:TabPanel runat="server" ID="tabView" AutoRender="false" DeferredRender="true" Plain="true" EnableTabScroll="true" Title="" meta:resourcekey="res_185_tabView">
                <Plugins>
                  <gtp:TabScrollerMenu runat="server" PageSize="50">
                  </gtp:TabScrollerMenu>
                </Plugins>
                <Items>
                  <gtp:Panel runat="server" ID="tabView_tab" Hidden="False" Title="属性映射" Layout="fit" Border="false" meta:resourcekey="res_186_tabView_tab">
                    <Items>
                      <gtp:GridPanel ID="refPropertyMapingView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" AutoRender="false" runat="server" DataSource="DynamicReferenceObject.PropertyMapping" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" SelectMode="CheckBox" meta:resourcekey="res_187_refPropertyMapingView">
                        <TopBar>
                          <gtp:Toolbar runat="server" ButtonAlign="Left" ID="refPropertyMapingView_toolbar" EnableOverflow="true">
                            <Items>
                              <gtp:Button ID="btnAddPropertyMap" runat="server" Action="actAddProMaping" Text="添加映射" meta:resourcekey="res_188_btnAddPropertyMap" IconCls="ci-toolbar-GTP_add-png">
                              </gtp:Button>
                              <gtp:Button ID="btnRemoveMap" runat="server" Action="actRemoveProMapping" Text="移除映射" meta:resourcekey="res_189_btnRemoveMap" IconCls="ci-toolbar-GTP_delete-png">
                              </gtp:Button>
                            </Items>
                          </gtp:Toolbar>
                        </TopBar>
                        <ColumnModel runat="server">
                          <Columns>
                            <gtp:TextColumn ColumnID="col_PropertyAlias" Align="Left" DataIndex="Alias" Header="回填属性" Width="150" Editable="false" meta:resourcekey="res_190_col_PropertyAlias">
                            </gtp:TextColumn>
                            <gtp:TextColumn ColumnID="col_SourceName" Align="Left" DataIndex="SourceId" Header="对应参数" Width="150" meta:resourcekey="res_191_col_SourceName">
                              <Editor>
                                <gtp:ComboBox DataIndex="SourceId" ID="refPropertyMapingView_col_SourceName_editor" runat="server" meta:resourcekey="res_192_refPropertyMapingView_col_SourceName_editor">
                                </gtp:ComboBox>
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
                  <gtp:Panel runat="server" ID="tabView_tab1" Hidden="False" Title="参数设置" Layout="fit" Border="false" meta:resourcekey="res_193_tabView_tab1">
                    <Items>
                      <gtp:GridPanel ID="refPageParamView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" AutoRender="false" runat="server" DataSource="DynamicReferenceObject.PageParam" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" SelectMode="CheckBox" meta:resourcekey="res_194_refPageParamView">
                        <TopBar>
                          <gtp:Toolbar runat="server" ButtonAlign="Left" ID="refPageParamView_toolbar" EnableOverflow="true">
                            <Items>
                              <gtp:Button ID="btnAddPageParam" runat="server" Action="actAddPageParam" Text="添加参数" meta:resourcekey="res_195_btnAddPageParam" IconCls="ci-toolbar-GTP_add-png">
                              </gtp:Button>
                              <gtp:Button ID="btnRemoveParam" runat="server" Action="actRemovePageParam" Text="移除参数" meta:resourcekey="res_196_btnRemoveParam" IconCls="ci-toolbar-GTP_delete-png">
                              </gtp:Button>
                            </Items>
                          </gtp:Toolbar>
                        </TopBar>
                        <ColumnModel runat="server">
                          <Columns>
                            <gtp:TextColumn ColumnID="col_ParamAlias" Align="Left" DataIndex="Alias" Header="参数" Width="150" Editable="false" meta:resourcekey="res_197_col_ParamAlias">
                            </gtp:TextColumn>
                            <gtp:TextColumn ColumnID="col_ParamValue" Align="Left" DataIndex="ParamValue" Header="参数值" Width="150" meta:resourcekey="res_198_col_ParamValue">
                              <Editor>
                                <gtp:TextField DataIndex="ParamValue" ID="refPageParamView_col_ParamValue_editor" runat="server" AllowBlank="false" meta:resourcekey="res_199_refPageParamView_col_ParamValue_editor">
                                </gtp:TextField>
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
                </Items>
              </gtp:TabPanel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel16" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="35" meta:resourcekey="res_200_3">
            <Items>
              <gtp:ToolbarPanel ID="toolbarView1" AutoRender="false" runat="server">
                <Items>
                  <gtp:CommandToolbar runat="server" ID="toolbarView1_toolbar" ButtonAlign="Right">
                    <Items>
                      <gtp:Button ID="btn_actSaveReferenceInfo" runat="server" Action="actSaveReferenceInfo" Text="确定" meta:resourcekey="res_201_btn_actSaveReferenceInfo">
                      </gtp:Button>
                      <gtp:Button ID="btn_actCancelReference" runat="server" Action="actCancelReference" Text="取消" meta:resourcekey="res_202_btn_actCancelReference">
                      </gtp:Button>
                      <gtp:ToolbarSpacer LabelSeparator="" ID="tsRefObject" runat="server" Width="10">
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
  <gtp:Window runat="server" ID="windowView1" AutoRender="false" Title="选择映射属性" Hidden="true" Height="330" Width="350" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_203_windowView1"  >
    <Items>
      <gtp:GridPanel ID="PropertySelectView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" AutoRender="false" runat="server" DataSource="PropertyList" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" SelectMode="CheckBox" meta:resourcekey="res_204_PropertySelectView">
        <BottomBar>
          <gtp:CommandToolbar runat="server" ID="PropertySelectView_toolbar" ButtonAlign="Right">
            <Items>
              <gtp:Button ID="btnSelect" runat="server" Action="actSelectProperties" Text="确定" meta:resourcekey="res_205_btnSelect">
              </gtp:Button>
              <gtp:Button ID="btnCancelSelect" runat="server" Action="actCancelSelect" Text="取消" meta:resourcekey="res_206_btnCancelSelect">
              </gtp:Button>
              <gtp:ToolbarSpacer LabelSeparator="" ID="tsSelect" runat="server" Width="10">
              </gtp:ToolbarSpacer>
            </Items>
          </gtp:CommandToolbar>
        </BottomBar>
        <ColumnModel runat="server">
          <Columns>
            <gtp:TextColumn ColumnID="col_PropertyAlias" Align="Left" DataIndex="PropertyAlias" Header="名称" Width="120" Editable="false" meta:resourcekey="res_207_col_PropertyAlias">
            </gtp:TextColumn>
            <gtp:TextColumn ColumnID="col_PropertyName" Align="Left" DataIndex="PropertyName" Header="编码" Width="180" Editable="false" meta:resourcekey="res_208_col_PropertyName">
            </gtp:TextColumn>
          </Columns>
        </ColumnModel>
        <View>
          <gtp:GridView runat="server">
          </gtp:GridView>
        </View>
      </gtp:GridPanel>
    </Items>
  </gtp:Window>
  <gtp:Window runat="server" ID="bizEditWindow" AutoRender="false" Title="信息维护" Hidden="true" Height="235" Width="640" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_209_bizEditWindow"  >
    <Items>
      <gtp:FormPanel ID="bizInfoEditView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:20px;padding-right:10px;&#xD;&#xA;  padding-top:20px;padding-bottom:10px" DataSource="DynaBizInfoEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_210_bizInfoEditView">
        <BottomBar>
          <gtp:CommandToolbar runat="server" ID="bizInfoEditView_toolbar" ButtonAlign="Right">
            <Items>
              <gtp:Button ID="btnUpdateBizInfo" runat="server" Width="60" Action="actUpdateBizInfo" Text="保存" Cls="g-btn-recommend" meta:resourcekey="res_211_btnUpdateBizInfo">
              </gtp:Button>
              <gtp:Button ID="btnCancelUpdate" runat="server" Width="60" Action="actCancelUpdate" Text="取消" meta:resourcekey="res_212_btnCancelUpdate">
              </gtp:Button>
              <gtp:ToolbarSpacer LabelSeparator="" ID="tsUpdateBizInfo" runat="server" Width="30">
              </gtp:ToolbarSpacer>
            </Items>
          </gtp:CommandToolbar>
        </BottomBar>
        <LayoutConfig>
          <gtp:TableLayoutConfig Columns="2" ColumnWidths="[280,280]" MaxColumnWidths="[280,280]" MonitorResize="True">
          </gtp:TableLayoutConfig>
        </LayoutConfig>
        <Items>
          <gtp:TextField DataIndex="BizAlias" ID="Efd_E_BizAlias" runat="server" FieldLabel="业务名称" LabelWidth="75" LabelAlign="Right" MaxLength="255" meta:resourcekey="res_213_Efd_E_BizAlias">
          </gtp:TextField>
          <gtp:TextField DataIndex="BizName" ID="Efd_E_BizName" runat="server" ReadOnly="true" FieldLabel="业务编码" LabelWidth="75" MaxLength="255" meta:resourcekey="res_214_Efd_E_BizName">
          </gtp:TextField>
          <gtp:TextField DataIndex="Path" ID="Efd_E_Path" runat="server" ColSpan="2" ReadOnly="true" FieldLabel="模块树路径" LabelWidth="75" LabelAlign="Right" MaxLength="255" meta:resourcekey="res_215_Efd_E_Path">
          </gtp:TextField>
          <gtp:TextArea DataIndex="Remark" ID="Efd_E_Remark" runat="server" ColSpan="2" FieldLabel="备注" LabelWidth="75" LabelAlign="Right" MaxLength="2000" meta:resourcekey="res_216_Efd_E_Remark">
          </gtp:TextArea>
        </Items>
      </gtp:FormPanel>
    </Items>
  </gtp:Window>
