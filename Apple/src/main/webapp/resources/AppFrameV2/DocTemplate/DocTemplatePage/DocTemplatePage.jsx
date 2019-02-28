<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_DocTemplatePage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.DocTemplate" InitScriptMode="Jsx" PageName="DocTemplatePage" BizComp="GTP.AppFrameV2.DocTemplate.DocTemplate" CustomIcons="['toolbar/GTP_search.png','toolbar/GTP_refresh.png','toolbar/GTP_up.png','toolbar/GTP_down.png','toolbar/GTP_upgrade.png','toolbar/GTP_degrade.png','toolbar/GTP_save.png','toolbar/GTP_giveup.png','toolbar/GTP_new.png','toolbar/GTP_addchild.png','toolbar/GTP_minus.png','toolbar/GTP_add.png','toolbar/GTP_filenew.png','toolbar/GTP_filesend.png','toolbar/GTP_delete.png','toolbar/GTP_download.png','toolbar/GTP_fileopen.png','toolbar/GTP_cancel.png','toolbar/GTP_saveas.png','tree/GTP_folder.png','toolbar/GTP_adoption.png','toolbar/GTP_disable.png','tree/GTP_folder.png','auth/GTP_bizform.png','toolbar/GTP_allunfold.png','toolbar/GTP_allfold.png']" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
    <ExtendData>
      <gtp:ExtendDataItem Key="BizComponent" Value="GTP.AppFrameV2.DocTemplate.DocTemplate" />
      <gtp:ExtendDataItem Key="S_NeedAuth" Value="true" />
    </ExtendData>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:Rules ID="Rules1" runat="server" >
    <Items>
      <gtp:ViewRule ID="viewRule_LeftTreeHaveData" runat="server" DataSource="LeftTreeQuery" Expression="Root().LeftTreeQuery.Count()&gt;0" meta:resourcekey="res_2_viewRule_LeftTreeHaveData" >
        <Items>
          <gtp:ViewRuleItem Component="actList" Type="ActionRule">
            <Targets>
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveUp" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveDown" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actUpGrade" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actDeGrade" />
              <gtp:ViewRuleItemTarget Name="actAdd" />
              <gtp:ViewRuleItemTarget Name="actAddRoot" />
            </Targets>
            <Properties>
              <gtp:ViewRuleItemProperty Name="Disabled" Value="false" />
            </Properties>
          </gtp:ViewRuleItem>
        </Items>
      </gtp:ViewRule>
      <gtp:ViewRule ID="viewRule_LeftTreeNoData" runat="server" DataSource="LeftTreeQuery" Expression="Root().LeftTreeQuery.Count()==0" meta:resourcekey="res_3_viewRule_LeftTreeNoData" >
        <Items>
          <gtp:ViewRuleItem Component="actList" Type="ActionRule">
            <Targets>
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveUp" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveDown" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actUpGrade" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actDeGrade" />
              <gtp:ViewRuleItemTarget Name="actAdd" />
              <gtp:ViewRuleItemTarget Name="actAddRoot" />
            </Targets>
            <Properties>
              <gtp:ViewRuleItemProperty Name="Disabled" Value="true" />
            </Properties>
          </gtp:ViewRuleItem>
        </Items>
      </gtp:ViewRule>
      <gtp:ViewRule ID="viewRule_RightTreeHaveData" runat="server" DataSource="RightTreeQuery" Expression="Root().RightTreeQuery.Count()&gt;0" meta:resourcekey="res_4_viewRule_RightTreeHaveData" >
        <Items>
          <gtp:ViewRuleItem Component="actList" Type="ActionRule">
            <Targets>
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveUp1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveDown1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actUpGrade1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actDeGrade1" />
              <gtp:ViewRuleItemTarget Name="actAddChild" />
              <gtp:ViewRuleItemTarget Name="actRemove" />
            </Targets>
            <Properties>
              <gtp:ViewRuleItemProperty Name="Disabled" Value="false" />
            </Properties>
          </gtp:ViewRuleItem>
        </Items>
      </gtp:ViewRule>
      <gtp:ViewRule ID="viewRule_RightTreeNoData" runat="server" DataSource="RightTreeQuery" Expression="Root().RightTreeQuery.Count()==0" meta:resourcekey="res_5_viewRule_RightTreeNoData" >
        <Items>
          <gtp:ViewRuleItem Component="actList" Type="ActionRule">
            <Targets>
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveUp1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveDown1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actUpGrade1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actDeGrade1" />
              <gtp:ViewRuleItemTarget Name="actAddChild" />
              <gtp:ViewRuleItemTarget Name="actRemove" />
            </Targets>
            <Properties>
              <gtp:ViewRuleItemProperty Name="Disabled" Value="true" />
            </Properties>
          </gtp:ViewRuleItem>
        </Items>
      </gtp:ViewRule>
      <gtp:ViewRule ID="viewRule_Update" runat="server" Disabled="true" DataSource="RightTreeQuery" meta:resourcekey="res_6_viewRule_Update" >
        <Items>
          <gtp:ViewRuleItem Component="actList" Type="ActionRule">
            <Targets>
              <gtp:ViewRuleItemTarget Name="actSave" />
              <gtp:ViewRuleItemTarget Name="actCancel" />
            </Targets>
            <Properties>
              <gtp:ViewRuleItemProperty Name="Disabled" Value="false" />
            </Properties>
          </gtp:ViewRuleItem>
          <gtp:ViewRuleItem Component="actList" Type="ActionRule">
            <Targets>
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveUp1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveDown1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actUpGrade1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actDeGrade1" />
            </Targets>
            <Properties>
              <gtp:ViewRuleItemProperty Name="Disabled" Value="true" />
            </Properties>
          </gtp:ViewRuleItem>
        </Items>
      </gtp:ViewRule>
      <gtp:ViewRule ID="viewRule_NoUpdate" runat="server" Disabled="true" DataSource="RightTreeQuery" meta:resourcekey="res_7_viewRule_NoUpdate" >
        <Items>
          <gtp:ViewRuleItem Component="actList" Type="ActionRule">
            <Targets>
              <gtp:ViewRuleItemTarget Name="actSave" />
              <gtp:ViewRuleItemTarget Name="actCancel" />
            </Targets>
            <Properties>
              <gtp:ViewRuleItemProperty Name="Disabled" Value="true" />
            </Properties>
          </gtp:ViewRuleItem>
          <gtp:ViewRuleItem Component="actList" Type="ActionRule">
            <Targets>
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveUp1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actMoveDown1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actUpGrade1" />
              <gtp:ViewRuleItemTarget Name="Ap_TreeGrid_actDeGrade1" />
            </Targets>
            <Properties>
              <gtp:ViewRuleItemProperty Name="Disabled" Value="false" />
            </Properties>
          </gtp:ViewRuleItem>
        </Items>
      </gtp:ViewRule>
      <gtp:ViewRule ID="viewRule_NewRowColor" runat="server" DataSource="RightTreeQuery" Expression="ID&lt;=0" meta:resourcekey="res_8_viewRule_NewRowColor" >
        <Items>
        </Items>
      </gtp:ViewRule>
    </Items>
  </gtp:Rules>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="RightTreeQuery" Alias="文档目录" Type="GTP.AppFrameV2.DocTemplate.DTFolderQuery">
        <CustomConfig>
          <gtp:ConfigItem Name="S_DataSourceAsEnity" Value="true" Mode="Value" />
        </CustomConfig>
        <Fields>
          <gtp:DataField Name="ID" Alias="ID" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="Code" Alias="编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FullCode" Alias="全编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsLeaf" Alias="是否叶子结点" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="JianPin" Alias="简拼" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="LastUpdateTime" Alias="最后修改时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="LastUpdateUser" Alias="最后修改人" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Level" Alias="级别" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="Name" Alias="名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="OrderNo" Alias="序列号" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="PID" Alias="父单据ID" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="PinYin" Alias="拼音" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="备注" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="C_ID" Alias="自定义C_ID" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="C_FullCode" Alias="自定义C_FullCode" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="D_DeptId" Alias="自定义D_DeptId" Type="Int">
            <CustomConfig>
              <gtp:ConfigItem Name="IsVisible" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="ID" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="D_FullDeptId" Alias="自定义D_FullDeptId" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="TreePropertyKey" Value="FullCode" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="ApplyRange" Alias="应用范围" Type="Auto">
            <CustomConfig>
              <gtp:ConfigItem Name="EnumId" Value="GTP.AppFrameV2.DocTemplate.OwnerRange" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="CreatTime" Alias="创建时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="ModuleCode" Alias="所属业务组件编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ApplyDept_DeptName" Alias="应用组织名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="IsNameKeyWord" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="NAME" Mode="Value" />
              <gtp:ConfigItem Name="S_PropertyToUpper" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="ApplyDept_DeptId" Alias="应用组织" Type="Int">
            <CustomConfig>
              <gtp:ConfigItem Name="IsVisible" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="ID" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="ApplyDeptFullId" Alias="应用组织全ID" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="CreateDept_DeptId" Alias="创建部门Id" Type="Int">
            <CustomConfig>
              <gtp:ConfigItem Name="IsVisible" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="ID" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="CanViewDFile" Alias="能否查看该目录下的文档模板" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="IsDel" Alias="是否删除" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="CreateDept_Name" Alias="部门名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="IsNameKeyWord" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="NAME" Mode="Value" />
              <gtp:ConfigItem Name="S_PropertyToUpper" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="LeftTreeQuery" Alias="业务模块树" Type="GTP.AppFrameV2.DocTemplate.BizComQuery">
        <Fields>
          <gtp:DataField Name="ID" Alias="ID" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="Code" Alias="编码" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="FullCode" Alias="全编码" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="IsLeaf" Alias="是否叶子结点" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="LastUpdateTime" Alias="最后修改时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="LastUpdateUser" Alias="最后修改人" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Level" Alias="级别" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="Name" Alias="名称" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="OrderNo" Alias="序列号" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="PID" Alias="父id" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="备注" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="JianPin" Alias="简拼" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="PinYin" Alias="拼音" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="D_DeptId" Alias="部门" Type="Int">
            <CustomConfig>
              <gtp:ConfigItem Name="IsVisible" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="ID" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="D_FullDeptId" Alias="部门全Id" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="TreePropertyKey" Value="FullCode" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="FullName" Alias="全名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsBizComponent" Alias="是否业务组件" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="IsSystem" Alias="是否系统" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="Status" Alias="状态" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="Tag" Alias="标签" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DTFile" Alias="文档模板文件" Type="GTP.AppFrameV2.DocTemplate.DTFile">
        <Fields>
          <gtp:DataField Name="ID" Alias="主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="DTFolder.ID" Alias="ID" Type="Int" ForeignKey="true">
          </gtp:DataField>
          <gtp:DataField Name="Code" Alias="编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="DTFolderFullCode" Alias="关联目录全编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Summary" Alias="摘要" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Version" Alias="模板版本" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsValid" Alias="是否启用" Type="Boolean" DefaultValueExpression="true">
          </gtp:DataField>
          <gtp:DataField Name="CreateDept.DeptId" Alias="部门" Type="Int" ForeignKey="true" DefaultValueExpression="$C.deptId">
            <CustomConfig>
              <gtp:ConfigItem Name="IsVisible" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="ID" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Name" Alias="文件名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FileID" Alias="文件号" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="ViewGuid" Alias="查询标识" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="EditGuid" Alias="编辑标识" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ShareCount" Alias="共享数" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="DisplayName" Alias="文件名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FileSize" Alias="文件大小" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="CreateTime" Alias="上传时间" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FileExist" Alias="附件是否存在" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="备注" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="TemplateID" Alias="模板ID" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="TemplateInfo" Alias="文档模版信息" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FolderId" Alias="文件夹ID" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="AFExt1" Alias="AFExt1" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="AFExt2" Alias="AFExt2" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DTFolder" Alias="文档模板目录树" Type="GTP.AppFrameV2.DocTemplate.DTFolder">
        <Fields>
          <gtp:DataField Name="ID" Alias="ID" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="ModuleCode" Alias="所属业务组件编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ApplyRange" Alias="应用范围" Type="Auto" DefaultValueExpression="{name:'BHXJ',alias:{zh_CN:'包含下级'}}">
            <CustomConfig>
              <gtp:ConfigItem Name="EnumId" Value="GTP.AppFrameV2.DocTemplate.OwnerRange" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="ApplyDept.DeptId" Alias="部门" Type="Int" ForeignKey="true" DefaultValueExpression="$C.deptId">
            <CustomConfig>
              <gtp:ConfigItem Name="IsVisible" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="ID" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="ApplyDept.Name" Alias="部门名称" Type="String" TrimBlank="true" DefaultValueExpression="$C.deptName">
            <CustomConfig>
              <gtp:ConfigItem Name="IsNameKeyWord" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="NAME" Mode="Value" />
              <gtp:ConfigItem Name="S_PropertyToUpper" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Creator.UserId" Alias="用户" Type="Int" ForeignKey="true" DefaultValueExpression="$C.userId">
            <CustomConfig>
              <gtp:ConfigItem Name="IsQueryClassKey" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="CreatDept.DeptId" Alias="部门" Type="Int" ForeignKey="true" DefaultValueExpression="$C.deptId">
            <CustomConfig>
              <gtp:ConfigItem Name="IsVisible" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="ID" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="CreatTime" Alias="创建时间" Type="Date" DefaultValueExpression="Now()">
          </gtp:DataField>
          <gtp:DataField Name="IsDel" Alias="是否删除" Type="Boolean" DefaultValueExpression="false">
          </gtp:DataField>
          <gtp:DataField Name="Dept.DeptId" Alias="部门" Type="Int" ForeignKey="true" DefaultValueExpression="$C.deptId">
            <CustomConfig>
              <gtp:ConfigItem Name="IsVisible" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="ID" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="PID" Alias="父单据ID" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="Code" Alias="编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="备注" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="LastUpdateUser" Alias="最后修改人" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="LastUpdateTime" Alias="最后修改时间" Type="Date">
          </gtp:DataField>
          <gtp:DataField Name="PinYin" Alias="拼音" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="JianPin" Alias="简拼" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Name" Alias="名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FullCode" Alias="全编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="IsLeaf" Alias="是否叶子结点" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="OrderNo" Alias="序列号" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="Level" Alias="级别" Type="Int">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DTQuery" Alias="文档模板查询实体" Type="GTP.AppFrameV2.DocTemplate.DTQuery">
        <Fields>
          <gtp:DataField Name="ID" Alias="主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="Code" Alias="编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Name" Alias="文件名" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="FuzzyField" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="Summary" Alias="摘要" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Version" Alias="模板版本" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Remark" Alias="备注" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ViewGuid" Alias="查询标识" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="EditGuid" Alias="编辑标识" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="FileID" Alias="文件号" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="DTFolder_ID" Alias="文档目录ID" Type="Int">
          </gtp:DataField>
          <gtp:DataField Name="IsValid" Alias="是否启用" Type="Boolean">
          </gtp:DataField>
          <gtp:DataField Name="DTFolderFullCode" Alias="关联目录全编码" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="CREATE_DeptId" Alias="部门" Type="Int">
            <CustomConfig>
              <gtp:ConfigItem Name="IsVisible" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="ID" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="false" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
          <gtp:DataField Name="CREATE_DeptName" Alias="创建部门" Type="String" TrimBlank="true">
            <CustomConfig>
              <gtp:ConfigItem Name="IsNameKeyWord" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="Columnshow" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="TreePropertyKey" Value="NAME" Mode="Value" />
              <gtp:ConfigItem Name="S_PropertyToUpper" Value="true" Mode="Value" />
              <gtp:ConfigItem Name="IsRelevance" Value="false" Mode="Value" />
              <gtp:ConfigItem Name="IsAllowExport" Value="true" Mode="Value" />
            </CustomConfig>
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
    </items>
  </gtp:DataContext>
  <gtp:QueryPlans ID="queryPlans1" runat="server" >
    <items>
      <gtp:QueryPlan Name="leftTreeQueryPlan" DataSource="LeftTreeQuery" ExprContext="" PageSize="25" CurrentPage="1">
        <Filters>
          <gtp:FilterGroup Name="group" Value="And">
            <Items>
              <gtp:FilterGroup Name="group_OR" Value="Or">
                <Items>
                  <gtp:Filter Name="filter_Cat_Code" Field="Code" OP="Lk" />
                  <gtp:Filter Name="filter_Cat_Name" Field="Name" OP="Lk" />
                  <gtp:Filter Name="filter_Cat_JianPin" Field="JianPin" OP="Llk" />
                  <gtp:Filter Name="filter_Cat_PinYin" Field="PinYin" OP="Llk" />
                </Items>
              </gtp:FilterGroup>
              <gtp:Filter Name="filter_D_DeptId" Field="D_DeptId" OP="Eq" />
            </Items>
          </gtp:FilterGroup>
        </Filters>
      </gtp:QueryPlan>
      <gtp:QueryPlan Name="RightTreeQueryPlan" DataSource="RightTreeQuery" ExprContext="" PageSize="25" CurrentPage="1">
        <Filters>
          <gtp:FilterGroup Name="group_And" Value="And">
            <Items>
              <gtp:FilterGroup Name="Group_Dept_Or" Value="Or">
                <Items>
                  <gtp:Filter Name="filter_D_FullDeptId_Eq" Field="D_FullDeptId" OP="Eq" />
                  <gtp:Filter Name="filter_D_FullDeptId_Like" Field="D_FullDeptId" OP="Llk" />
                </Items>
              </gtp:FilterGroup>
              <gtp:FilterGroup Name="Group_Cat_Or" Value="Or">
                <Items>
                  <gtp:Filter Name="filter_C_FullCode_Equel" Field="ModuleCode" OP="Eq" />
                  <gtp:Filter Name="filter_C_FullCode_Like" Field="ModuleCode" OP="Llk" />
                </Items>
              </gtp:FilterGroup>
              <gtp:FilterGroup Name="IsDel" Value="And">
                <Items>
                  <gtp:Filter Name="filter_IsDel" Field="IsDel" OP="Eq" Value="false" />
                </Items>
              </gtp:FilterGroup>
            </Items>
          </gtp:FilterGroup>
        </Filters>
      </gtp:QueryPlan>
      <gtp:QueryPlan Name="DTqueryPlan" DataSource="DTQuery" ExprContext="" PageSize="25" CurrentPage="1">
        <Filters>
          <gtp:FilterGroup Name="filter_DTFile" Value="And">
            <Items>
              <gtp:Filter Name="filter_DTFolder_ID" Field="DTFolder_ID" OP="Eq" />
              <gtp:Filter Name="filter_CREATE_DeptId" Field="CREATE_DeptId" OP="In" />
            </Items>
          </gtp:FilterGroup>
        </Filters>
      </gtp:QueryPlan>
    </items>
  </gtp:QueryPlans>
  <gtp:Actions ID="actList" runat="server" >
    <Items>
      <gtp:Action ID="Ap_TreeGrid_actCollapseAll" runat="server" Disabled="false" Hidden="false" Handler="Ap_TreeGrid_actCollapseAll_Handler" Tooltip="全部折叠" meta:resourcekey="res_9_Ap_TreeGrid_actCollapseAll" >
        <CustomConfig>
          <gtp:ConfigItem Name="treeId" Value="" Mode="Value" />
        </CustomConfig>
      </gtp:Action>
      <gtp:Action ID="Ap_TreeGrid_actExpandAll" runat="server" Disabled="false" Hidden="false" Handler="Ap_TreeGrid_actExpandAll_Handler" Tooltip="展开" meta:resourcekey="res_10_Ap_TreeGrid_actExpandAll" >
        <CustomConfig>
          <gtp:ConfigItem Name="treeId" Value="" Mode="Value" />
        </CustomConfig>
      </gtp:Action>
      <gtp:Action ID="actQueryRightTree" runat="server" Disabled="false" Hidden="false" Handler="actQueryRightTree" IconCls="ci-toolbar-GTP_search-png" Text="查询右树" Tooltip="查询(内部函数,处理查询)" meta:resourcekey="res_11_actQueryRightTree" >
      </gtp:Action>
      <gtp:Action ID="actQueryLeftTree" runat="server" Disabled="false" Hidden="false" Handler="actQueryLeftTree" IconCls="ci-toolbar-GTP_search-png" Text="查询左树" Tooltip="查询(内部函数,处理查询)" meta:resourcekey="res_12_actQueryLeftTree" >
      </gtp:Action>
      <gtp:Action ID="actRefreshRightTree" runat="server" Disabled="false" Hidden="false" Handler="actRefreshRightTree_Handler" IconCls="ci-toolbar-GTP_refresh-png" Tooltip="刷新" meta:resourcekey="res_13_actRefreshRightTree" >
      </gtp:Action>
      <gtp:Action ID="actRefreshLeftTree" runat="server" Disabled="false" Hidden="false" Handler="actRefreshLeftTree_Handler" IconCls="ci-toolbar-GTP_refresh-png" Tooltip="刷新" meta:resourcekey="res_14_actRefreshLeftTree" >
      </gtp:Action>
      <gtp:Action ID="Ap_TreeGrid_actMoveUp" runat="server" Disabled="false" Hidden="false" Handler="Ap_TreeGrid_actMoveUp_Handler" IconCls="ci-toolbar-GTP_up-png" Tooltip="上移记录" meta:resourcekey="res_15_Ap_TreeGrid_actMoveUp" >
        <CustomConfig>
          <gtp:ConfigItem Name="treeId" Value="" Mode="Value" />
        </CustomConfig>
      </gtp:Action>
      <gtp:Action ID="Ap_TreeGrid_actMoveDown" runat="server" Disabled="false" Hidden="false" Handler="Ap_TreeGrid_actMoveDown_Handler" IconCls="ci-toolbar-GTP_down-png" Tooltip="下移记录" meta:resourcekey="res_16_Ap_TreeGrid_actMoveDown" >
        <CustomConfig>
          <gtp:ConfigItem Name="treeId" Value="" Mode="Value" />
        </CustomConfig>
      </gtp:Action>
      <gtp:Action ID="Ap_TreeGrid_actUpGrade" runat="server" Disabled="false" Hidden="false" Handler="Ap_TreeGrid_actUpGrade_Handler" IconCls="ci-toolbar-GTP_upgrade-png" Tooltip="升级记录" meta:resourcekey="res_17_Ap_TreeGrid_actUpGrade" >
        <CustomConfig>
          <gtp:ConfigItem Name="treeId" Value="" Mode="Value" />
        </CustomConfig>
      </gtp:Action>
      <gtp:Action ID="Ap_TreeGrid_actDeGrade" runat="server" Disabled="false" Hidden="false" Handler="Ap_TreeGrid_actDeGrade_Handler" IconCls="ci-toolbar-GTP_degrade-png" Tooltip="降级记录" meta:resourcekey="res_18_Ap_TreeGrid_actDeGrade" >
        <CustomConfig>
          <gtp:ConfigItem Name="treeId" Value="" Mode="Value" />
        </CustomConfig>
      </gtp:Action>
      <gtp:Action ID="Ap_TreeGrid_actMoveUp1" runat="server" Disabled="false" Hidden="false" Handler="Ap_TreeGrid_actMoveUp_Handler" IconCls="ci-toolbar-GTP_up-png" Tooltip="上移记录" meta:resourcekey="res_19_Ap_TreeGrid_actMoveUp1" >
        <CustomConfig>
          <gtp:ConfigItem Name="treeId" Value="" Mode="Value" />
        </CustomConfig>
      </gtp:Action>
      <gtp:Action ID="Ap_TreeGrid_actMoveDown1" runat="server" Disabled="false" Hidden="false" Handler="Ap_TreeGrid_actMoveDown_Handler" IconCls="ci-toolbar-GTP_down-png" Tooltip="下移记录" meta:resourcekey="res_20_Ap_TreeGrid_actMoveDown1" >
        <CustomConfig>
          <gtp:ConfigItem Name="treeId" Value="" Mode="Value" />
        </CustomConfig>
      </gtp:Action>
      <gtp:Action ID="Ap_TreeGrid_actUpGrade1" runat="server" Disabled="false" Hidden="false" Handler="Ap_TreeGrid_actUpGrade_Handler" IconCls="ci-toolbar-GTP_upgrade-png" Tooltip="升级记录" meta:resourcekey="res_21_Ap_TreeGrid_actUpGrade1" >
        <CustomConfig>
          <gtp:ConfigItem Name="treeId" Value="" Mode="Value" />
        </CustomConfig>
      </gtp:Action>
      <gtp:Action ID="Ap_TreeGrid_actDeGrade1" runat="server" Disabled="false" Hidden="false" Handler="Ap_TreeGrid_actDeGrade_Handler" IconCls="ci-toolbar-GTP_degrade-png" Tooltip="降级记录" meta:resourcekey="res_22_Ap_TreeGrid_actDeGrade1" >
        <CustomConfig>
          <gtp:ConfigItem Name="treeId" Value="" Mode="Value" />
        </CustomConfig>
      </gtp:Action>
      <gtp:Action ID="actSave" runat="server" Disabled="false" Hidden="false" Handler="actSave_Handler" IconCls="ci-toolbar-GTP_save-png" Text="保存" Tooltip="保存更改" meta:resourcekey="res_23_actSave" >
      </gtp:Action>
      <gtp:Action ID="actCancel" runat="server" Disabled="false" Hidden="false" Handler="actCancel_Handler" IconCls="ci-toolbar-GTP_giveup-png" Text="放弃" Tooltip="放弃" meta:resourcekey="res_24_actCancel" >
      </gtp:Action>
      <gtp:Action ID="actAdd" runat="server" Disabled="false" Hidden="false" Handler="actAdd_Handler" IconCls="ci-toolbar-GTP_new-png" Text="新建同级" Tooltip="新建同级" meta:resourcekey="res_25_actAdd" >
      </gtp:Action>
      <gtp:Action ID="actAddChild" runat="server" Disabled="false" Hidden="false" Handler="actAddChild_Handler" IconCls="ci-toolbar-GTP_addchild-png" Text="新建下级" Tooltip="新建下级" meta:resourcekey="res_26_actAddChild" >
      </gtp:Action>
      <gtp:Action ID="actRemove" runat="server" Disabled="false" Hidden="false" Handler="actRemove_Handler" IconCls="ci-toolbar-GTP_minus-png" Text="删除" Tooltip="删除记录" meta:resourcekey="res_27_actRemove" >
      </gtp:Action>
      <gtp:Action ID="actAddRoot" runat="server" Disabled="false" Hidden="false" Handler="actAddRoot_Handler" IconCls="ci-toolbar-GTP_add-png" Text="新建根" Tooltip="新建根" meta:resourcekey="res_28_actAddRoot" >
      </gtp:Action>
      <gtp:Action ID="actAddAttach" runat="server" Disabled="false" Hidden="false" Handler="actAddAttach_Handler" IconCls="ci-toolbar-GTP_filenew-png" Text="添加" Tooltip="添加一个附件记录" meta:resourcekey="res_29_actAddAttach" >
      </gtp:Action>
      <gtp:Action ID="actAddAfterUploadFile" runat="server" Disabled="false" Hidden="false" Handler="actAddAfterUploadFile_Handler" IconCls="ci-toolbar-GTP_filesend-png" Text="添加" Tooltip="添加一个附件记录" meta:resourcekey="res_30_actAddAfterUploadFile" >
      </gtp:Action>
      <gtp:Action ID="actDeleteAttach" runat="server" Disabled="false" Hidden="false" Handler="actDeleteAttach_Handler" IconCls="ci-toolbar-GTP_delete-png" Text="删除" Tooltip="删除附件" meta:resourcekey="res_31_actDeleteAttach" >
      </gtp:Action>
      <gtp:Action ID="actDownLoadFile" runat="server" Disabled="false" Hidden="false" Handler="actDownLoadFile_Handler" IconCls="ci-toolbar-GTP_download-png" Text="下载" Tooltip="下载附件" meta:resourcekey="res_32_actDownLoadFile" >
      </gtp:Action>
      <gtp:Action ID="actOpenFile" runat="server" Disabled="false" Hidden="false" Handler="actOpenFile_Handler" IconCls="ci-toolbar-GTP_fileopen-png" Text="打开" Tooltip="打开附件" meta:resourcekey="res_33_actOpenFile" >
      </gtp:Action>
      <gtp:Action ID="act_SaveDTFolder" runat="server" Disabled="false" Hidden="false" Handler="act_SaveDTFolder_Handler" IconCls="ci-toolbar-GTP_save-png" Text="保存" Tooltip="保存模板目录" meta:resourcekey="res_34_act_SaveDTFolder" >
      </gtp:Action>
      <gtp:Action ID="act_SaveDT" runat="server" Disabled="false" Hidden="false" Handler="act_SaveDT_Handler" IconCls="ci-toolbar-GTP_save-png" Text="保存" Tooltip="保存模板" meta:resourcekey="res_35_act_SaveDT" >
      </gtp:Action>
      <gtp:Action ID="act_CloseWDTF" runat="server" Disabled="false" Hidden="false" Handler="act_CloseWDTF_Handler" IconCls="ci-toolbar-GTP_cancel-png" Text="取消" Tooltip="取消" meta:resourcekey="res_36_act_CloseWDTF" >
      </gtp:Action>
      <gtp:Action ID="act_CloseWDT" runat="server" Disabled="false" Hidden="false" Handler="act_CloseWDT_Handler" IconCls="ci-toolbar-GTP_cancel-png" Text="取消" Tooltip="取消" meta:resourcekey="res_37_act_CloseWDT" >
      </gtp:Action>
      <gtp:Action ID="act_UpdateDTF" runat="server" Disabled="false" Hidden="false" Handler="act_UpdateDTF_Handler" IconCls="ci-toolbar-GTP_saveas-png" Text="修改" Tooltip="修改文档目录" meta:resourcekey="res_38_act_UpdateDTF" >
      </gtp:Action>
      <gtp:Action ID="actNewAddAttach" runat="server" Disabled="false" Hidden="false" Handler="actNewAddAttach_Handler" IconCls="ci-tree-GTP_folder-png" Text="添加模板" Tooltip="添加模板" meta:resourcekey="res_39_actNewAddAttach" >
      </gtp:Action>
      <gtp:Action ID="actNewUpdateAttach" runat="server" Disabled="false" Hidden="false" Handler="actNewUpdateAttach_Handler" IconCls="ci-toolbar-GTP_saveas-png" Text="编辑模板" Tooltip="编辑" meta:resourcekey="res_40_actNewUpdateAttach" >
      </gtp:Action>
      <gtp:Action ID="actIsValid" runat="server" Disabled="false" Hidden="false" Handler="actSetValid_Handler" IconCls="ci-toolbar-GTP_adoption-png" Text="启用" Tooltip="启用" meta:resourcekey="res_41_actIsValid" >
      </gtp:Action>
      <gtp:Action ID="actNotValid" runat="server" Disabled="false" Hidden="false" Handler="actNotValid_Handler" IconCls="ci-toolbar-GTP_disable-png" Text="停用" Tooltip="停用" meta:resourcekey="res_42_actNotValid" >
      </gtp:Action>
      <gtp:Action ID="act" runat="server" Disabled="false" Hidden="false" IconCls="ci-tree-GTP_folder-png" meta:resourcekey="res_43_act" >
      </gtp:Action>
      <gtp:Action ID="act1" runat="server" Disabled="false" Hidden="false" IconCls="ci-auth-GTP_bizform-png" meta:resourcekey="res_44_act1" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="leftTreeGrid" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="topToolbarSpacer" Hidden="false" />
          <gtp:StateItem ReferenceName="topTilte" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ToolbarFill" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_LeftTree_ExpandTo" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_LeftTree_CollapseAll" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_LeftTree_Refresh" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="leftTreeSearch" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="leftTreeGrid.col_Code" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="leftTreeGrid.col_Name" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="leftTreeGrid.col_Remark" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="leftTreeGrid.col_FullCode" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="rightTreeGrid" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="textSelectedCategory" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ToolbarSpacer_include" Hidden="false" />
          <gtp:StateItem ReferenceName="includeChild" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ToolbarSearchFill" Hidden="false" />
          <gtp:StateItem ReferenceName="Separator_Search" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnAddRoot" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnAdd" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnAddChild" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnUpdataDTF" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnRemove" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_RightTree_ExpandTo" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_RightTree_CollapseAll" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_RightTree_Refresh" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnCancel" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="Separator_Edit" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_MoveUp" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_MoveDown" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_Degrade" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_Upgrade" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="Separator_Move" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="btnSave" Disabled="true" Hidden="true" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_Code" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_Name" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_FullCode" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_ModuleCode" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_Remark" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_ApplyRange" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_DeptName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_CreateDept" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_CreateDeptName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_NewAddAttach" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_NewUpdateAttach" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnDel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnDownLoad" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnOpen" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnIsValid" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnNotValid" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="gridView.col_Code" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_DTFolder_ID" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_FileID" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_EditGuid" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_ViewGuid" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_Remark" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_Version" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_Summary" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_Name" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_CreateDeptId" Hidden="true" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_CreateDeptName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="gridView.col_IsValid" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="entityDTF" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_SaveDTFolder" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_CloseWDTF" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ToolbarSeparator" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DTFName" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ApplyDept_Name" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ApplyRange" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DTFRemark" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDTF_category_R1C1_1" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDTF_category_R2C1_1" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDTF_category_R3C1_2" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDTF_category_R4C1_1" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDTF_category_R3C1_1" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDTF_category_R2C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDTF_category_R4C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDTF_category_R5C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDTF_category_R1C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DTFCode" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ModuleCode" ReadOnly="false" Hidden="true" />
          <gtp:StateItem ReferenceName="entityDTF_category_R3C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="windowDTF" Disabled="false" Hidden="true" />
          <gtp:StateItem ReferenceName="entityDT" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_SaveDT" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_CloseWDT" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ToolbarSeparator1" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Code" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Name" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Version" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Summary" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_Remark" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDT_category_R1C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDT_category_R2C1_1" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDT_category_R3C1_2" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDT_category_R5C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDT_category_R5C1_2" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDT_category_R5C1_1" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDT_category_R2C1_2" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDT_category_R3C1_1" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDT_category_R3C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="entityDT_category_R2C1_" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_FileID" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ViewGuid" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_EditGuid" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ShareCount" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_DisplayName" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_FileSize" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_CreateTime" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_FileExist" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_TemplateID" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_TemplateInfo" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_FolderId" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_AFExt1" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_AFExt2" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="windowDT" Disabled="false" Hidden="true" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_READONLY" PageReadOnly="true">
        <Items>
          <gtp:StateItem ReferenceName="leftTreeGrid.col_Code" ReadOnly="true" />
          <gtp:StateItem ReferenceName="leftTreeGrid.col_Name" ReadOnly="true" />
          <gtp:StateItem ReferenceName="leftTreeGrid.col_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="leftTreeGrid.col_FullCode" ReadOnly="true" />
          <gtp:StateItem ReferenceName="topToolbarSpacer" Disabled="true" />
          <gtp:StateItem ReferenceName="topTilte" Disabled="true" />
          <gtp:StateItem ReferenceName="ToolbarFill" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_LeftTree_ExpandTo" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_LeftTree_CollapseAll" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_LeftTree_Refresh" Disabled="true" />
          <gtp:StateItem ReferenceName="leftTreeSearch" Disabled="true" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_Code" ReadOnly="true" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_Name" ReadOnly="true" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_FullCode" ReadOnly="true" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_ModuleCode" ReadOnly="true" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_ApplyRange" ReadOnly="true" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_DeptName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_CreateDept" ReadOnly="true" />
          <gtp:StateItem ReferenceName="rightTreeGrid.col_CreateDeptName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="textSelectedCategory" Disabled="true" />
          <gtp:StateItem ReferenceName="ToolbarSpacer_include" Disabled="true" />
          <gtp:StateItem ReferenceName="includeChild" Disabled="true" />
          <gtp:StateItem ReferenceName="ToolbarSearchFill" Disabled="true" />
          <gtp:StateItem ReferenceName="Separator_Search" Disabled="true" />
          <gtp:StateItem ReferenceName="Separator_Edit" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_MoveUp" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_MoveDown" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_Degrade" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_Upgrade" Disabled="true" />
          <gtp:StateItem ReferenceName="Separator_Move" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_ExpandTo" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_CollapseAll" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_Refresh" Disabled="true" />
          <gtp:StateItem ReferenceName="btnAddRoot" Disabled="true" />
          <gtp:StateItem ReferenceName="btnAdd" Disabled="true" />
          <gtp:StateItem ReferenceName="btnAddChild" Disabled="true" />
          <gtp:StateItem ReferenceName="btnRemove" Disabled="true" />
          <gtp:StateItem ReferenceName="btnSave" Disabled="true" />
          <gtp:StateItem ReferenceName="btnCancel" Disabled="true" />
          <gtp:StateItem ReferenceName="btnUpdataDTF" Disabled="true" />
          <gtp:StateItem ReferenceName="gridView.col_Code" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_DTFolder_ID" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_FileID" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_EditGuid" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_ViewGuid" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_Version" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_Summary" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_Name" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_CreateDeptId" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_CreateDeptName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="gridView.col_IsValid" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btn_NewAddAttach" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_NewUpdateAttach" Disabled="true" />
          <gtp:StateItem ReferenceName="btnDel" Disabled="true" />
          <gtp:StateItem ReferenceName="btnDownLoad" Disabled="true" />
          <gtp:StateItem ReferenceName="btnOpen" Disabled="true" />
          <gtp:StateItem ReferenceName="btnIsValid" Disabled="true" />
          <gtp:StateItem ReferenceName="btnNotValid" Disabled="true" />
          <gtp:StateItem ReferenceName="Efd_DTFName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_ApplyDept_Name" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_ApplyRange" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_DTFRemark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDTF_category_R1C1_1" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDTF_category_R2C1_1" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDTF_category_R3C1_2" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDTF_category_R4C1_1" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDTF_category_R3C1_1" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDTF_category_R2C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDTF_category_R4C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDTF_category_R5C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDTF_category_R1C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_DTFCode" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_ModuleCode" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDTF_category_R3C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btn_SaveDTFolder" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_CloseWDTF" Disabled="true" />
          <gtp:StateItem ReferenceName="ToolbarSeparator" Disabled="true" />
          <gtp:StateItem ReferenceName="Efd_Code" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_Name" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_Version" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_Summary" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_Remark" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDT_category_R1C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDT_category_R2C1_1" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDT_category_R3C1_2" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDT_category_R5C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDT_category_R5C1_2" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDT_category_R5C1_1" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDT_category_R2C1_2" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDT_category_R3C1_1" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDT_category_R3C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="entityDT_category_R2C1_" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_FileID" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_ViewGuid" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_EditGuid" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_ShareCount" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_DisplayName" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_FileSize" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_CreateTime" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_FileExist" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_TemplateID" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_TemplateInfo" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_FolderId" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_AFExt1" ReadOnly="true" />
          <gtp:StateItem ReferenceName="Efd_AFExt2" ReadOnly="true" />
          <gtp:StateItem ReferenceName="btn_SaveDT" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_CloseWDT" Disabled="true" />
          <gtp:StateItem ReferenceName="ToolbarSeparator1" Disabled="true" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_UPDATE">
        <Items>
          <gtp:StateItem ReferenceName="btnSave" Disabled="false" />
          <gtp:StateItem ReferenceName="btnCancel" Disabled="false" />
          <gtp:StateItem ReferenceName="btn_RightTree_MoveUp" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_MoveDown" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_Degrade" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_Upgrade" Disabled="true" />
        </Items>
      </gtp:State>
      <gtp:State Name="STATE_NOUPDATE">
        <Items>
          <gtp:StateItem ReferenceName="btnSave" Disabled="true" />
          <gtp:StateItem ReferenceName="btnCancel" Disabled="true" />
          <gtp:StateItem ReferenceName="btn_RightTree_MoveUp" Disabled="false" />
          <gtp:StateItem ReferenceName="btn_RightTree_MoveDown" Disabled="false" />
          <gtp:StateItem ReferenceName="btn_RightTree_Degrade" Disabled="false" />
          <gtp:StateItem ReferenceName="btn_RightTree_Upgrade" Disabled="false" />
        </Items>
      </gtp:State>
    </Items>
  </gtp:States>
  <gtp:Viewport ID="viewport" runat="server" Layout="border" >
    <Items>
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="West" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="true" Split="true" Width="216" meta:resourcekey="res_45_1" >
        <Items>
          <gtp:TreeGridPanel runat="server" ID="leftTreeGrid" AutoCellSizeMode="None" Title="左树" DataSource="LeftTreeQuery" Header="false" AutoExpandColumn="col_Name" KeyField="ID" ParentKeyField="PID" FullCodeField="FullCode" CodeField="Code" OrderField="OrderNo" LevelField="Level" LeafField="IsLeaf" MasterColumnID="col_Name" meta:resourcekey="res_46_leftTreeGrid">
            <TopBar>
              <gtp:Toolbar runat="server" Layout="Container">
                <Items>
                  <gtp:CommandToolbar runat="server" ID="leftTreeGrid_toolbar" ButtonAlign="Left">
                    <Items>
                      <gtp:ToolbarSpacer LabelSeparator="" ID="topToolbarSpacer" runat="server" Width="1">
                      </gtp:ToolbarSpacer>
                      <gtp:ToolbarTextItem ID="topTilte" runat="server" Text="业务表单" TextStyle="font-size:14px;color:#333333;font-weight: bold;" meta:resourcekey="res_47_topTilte">
                      </gtp:ToolbarTextItem>
                      <gtp:ToolbarFill LabelSeparator="" ID="ToolbarFill" runat="server">
                      </gtp:ToolbarFill>
                      <gtp:Button ID="btn_LeftTree_ExpandTo" runat="server" Tooltip="全部展开" meta:resourcekey="res_48_btn_LeftTree_ExpandTo" IconCls="ci-toolbar-GTP_allunfold-png">
                        <Menu>
                          <gtp:Menu runat="server">
                            <Items>
                              <gtp:MenuItem runat="server" ID="MenuItem2" Text="展开到2级" Action="Ap_TreeGrid_actExpandAll" meta:resourcekey="res_49_MenuItem2" />
                              <gtp:MenuItem runat="server" ID="MenuItem3" Text="展开到3级" Action="Ap_TreeGrid_actExpandAll" meta:resourcekey="res_50_MenuItem3" />
                              <gtp:MenuItem runat="server" ID="MenuItem4" Text="展开到4级" Action="Ap_TreeGrid_actExpandAll" meta:resourcekey="res_51_MenuItem4" />
                              <gtp:MenuItem runat="server" ID="MenuItem5" Text="展开到5级" Action="Ap_TreeGrid_actExpandAll" meta:resourcekey="res_52_MenuItem5" />
                              <gtp:MenuItem runat="server" ID="MenuItem1" Text="展开全部" Action="Ap_TreeGrid_actExpandAll" meta:resourcekey="res_53_MenuItem1" />
                            </Items>
                          </gtp:Menu>
                        </Menu>
                      </gtp:Button>
                      <gtp:Button ID="btn_LeftTree_CollapseAll" runat="server" Action="Ap_TreeGrid_actCollapseAll" Tooltip="全部折叠" meta:resourcekey="res_54_btn_LeftTree_CollapseAll" IconCls="ci-toolbar-GTP_allfold-png">
                      </gtp:Button>
                      <gtp:Button ID="btn_LeftTree_Refresh" runat="server" Action="actRefreshLeftTree" Tooltip="刷新" meta:resourcekey="res_55_btn_LeftTree_Refresh" IconCls="ci-toolbar-GTP_refresh-png">
                      </gtp:Button>
                    </Items>
                  </gtp:CommandToolbar>
                  <gtp:Toolbar runat="server" ButtonAlign="Left" ID="leftTreeGrid_search" EnableOverflow="true">
                    <Items>
                      <gtp:CustomTriggerField ID="leftTreeSearch" runat="server" EmptyText="快速查询" Width="170" meta:resourcekey="res_56_leftTreeSearch">
                        <Listeners>
                          <KeyUp Handler="leftTreeSearch_KeyUp" />
                          <TriggerClick Handler="leftTreeSearch_TriggerClick" />
                        </Listeners>
                      </gtp:CustomTriggerField>
                    </Items>
                  </gtp:Toolbar>
                </Items>
              </gtp:Toolbar>
            </TopBar>
            <ColumnModel runat="server">
              <Columns>
                <gtp:TextColumn ColumnID="col_Name" Align="Left" DataIndex="Name" Header="名称" Width="300" Editable="false" meta:resourcekey="res_57_col_Name">
                  <Renderer Handler="col_Name_Renderer" />
                </gtp:TextColumn>
              </Columns>
            </ColumnModel>
            <View>
              <gtp:TreeGridView runat="server">
              </gtp:TreeGridView>
            </View>
            <Listeners>
              <BeforeRender Handler="leftTreeGrid_BeforeRender" />
            </Listeners>
          </gtp:TreeGridPanel>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="Center" Layout="border" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="true" Split="true">
        <Items>
          <gtp:Panel ID="layoutPanel3" runat="server" Header="false" Title="" Region="North" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="true" Split="true" Height="320" meta:resourcekey="res_58_21" >
            <Items>
              <gtp:TreeGridPanel runat="server" ID="rightTreeGrid" AutoCellSizeMode="None" Title="右树" DataSource="RightTreeQuery" Header="false" KeyField="ID" ParentKeyField="PID" FullCodeField="FullCode" CodeField="Code" OrderField="OrderNo" LevelField="Level" LeafField="IsLeaf" MasterColumnID="col_Name" meta:resourcekey="res_59_rightTreeGrid">
                <TopBar>
                  <gtp:Toolbar runat="server" Layout="Container">
                    <Items>
                      <gtp:CommandToolbar runat="server" ID="rightTreeGrid_toolbar_topTitle" ButtonAlign="Left">
                        <Items>
                          <gtp:ToolbarTextItem ID="textSelectedCategory" runat="server" TextStyle="font-size:14px;color:#333333;font-weight: bold;">
                          </gtp:ToolbarTextItem>
                          <gtp:ToolbarSpacer LabelSeparator="" ID="ToolbarSpacer_include" runat="server" Width="12">
                          </gtp:ToolbarSpacer>
                          <gtp:CheckBox LabelSeparator="" ID="includeChild" runat="server" LabelAlign="Right" BoxLabel="包含下级节点" meta:resourcekey="res_60_includeChild">
                          </gtp:CheckBox>
                          <gtp:ToolbarFill LabelSeparator="" ID="ToolbarSearchFill" runat="server">
                          </gtp:ToolbarFill>
                          <gtp:ToolbarSeparator LabelSeparator="" ID="Separator_Search" runat="server" Hidden="true">
                          </gtp:ToolbarSeparator>
                        </Items>
                      </gtp:CommandToolbar>
                      <gtp:Toolbar runat="server" ButtonAlign="Left" ID="rightTreeGrid_toolbar" EnableOverflow="true">
                        <Items>
                          <gtp:Button ID="btnAddRoot" runat="server" Hidden="false" Action="actAddRoot" Tooltip="新建根" Text="新建根" meta:resourcekey="res_61_btnAddRoot" IconCls="ci-toolbar-GTP_add-png">
                          </gtp:Button>
                          <gtp:Button ID="btnAdd" runat="server" Action="actAdd" Tooltip="新建同级" Text="新建" Hidden="true" meta:resourcekey="res_62_btnAdd" IconCls="ci-toolbar-GTP_new-png">
                          </gtp:Button>
                          <gtp:Button ID="btnAddChild" runat="server" Action="actAddChild" Tooltip="新建下级" Text="新建下级" meta:resourcekey="res_63_btnAddChild" IconCls="ci-toolbar-GTP_addchild-png">
                          </gtp:Button>
                          <gtp:Button ID="btnUpdataDTF" runat="server" Action="act_UpdateDTF" Tooltip="修改文档目录" Text="修改" meta:resourcekey="res_64_btnUpdataDTF" IconCls="ci-toolbar-GTP_saveas-png">
                          </gtp:Button>
                          <gtp:Button ID="btnRemove" runat="server" Action="actRemove" Tooltip="删除记录" Text="删除" meta:resourcekey="res_65_btnRemove" IconCls="ci-toolbar-GTP_minus-png">
                          </gtp:Button>
                          <gtp:Button ID="btn_RightTree_ExpandTo" runat="server" Tooltip="展开" meta:resourcekey="res_66_btn_RightTree_ExpandTo" IconCls="ci-toolbar-GTP_allunfold-png">
                            <Menu>
                              <gtp:Menu runat="server">
                                <Items>
                                  <gtp:MenuItem runat="server" ID="btnExpandAll_menu2" Text="展开到2级" Action="Ap_TreeGrid_actExpandAll" meta:resourcekey="res_67_btnExpandAll_menu2" />
                                  <gtp:MenuItem runat="server" ID="btnExpandAll_menu3" Text="展开到3级" Action="Ap_TreeGrid_actExpandAll" meta:resourcekey="res_68_btnExpandAll_menu3" />
                                  <gtp:MenuItem runat="server" ID="btnExpandAll_menu4" Text="展开到4级" Action="Ap_TreeGrid_actExpandAll" meta:resourcekey="res_69_btnExpandAll_menu4" />
                                  <gtp:MenuItem runat="server" ID="btnExpandAll_menu5" Text="展开到5级" Action="Ap_TreeGrid_actExpandAll" meta:resourcekey="res_70_btnExpandAll_menu5" />
                                  <gtp:MenuItem runat="server" ID="btnExpandAll_menu1" Text="展开全部" Action="Ap_TreeGrid_actExpandAll" meta:resourcekey="res_71_btnExpandAll_menu1" />
                                </Items>
                              </gtp:Menu>
                            </Menu>
                          </gtp:Button>
                          <gtp:Button ID="btn_RightTree_CollapseAll" runat="server" Action="Ap_TreeGrid_actCollapseAll" Tooltip="折叠" meta:resourcekey="res_72_btn_RightTree_CollapseAll" IconCls="ci-toolbar-GTP_allfold-png">
                          </gtp:Button>
                          <gtp:Button ID="btn_RightTree_Refresh" runat="server" Action="actRefreshRightTree" Tooltip="刷新" meta:resourcekey="res_73_btn_RightTree_Refresh" IconCls="ci-toolbar-GTP_refresh-png">
                          </gtp:Button>
                          <gtp:Button ID="btnCancel" runat="server" Action="actCancel" Tooltip="放弃" Text="放弃" Hidden="true" meta:resourcekey="res_74_btnCancel" IconCls="ci-toolbar-GTP_giveup-png">
                          </gtp:Button>
                          <gtp:ToolbarSeparator LabelSeparator="" ID="Separator_Edit" runat="server" Hidden="true">
                          </gtp:ToolbarSeparator>
                          <gtp:Button ID="btn_RightTree_MoveUp" runat="server" Action="Ap_TreeGrid_actMoveUp1" Tooltip="上移记录" Hidden="true" meta:resourcekey="res_75_btn_RightTree_MoveUp" IconCls="ci-toolbar-GTP_up-png">
                          </gtp:Button>
                          <gtp:Button ID="btn_RightTree_MoveDown" runat="server" Action="Ap_TreeGrid_actMoveDown1" Tooltip="下移记录" Hidden="true" meta:resourcekey="res_76_btn_RightTree_MoveDown" IconCls="ci-toolbar-GTP_down-png">
                          </gtp:Button>
                          <gtp:Button ID="btn_RightTree_Degrade" runat="server" Action="Ap_TreeGrid_actDeGrade1" Tooltip="降级记录" Hidden="true" meta:resourcekey="res_77_btn_RightTree_Degrade" IconCls="ci-toolbar-GTP_degrade-png">
                          </gtp:Button>
                          <gtp:Button ID="btn_RightTree_Upgrade" runat="server" Action="Ap_TreeGrid_actUpGrade1" Tooltip="升级记录" Hidden="true" meta:resourcekey="res_78_btn_RightTree_Upgrade" IconCls="ci-toolbar-GTP_upgrade-png">
                          </gtp:Button>
                          <gtp:ToolbarSeparator LabelSeparator="" ID="Separator_Move" runat="server" Hidden="true">
                          </gtp:ToolbarSeparator>
                          <gtp:Button ID="btnSave" runat="server" Disabled="true" Action="actSave" Tooltip="保存更改" Text="保存" Hidden="true" meta:resourcekey="res_79_btnSave" IconCls="ci-toolbar-GTP_save-png">
                          </gtp:Button>
                        </Items>
                      </gtp:Toolbar>
                    </Items>
                  </gtp:Toolbar>
                </TopBar>
                <ColumnModel runat="server">
                  <Columns>
                    <gtp:TextColumn ColumnID="col_Name" Align="Left" DataIndex="Name" Header="名称" Width="300" Editable="false" meta:resourcekey="res_80_col_Name">
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_DeptName" Align="Left" DataIndex="ApplyDept_DeptName" Header="应用组织名称" Width="200" Editable="false" meta:resourcekey="res_81_col_DeptName">
                    </gtp:TextColumn>
                    <gtp:EnumColumn ColumnID="col_ApplyRange" Align="Left" DataIndex="ApplyRange" Header="应用范围" Width="200" Editable="false" meta:resourcekey="res_82_col_ApplyRange">
                    </gtp:EnumColumn>
                    <gtp:NumberColumn ColumnID="col_CreateDept" Align="Right" DataIndex="CreateDept_DeptId" Header="创建部门Id" Hidden="true" Editable="false" Format="0" meta:resourcekey="res_83_col_CreateDept">
                    </gtp:NumberColumn>
                    <gtp:TextColumn ColumnID="col_CreateDeptName" Align="Left" DataIndex="CreateDept_Name" Header="创建部门" Editable="false" meta:resourcekey="res_84_col_CreateDeptName">
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_Remark" Align="Left" DataIndex="Remark" Header="备注" Hidden="true" Editable="false" meta:resourcekey="res_85_col_Remark">
                    </gtp:TextColumn>
                  </Columns>
                </ColumnModel>
                <View>
                  <gtp:TreeGridView runat="server">
                  </gtp:TreeGridView>
                </View>
                <Listeners>
                  <BeforeEdit Handler="rightTreeGrid_BeforeEdit" />
                  <AfterEdit Handler="rightTreeGrid_AfterEdit" />
                  <RowClick Handler="rightTreeGrid_RowClick" />
                </Listeners>
              </gtp:TreeGridPanel>
            </Items>
          </gtp:Panel>
          <gtp:Panel ID="layoutPanel4" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="true" Split="true" meta:resourcekey="res_86_22" >
            <Items>
              <gtp:GridPanel ID="gridView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="DTQuery" Height="0" AutoCellSizeMode="None" ShowRowNumber="true" HideGroupedColumn="true" meta:resourcekey="res_87_gridView">
                <TopBar>
                  <gtp:Toolbar runat="server" ButtonAlign="Left" ID="gridView_toolbar" EnableOverflow="true">
                    <Items>
                      <gtp:Button ID="btn_NewAddAttach" runat="server" Action="actNewAddAttach" Tooltip="添加模板" Text="添加模板" meta:resourcekey="res_88_btn_NewAddAttach" IconCls="ci-tree-GTP_folder-png">
                      </gtp:Button>
                      <gtp:Button ID="btn_NewUpdateAttach" runat="server" Action="actNewUpdateAttach" Tooltip="编辑" Text="编辑模板" meta:resourcekey="res_89_btn_NewUpdateAttach" IconCls="ci-toolbar-GTP_saveas-png">
                      </gtp:Button>
                      <gtp:Button ID="btnDel" runat="server" Action="actDeleteAttach" Tooltip="删除附件" Text="删除" meta:resourcekey="res_90_btnDel" IconCls="ci-toolbar-GTP_delete-png">
                      </gtp:Button>
                      <gtp:Button ID="btnDownLoad" runat="server" Action="actDownLoadFile" Tooltip="下载附件" Text="下载" meta:resourcekey="res_91_btnDownLoad" IconCls="ci-toolbar-GTP_download-png">
                      </gtp:Button>
                      <gtp:Button ID="btnOpen" runat="server" Action="actOpenFile" Tooltip="打开附件" Text="打开" meta:resourcekey="res_92_btnOpen" IconCls="ci-toolbar-GTP_fileopen-png">
                      </gtp:Button>
                      <gtp:Button ID="btnIsValid" runat="server" Action="actIsValid" Tooltip="启用" Text="启用" meta:resourcekey="res_93_btnIsValid" IconCls="ci-toolbar-GTP_adoption-png">
                      </gtp:Button>
                      <gtp:Button ID="btnNotValid" runat="server" Action="actNotValid" Tooltip="停用" Text="停用" meta:resourcekey="res_94_btnNotValid" IconCls="ci-toolbar-GTP_disable-png">
                      </gtp:Button>
                    </Items>
                  </gtp:Toolbar>
                </TopBar>
                <ColumnModel runat="server">
                  <Columns>
                    <gtp:BooleanColumn ColumnID="col_IsValid" Align="Center" DataIndex="IsValid" Header="状态" Editable="false" TrueText="&lt;font color=&quot;green&quot;&gt;启用&lt;/font&gt;" FalseText="&lt;font color=&quot;gray&quot;&gt;停用&lt;/font&gt;" meta:resourcekey="res_95_col_IsValid">
                    </gtp:BooleanColumn>
                    <gtp:TextColumn ColumnID="col_Code" Align="Left" DataIndex="Code" Header="模板编码" Width="150" Editable="false" meta:resourcekey="res_96_col_Code">
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_Name" Align="Left" DataIndex="Name" Header="模板名称" Width="200" Editable="false" meta:resourcekey="res_97_col_Name">
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_Summary" Align="Left" AutoCellSizeMode="RowHeight" DataIndex="Summary" Header="摘要" Width="250" Editable="false" meta:resourcekey="res_98_col_Summary">
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_Version" Align="Left" DataIndex="Version" Header="版本" Editable="false" meta:resourcekey="res_99_col_Version">
                    </gtp:TextColumn>
                    <gtp:TextColumn ColumnID="col_Remark" Align="Left" AutoCellSizeMode="RowHeight" DataIndex="Remark" Header="备注" Width="250" Editable="false" meta:resourcekey="res_100_col_Remark">
                    </gtp:TextColumn>
                    <gtp:NumberColumn ColumnID="col_CreateDeptId" Align="Right" DataIndex="CREATE_DeptId" Header="部门" Hidden="true" Editable="false" Format="0" meta:resourcekey="res_101_col_CreateDeptId">
                    </gtp:NumberColumn>
                    <gtp:TextColumn ColumnID="col_CreateDeptName" Align="Left" DataIndex="CREATE_DeptName" Header="创建部门" Width="150" Editable="false" meta:resourcekey="res_102_col_CreateDeptName">
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
      </gtp:Panel>
    </Items>
  </gtp:Viewport>
  <gtp:Window runat="server" ID="windowDTF" AutoRender="false" Title="文档目录信息" Hidden="true" Height="300" Width="500" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_103_windowDTF"  >
    <Items>
      <gtp:FormPanel ID="entityDTF" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:10px;padding-bottom:10px" DataSource="DTFolder" LabelWidth="60" LabelAlign="Left" meta:resourcekey="res_104_entityDTF">
        <BottomBar>
          <gtp:CommandToolbar runat="server" ID="entityDTF_toolbar" ButtonAlign="Right">
            <Items>
              <gtp:Button ID="btn_SaveDTFolder" runat="server" Action="act_SaveDTFolder" Tooltip="保存模板目录" Text="保存" meta:resourcekey="res_105_btn_SaveDTFolder" IconCls="ci-toolbar-GTP_save-png">
              </gtp:Button>
              <gtp:Button ID="btn_CloseWDTF" runat="server" Action="act_CloseWDTF" Tooltip="取消" Text="取消" meta:resourcekey="res_106_btn_CloseWDTF" IconCls="ci-toolbar-GTP_cancel-png">
              </gtp:Button>
              <gtp:ToolbarSeparator LabelSeparator="" ID="ToolbarSeparator" runat="server">
              </gtp:ToolbarSeparator>
            </Items>
          </gtp:CommandToolbar>
        </BottomBar>
        <LayoutConfig>
          <gtp:TableLayoutConfig Columns="1" ColumnWidths="[450]" MaxColumnWidths="[300]" MonitorResize="False">
          </gtp:TableLayoutConfig>
        </LayoutConfig>
        <Items>
          <gtp:TextField DataIndex="Name" ID="Efd_DTFName" runat="server" FieldLabel="目录名称" AllowBlank="false" MaxLength="255" meta:resourcekey="res_107_Efd_DTFName">
          </gtp:TextField>
          <gtp:LookupField RefPage="/GTP/AppFrameV2/Org/DeptLookupPage/DeptLookupPage.aspx" DataIndex="ApplyDept.Name" ID="Efd_ApplyDept_Name" runat="server" FieldLabel="应用部门" AllowBlank="false" MaxLength="255" meta:resourcekey="res_108_Efd_ApplyDept_Name">
            <InputMappings>
              <gtp:LookupInputMapping Target="ApplyDept.DeptId" Source="OutEntity.Id" IsCollection="False" Type="Entity" />
              <gtp:LookupInputMapping Target="ApplyDept.Name" Source="OutEntity.Name" IsCollection="False" Type="Entity" />
            </InputMappings>
            <OutputMappings>
              <gtp:LookupOutputMapping Target="deployIsRoot" Source="true" IsCollection="False" Type="Boolean" />
              <gtp:LookupOutputMapping Target="dummySelect" Source="false" IsCollection="False" Type="Boolean" />
              <gtp:LookupOutputMapping Target="dummyVisible" Source="true" IsCollection="False" Type="Boolean" />
              <gtp:LookupOutputMapping Target="deployDeptId" Source="ApplyDept.DeptId" IsCollection="False" Type="Entity" />
            </OutputMappings>
            <Listeners>
              <BeforeLookup Handler="Efd_ApplyDept_Name_BeforeLookup" />
            </Listeners>
          </gtp:LookupField>
          <gtp:EnumField DataIndex="ApplyRange" ID="Efd_ApplyRange" runat="server" FieldLabel="应用范围" EnumType="GTP.AppFrameV2.DocTemplate.OwnerRange" meta:resourcekey="res_109_Efd_ApplyRange">
          </gtp:EnumField>
          <gtp:TextArea DataIndex="Remark" ID="Efd_DTFRemark" runat="server" FieldLabel="备注" meta:resourcekey="res_110_Efd_DTFRemark">
          </gtp:TextArea>
        </Items>
      </gtp:FormPanel>
    </Items>
  </gtp:Window>
  <gtp:Window runat="server" ID="windowDT" AutoRender="false" Title="文档模板信息" Hidden="true" Height="400" Width="500" Layout="FitLayout" Icon="Application" BodyStyle="background-color: #fff;" Padding="2" Modal="true" meta:resourcekey="res_111_windowDT"  >
    <Items>
      <gtp:FormPanel ID="entityDT" AutoRender="false" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:10px;padding-bottom:10px" DataSource="DTFile" LabelWidth="60" LabelAlign="Left" meta:resourcekey="res_112_entityDT">
        <BottomBar>
          <gtp:CommandToolbar runat="server" ID="entityDT_toolbar" ButtonAlign="Right">
            <Items>
              <gtp:Button ID="btn_SaveDT" runat="server" Action="act_SaveDT" Tooltip="保存模板" Text="保存" meta:resourcekey="res_113_btn_SaveDT" IconCls="ci-toolbar-GTP_save-png">
              </gtp:Button>
              <gtp:Button ID="btn_CloseWDT" runat="server" Action="act_CloseWDT" Tooltip="取消" Text="取消" meta:resourcekey="res_114_btn_CloseWDT" IconCls="ci-toolbar-GTP_cancel-png">
              </gtp:Button>
              <gtp:ToolbarSeparator LabelSeparator="" ID="ToolbarSeparator1" runat="server">
              </gtp:ToolbarSeparator>
            </Items>
          </gtp:CommandToolbar>
        </BottomBar>
        <LayoutConfig>
          <gtp:TableLayoutConfig Columns="1" ColumnWidths="[450]" MaxColumnWidths="[300]" MonitorResize="False">
          </gtp:TableLayoutConfig>
        </LayoutConfig>
        <Items>
          <gtp:TextField DataIndex="Code" ID="Efd_Code" runat="server" FieldLabel="模板编码" MaxLength="255" meta:resourcekey="res_115_Efd_Code">
          </gtp:TextField>
          <gtp:CustomTriggerField DataIndex="Name" ID="Efd_Name" runat="server" FieldLabel="模板名称" AllowBlank="false" meta:resourcekey="res_116_Efd_Name">
            <Listeners>
              <TriggerClick Handler="Efd_Name_TriggerClick" />
            </Listeners>
          </gtp:CustomTriggerField>
          <gtp:TextField DataIndex="Version" ID="Efd_Version" runat="server" FieldLabel="模板版本" MaxLength="255" meta:resourcekey="res_117_Efd_Version">
          </gtp:TextField>
          <gtp:TextArea DataIndex="Summary" ID="Efd_Summary" runat="server" FieldLabel="摘要" meta:resourcekey="res_118_Efd_Summary">
          </gtp:TextArea>
          <gtp:TextArea DataIndex="Remark" ID="Efd_Remark" runat="server" FieldLabel="备注" meta:resourcekey="res_119_Efd_Remark">
          </gtp:TextArea>
        </Items>
      </gtp:FormPanel>
    </Items>
  </gtp:Window>
