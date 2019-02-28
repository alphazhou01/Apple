<%@ Page Language="C#" Inherits="GTP.Runtime.WebControls.GTPPage" Culture="auto"  ContentType="text/javascript" UICulture="auto" meta:resourcekey="res_1_DynaExpressionPage" %>
<%@ Register Assembly="GTP.Runtime.WebControls" Namespace="GTP.Runtime.WebControls" TagPrefix="gtp" %>

  <gtp:ResourceManager ID="resourceManager" runat="server" PageNamespace="GTP.AppFrameV2.DynaBizComp" InitScriptMode="Jsx" PageName="DynaExpressionPage" PageWidth="400" PageHeight="350" >
    <Listeners>
      <DocumentReady Handler="Page_DocumentReady" />
    </Listeners>
  </gtp:ResourceManager>
  <gtp:ResourcePlaceHolder runat="server" Mode="ScriptFiles" >
  </gtp:ResourcePlaceHolder>
  <gtp:PageParam ID="pageParam" runat="server" >
    <InputParams>
      <gtp:InputParam Name="ExpressionText" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="EntityName" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="ModuleCode" IsCollection="False" Type="String" Value="" />
      <gtp:InputParam Name="ExtensionId" IsCollection="False" Type="Number" Value="" />
      <gtp:InputParam Name="PropertyInfos" IsCollection="False" Type="String" Value="" />
    </InputParams>
    <OutputParams>
      <gtp:OutputParam Name="OutExpressionText" IsCollection="False" Type="String" Value="" />
    </OutputParams>
  </gtp:PageParam>
  <gtp:DataContext ID="dataContext1" runat="server" >
    <items>
      <gtp:DataSource Name="FoundationCategory" Alias="函数分类" Type="">
        <Fields>
          <gtp:DataField Name="CategoryName" Alias="分类名称" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="FoundationItem" Alias="系统函数" Type="">
        <Fields>
          <gtp:DataField Name="MethodName" Alias="函数名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="MethodParams" Alias="函数参数" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="ReturnValue" Alias="返回值" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Description" Alias="描述" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="EnvironmentVariables" Alias="环境变量" Type="">
        <Fields>
          <gtp:DataField Name="VariablesName" Alias="变量名称" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="Description" Alias="描述" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="ExpressionInfo" Alias="表达式信息" Type="">
        <Fields>
          <gtp:DataField Name="ExpressionValue" Alias="表达式" Type="String" TrimBlank="true">
          </gtp:DataField>
        </Fields>
      </gtp:DataSource>
      <gtp:DataSource Name="DynaPropertyInfo" Alias="动态属性定义" Type="GTP.AppFrameV2.DynaBizComp.DynamicPropertyDefinition">
        <Fields>
          <gtp:DataField Name="Id" Alias="扩展属性主键" Type="Int" PrimaryKey="true">
          </gtp:DataField>
          <gtp:DataField Name="PropertyName" Alias="属性名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="PropertyAlias" Alias="显示名" Type="String" TrimBlank="true">
          </gtp:DataField>
          <gtp:DataField Name="DataType" Alias="数据类型" Type="String" TrimBlank="true">
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
      <gtp:Action ID="actReset" runat="server" Disabled="false" Hidden="false" Handler="actReset_Handler" Text="重置" meta:resourcekey="res_4_actReset" >
      </gtp:Action>
      <gtp:Action ID="actClear" runat="server" Disabled="false" Hidden="false" Handler="actClear_Handler" Text="清空" meta:resourcekey="res_5_actClear" >
      </gtp:Action>
    </Items>
  </gtp:Actions>
  <gtp:States ID="States1" runat="server" >
    <Items>
      <gtp:State Name="STATE_ORIGINAL">
        <Items>
          <gtp:StateItem ReferenceName="tabView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tabFoundation" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="tabVariable" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="tabDynaProperty" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="tabEVariable" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="containerView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="categoryView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="categoryView.col_CategoryName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="foundationView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="foundationView.col_MethodName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="foundationView.col_MethodParams" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="foundationView.col_ReturnValue" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="foundationView.col_Description" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="containerView1" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="ExpressionView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="Efd_ExpressionValue" ReadOnly="false" Hidden="false" />
          <gtp:StateItem ReferenceName="toolbarView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnReset" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btnClear" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsEdit" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actAccept" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="btn_actCancel" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="tsAccept" Hidden="false" />
          <gtp:StateItem ReferenceName="eVariablesView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="eVariablesView.col_VariablesName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="eVariablesView.col_Description" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="dynaPropertyView" Disabled="false" Hidden="false" />
          <gtp:StateItem ReferenceName="dynaPropertyView.col_PropertyName" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="dynaPropertyView.col_PropertyAlias" Hidden="false" ReadOnly="false" />
          <gtp:StateItem ReferenceName="dynaPropertyView.col_DataType" Hidden="false" ReadOnly="false" />
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
      <gtp:Panel ID="layoutPanel1" runat="server" Header="false" Title="" Region="North" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="240" meta:resourcekey="res_6_1" >
        <Items>
          <gtp:TabPanel runat="server" ID="tabView" DeferredRender="true" Plain="true" EnableTabScroll="true" Title="" meta:resourcekey="res_7_tabView">
            <Listeners>
              <TabChange Handler="tabView_TabChange" />
            </Listeners>
            <Plugins>
              <gtp:TabScrollerMenu runat="server" PageSize="50">
              </gtp:TabScrollerMenu>
            </Plugins>
            <Items>
              <gtp:Panel runat="server" ID="tabFoundation" Hidden="False" Title="系统函数" Layout="fit" Border="false" meta:resourcekey="res_8_tabFoundation">
                <Items>
                  <gtp:Panel runat="server" ID="containerView" Layout="border" meta:resourcekey="res_9_containerView">
                    <Items>
                      <gtp:Panel ID="layoutPanel2" runat="server" Header="false" Title="" Region="West" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="true" Width="125" meta:resourcekey="res_10_1">
                        <Items>
                          <gtp:GridPanel ID="categoryView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="FoundationCategory" Title="函数分类" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_11_categoryView">
                            <ColumnModel runat="server">
                              <Columns>
                                <gtp:TextColumn ColumnID="col_CategoryName" Align="Left" DataIndex="CategoryName" Header="分类名称" Editable="false" meta:resourcekey="res_12_col_CategoryName">
                                </gtp:TextColumn>
                              </Columns>
                            </ColumnModel>
                            <View>
                              <gtp:GridView runat="server">
                              </gtp:GridView>
                            </View>
                            <Listeners>
                              <Click Handler="categoryView_Click" />
                            </Listeners>
                          </gtp:GridPanel>
                        </Items>
                      </gtp:Panel>
                      <gtp:Panel ID="layoutPanel3" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_13_2">
                        <Items>
                          <gtp:GridPanel ID="foundationView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="FoundationItem" Title="系统函数" Height="0" AutoCellSizeMode="None" HideGroupedColumn="true" meta:resourcekey="res_14_foundationView">
                            <ColumnModel runat="server">
                              <Columns>
                                <gtp:TextColumn ColumnID="col_MethodName" Align="Left" DataIndex="MethodName" Header="函数名称" Width="75" Editable="false" meta:resourcekey="res_15_col_MethodName">
                                </gtp:TextColumn>
                                <gtp:TextColumn ColumnID="col_MethodParams" Align="Left" DataIndex="MethodParams" Header="函数参数" Editable="false" meta:resourcekey="res_16_col_MethodParams">
                                </gtp:TextColumn>
                                <gtp:TextColumn ColumnID="col_ReturnValue" Align="Left" DataIndex="ReturnValue" Header="返回值" Editable="false" meta:resourcekey="res_17_col_ReturnValue">
                                </gtp:TextColumn>
                                <gtp:TextColumn ColumnID="col_Description" Align="Left" DataIndex="Description" Header="描述" Width="250" Editable="false" meta:resourcekey="res_18_col_Description">
                                </gtp:TextColumn>
                              </Columns>
                            </ColumnModel>
                            <View>
                              <gtp:GridView runat="server">
                              </gtp:GridView>
                            </View>
                            <Listeners>
                              <DblClick Handler="foundationView_DblClick" />
                            </Listeners>
                          </gtp:GridPanel>
                        </Items>
                      </gtp:Panel>
                    </Items>
                  </gtp:Panel>
                </Items>
              </gtp:Panel>
              <gtp:Panel runat="server" ID="tabVariable" Hidden="False" Title="业务属性" Layout="fit" Border="false" meta:resourcekey="res_19_tabVariable">
                <Items>
                  <gtp:Panel runat="server" ID="containerView1" Layout="border" meta:resourcekey="res_20_containerView1">
                    <Items>
                      <gtp:Panel ID="layoutPanel4" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_21_1">
                        <Items>
                        </Items>
                      </gtp:Panel>
                    </Items>
                  </gtp:Panel>
                </Items>
              </gtp:Panel>
              <gtp:Panel runat="server" ID="tabDynaProperty" Hidden="False" Title="扩展属性" Layout="fit" Border="false" meta:resourcekey="res_22_tabDynaProperty">
                <Items>
                  <gtp:GridPanel ID="dynaPropertyView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="DynaPropertyInfo" Title="扩展属性" AutoCellSizeMode="None" Header="false" HideGroupedColumn="true" meta:resourcekey="res_23_dynaPropertyView">
                    <ColumnModel runat="server">
                      <Columns>
                        <gtp:TextColumn ColumnID="col_PropertyName" Align="Left" DataIndex="PropertyName" Header="属性编码" Width="150" Editable="false" meta:resourcekey="res_24_col_PropertyName">
                        </gtp:TextColumn>
                        <gtp:TextColumn ColumnID="col_PropertyAlias" Align="Left" DataIndex="PropertyAlias" Header="属性名称" Width="150" Editable="false" meta:resourcekey="res_25_col_PropertyAlias">
                        </gtp:TextColumn>
                        <gtp:TextColumn ColumnID="col_DataType" Align="Left" DataIndex="DataType" Header="数据类型" Editable="false" meta:resourcekey="res_26_col_DataType">
                          <Renderer Handler="col_DataType_Renderer" />
                        </gtp:TextColumn>
                      </Columns>
                    </ColumnModel>
                    <View>
                      <gtp:GridView runat="server">
                      </gtp:GridView>
                    </View>
                    <Listeners>
                      <DblClick Handler="dynaPropertyView_DblClick" />
                    </Listeners>
                  </gtp:GridPanel>
                </Items>
              </gtp:Panel>
              <gtp:Panel runat="server" ID="tabEVariable" Hidden="False" Title="环境变量" Layout="fit" Border="false" meta:resourcekey="res_27_tabEVariable">
                <Items>
                  <gtp:GridPanel ID="eVariablesView" Style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:0px" runat="server" DataSource="EnvironmentVariables" Title="环境变量" AutoCellSizeMode="None" Header="false" HideGroupedColumn="true" meta:resourcekey="res_28_eVariablesView">
                    <ColumnModel runat="server">
                      <Columns>
                        <gtp:TextColumn ColumnID="col_VariablesName" Align="Left" DataIndex="VariablesName" Header="变量名称" Width="190" Editable="false" meta:resourcekey="res_29_col_VariablesName">
                        </gtp:TextColumn>
                        <gtp:TextColumn ColumnID="col_Description" Align="Left" DataIndex="Description" Header="描述" Width="300" Editable="false" meta:resourcekey="res_30_col_Description">
                        </gtp:TextColumn>
                      </Columns>
                    </ColumnModel>
                    <View>
                      <gtp:GridView runat="server">
                      </gtp:GridView>
                    </View>
                    <Listeners>
                      <DblClick Handler="eVariablesView_DblClick" />
                    </Listeners>
                  </gtp:GridPanel>
                </Items>
              </gtp:Panel>
            </Items>
          </gtp:TabPanel>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel5" runat="server" Header="false" Title="" Region="Center" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" meta:resourcekey="res_31_2" >
        <Items>
          <gtp:FormPanel ID="ExpressionView" runat="server" Title="" BodyStyle="padding-left:10px;padding-right:10px;&#xD;&#xA;  padding-top:10px;padding-bottom:10px" DataSource="ExpressionInfo" LabelWidth="60" LabelAlign="Left" HideLabels="true" Height="55" Border="false" meta:resourcekey="res_32_ExpressionView">
            <LayoutConfig>
              <gtp:TableLayoutConfig Columns="1" ColumnWidths="[680]" MaxColumnWidths="[600]" MonitorResize="True">
              </gtp:TableLayoutConfig>
            </LayoutConfig>
            <Items>
              <gtp:TextArea DataIndex="ExpressionValue" ID="Efd_ExpressionValue" runat="server" RowSpan="2" FieldLabel="表达式" MaxLength="500" Height="50" meta:resourcekey="res_33_Efd_ExpressionValue">
              </gtp:TextArea>
            </Items>
          </gtp:FormPanel>
        </Items>
      </gtp:Panel>
      <gtp:Panel ID="layoutPanel6" runat="server" Header="false" Title="" Region="South" Layout="fit" Border="false" Padding="0" CollapseMode="Mini" Collapsed="false" Collapsible="false" Split="false" Height="35" meta:resourcekey="res_34_3" >
        <Items>
          <gtp:ToolbarPanel ID="toolbarView" runat="server">
            <Items>
              <gtp:CommandToolbar runat="server" ID="toolbarView_toolbar" ButtonAlign="Right">
                <Items>
                  <gtp:Button ID="btnReset" runat="server" Width="55" Action="actReset" Text="重置" meta:resourcekey="res_35_btnReset">
                  </gtp:Button>
                  <gtp:Button ID="btnClear" runat="server" Width="55" Action="actClear" Text="清空" meta:resourcekey="res_36_btnClear">
                  </gtp:Button>
                  <gtp:ToolbarSpacer LabelSeparator="" ID="tsEdit" runat="server" Width="15">
                  </gtp:ToolbarSpacer>
                  <gtp:Button ID="btn_actAccept" runat="server" Width="55" Action="actAccept" Text="确定" meta:resourcekey="res_37_btn_actAccept">
                  </gtp:Button>
                  <gtp:Button ID="btn_actCancel" runat="server" Width="55" Action="actCancel" Text="取消" meta:resourcekey="res_38_btn_actCancel">
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
