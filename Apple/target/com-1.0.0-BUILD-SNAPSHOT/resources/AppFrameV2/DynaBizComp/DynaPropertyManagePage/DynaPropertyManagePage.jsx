<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_DynaPropertyManagePage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.DynaBizComp" InitScriptMode="Jsx" PageName="DynaPropertyManagePage" BizComp="GTP.AppFrameV2.DynaBizComp.DynaExtensionModule" CustomIcons="['toolbar/GTP_add.png','toolbar/GTP_edit.png','toolbar/GTP_delete.png','toolbar/GTP_up.png','toolbar/GTP_down.png','toolbar/GTP_view.png','toolbar/GTP_back.png','toolbar/GTP_add.png','toolbar/GTP_delete.png','toolbar/GTP_accredit.png','toolbar/GTP_addchild.png','toolbar/GTP_decline.png','toolbar/GTP_enabled.png','toolbar/GTP_disable.png']" >
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
      <gtp:InputParam Name="ExtensionId" IsCollection="False" Type="Number" Value="" />
      <gtp:InputParam Name="State" IsCollection="False" Type="Boolean" Value="" />
      <gtp:InputParam Name="EntityFullName" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="bizCompName" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="StaticExtension" IsCollection="False" Type="Boolean" Value="" />
      <gtp:InputParam Name="SetRef" IsCollection="False" Type="Boolean" Value="true" />
    </InputParams>
  </gtp:PageParam>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
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
          <gtp:DataField Name="DisplayDecimalPrecision" Alias="显示位数" Type="Int" DefaultValueExpression="2">
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
          <gtp:DataField Name="OrderNum" Alias="顺序号" Type="Int" DefaultValueExpression="0">
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
          <gtp:DataField Name="DynamicGroupDefinition.Id" Alias="主键" Type="Int" ForeignKey="true">
          </gtp:DataField>
          <gtp:DataField Name="DynamicGroupDefinition.GroupAlias" Alias="分组别名" Type="String" TrimBlank="true">
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
          <gtp:DataField Name="GroupId" Alias="分组名称" Type="String" TrimBlank="true">
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
          <gtp:DataField Name="IsNullable" Alias="是否允许为空" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsHideComponent" Alias="是否隐藏控件" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsReadOnly" Alias="是否只读" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsQuery" Alias="是否可查询" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="IsFilter" Alias="是否可过滤" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="IsOrder" Alias="是否可排序" Type="Boolean" DefaultValueExpression="true">
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
          <gtp:DataField Name="DynamicGroupDefinition.Id" Alias="主键" Type="Int" ForeignKey="true">
          </gtp:DataField>
          <gtp:DataField Name="DynamicGroupDefinition.GroupAlias" Alias="分组别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="State" Alias="字段状态" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ExtensionId" Alias="方案id" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="RefPageName" Alias="参照页面" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsManualField" Alias="人工录入" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsEnable" Alias="是否启用" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="NotNullable" Alias="必填" Type="Boolean" ValueExpression="IIf(IsNullable,false,true)">
          </gtp:DataField>
          <gtp:DataField Name="IsRef" Alias="参照" Type="Boolean" ValueExpression="IIf(RefPageName==null,false,true)">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynaGroupList" Alias="动态分组定义" Type="GTP.AppFrameV2.DynaBizComp.DynamicGroupDefinition">
        <Fields>
          <gtp:DataField Name="Id" Alias="主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="GroupName" Alias="分组名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="GroupAlias" Alias="分组别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="OrderNo" Alias="序列号" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="DynamicExtensionDefinition.Id" Alias="弹性域主表ID" Type="Int" ForeignKey="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynaGroupEdit" Alias="动态分组定义" Type="GTP.AppFrameV2.DynaBizComp.DynamicGroupDefinition">
        <Fields>
          <gtp:DataField Name="Id" Alias="主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="GroupName" Alias="分组名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="GroupAlias" Alias="分组别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="OrderNo" Alias="序列号" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="DynamicExtensionDefinition.Id" Alias="弹性域主表ID" Type="Int" ForeignKey="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="Property" Alias="实体属性" Type="">
        <Fields>
          <gtp:DataField Name="Code" Alias="名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FullCode" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="OType" Alias="类型" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ID" Alias="名称" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynaProjectPoco" Alias="方案分组" Type="GTP.AppFrameV2.DynaBizComp.DynaProjectPoco">
        <Fields>
          <gtp:DataField Name="ID" Alias="ID" Type="Int" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="PID" Alias="父ID" Type="Int" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Name" Alias="名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Alias" Alias="别名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Level" Alias="层级" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="IsLeaf" Alias="是否叶节点" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="OrderNo" Alias="序列号" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="Conditions" Alias="条件" Type="String" TrimBlank="true">
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
          <gtp:DataField Name="DefaultGroupId" Alias="默认分组Id" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="StaticProjectId" Alias="静态方案Id" Type="Int">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynamicExtensionDefinition" Alias="动态属性扩展" Type="GTP.AppFrameV2.DynaBizComp.DynamicExtensionDefinition">
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
          <gtp:DataField Name="ColumnCount" Alias="列数" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="IsPublished" Alias="是否发布" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="ExtensionName" Alias="方案名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsModified" Alias="是否在调整" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="HasEnabled" Alias="是否上线" Type="Boolean" TrimBlank="true" DefaultValueExpression="false">
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
              <gtp:DataField Name="DynamicExtensionDefinition.Id" Alias="弹性域主表ID" Type="Int" ForeignKey="true">
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
      <gtp:DataSource Name="DynamicReferenceObject" Alias="动态属性定义" Type="GTP.AppFrameV2.DynaBizComp.DynamicPropertyDefinition">
        <Fields>
          <gtp:DataField Name="Id" Alias="扩展属性主键" Type="Int" PrimaryKey="true">
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
    </items>
  </gtp:DataContext>
  <gtp:Actions ID="actList" runat="server" >
    <Items>
      <gtp:Action ID="actAddGroup" runat="server" Disabled="false" Hidden="false" Handler="actAddGroup_Handler" IconCls="ci-toolbar-GTP_add-png" Text="新增" meta:resourcekey="res_2_actAddGroup" >
      </gtp:Action>
      <gtp:Action ID="actEditGroup" runat="server" Disabled="false" Hidden="false" Handler="actEditGroup_Handler" IconCls="ci-toolbar-GTP_edit-png" Text="编辑" meta:resourcekey="res_3_actEditGroup" >
      </gtp:Action>
      <gtp:Action ID="actDeleteGroup" runat="server" Disabled="false" Hidden="false" Handler="actDeleteGroup_Handler" IconCls="ci-toolbar-GTP_delete-png" Text="删除" meta:resourcekey="res_4_actDeleteGroup" >
      </gtp:Action>
      <gtp:Action ID="actMoveUp" runat="server" Disabled="false" Hidden="false" Handler="actMoveUp_Handler" IconCls="ci-toolbar-GTP_up-png" Text="上移" meta:resourcekey="res_5_actMoveUp" >
      </gtp:Action>
      <gtp:Action ID="actMoveDown" runat="server" Disabled="false" Hidden="false" Handler="actMoveDown_Handler" IconCls="ci-toolbar-GTP_down-png" Text="下移" meta:resourcekey="res_6_actMoveDown" >
      </gtp:Action>
      <gtp:Action ID="actAddProperty" runat="server" Disabled="false" Hidden="false" Handler="actAddProperty_Handler" IconCls="ci-toolbar-GTP_add-png" Text="新增字段" meta:resourcekey="res_7_actAddProperty" >
      </gtp:Action>
      <gtp:Action ID="actEditProperty" runat="server" Disabled="false" Hidden="false" Handler="actEditProperty_Handler" IconCls="ci-toolbar-GTP_edit-png" Text="编辑字段" meta:resourcekey="res_8_actEditProperty" >
      </gtp:Action>
      <gtp:Action ID="actDeleteProperty" runat="server" Disabled="false" Hidden="false" Handler="actDeleteProperty_Handler" IconCls="ci-toolbar-GTP_delete-png" Text="删除字段" meta:resourcekey="res_9_actDeleteProperty" >
      </gtp:Action>
      <gtp:Action ID="actSaveProperty" runat="server" Disabled="false" Hidden="false" Handler="actSaveProperty_Handler" Text="保存" meta:resourcekey="res_10_actSaveProperty" >
      </gtp:Action>
      <gtp:Action ID="actCancelProperty" runat="server" Disabled="false" Hidden="false" Handler="actCancelProperty_Handler" Text="取消" meta:resourcekey="res_11_actCancelProperty" >
      </gtp:Action>
      <gtp:Action ID="actSavePropertys" runat="server" Disabled="false" Hidden="false" Handler="actSavePropertys_Handler" Text="保存并继续" meta:resourcekey="res_12_actSavePropertys" >
      </gtp:Action>
      <gtp:Action ID="actMoveUpProperty" runat="server" Disabled="false" Hidden="false" Handler="actMoveUpProperty_Handler" IconCls="ci-toolbar-GTP_up-png" Text="上移" meta:resourcekey="res_13_actMoveUpProperty" >
      </gtp:Action>
      <gtp:Action ID="actMoveDownProperty" runat="server" Disabled="false" Hidden="false" Handler="actMoveDownProperty_Handler" IconCls="ci-toolbar-GTP_down-png" Text="下移" meta:resourcekey="res_14_actMoveDownProperty" >
      </gtp:Action>
      <gtp:Action ID="actSaveGroup" runat="server" Disabled="false" Hidden="false" Handler="actSaveGroup_Handler" Text="确定" meta:resourcekey="res_15_actSaveGroup" >
      </gtp:Action>
      <gtp:Action ID="actCancelGroup" runat="server" Disabled="false" Hidden="false" Handler="actCancelGroup_Handler" Text="取消" meta:resourcekey="res_16_actCancelGroup" >
      </gtp:Action>
      <gtp:Action ID="actView" runat="server" Disabled="false" Hidden="false" Handler="actView_Handler" IconCls="ci-toolbar-GTP_view-png" Text="查看" meta:resourcekey="res_17_actView" >
      </gtp:Action>
      <gtp:Action ID="actOk" runat="server" Disabled="false" Hidden="false" Handler="actOk_Handler" Text="确定" meta:resourcekey="res_18_actOk" >
      </gtp:Action>
      <gtp:Action ID="actBack" runat="server" Disabled="false" Hidden="false" Handler="actBack_Handler" IconCls="ci-toolbar-GTP_back-png" Text="返回" meta:resourcekey="res_19_actBack" >
      </gtp:Action>
      <gtp:Action ID="actSuperModel" runat="server" Disabled="false" Hidden="false" Handler="actSuperModel_Handler" Text="高级模式" meta:resourcekey="res_20_actSuperModel" >
      </gtp:Action>
      <gtp:Action ID="actSimpleModel" runat="server" Disabled="false" Hidden="false" Handler="actSimpleModel_Handler" Text="简单模式" meta:resourcekey="res_21_actSimpleModel" >
      </gtp:Action>
      <gtp:Action ID="actSaveProject" runat="server" Disabled="false" Hidden="false" Handler="actSaveProject_Handler" Text="保存" meta:resourcekey="res_22_actSaveProject" >
      </gtp:Action>
      <gtp:Action ID="actCancelProject" runat="server" Disabled="false" Hidden="false" Handler="actCancelProject_Handler" Text="取消" meta:resourcekey="res_23_actCancelProject" >
      </gtp:Action>
      <gtp:Action ID="actAddCondition" runat="server" Disabled="false" Hidden="false" Handler="actAddCondition_Handler" IconCls="ci-toolbar-GTP_add-png" Text="添加" meta:resourcekey="res_24_actAddCondition" >
      </gtp:Action>
      <gtp:Action ID="actRemoveCondition" runat="server" Disabled="false" Hidden="false" Handler="actRemoveCondition_Handler" IconCls="ci-toolbar-GTP_delete-png" Text="移除" meta:resourcekey="res_25_actRemoveCondition" >
      </gtp:Action>
      <gtp:Action ID="actAddExtension" runat="server" Disabled="false" Hidden="false" Handler="actAddExtension_Handler" Text="新增" meta:resourcekey="res_26_actAddExtension" >
      </gtp:Action>
      <gtp:Action ID="actAddStaticExtension" runat="server" Disabled="false" Hidden="false" Handler="actAddStaticExtension_Handler" Text="新增静态方案" meta:resourcekey="res_27_actAddStaticExtension" >
      </gtp:Action>
      <gtp:Action ID="actEditProjectGroup" runat="server" Disabled="false" Hidden="false" Handler="actEditProjectGroup_Handler" IconCls="ci-toolbar-GTP_accredit-png" Text="编辑" meta:resourcekey="res_28_actEditProjectGroup" >
      </gtp:Action>
      <gtp:Action ID="actDeleteProjectGroup" runat="server" Disabled="false" Hidden="false" Handler="actDeleteProjectGroup_Handler" IconCls="ci-toolbar-GTP_delete-png" Text="删除" meta:resourcekey="res_29_actDeleteProjectGroup" >
      </gtp:Action>
      <gtp:Action ID="actSetReferenceInfo" runat="server" Disabled="false" Hidden="false" Handler="actSetReferenceInfo_Handler" Text="设置参照" meta:resourcekey="res_30_actSetReferenceInfo" >
      </gtp:Action>
      <gtp:Action ID="actRemoveReference" runat="server" Disabled="false" Hidden="false" Handler="actRemoveReference_Handler" Text="取消参照" meta:resourcekey="res_31_actRemoveReference" >
      </gtp:Action>
      <gtp:Action ID="actSaveReferenceInfo" runat="server" Disabled="false" Hidden="false" Handler="actSaveReferenceInfo_Handler" Text="确定" meta:resourcekey="res_32_actSaveReferenceInfo" >
      </gtp:Action>
      <gtp:Action ID="actCancelReference" runat="server" Disabled="false" Hidden="false" Handler="actCancelReference_Handler" Text="取消" meta:resourcekey="res_33_actCancelReference" >
      </gtp:Action>
      <gtp:Action ID="actAddProMaping" runat="server" Disabled="false" Hidden="false" Handler="actAddProMaping_Handler" Text="添加映射" meta:resourcekey="res_34_actAddProMaping" >
      </gtp:Action>
      <gtp:Action ID="actRemoveProMapping" runat="server" Disabled="false" Hidden="false" Handler="actRemoveProMapping_Handler" Text="移除映射" meta:resourcekey="res_35_actRemoveProMapping" >
      </gtp:Action>
      <gtp:Action ID="actAddPageParam" runat="server" Disabled="false" Hidden="false" Handler="actAddPageParam_Handler" Text="添加参数" meta:resourcekey="res_36_actAddPageParam" >
      </gtp:Action>
      <gtp:Action ID="actRemovePageParam" runat="server" Disabled="false" Hidden="false" Handler="actRemovePageParam_Handler" Text="移除参数" meta:resourcekey="res_37_actRemovePageParam" >
      </gtp:Action>
      <gtp:Action ID="actSelectProperties" runat="server" Disabled="false" Hidden="false" Handler="actSelectProperties_Handler" Text="确定" meta:resourcekey="res_38_actSelectProperties" >
      </gtp:Action>
      <gtp:Action ID="actCancelSelect" runat="server" Disabled="false" Hidden="false" Handler="actCancelSelect_Handler" Text="取消" meta:resourcekey="res_39_actCancelSelect" >
      </gtp:Action>
      <gtp:Action ID="actEnable" runat="server" Disabled="false" Hidden="false" Handler="actEnable_Handler" Text="启用" meta:resourcekey="res_40_actEnable" >
      </gtp:Action>
      <gtp:Action ID="actDisable" runat="server" Disabled="false" Hidden="false" Handler="actDisable_Handler" Text="停用" meta:resourcekey="res_41_actDisable" >
      </gtp:Action>
      <gtp:Action ID="actSetFormulaValue" runat="server" Disabled="false" Hidden="false" Handler="actSetFormulaValue_Handler" meta:resourcekey="res_42_actSetFormulaValue" >
      </gtp:Action>
      <gtp:Action ID="actSetDefaultValue" runat="server" Disabled="false" Hidden="false" Handler="actSetDefaultValue_Handler" meta:resourcekey="res_43_actSetDefaultValue" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="gridView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnBack" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnAddProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnEditProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnDeleteProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="sbMoveUp" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="sbMoveDown" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnPMoveUp" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnPMoveDown" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSetReferenceInfo" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnRemoveReference" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnSetEnable" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSetDisable" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="gridView.col_PropertyName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_PropertyAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_FieldName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_DataType" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_IsNullable" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_IsReadOnly" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_IsQuery" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_IsFilter" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_IsOrder" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_OrderNum" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_RowSpan" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_ColumnSpan" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_ColumnWidth" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_GroupName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_IsRef" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_IsEnable" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_IsHideComponent" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="windowView" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="groupGridView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnAddGroup" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnEditGroup" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnDeleteGroup" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ToolbarSeparator" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnMoveUp" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnMoveDown" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="groupGridView.col_GroupAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="containerView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="stringEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Length" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsMulti" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="baseEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_PropertyAlias" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_PropertyName" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DataType" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_GroupId" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="toolbarView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnOk" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnSaveProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSavePropertys" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnCancelProperty" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ToolbarSpacer" Hidden="false" />
          <gtp:StateItem ReferenceName="styleEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="styleEntityView_category_R1C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsManualField" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsNullable" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsReadOnly" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsHideComponent" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_RowSpan" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ColumnSpan" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="styleEntityView_category_R7C1_1" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsQuery" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_GridColWidth" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_FuzzyField" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsFilter" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsOrder" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="longEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_MinLong" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_MaxLong" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_UseThousandsLong" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_AllowNegativeLong" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="decimalEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Scale" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DisplayDecimalPrecision" ReadOnly="true" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_MinDecimal" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_MaxDecimal" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_MoneySymbolic" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsShowPad" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_AllowNegativeDecimal" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_UseThousandsDecimal" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="dateEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DateFormat" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="dictEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_TypeAlias" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsCollection" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_IsEditable" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="boolEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_FalseText" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_TrueText" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="formulaEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DefaultValue" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_btnDefaultValue" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_FormulaValue" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_btnFormulaValue" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="windowView1" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="groupEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSaveGroup" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnCancelGroup" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsGroup" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_GroupAlias" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="systemPropertyView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="systemPropertyView.col_Code" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="systemPropertyView.col_OType" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="systemPropertyView.col_ID" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="treeGrid" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="cbEntityList" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="spTreeGrid" Hidden="false" />
          <gtp:StateItem ReferenceName="tsSimpleModel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSimpleModel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="sbtAppendProject" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsAppend" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnAppendGroup" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsEdit" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnEditProjectGroup" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnDeleteProjectGroup" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="treeGrid.col_Alias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="treeGrid.col_Conditions" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="entityListView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsSuperMode" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSuperModel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityListView.col_EntityName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="entityListView.col_EntityAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="windowView2" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="containerView1" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ProjectEntityView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ExtensionName" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Remark" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ColumnCount" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="conditionsView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnAddCondition" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnRemoveCondition" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="conditionsView.col_PropertyAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="conditionsView.col_PropertyValue" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="conditionsView.col_OperatorType" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="tbvProjectView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actSaveProject" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actCancelProject" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsProject" Hidden="false" />
          <gtp:StateItem ReferenceName="windowView3" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="containerView2" Disabled="false" Hidden="false" />
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
          <gtp:StateItem ReferenceName="windowView4" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="PropertySelectView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnSelect" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnCancelSelect" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsSelect" Hidden="false" />
          <gtp:StateItem ReferenceName="PropertySelectView.col_PropertyName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="PropertySelectView.col_PropertyAlias" Hidden="false" ReadOnly="false" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="gridView.col_PropertyName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_PropertyAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_FieldName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_DataType" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_IsNullable" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_IsReadOnly" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_IsQuery" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_IsFilter" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_IsOrder" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_OrderNum" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_RowSpan" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_ColumnSpan" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_ColumnWidth" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_GroupName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_IsRef" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_IsEnable" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_IsHideComponent" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnBack" Disabled="true" />
          <gtp:StateItem ReferenceName="groupGridView.col_GroupAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnAddGroup" Disabled="true" />
          <gtp:StateItem ReferenceName="btnEditGroup" Disabled="true" />
          <gtp:StateItem ReferenceName="btnDeleteGroup" Disabled="true" />
          <gtp:StateItem ReferenceName="ToolbarSeparator" Disabled="true" />
          <gtp:StateItem ReferenceName="btnMoveUp" Disabled="true" />
          <gtp:StateItem ReferenceName="btnMoveDown" Disabled="true" />
          <gtp:StateItem ReferenceName="Efd_Length" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsMulti" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_PropertyAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_PropertyName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_DataType" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_GroupId" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnOk" Disabled="true" />
          <gtp:StateItem ReferenceName="btnSaveProperty" Disabled="true" />
          <gtp:StateItem ReferenceName="btnSavePropertys" Disabled="true" />
          <gtp:StateItem ReferenceName="btnCancelProperty" Disabled="true" />
          <gtp:StateItem ReferenceName="ToolbarSpacer" Disabled="true" />
          <gtp:StateItem ReferenceName="styleEntityView_category_R1C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsManualField" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsNullable" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsReadOnly" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsHideComponent" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_RowSpan" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_ColumnSpan" ReadOnly="true" />
          <gtp:StateItem ReferenceName="styleEntityView_category_R7C1_1" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsQuery" ReadOnly="true" />
          <gtp:StateItem ReferenceName="styleEntityView_category_R6C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_GridColWidth" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_FuzzyField" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsFilter" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsOrder" ReadOnly="true" />
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
          <gtp:StateItem ReferenceName="Efd_DateFormat" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_TypeAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsCollection" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_IsEditable" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_FalseText" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_TrueText" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_DefaultValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_btnDefaultValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_FormulaValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_btnFormulaValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_GroupAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnSaveGroup" Disabled="true" />
          <gtp:StateItem ReferenceName="btnCancelGroup" Disabled="true" />
          <gtp:StateItem ReferenceName="tsGroup" Disabled="true" />
          <gtp:StateItem ReferenceName="systemPropertyView.col_Code" ReadOnly="true" />
          <gtp:StateItem ReferenceName="systemPropertyView.col_OType" ReadOnly="true" />
          <gtp:StateItem ReferenceName="systemPropertyView.col_ID" ReadOnly="true" />
          <gtp:StateItem ReferenceName="treeGrid.col_Alias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="treeGrid.col_Conditions" ReadOnly="true" />
          <gtp:StateItem ReferenceName="cbEntityList" Disabled="true" />
          <gtp:StateItem ReferenceName="spTreeGrid" Disabled="true" />
          <gtp:StateItem ReferenceName="tsSimpleModel" Disabled="true" />
          <gtp:StateItem ReferenceName="btnSimpleModel" Disabled="true" />
          <gtp:StateItem ReferenceName="sbtAppendProject" Disabled="true" />
          <gtp:StateItem ReferenceName="tsAppend" Disabled="true" />
          <gtp:StateItem ReferenceName="btnAppendGroup" Disabled="true" />
          <gtp:StateItem ReferenceName="tsEdit" Disabled="true" />
          <gtp:StateItem ReferenceName="btnEditProjectGroup" Disabled="true" />
          <gtp:StateItem ReferenceName="btnDeleteProjectGroup" Disabled="true" />
          <gtp:StateItem ReferenceName="entityListView.col_EntityName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityListView.col_EntityAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="tsSuperMode" Disabled="true" />
          <gtp:StateItem ReferenceName="btnSuperModel" Disabled="true" />
          <gtp:StateItem ReferenceName="Efd_ExtensionName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_ColumnCount" ReadOnly="true" />
          <gtp:StateItem ReferenceName="conditionsView.col_PropertyAlias" ReadOnly="true" />
          <gtp:StateItem ReferenceName="conditionsView.col_PropertyValue" ReadOnly="true" />
          <gtp:StateItem ReferenceName="conditionsView.col_OperatorType" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btnAddCondition" Disabled="true" />
          <gtp:StateItem ReferenceName="btnRemoveCondition" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actSaveProject" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_actCancelProject" Disabled="true" />
          <gtp:StateItem ReferenceName="tsProject" Disabled="true" />
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
          <gtp:StateItem ReferenceName="btnAddProperty" Hidden="true" />
          <gtp:StateItem ReferenceName="btnEditProperty" Hidden="true" />
          <gtp:StateItem ReferenceName="btnDeleteProperty" Hidden="true" />
          <gtp:StateItem ReferenceName="sbMoveUp" Hidden="true" />
          <gtp:StateItem ReferenceName="sbMoveDown" Hidden="true" />
          <gtp:StateItem ReferenceName="btnPMoveUp" Hidden="true" />
          <gtp:StateItem ReferenceName="btnPMoveDown" Hidden="true" />
          <gtp:StateItem ReferenceName="btnSetReferenceInfo" Hidden="true" />
          <gtp:StateItem ReferenceName="btnRemoveReference" Hidden="true" />
          <gtp:StateItem ReferenceName="btnSetEnable" Hidden="true" />
          <gtp:StateItem ReferenceName="btnSetDisable" Hidden="true" />
          <gtp:StateItem ReferenceName="btnView" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_NORMAL" Default="true">
        <Items>
          <gtp:StateItem ReferenceName="btnView" Hidden="true" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="West" Layout="border" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Width="340">
        <Items>
          <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="Center" Layout="card" ActiveIndex="0" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_44_11" >
            <Items>
              <gtp:GridPanel ID="groupGridView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="DynaGroupList" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_45_groupGridView">
                <TopBar>
                  <gtp:Toolbar runat="server" ButtonAlign="Left" ID="treeView_toolbar" EnableOverflow="true">
                    <Items>
                      <gtp:Button ID="btnAddGroup" runat="server" Action="actAddGroup" Text="新增" meta:resourcekey="res_46_btnAddGroup" IconCls="ci-toolbar-GTP_add-png">
                      </gtp:Button>
                      <gtp:Button ID="btnEditGroup" runat="server" Action="actEditGroup" Text="编辑" meta:resourcekey="res_47_btnEditGroup" IconCls="ci-toolbar-GTP_edit-png">
                      </gtp:Button>
                      <gtp:Button ID="btnDeleteGroup" runat="server" Action="actDeleteGroup" Text="删除" meta:resourcekey="res_48_btnDeleteGroup" IconCls="ci-toolbar-GTP_delete-png">
                      </gtp:Button>
                      <gtp:ToolbarSeparator LabelSeparator="" ID="ToolbarSeparator" runat="server" Hidden="true">
                      </gtp:ToolbarSeparator>
                      <gtp:Button ID="btnMoveUp" runat="server" Hidden="true" Action="actMoveUp" IconCls="ci-toolbar-GTP_up-png">
                      </gtp:Button>
                      <gtp:Button ID="btnMoveDown" runat="server" Hidden="true" Action="actMoveDown" IconCls="ci-toolbar-GTP_down-png">
                      </gtp:Button>
                    </Items>
                  </gtp:Toolbar>
                </TopBar>
                <ColumnModel runat="server">
                  <Columns>
                    <gtp:TextColumn ColumnID="col_GroupAlias" Align="Center" DataIndex="GroupAlias" Header="分组名称" Width="230" Editable="false" meta:resourcekey="res_49_col_GroupAlias">
                    </gtp:TextColumn>
                  </Columns>
                </ColumnModel>
                <View>
                  <gtp:GridView runat="server">
                  </gtp:GridView>
                </View>
                <Listeners>
                  <RowClick Handler="groupGridView_RowClick" />
                </Listeners>
              </gtp:GridPanel>
              <gtp:GridPanel ID="entityListView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" ForbidSortFields="EntityName,EntityAlias" runat="server" DataSource="DynaEntityPoco" Title="业务实体" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_50_entityListView">
                <TopBar>
                  <gtp:Toolbar runat="server" ButtonAlign="Right" ID="entityListView_toolbar" EnableOverflow="true">
                    <Items>
                      <gtp:ToolbarSeparator LabelSeparator="" ID="tsSuperMode" runat="server">
                      </gtp:ToolbarSeparator>
                      <gtp:Button ID="btnSuperModel" runat="server" Action="actSuperModel" Text="高级模式" meta:resourcekey="res_51_btnSuperModel">
                      </gtp:Button>
                    </Items>
                  </gtp:Toolbar>
                </TopBar>
                <ColumnModel runat="server">
                  <Columns>
                    <gtp:TextColumn ColumnID="col_EntityName" Align="Left" DataIndex="EntityName" Header="编码" Width="150" Editable="false" meta:resourcekey="res_52_col_EntityName">
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_EntityAlias" Align="Left" DataIndex="EntityAlias" Header="名称" Width="150" Editable="false" meta:resourcekey="res_53_col_EntityAlias">
                    </gtp:TextColumn>
                  </Columns>
                </ColumnModel>
                <View>
                  <gtp:GridView runat="server">
                  </gtp:GridView>
                </View>
                <Listeners>
                  <RowClick Handler="entityListView_RowClick" />
                </Listeners>
              </gtp:GridPanel>
              <gtp:TreeGridPanel runat="server" ID="treeGrid" ForbidSortFields="Alias,Conditions" AutoCellSizeMode="None" Title="扩展方案管理" DataSource="DynaProjectPoco" KeyField="ID" ParentKeyField="PID" OrderField="OrderNo" LevelField="Level" LeafField="IsLeaf" MasterColumnID="col_Alias" meta:resourcekey="res_54_treeGrid">
                <TopBar>
                  <gtp:Toolbar runat="server" Layout="Container">
                    <Items>
                      <gtp:Toolbar runat="server" ButtonAlign="Left" ID="treeGrid_toolbar" EnableOverflow="true">
                        <Items>
                          <gtp:ComboBox ID="cbEntityList" runat="server" FieldLabel="配置实体" LabelWidth="60" AllowBlank="false" Width="230" Editable="false" meta:resourcekey="res_55_cbEntityList">
                            <Listeners>
                              <Select Handler="cbEntityList_Select" />
                            </Listeners>
                          </gtp:ComboBox>
                          <gtp:ToolbarSpacer LabelSeparator="" ID="spTreeGrid" runat="server" Width="30">
                          </gtp:ToolbarSpacer>
                          <gtp:ToolbarSeparator LabelSeparator="" ID="tsSimpleModel" runat="server">
                          </gtp:ToolbarSeparator>
                          <gtp:Button ID="btnSimpleModel" runat="server" Action="actSimpleModel" Text="简单模式" meta:resourcekey="res_56_btnSimpleModel">
                          </gtp:Button>
                        </Items>
                      </gtp:Toolbar>
                      <gtp:Toolbar runat="server" ButtonAlign="Left" ID="treeGrid_toolbar1" EnableOverflow="true">
                        <Items>
                          <gtp:SplitButton ID="sbtAppendProject" runat="server" Action="actAddStaticExtension" Text="新增方案" meta:resourcekey="res_57_sbtAppendProject" IconCls="ci-toolbar-GTP_add-png">
                            <Menu>
                              <gtp:Menu runat="server">
                                <Items>
                                  <gtp:MenuItem runat="server" ID="sbtAddProject_menu" Text="静态方案" Action="actAddStaticExtension" meta:resourcekey="res_58_sbtAddProject_menu" />
                                  <gtp:MenuItem runat="server" ID="sbtAddProject_menu1" Text="动态方案" Action="actAddExtension" meta:resourcekey="res_59_sbtAddProject_menu1" />
                                </Items>
                              </gtp:Menu>
                            </Menu>
                          </gtp:SplitButton>
                          <gtp:ToolbarSeparator LabelSeparator="" ID="tsAppend" runat="server">
                          </gtp:ToolbarSeparator>
                          <gtp:Button ID="btnAppendGroup" runat="server" Action="actAddGroup" Text="新增分组" meta:resourcekey="res_60_btnAppendGroup" IconCls="ci-toolbar-GTP_add-png">
                          </gtp:Button>
                          <gtp:ToolbarSeparator LabelSeparator="" ID="tsEdit" runat="server">
                          </gtp:ToolbarSeparator>
                          <gtp:Button ID="btnEditProjectGroup" runat="server" Action="actEditProjectGroup" Text="编辑" meta:resourcekey="res_61_btnEditProjectGroup" IconCls="ci-toolbar-GTP_accredit-png">
                          </gtp:Button>
                          <gtp:Button ID="btnDeleteProjectGroup" runat="server" Action="actDeleteProjectGroup" Text="删除" meta:resourcekey="res_62_btnDeleteProjectGroup" IconCls="ci-toolbar-GTP_delete-png">
                          </gtp:Button>
                        </Items>
                      </gtp:Toolbar>
                    </Items>
                  </gtp:Toolbar>
                </TopBar>
                <ColumnModel runat="server">
                  <Columns>
                    <gtp:TextColumn ColumnID="col_Alias" Align="Left" DataIndex="Alias" Header="别名" Width="150" Editable="false" meta:resourcekey="res_63_col_Alias">
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_Conditions" Align="Left" DataIndex="Conditions" Header="条件" Width="150" Editable="false" meta:resourcekey="res_64_col_Conditions">
                    </gtp:TextColumn>
                  </Columns>
                </ColumnModel>
                <View>
                  <gtp:TreeGridView runat="server">
                  </gtp:TreeGridView>
                </View>
                <Listeners>
                  <RowClick Handler="treeGrid_RowClick" />
                </Listeners>
              </gtp:TreeGridPanel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel3" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="350" meta:resourcekey="res_65_12" >
            <Items>
              <gtp:GridPanel ID="systemPropertyView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="Property" Title="系统字段" Height="0" AutoCellSizeMode="None" AutoScroll="true" HideGroupedColumn="true" meta:resourcekey="res_66_systemPropertyView">
                <ColumnModel runat="server">
                  <Columns>
                    <gtp:TextColumn ColumnID="col_Code" Align="Left" DataIndex="Code" Header="显示名称" Editable="false" meta:resourcekey="res_67_col_Code">
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_ID" Align="Left" DataIndex="ID" Header="属性编码" Width="120" Editable="false" meta:resourcekey="res_68_col_ID">
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_OType" Align="Left" DataIndex="OType" Header="类型" Editable="false" meta:resourcekey="res_69_col_OType">
                      <Renderer Handler="col_OType_Renderer" />
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
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel4" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_70_2" >
        <Items>
          <gtp:GridPanel ID="gridView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="DynaPropertyList" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_71_gridView">
            <TopBar>
              <gtp:Toolbar runat="server" ButtonAlign="Left" ID="gridView_toolbar" EnableOverflow="true">
                <Items>
                  <gtp:Button ID="btnBack" runat="server" Hidden="true" Action="actBack" Text="返回" meta:resourcekey="res_72_btnBack" IconCls="ci-toolbar-GTP_back-png">
                  </gtp:Button>
                  <gtp:Button ID="btnView" runat="server" Action="actView" Text="查看" meta:resourcekey="res_73_btnView" IconCls="ci-toolbar-GTP_view-png">
                  </gtp:Button>
                  <gtp:Button ID="btnAddProperty" runat="server" Action="actAddProperty" Text="新增字段" meta:resourcekey="res_74_btnAddProperty" IconCls="ci-toolbar-GTP_add-png">
                  </gtp:Button>
                  <gtp:Button ID="btnEditProperty" runat="server" Action="actEditProperty" Text="编辑字段" meta:resourcekey="res_75_btnEditProperty" IconCls="ci-toolbar-GTP_edit-png">
                  </gtp:Button>
                  <gtp:Button ID="btnDeleteProperty" runat="server" Action="actDeleteProperty" Text="删除字段" meta:resourcekey="res_76_btnDeleteProperty" IconCls="ci-toolbar-GTP_delete-png">
                  </gtp:Button>
                  <gtp:SplitButton ID="sbMoveUp" runat="server" Hidden="true" Action="actMoveUp" Text="上移" meta:resourcekey="res_77_sbMoveUp" IconCls="ci-toolbar-GTP_up-png">
                    <Menu>
                      <gtp:Menu runat="server">
                        <Items>
                          <gtp:MenuItem runat="server" ID="gridView_toolbar_sbMoveUp_menu" Text="上移一层" Action="actMoveUp" meta:resourcekey="res_78_gridView_toolbar_sbMoveUp_menu" />
                          <gtp:MenuItem runat="server" ID="gridView_toolbar_sbMoveUp_menu1" Text="置于顶层" Action="actMoveUp" meta:resourcekey="res_79_gridView_toolbar_sbMoveUp_menu1" />
                        </Items>
                      </gtp:Menu>
                    </Menu>
                  </gtp:SplitButton>
                  <gtp:SplitButton ID="sbMoveDown" runat="server" Hidden="true" Action="actMoveDown" Text="下移" meta:resourcekey="res_80_sbMoveDown" IconCls="ci-toolbar-GTP_down-png">
                    <Menu>
                      <gtp:Menu runat="server">
                        <Items>
                          <gtp:MenuItem runat="server" ID="gridView_toolbar_sbMoveDown_menu" Text="下移一层" Action="actMoveDown" meta:resourcekey="res_81_gridView_toolbar_sbMoveDown_menu" />
                          <gtp:MenuItem runat="server" ID="gridView_toolbar_sbMoveDown_menu1" Text="置于底层" Action="actMoveDown" meta:resourcekey="res_82_gridView_toolbar_sbMoveDown_menu1" />
                        </Items>
                      </gtp:Menu>
                    </Menu>
                  </gtp:SplitButton>
                  <gtp:Button ID="btnPMoveUp" runat="server" Action="actMoveUp" Text="上移" meta:resourcekey="res_83_btnPMoveUp" IconCls="ci-toolbar-GTP_up-png">
                  </gtp:Button>
                  <gtp:Button ID="btnPMoveDown" runat="server" Action="actMoveDown" Text="下移" meta:resourcekey="res_84_btnPMoveDown" IconCls="ci-toolbar-GTP_down-png">
                  </gtp:Button>
                  <gtp:Button ID="btnSetReferenceInfo" runat="server" Hidden="true" Action="actSetReferenceInfo" Text="设置参照" meta:resourcekey="res_85_btnSetReferenceInfo" IconCls="ci-toolbar-GTP_addchild-png">
                  </gtp:Button>
                  <gtp:Button ID="btnRemoveReference" runat="server" Hidden="true" Action="actRemoveReference" Text="取消参照" meta:resourcekey="res_86_btnRemoveReference" IconCls="ci-toolbar-GTP_decline-png">
                  </gtp:Button>
                  <gtp:Button ID="btnSetEnable" runat="server" Action="actEnable" Text="启用" meta:resourcekey="res_87_btnSetEnable" IconCls="ci-toolbar-GTP_enabled-png">
                  </gtp:Button>
                  <gtp:Button ID="btnSetDisable" runat="server" Action="actDisable" Text="停用" meta:resourcekey="res_88_btnSetDisable" IconCls="ci-toolbar-GTP_disable-png">
                  </gtp:Button>
                </Items>
              </gtp:Toolbar>
            </TopBar>
            <ColumnModel runat="server">
              <Columns>
                <gtp:CheckColumn ColumnID="col_IsEnable" Align="Left" DataIndex="IsEnable" Header="启用" Width="50" Editable="false" meta:resourcekey="res_89_col_IsEnable">
                  <Renderer Handler="col_IsEnable_Renderer" />
                </gtp:CheckColumn>
                <gtp:TextColumn ColumnID="col_PropertyName" Align="Left" DataIndex="PropertyName" Header="属性编码" Width="150" Editable="false" meta:resourcekey="res_90_col_PropertyName">
                  <Renderer Handler="col_PropertyName_Renderer" />
                </gtp:TextColumn>
                <gtp:I18nColumn ColumnID="col_PropertyAlias" Align="Left" DataIndex="PropertyAlias" Header="显示名称" Width="150" Editable="false" meta:resourcekey="res_91_col_PropertyAlias">
                </gtp:I18nColumn>
                <gtp:TextColumn ColumnID="col_DataType" Align="Left" DataIndex="DataType" Header="数据类型" Width="70" Editable="false" meta:resourcekey="res_92_col_DataType">
                  <Renderer Handler="col_DataType_Renderer" />
                </gtp:TextColumn>
                <gtp:TextColumn ColumnID="col_GroupName" Align="Left" DataIndex="DynamicGroupDefinition.GroupAlias" Header="所属分组" Width="120" Editable="false" meta:resourcekey="res_93_col_GroupName">
                </gtp:TextColumn>
                <gtp:CheckColumn ColumnID="col_IsRef" Align="Left" DataIndex="IsRef" Header="参照" Width="50" Editable="false" meta:resourcekey="res_94_col_IsRef">
                </gtp:CheckColumn>
                <gtp:CheckColumn ColumnID="col_IsNullable" Align="Left" DataIndex="NotNullable" Header="必填" Width="50" Editable="false" meta:resourcekey="res_95_col_IsNullable">
                </gtp:CheckColumn>
                <gtp:CheckColumn ColumnID="col_IsReadOnly" Align="Left" DataIndex="IsReadOnly" Header="只读" Width="50" Editable="false" meta:resourcekey="res_96_col_IsReadOnly">
                </gtp:CheckColumn>
                <gtp:CheckColumn ColumnID="col_IsHideComponent" Align="Center" DataIndex="IsHideComponent" Header="隐藏控件" Width="74" Editable="false" meta:resourcekey="res_97_col_IsHideComponent">
                </gtp:CheckColumn>
                <gtp:CheckColumn ColumnID="col_IsQuery" Align="Left" DataIndex="IsQuery" Header="列表显示" Width="70" Editable="false" meta:resourcekey="res_98_col_IsQuery">
                </gtp:CheckColumn>
                <gtp:CheckColumn ColumnID="col_IsFilter" Align="Left" DataIndex="IsFilter" Header="可过滤" Width="50" Editable="false" meta:resourcekey="res_99_col_IsFilter">
                </gtp:CheckColumn>
                <gtp:CheckColumn ColumnID="col_IsOrder" Align="Left" DataIndex="IsOrder" Header="可排序" Width="50" Editable="false" meta:resourcekey="res_100_col_IsOrder">
                </gtp:CheckColumn>
                <gtp:NumberColumn ColumnID="col_RowSpan" Align="Right" DataIndex="RowSpan" Header="行跨度" Width="50" Editable="false" Format="0" meta:resourcekey="res_101_col_RowSpan">
                </gtp:NumberColumn>
                <gtp:NumberColumn ColumnID="col_ColumnSpan" Align="Right" DataIndex="ColumnSpan" Header="列跨度" Width="50" Editable="false" Format="0" meta:resourcekey="res_102_col_ColumnSpan">
                </gtp:NumberColumn>
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
  <gtp:Window runat="server" ID="windowView" AutoRender="false" Title="属性" Hidden="true" Height="445" Width="670" Layout="FitLayout" Resizable="false" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_103_windowView"  >
    <Items>
      <gtp:Panel runat="server" ID="containerView" AutoRender="false" Layout="border" meta:resourcekey="res_104_containerView">
        <Items>
          <gtp:Panel ID="layoutPanel5" runat="server" Header="false" Title="" Region="Center" Layout="border" Border="true" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false">
            <Items>
              <gtp:Panel ID="layoutPanel6" runat="server" Header="false" Title="" Region="North" Layout="border" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="240">
                <Items>
                  <gtp:Panel ID="layoutPanel7" runat="server" Header="false" Title="" Region="Center" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="105" meta:resourcekey="res_105_111">
                    <Items>
                      <gtp:FormPanel ID="baseEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:10px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Height="125" Border="false" meta:resourcekey="res_106_baseEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="2" ColumnWidths="[205,205]" MaxColumnWidths="[205,205]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:TextField DataIndex="PropertyAlias" ID="Efd_PropertyAlias" runat="server" FieldLabel="显示名称" LabelWidth="75" AllowBlank="false" meta:resourcekey="res_107_Efd_PropertyAlias">
                          </gtp:TextField>
                          <gtp:TextField DataIndex="PropertyName" ID="Efd_PropertyName" runat="server" FieldLabel="属性编码" LabelWidth="75" AllowBlank="false" MaxLength="25" meta:resourcekey="res_108_Efd_PropertyName">
                          </gtp:TextField>
                          <gtp:ComboBox DataIndex="DataType" ID="Efd_DataType" runat="server" FieldLabel="数据类型" LabelWidth="75" AllowBlank="false" Editable="false" meta:resourcekey="res_109_Efd_DataType">
                            <Items>
                              <gtp:ListItem Text="文本" Value="string" meta:resourcekey="res_110_listItem" />
                              <gtp:ListItem Text="整数" Value="long" meta:resourcekey="res_111_listItem1" />
                              <gtp:ListItem Text="小数" Value="decimal" meta:resourcekey="res_112_listItem2" />
                              <gtp:ListItem Text="是否" Value="boolean" meta:resourcekey="res_113_listItem3" />
                              <gtp:ListItem Text="日期" Value="datetime" meta:resourcekey="res_114_listItem4" />
                              <gtp:ListItem Text="字典" Value="datadict" meta:resourcekey="res_115_listItem5" />
                            </Items>
                            <Listeners>
                              <Select Handler="Efd_DataType_Select" />
                            </Listeners>
                          </gtp:ComboBox>
                          <gtp:ComboBox DataIndex="GroupId" ID="Efd_GroupId" runat="server" FieldLabel="分组名称" LabelWidth="75" AllowBlank="false" Editable="false" meta:resourcekey="res_116_Efd_GroupId">
                            <Listeners>
                              <Select Handler="Efd_GroupId_Select" />
                            </Listeners>
                          </gtp:ComboBox>
                        </Items>
                      </gtp:FormPanel>
                    </Items>
                  </gtp:Panel>
                  <gtp:Panel ID="layoutPanel8" runat="server" Header="false" Title="" Region="South" Layout="card" ActiveIndex="0" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="140" Width="388" meta:resourcekey="res_117_112">
                    <Items>
                      <gtp:FormPanel ID="stringEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:25.0px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Height="50" Border="false" meta:resourcekey="res_118_stringEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="1" ColumnWidths="[330]" MaxColumnWidths="[330]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:NumberField DataIndex="Length" ID="Efd_Length" runat="server" FieldLabel="长度" LabelWidth="75" MaxLength="10" MaxValue="4000" MinValue="10" AllowDecimals="false" AllowNegative="false" meta:resourcekey="res_119_Efd_Length">
                          </gtp:NumberField>
                          <gtp:CheckBox DataIndex="IsMulti" ID="Efd_IsMulti" runat="server" FieldLabel="多行文本" LabelWidth="75" meta:resourcekey="res_120_Efd_IsMulti">
                          </gtp:CheckBox>
                        </Items>
                      </gtp:FormPanel>
                      <gtp:FormPanel ID="longEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:25px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="0" LabelAlign="Left" Height="60" Border="false" meta:resourcekey="res_121_longEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="2" ColumnWidths="[165,165]" MaxColumnWidths="[165,165]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:TextField DataIndex="MinNumber" ID="Efd_MinLong" runat="server" FieldLabel="最小值" LabelWidth="60" MaxLength="17" meta:resourcekey="res_122_Efd_MinLong">
                          </gtp:TextField>
                          <gtp:TextField DataIndex="MaxNumber" ID="Efd_MaxLong" runat="server" FieldLabel="最大值" LabelWidth="60" MaxLength="17" meta:resourcekey="res_123_Efd_MaxLong">
                          </gtp:TextField>
                          <gtp:CheckBox DataIndex="UseThousands" LabelSeparator="&amp;nbsp;" ID="Efd_UseThousandsLong" runat="server" FieldLabel="显示千分位" LabelWidth="50" HideLabel="true" BoxLabel="显示千分位" meta:resourcekey="res_124_Efd_UseThousandsLong">
                          </gtp:CheckBox>
                          <gtp:Label ID="longEntityView_category_R2C2" runat="server" meta:resourcekey="res_125_longEntityView_category_R2C2">
                          </gtp:Label>
                          <gtp:CheckBox DataIndex="AllowNegative" LabelSeparator="&amp;nbsp;" ID="Efd_AllowNegativeLong" runat="server" FieldLabel="允许负数" LabelWidth="50" HideLabel="true" BoxLabel="允许负数" meta:resourcekey="res_126_Efd_AllowNegativeLong">
                          </gtp:CheckBox>
                          <gtp:Label ID="longEntityView_category_R3C2" runat="server" meta:resourcekey="res_127_longEntityView_category_R3C2">
                          </gtp:Label>
                        </Items>
                      </gtp:FormPanel>
                      <gtp:FormPanel ID="decimalEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:25px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="75" LabelAlign="Left" Height="60" Border="false" meta:resourcekey="res_128_decimalEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="2" ColumnWidths="[165,165]" MaxColumnWidths="[150,165]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:NumberField DataIndex="Scale" ID="Efd_Scale" runat="server" FieldLabel="小数位数" LabelWidth="65" MaxLength="10" MaxValue="8" MinValue="0" AllowDecimals="false" AllowNegative="false" DecimalPrecision="0" meta:resourcekey="res_129_Efd_Scale">
                          </gtp:NumberField>
                          <gtp:NumberField DataIndex="DisplayDecimalPrecision" ID="Efd_DisplayDecimalPrecision" runat="server" Style="text-align:right" ReadOnly="true" FieldLabel="显示位数" LabelWidth="70" MaxLength="10" meta:resourcekey="res_130_Efd_DisplayDecimalPrecision">
                          </gtp:NumberField>
                          <gtp:TextField DataIndex="MinNumber" ID="Efd_MinDecimal" runat="server" FieldLabel="最小值" LabelWidth="65" MaxLength="27" meta:resourcekey="res_131_Efd_MinDecimal">
                          </gtp:TextField>
                          <gtp:TextField DataIndex="MaxNumber" ID="Efd_MaxDecimal" runat="server" FieldLabel="最大值" LabelWidth="70" MaxLength="27" meta:resourcekey="res_132_Efd_MaxDecimal">
                          </gtp:TextField>
                          <gtp:ComboBox DataIndex="MoneySymbolic" ID="Efd_MoneySymbolic" runat="server" FieldLabel="货币符号" LabelWidth="65" meta:resourcekey="res_133_Efd_MoneySymbolic">
                            <Items>
                              <gtp:ListItem Text="¥" Value="¥" meta:resourcekey="res_134_listItem" />
                              <gtp:ListItem Text="$" Value="$" meta:resourcekey="res_135_listItem1" />
                              <gtp:ListItem Text="£" Value="£" meta:resourcekey="res_136_listItem2" />
                              <gtp:ListItem Text="€" Value="€" meta:resourcekey="res_137_listItem3" />
                            </Items>
                          </gtp:ComboBox>
                          <gtp:CheckBox DataIndex="IsShowPad" LabelSeparator="&amp;nbsp;" ID="Efd_IsShowPad" runat="server" FieldLabel="末位补零" LabelWidth="70" HideLabel="true" BoxLabel="末位补零" meta:resourcekey="res_138_Efd_IsShowPad">
                          </gtp:CheckBox>
                          <gtp:CheckBox DataIndex="AllowNegative" LabelSeparator="&amp;nbsp;" ID="Efd_AllowNegativeDecimal" runat="server" FieldLabel="允许负数" LabelWidth="65" HideLabel="true" BoxLabel="允许负数" meta:resourcekey="res_139_Efd_AllowNegativeDecimal">
                          </gtp:CheckBox>
                          <gtp:CheckBox DataIndex="UseThousands" LabelSeparator="&amp;nbsp;" ID="Efd_UseThousandsDecimal" runat="server" FieldLabel="显示千分位" LabelWidth="70" HideLabel="true" BoxLabel="显示千分位" meta:resourcekey="res_140_Efd_UseThousandsDecimal">
                          </gtp:CheckBox>
                        </Items>
                      </gtp:FormPanel>
                      <gtp:FormPanel ID="boolEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:25px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Height="1" Border="false" meta:resourcekey="res_141_boolEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="1" ColumnWidths="[330]" MaxColumnWidths="[330]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                        </Items>
                      </gtp:FormPanel>
                      <gtp:FormPanel ID="dateEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:25px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="75" LabelAlign="Left" Height="40" Border="false" meta:resourcekey="res_142_dateEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="1" ColumnWidths="[330]" MaxColumnWidths="[330]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:ComboBox DataIndex="DateFormat" ID="Efd_DateFormat" runat="server" FieldLabel="日期格式" LabelWidth="75" meta:resourcekey="res_143_Efd_DateFormat">
                            <Items>
                              <gtp:ListItem Text="Y-n-j" Value="Y-n-j" meta:resourcekey="res_144_listItem" />
                              <gtp:ListItem Text="Y-m-d" Value="Y-m-d" meta:resourcekey="res_145_listItem1" />
                              <gtp:ListItem Text="m/d/Y" Value="m/d/Y" meta:resourcekey="res_146_listItem2" />
                              <gtp:ListItem Text="n/j/Y" Value="n/j/Y" meta:resourcekey="res_147_listItem3" />
                              <gtp:ListItem Text="Y年m月d日" Value="Y年m月d日" meta:resourcekey="res_148_listItem4" />
                              <gtp:ListItem Text="Y年n月j日" Value="Y年n月j日" meta:resourcekey="res_149_listItem5" />
                              <gtp:ListItem Text="Y-m-d (星期l)" Value="Y-m-d(星期l)" meta:resourcekey="res_150_listItem6" />
                              <gtp:ListItem Text="Y年m月d日 H时i分" Value="Y年m月d日 H时i分" meta:resourcekey="res_151_listItem7" />
                              <gtp:ListItem Text="Y年m月d日 H时i分s秒" Value="Y年m月d日 H时i分s秒" meta:resourcekey="res_152_listItem8" />
                              <gtp:ListItem Text="j日G时" Value="j日G时" meta:resourcekey="res_153_listItem9" />
                              <gtp:ListItem Text="H:i" Value="H:i" meta:resourcekey="res_154_listItem11" />
                              <gtp:ListItem Text="H:i:s" Value="H:i:s" meta:resourcekey="res_155_listItem12" />
                              <gtp:ListItem Text="H时i分" Value="H时i分" meta:resourcekey="res_156_listItem13" />
                            </Items>
                          </gtp:ComboBox>
                        </Items>
                      </gtp:FormPanel>
                      <gtp:FormPanel ID="dictEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:25px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="75" LabelAlign="Left" Height="30" Border="false" meta:resourcekey="res_157_dictEntityView">
                        <LayoutConfig>
                          <gtp:TableLayoutConfig Columns="1" ColumnWidths="[330]" MaxColumnWidths="[330]" MonitorResize="True">
                          </gtp:TableLayoutConfig>
                        </LayoutConfig>
                        <Items>
                          <gtp:LookupField RefPage="/GTP/AppFrameV2/DynaBizComp/DynaDictLookUpPage/DynaDictLookUpPage.aspx" DataIndex="TypeAlias" ID="Efd_TypeAlias" runat="server" FieldLabel="对应字典" LabelWidth="75" AllowBlank="false" MaxLength="255" meta:resourcekey="res_158_Efd_TypeAlias">
                            <InputMappings>
                              <gtp:LookupInputMapping Target="FullTypeName" Source="OutEntity.DictFullCode" IsCollection="False" Type="Entity" />
                              <gtp:LookupInputMapping Target="TypeAlias" Source="OutEntity.DictCName" IsCollection="False" Type="Entity" />
                            </InputMappings>
                            <Features DialogHeight="370" DialogWidth="610" />
                            <Listeners>
                              <AfterLookup Handler="Efd_TypeAlias_AfterLookup" />
                            </Listeners>
                          </gtp:LookupField>
                          <gtp:CheckBox DataIndex="IsCollection" LabelSeparator="&amp;nbsp;" ID="Efd_IsCollection" runat="server" FieldLabel="允许多选" LabelWidth="75" meta:resourcekey="res_159_Efd_IsCollection">
                          </gtp:CheckBox>
                          <gtp:CheckBox DataIndex="IsEditable" LabelSeparator="&amp;nbsp;" ID="Efd_IsEditable" runat="server" FieldLabel="允许编辑" LabelWidth="75" meta:resourcekey="res_160_Efd_IsEditable">
                          </gtp:CheckBox>
                        </Items>
                      </gtp:FormPanel>
                    </Items>
                  </gtp:Panel>
                </Items>
              </gtp:Panel>
              <gtp:Panel ID="layoutPanel9" runat="server" Header="false" Title="" Region="Center" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_161_12">
                <Items>
                  <gtp:FormPanel ID="formulaEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:13.0px;padding-right:10px;&#xD;&#xA;  padding-top:25.0px;padding-bottom:10px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_162_formulaEntityView">
                    <LayoutConfig>
                      <gtp:TableLayoutConfig Columns="2" ColumnWidths="[320,80]" MaxColumnWidths="[320,80]" MonitorResize="True">
                      </gtp:TableLayoutConfig>
                    </LayoutConfig>
                    <Items>
                      <gtp:ComboBox DataIndex="DefaultValue" ID="Efd_DefaultValue" runat="server" FieldLabel="默认值" LabelWidth="75" meta:resourcekey="res_163_Efd_DefaultValue">
                      </gtp:ComboBox>
                      <gtp:Button ID="Efd_btnDefaultValue" runat="server" Action="actSetDefaultValue" Text="高级" meta:resourcekey="res_164_Efd_btnDefaultValue">
                      </gtp:Button>
                      <gtp:ComboBox DataIndex="FormulaValue" ID="Efd_FormulaValue" runat="server" FieldLabel="计算表达式" LabelWidth="75" meta:resourcekey="res_165_Efd_FormulaValue">
                      </gtp:ComboBox>
                      <gtp:Button ID="Efd_btnFormulaValue" runat="server" Action="actSetFormulaValue" Text="高级" meta:resourcekey="res_166_Efd_btnFormulaValue">
                      </gtp:Button>
                    </Items>
                  </gtp:FormPanel>
                </Items>
              </gtp:Panel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel10" runat="server" Header="false" Title="" Region="East" Border="true" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="315" Width="230" meta:resourcekey="res_167_2">
            <Items>
              <gtp:FormPanel ID="styleEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:15px;padding-right:10px;&#xD;&#xA;  padding-top:0px;padding-bottom:0px" DataSource="DynaPropertyEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_168_styleEntityView">
                <LayoutConfig>
                  <gtp:TableLayoutConfig Columns="2" ColumnWidths="[25,175]" MaxColumnWidths="[25,250]" MonitorResize="False">
                  </gtp:TableLayoutConfig>
                </LayoutConfig>
                <Items>
                  <gtp:Label LabelSeparator="&amp;nbsp;" ID="styleEntityView_category_R1C1_" runat="server" ColSpan="2" FieldLabel="表单设置" LabelWidth="75" HideLabel="true" Text="表单设置" meta:resourcekey="res_169_styleEntityView_category_R1C1_" TextStyle="font-size:13px;font-weight: bold;">
                  </gtp:Label>
                  <gtp:CheckBox DataIndex="IsManualField" LabelSeparator="&amp;nbsp;" ID="Efd_IsManualField" runat="server" ColSpan="2" FieldLabel="人工录入" LabelWidth="1" HideLabel="true" BoxLabel="人工录入" meta:resourcekey="res_170_Efd_IsManualField">
                  </gtp:CheckBox>
                  <gtp:Label ID="styleEntityView_category_R3C1" runat="server" meta:resourcekey="res_171_styleEntityView_category_R3C1">
                  </gtp:Label>
                  <gtp:CheckBox DataIndex="IsNullable" LabelSeparator="&amp;nbsp;" ID="Efd_IsNullable" runat="server" FieldLabel="允许为空" LabelWidth="1" HideLabel="true" BoxLabel="允许为空" meta:resourcekey="res_172_Efd_IsNullable">
                  </gtp:CheckBox>
                  <gtp:CheckBox DataIndex="IsReadOnly" LabelSeparator="&amp;nbsp;" ID="Efd_IsReadOnly" runat="server" ColSpan="2" FieldLabel="只读" LabelWidth="1" HideLabel="true" BoxLabel="只读" meta:resourcekey="res_173_Efd_IsReadOnly">
                  </gtp:CheckBox>
                  <gtp:CheckBox DataIndex="IsHideComponent" LabelSeparator="&amp;nbsp;" ID="Efd_IsHideComponent" runat="server" ColSpan="2" FieldLabel="隐藏控件" LabelWidth="1" HideLabel="true" BoxLabel="隐藏控件" meta:resourcekey="res_174_Efd_IsHideComponent">
                  </gtp:CheckBox>
                  <gtp:NumberField DataIndex="RowSpan" ID="Efd_RowSpan" runat="server" ColSpan="2" FieldLabel="行跨度" LabelWidth="50" MaxLength="10" AllowDecimals="false" AllowNegative="false" meta:resourcekey="res_175_Efd_RowSpan">
                  </gtp:NumberField>
                  <gtp:NumberField DataIndex="ColumnSpan" ID="Efd_ColumnSpan" runat="server" ColSpan="2" FieldLabel="列跨度" LabelWidth="50" MaxLength="10" AllowDecimals="false" AllowNegative="false" meta:resourcekey="res_176_Efd_ColumnSpan">
                  </gtp:NumberField>
                  <gtp:Label LabelSeparator="&amp;nbsp;" ID="styleEntityView_category_R7C1_1" runat="server" ColSpan="2" FieldLabel="列表设置" HideLabel="true" Text="列表设置" meta:resourcekey="res_177_styleEntityView_category_R7C1_1" TextStyle="font-size:13px;font-weight: bold;">
                  </gtp:Label>
                  <gtp:CheckBox DataIndex="IsQuery" ID="Efd_IsQuery" runat="server" ColSpan="2" FieldLabel="列表显示" LabelWidth="75" HideLabel="true" BoxLabel="列表显示" meta:resourcekey="res_178_Efd_IsQuery">
                  </gtp:CheckBox>
                  <gtp:Label LabelSeparator="&amp;nbsp;" ID="styleEntityView_category_R6C1_" runat="server" meta:resourcekey="res_179_styleEntityView_category_R6C1_">
                  </gtp:Label>
                  <gtp:NumberField DataIndex="GridColWidth" ID="Efd_GridColWidth" runat="server" FieldLabel="列表列宽" LabelWidth="60" MaxLength="19" MaxValue="1000" MinValue="40" AllowDecimals="false" AllowNegative="false" meta:resourcekey="res_180_Efd_GridColWidth">
                  </gtp:NumberField>
                  <gtp:CheckBox DataIndex="FuzzyField" ID="Efd_FuzzyField" runat="server" ColSpan="2" FieldLabel="支持快速查询" LabelWidth="75" HideLabel="true" BoxLabel="快速查询" meta:resourcekey="res_181_Efd_FuzzyField">
                  </gtp:CheckBox>
                  <gtp:CheckBox DataIndex="IsFilter" ID="Efd_IsFilter" runat="server" ColSpan="2" FieldLabel="支持过滤" LabelWidth="75" HideLabel="true" BoxLabel="支持过滤" meta:resourcekey="res_182_Efd_IsFilter">
                  </gtp:CheckBox>
                  <gtp:CheckBox DataIndex="IsOrder" ID="Efd_IsOrder" runat="server" ColSpan="2" FieldLabel="支持排序" LabelWidth="75" HideLabel="true" BoxLabel="支持排序" meta:resourcekey="res_183_Efd_IsOrder">
                  </gtp:CheckBox>
                </Items>
              </gtp:FormPanel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel11" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="35" meta:resourcekey="res_184_3">
            <Items>
              <gtp:ToolbarPanel ID="toolbarView" AutoRender="false" runat="server">
                <Items>
                  <gtp:CommandToolbar runat="server" ID="entityView_toolbar" ButtonAlign="Right">
                    <Items>
                      <gtp:Button ID="btnOk" runat="server" Hidden="true" Width="60" Action="actOk" Text="确定" Cls="g-btn-recommend" meta:resourcekey="res_185_btnOk">
                      </gtp:Button>
                      <gtp:Button ID="btnSaveProperty" runat="server" Width="60" Action="actSaveProperty" Text="保存" Cls="g-btn-recommend" meta:resourcekey="res_186_btnSaveProperty">
                      </gtp:Button>
                      <gtp:Button ID="btnSavePropertys" runat="server" Width="60" Action="actSavePropertys" Text="保存并继续" meta:resourcekey="res_187_btnSavePropertys">
                      </gtp:Button>
                      <gtp:Button ID="btnCancelProperty" runat="server" Width="60" Action="actCancelProperty" Text="取消" meta:resourcekey="res_188_btnCancelProperty">
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
  <gtp:Window runat="server" ID="windowView1" AutoRender="false" Title="分组" Hidden="true" Height="150" Width="300" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_189_windowView1"  >
    <Items>
      <gtp:FormPanel ID="groupEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:10px;padding-bottom:10px" DataSource="DynaGroupEdit" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_190_groupEntityView">
        <BottomBar>
          <gtp:CommandToolbar runat="server" ID="groupEntityView_toolbar" ButtonAlign="Right">
            <Items>
              <gtp:Button ID="btnSaveGroup" runat="server" Action="actSaveGroup" Text="确定" meta:resourcekey="res_191_btnSaveGroup">
              </gtp:Button>
              <gtp:Button ID="btnCancelGroup" runat="server" Action="actCancelGroup" Text="取消" meta:resourcekey="res_192_btnCancelGroup">
              </gtp:Button>
              <gtp:ToolbarSeparator LabelSeparator="" ID="tsGroup" runat="server">
              </gtp:ToolbarSeparator>
            </Items>
          </gtp:CommandToolbar>
        </BottomBar>
        <LayoutConfig>
          <gtp:TableLayoutConfig Columns="1" ColumnWidths="[280]" MaxColumnWidths="[300]" MonitorResize="False">
          </gtp:TableLayoutConfig>
        </LayoutConfig>
        <Items>
          <gtp:TextField DataIndex="GroupAlias" ID="Efd_GroupAlias" runat="server" FieldLabel="分组名称" MaxLength="255" meta:resourcekey="res_193_Efd_GroupAlias">
          </gtp:TextField>
        </Items>
      </gtp:FormPanel>
    </Items>
  </gtp:Window>
  <gtp:Window runat="server" ID="windowView2" AutoRender="false" Hidden="true" Height="460" Width="440" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_194_windowView2"  >
    <Items>
      <gtp:Panel runat="server" ID="containerView1" AutoRender="false" Width="440" Layout="border" meta:resourcekey="res_195_containerView1">
        <Items>
          <gtp:Panel ID="layoutPanel12" runat="server" Header="false" Title="" Region="North" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="150" meta:resourcekey="res_196_1">
            <Items>
              <gtp:FormPanel ID="ProjectEntityView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:10px;padding-bottom:10px" DataSource="DynamicExtensionDefinition" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_197_ProjectEntityView">
                <LayoutConfig>
                  <gtp:TableLayoutConfig Columns="1" ColumnWidths="[400]" MaxColumnWidths="[300]" MonitorResize="True">
                  </gtp:TableLayoutConfig>
                </LayoutConfig>
                <Items>
                  <gtp:TextField DataIndex="ExtensionName" ID="Efd_ExtensionName" runat="server" FieldLabel="方案名称" LabelWidth="75" AllowBlank="false" MaxLength="255" meta:resourcekey="res_198_Efd_ExtensionName">
                  </gtp:TextField>
                  <gtp:TextArea DataIndex="Remark" ID="Efd_Remark" runat="server" FieldLabel="备注" LabelWidth="75" meta:resourcekey="res_199_Efd_Remark">
                  </gtp:TextArea>
                </Items>
              </gtp:FormPanel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel13" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_200_2">
            <Items>
              <gtp:GridPanel ID="conditionsView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" AutoRender="false" runat="server" DataSource="DynamicExtensionDefinition.DynamicExtensionConditions" Title="生效条件" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_201_conditionsView">
                <TopBar>
                  <gtp:Toolbar runat="server" ButtonAlign="Left" ID="conditionsView_toolbar" EnableOverflow="true">
                    <Items>
                      <gtp:Button ID="btnAddCondition" runat="server" Action="actAddCondition" Text="添加" meta:resourcekey="res_202_btnAddCondition" IconCls="ci-toolbar-GTP_add-png">
                      </gtp:Button>
                      <gtp:Button ID="btnRemoveCondition" runat="server" Action="actRemoveCondition" Text="移除" meta:resourcekey="res_203_btnRemoveCondition" IconCls="ci-toolbar-GTP_delete-png">
                      </gtp:Button>
                    </Items>
                  </gtp:Toolbar>
                </TopBar>
                <ColumnModel runat="server">
                  <Columns>
                    <gtp:TextColumn ColumnID="col_PropertyAlias" Align="Left" DataIndex="PropertyAlias" Header="属性名称" Width="150" meta:resourcekey="res_204_col_PropertyAlias">
                      <Editor>
                        <gtp:CustomTriggerField DataIndex="PropertyAlias" ID="gridView3_col_PropertyAlias_editor" runat="server" meta:resourcekey="res_205_gridView3_col_PropertyAlias_editor">
                          <Listeners>
                            <TriggerClick Handler="gridView3_col_PropertyAlias_editor_TriggerClick" />
                          </Listeners>
                        </gtp:CustomTriggerField>
                      </Editor>
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_OperatorType" Align="Left" DataIndex="OperatorType" Header="运算符" meta:resourcekey="res_206_col_OperatorType">
                      <Editor>
                        <gtp:ComboBox DataIndex="OperatorType" ID="gridView3_col_OperatorType_editor" runat="server" meta:resourcekey="res_207_gridView3_col_OperatorType_editor">
                        </gtp:ComboBox>
                      </Editor>
                      <Renderer Handler="col_OperatorType_Renderer" />
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_PropertyValue" Align="Left" DataIndex="PropertyValue" Header="值" Width="150" meta:resourcekey="res_208_col_PropertyValue">
                      <Editor>
                        <gtp:TextField DataIndex="PropertyValue" ID="gridView3_col_PropertyValue_editor" runat="server" MaxLength="500" meta:resourcekey="res_209_gridView3_col_PropertyValue_editor">
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
          <gtp:Panel ID="layoutPanel14" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="35" meta:resourcekey="res_210_3">
            <Items>
              <gtp:ToolbarPanel ID="tbvProjectView" AutoRender="false" runat="server">
                <Items>
                  <gtp:CommandToolbar runat="server" ID="tbvProjectView_toolbar" ButtonAlign="Right">
                    <Items>
                      <gtp:Button ID="btn_actSaveProject" runat="server" Action="actSaveProject" Text="保存" meta:resourcekey="res_211_btn_actSaveProject">
                      </gtp:Button>
                      <gtp:Button ID="btn_actCancelProject" runat="server" Action="actCancelProject" Text="取消" meta:resourcekey="res_212_btn_actCancelProject">
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
  <gtp:Window runat="server" ID="windowView3" AutoRender="false" Title="参照设置" Hidden="true" Height="375" Width="400" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_213_windowView3"  >
    <Items>
      <gtp:Panel runat="server" ID="containerView2" AutoRender="false" Layout="border" meta:resourcekey="res_214_containerView2">
        <Items>
          <gtp:Panel ID="layoutPanel15" runat="server" Header="false" Title="" Region="North" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="120" meta:resourcekey="res_215_1">
            <Items>
              <gtp:FormPanel ID="refObjectView" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:20.0px;padding-right:10px;&#xD;&#xA;  padding-top:20.0px;padding-bottom:10px" DataSource="DynamicReferenceObject" LabelWidth="60" LabelAlign="Left" Border="false" meta:resourcekey="res_216_refObjectView">
                <LayoutConfig>
                  <gtp:TableLayoutConfig Columns="1" ColumnWidths="[300]" MaxColumnWidths="[300]" MonitorResize="True">
                  </gtp:TableLayoutConfig>
                </LayoutConfig>
                <Items>
                  <gtp:LookupField RefPage="/GTP/AppFrameV2/DynaBizComp/DynaRefLookupPage/DynaRefLookupPage.aspx" DataIndex="RefPageAlias" ID="Efd_RefPageAlias" runat="server" FieldLabel="参照页面" LabelWidth="75" meta:resourcekey="res_217_Efd_RefPageAlias">
                    <InputMappings>
                      <gtp:LookupInputMapping Target="RefPageName" Source="OutEntity.PName" IsCollection="False" Type="Entity" />
                      <gtp:LookupInputMapping Target="RefPageAlias" Source="OutEntity.PAlias" IsCollection="False" Type="Entity" />
                    </InputMappings>
                    <Features DialogHeight="450" DialogWidth="520" />
                    <Listeners>
                      <Change Handler="Efd_RefPageAlias_Change" />
                    </Listeners>
                  </gtp:LookupField>
                  <gtp:TextField DataIndex="RefRemark" ID="Efd_RefRemark" runat="server" FieldLabel="描述" LabelWidth="75" MaxLength="200" meta:resourcekey="res_218_Efd_RefRemark">
                  </gtp:TextField>
                  <gtp:CheckBox DataIndex="IsEditable" LabelSeparator="&amp;nbsp;" ID="Efd_IsEditable2" runat="server" FieldLabel="允许编辑" LabelWidth="75" meta:resourcekey="res_219_Efd_IsEditable2">
                  </gtp:CheckBox>
                </Items>
              </gtp:FormPanel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel16" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_220_2">
            <Items>
              <gtp:TabPanel runat="server" ID="tabView" AutoRender="false" DeferredRender="true" Plain="true" EnableTabScroll="true" Title="" meta:resourcekey="res_221_tabView">
                <Plugins>
                  <gtp:TabScrollerMenu runat="server" PageSize="50">
                  </gtp:TabScrollerMenu>
                </Plugins>
                <Items>
                  <gtp:Panel runat="server" ID="tabView_tab" Hidden="False" Title="属性映射" Layout="fit" Border="false" meta:resourcekey="res_222_tabView_tab">
                    <Items>
                      <gtp:GridPanel ID="refPropertyMapingView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" AutoRender="false" runat="server" DataSource="DynamicReferenceObject.PropertyMapping" Height="0" AutoCellSizeMode="None" AutoScroll="true" HideGroupedColumn="true" SelectMode="CheckBox" meta:resourcekey="res_223_refPropertyMapingView">
                        <TopBar>
                          <gtp:Toolbar runat="server" ButtonAlign="Left" ID="refPropertyMapingView_toolbar" EnableOverflow="true">
                            <Items>
                              <gtp:Button ID="btnAddPropertyMap" runat="server" Action="actAddProMaping" Text="添加映射" meta:resourcekey="res_224_btnAddPropertyMap" IconCls="ci-toolbar-GTP_add-png">
                              </gtp:Button>
                              <gtp:Button ID="btnRemoveMap" runat="server" Action="actRemoveProMapping" Text="移除映射" meta:resourcekey="res_225_btnRemoveMap" IconCls="ci-toolbar-GTP_delete-png">
                              </gtp:Button>
                            </Items>
                          </gtp:Toolbar>
                        </TopBar>
                        <ColumnModel runat="server">
                          <Columns>
                            <gtp:TextColumn ColumnID="col_PropertyAlias" Align="Left" DataIndex="Alias" Header="回填属性" Width="150" Editable="false" meta:resourcekey="res_226_col_PropertyAlias">
                            </gtp:TextColumn>
                            <gtp:TextColumn ColumnID="col_SourceName" Align="Left" DataIndex="SourceId" Header="对应参数" Width="150" meta:resourcekey="res_227_col_SourceName">
                              <Editor>
                                <gtp:ComboBox DataIndex="SourceId" ID="refPropertyMapingView_col_SourceName_editor" runat="server" meta:resourcekey="res_228_refPropertyMapingView_col_SourceName_editor">
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
                  <gtp:Panel runat="server" ID="tabView_tab1" Hidden="False" Title="参数设置" Layout="fit" Border="false" meta:resourcekey="res_229_tabView_tab1">
                    <Items>
                      <gtp:GridPanel ID="refPageParamView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" AutoRender="false" runat="server" DataSource="DynamicReferenceObject.PageParam" Height="0" AutoCellSizeMode="None" AutoScroll="true" HideGroupedColumn="true" SelectMode="CheckBox" meta:resourcekey="res_230_refPageParamView">
                        <TopBar>
                          <gtp:Toolbar runat="server" ButtonAlign="Left" ID="refPageParamView_toolbar" EnableOverflow="true">
                            <Items>
                              <gtp:Button ID="btnAddPageParam" runat="server" Action="actAddPageParam" Text="添加参数" meta:resourcekey="res_231_btnAddPageParam" IconCls="ci-toolbar-GTP_add-png">
                              </gtp:Button>
                              <gtp:Button ID="btnRemoveParam" runat="server" Action="actRemovePageParam" Text="移除参数" meta:resourcekey="res_232_btnRemoveParam" IconCls="ci-toolbar-GTP_delete-png">
                              </gtp:Button>
                            </Items>
                          </gtp:Toolbar>
                        </TopBar>
                        <ColumnModel runat="server">
                          <Columns>
                            <gtp:TextColumn ColumnID="col_ParamAlias" Align="Left" DataIndex="Alias" Header="参数" Width="150" Editable="false" meta:resourcekey="res_233_col_ParamAlias">
                            </gtp:TextColumn>
                            <gtp:TextColumn ColumnID="col_ParamValue" Align="Left" DataIndex="ParamValue" Header="参数值" Width="150" meta:resourcekey="res_234_col_ParamValue">
                              <Editor>
                                <gtp:TextField DataIndex="ParamValue" ID="refPageParamView_col_ParamValue_editor" runat="server" AllowBlank="false" meta:resourcekey="res_235_refPageParamView_col_ParamValue_editor">
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
          <gtp:Panel ID="layoutPanel17" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="35" meta:resourcekey="res_236_3">
            <Items>
              <gtp:ToolbarPanel ID="toolbarView1" AutoRender="false" runat="server">
                <Items>
                  <gtp:CommandToolbar runat="server" ID="toolbarView1_toolbar" ButtonAlign="Right">
                    <Items>
                      <gtp:Button ID="btn_actSaveReferenceInfo" runat="server" Action="actSaveReferenceInfo" Text="确定" meta:resourcekey="res_237_btn_actSaveReferenceInfo">
                      </gtp:Button>
                      <gtp:Button ID="btn_actCancelReference" runat="server" Action="actCancelReference" Text="取消" meta:resourcekey="res_238_btn_actCancelReference">
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
  <gtp:Window runat="server" ID="windowView4" AutoRender="false" Title="选择映射属性" Hidden="true" Height="330" Width="350" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_239_windowView4"  >
    <Items>
      <gtp:GridPanel ID="PropertySelectView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" AutoRender="false" runat="server" DataSource="PropertyList" Height="250" AutoCellSizeMode="None" Width="300" AutoScroll="true" HideGroupedColumn="true" SelectMode="CheckBox" meta:resourcekey="res_240_PropertySelectView">
        <BottomBar>
          <gtp:CommandToolbar runat="server" ID="PropertySelectView_toolbar" ButtonAlign="Right">
            <Items>
              <gtp:Button ID="btnSelect" runat="server" Action="actSelectProperties" Text="确定" meta:resourcekey="res_241_btnSelect">
              </gtp:Button>
              <gtp:Button ID="btnCancelSelect" runat="server" Action="actCancelSelect" Text="取消" meta:resourcekey="res_242_btnCancelSelect">
              </gtp:Button>
              <gtp:ToolbarSpacer LabelSeparator="" ID="tsSelect" runat="server" Width="10">
              </gtp:ToolbarSpacer>
            </Items>
          </gtp:CommandToolbar>
        </BottomBar>
        <ColumnModel runat="server">
          <Columns>
            <gtp:TextColumn ColumnID="col_PropertyAlias" Align="Left" DataIndex="PropertyAlias" Header="名称" Width="120" Editable="false" meta:resourcekey="res_243_col_PropertyAlias">
            </gtp:TextColumn>
            <gtp:TextColumn ColumnID="col_PropertyName" Align="Left" DataIndex="PropertyName" Header="编码" Width="180" Editable="false" meta:resourcekey="res_244_col_PropertyName">
              <Renderer Handler="col_PropertyName_Renderer" />
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
