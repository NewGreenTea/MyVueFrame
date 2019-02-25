<template>
  <div class="checkWriteCss">
    <Row>
      <Col span="9" offset="3">
        <Button @click="showBaseInfo" :class="{'buttonSelect': butOnSelect.activeIndex === 1}">基本信息</Button>
        <Button @click="showProfInfo" :class="{'buttonSelect': butOnSelect.activeIndex === 2}">专业信息</Button>
        <Button @click="showFileInfo" :class="{'buttonSelect': butOnSelect.activeIndex === 3}">文件信息</Button>
        <Button @click="goBack">返回</Button>
      </Col>
      <Col span="6" offset="6" v-if="!this.checkParams.openCheck">
        <Button @click="successCheck" type="success">质检通过</Button>
        <Button @click="failCheck" type="error">质检不通过</Button>
      </Col>
    </Row>

    <Modal v-model="showModal" :title="modalTitle" draggable :mask-closable="false" @on-ok="modelOK"
           @on-cancel="modelCancel">
      <div>
        <Form class="checkFormClass">
          <FormItem label="原因：">
            <Input type="textarea" :autosize="reasonText" placeholder="..." v-model="reason"/>
          </FormItem>
        </Form>
      </div>
    </Modal>

    <!-- 基本信息 -->
    <Row v-if="base" class="displayClass">
      <Col span="20" offset="1">
        <Form class="checkFormClass" :model="baseArch" ref="BaseInfoForm">
          <Row>
            <!--立案号,档号,案卷类别-->
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="立案号：" prop="registerNo">
                    <!--<Input placeholder="..." v-model="baseArch.registerNo" class="writeInput"/>-->
                    {{baseArch.registerNo}}
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="档号：">
                    <!--<Input placeholder="..." v-model="baseArch.archNo" class="colorBack writeInput" disabled/>-->
                    {{baseArch.archNo}}
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="案卷类别：">
                    <!--<Input placeholder="..." v-model="baseArch.archType" class="colorBack writeInput" disabled/>-->
                    {{baseArch.archType}}
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <!--案卷标题-->
            <Col>
              <FormItem class="FormItemClass" label="案卷标题：">
                <!--<Input placeholder="..." v-model="baseArch.archTitle" style="width: 93%;float: right"/>-->
                {{baseArch.archTitle}}
              </FormItem>
            </Col>

            <!--编制单位-->
            <Col>
              <FormItem class="FormItemClass" label="编制单位：">
                <!--<Input placeholder="..." v-model="baseArch.company" style="width: 93%;float: right"/>-->
                {{baseArch.company}}
              </FormItem>
            </Col>

            <!--编制日期,进管日期,保管期限-->
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="编制日期：">
                    <!--<DatePicker placeholder="Select date" format="yyyy-MM-dd" class="writeInput"-->
                    <!--@on-change="baseArch.date=$event" v-model="baseArch.date"></DatePicker>-->
                    {{baseArch.date}}
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="进管日期：">
                    <!--<DatePicker placeholder="Select date" format="yyyy-MM-dd" class="writeInput"-->
                    <!--@on-change="baseArch.inputDate=$event" v-model="baseArch.inputDate"></DatePicker>-->
                    {{baseArch.inputDate}}
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="保管期限：">
                    <!--<Input placeholder="..." v-model="baseArch.storageType" class="writeInput"/>-->
                    {{baseArch.storageType}}
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <!--发文号：文种类别,年份,流水号-->
            <Col>
              <Row>
                <Col>
                  <FormItem class="FormItemClass" label="发文号：">
                    <!--<Input placeholder="发文号：文种类别" v-model="baseArch.dispatchNoType" class="writeInput"/>-->
                    {{baseArch.dispatchNoType}}&nbsp;
                    <!--<Input placeholder="发文号：年份" v-model="baseArch.dispatchNoYear" class="writeInput"/>-->
                    〔 {{baseArch.dispatchNoYear}} 〕
                    <!--<Input placeholder="发文号：流水号" v-model="baseArch.dispatchNoNum" class="writeInput"/>-->
                    &nbsp;{{baseArch.dispatchNoNum}} 号
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="公开属性：">
                    <!--<i-select placeholder="属性" class="writeInput" v-model="baseArch.publicProperty">-->
                    <!--<i-option :key="item" v-for="item in pubProperty" :value="item">{{item}}</i-option>-->
                    <!--</i-select>-->
                    {{baseArch.publicProperty}}
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="密级：">
                    <!--<Input placeholder="..." v-model="baseArch.secretLv" class="writeInput"/>-->
                    {{baseArch.secretLv}}
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="案卷页数：">
                    <!--<Input placeholder="..." v-model="baseArch.archPage" class="writeInput"/>-->
                    {{baseArch.archPage}}
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="经办人：">
                    <!--<Input placeholder="..." v-model="baseArch.operator" class="writeInput"/>-->
                    {{baseArch.operator}}
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="立卷审核人：">
                    <!--<Input placeholder="..." v-model="baseArch.archAuditor" class="writeInput"/>-->
                    {{baseArch.archAuditor}}
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="立卷人：">
                    <!--<Input placeholder="..." v-model="baseArch.archfileCreator" class="writeInput"/>-->
                    {{baseArch.archfileCreator}}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>

    <!-- 专业信息 -->
    <Row v-if="prof" class="displayClass">
      <!-- 专业基本 -->
      <Col span="20" offset="1">
        <Form class="checkFormClass" :model="profArch">
          <Row>
            <Col>
              <Row>
                <Col span="12">
                  <FormItem class="FormItemClass" label="建设单位：">
                    <!--<Input placeholder="..." v-model="profArch.buildCompany" class="writeInput"/>-->
                    {{profArch.buildCompany}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="建设项目：">
                    <!--<Input placeholder="..." v-model="profArch.buildProject" class="writeInput"/>-->
                    {{profArch.buildProject}}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>
      <!-- 专业项目地点 -->
      <Col span="20" offset="1">
        <Form class="checkFormClass" :model="buildingAddressInfo">
          <Row>
            <Col>
              <FormItem label="建设地址：" class="FormItemClass">
                <Row>
                  <Col>
                    <p>
                      <!--<Input placeholder="..." v-model="buildingAddressInfo.area" class="writeInput"/>-->
                      <span v-if="buildingAddressInfo!== null" class="displaySpan"> {{buildingAddressInfo.area}}</span>
                      <!--<Input placeholder="..." v-model="buildingAddressInfo.road" class="writeInput"/>-->
                      <span v-if="buildingAddressInfo!== null" class="displaySpan">{{buildingAddressInfo.road}}</span>
                      <!--<Input placeholder="..." v-model="buildingAddressInfo.street" class="writeInput"/>-->
                      <span v-if="buildingAddressInfo!== null" class="displaySpan">{{buildingAddressInfo.street}}</span>
                      <!--<Input placeholder="..." v-model="buildingAddressInfo.no" class="writeInput"/>-->
                      <span v-if="buildingAddressInfo!== null" class="displaySpan">{{buildingAddressInfo.no}}</span>
                    </p>
                  </Col>
                </Row>
              </FormItem>

            </Col>
          </Row>
        </Form>
      </Col>

      <!-- 个性专业信息 -->
      <Col span="20" offset="1">
        <Row v-if="C61Info.archId !== ''">
          <Form class="checkFormClass" :model="C61Info">
            <Col>
              <Row>
                <Col span="12">
                  <FormItem class="FormItemClass" label="总用地面积：" prop="totalArea">
                    <!--<Input placeholder="..." v-model="C61Info.totalArea" class="writeInput"/>-->
                    {{(C61Info !== null && C61Info.totalArea !== null)? C61Info.totalArea +'（m²/平方米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="可建设用地面积(净用地面积)：" prop="buildArea">
                    <!--<Input placeholder="..." v-model="C61Info.buildArea" class="writeInput"/>-->
                    {{(C61Info !== null && C61Info.buildArea !== null)? C61Info.buildArea +'（m²/平方米）': ''}}
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col span="12">
                  <FormItem class="FormItemClass" label="道路用地面积：" prop="roadArea">
                    <!--<Input placeholder="..." v-model="C61Info.roadArea" class="writeInput"/>-->
                    {{(C61Info !== null && C61Info.roadArea !== null)? C61Info.roadArea +'（m²/平方米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="容积率：" prop="plotRatio">
                    <!--<Input placeholder="..." v-model="C61Info.plotRatio" class="writeInput"/>-->
                    {{(C61Info !== null && C61Info.plotRatio !== null)? C61Info.plotRatio +'（%）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="建筑密度：" prop="buildDensity">
                    <!--<Input placeholder="..." v-model="C61Info.buildDensity" class="writeInput"/>-->
                    {{(C61Info !== null && C61Info.buildDensity !== null)? C61Info.buildDensity +'（kg/m³）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="绿地率：" prop="greenSpaceRatio">
                    <!--<Input placeholder="..." v-model="C61Info.greenSpaceRatio" class="writeInput"/>-->
                    {{(C61Info !== null && C61Info.greenSpaceRatio !== null)? C61Info.greenSpaceRatio +'（%）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="居住人口：" prop="population">
                    <!--<Input placeholder="..." v-model="C61Info.population" class="writeInput"/>-->
                    {{(C61Info !== null && C61Info.population !== null)? C61Info.population +'（万）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="计算容积率建筑面积：" prop="plotRatioArea">
                    <!--<Input placeholder="..." v-model="C61Info.plotRatioArea" class="writeInput"/>-->
                    {{(C61Info !== null && C61Info.plotRatioArea !== null)? C61Info.plotRatioArea +'（m²/平方米）': ''}}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Form>
        </Row>

        <Row v-if="C62Info.archId !== ''">
          <Form class="checkFormClass" :model="C62Info">
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="规划设计单位：">
                    <!--<Input placeholder="..." v-model="C62Info.designCompany" class="writeInput"/>-->
                    {{C62Info.designCompany}}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Form>
        </Row>

        <Row v-if="C63Info.archId !== ''">
          <Form class="checkFormClass" :model="C63Info">
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="规划设计单位：">
                    <!--<Input placeholder="..." v-model="C63Info.designCompany" class="writeInput"/>-->
                    {{C63Info.designCompany}}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Form>
        </Row>

        <Row v-if="D21Info.archId !== ''">
          <Form class="checkFormClass" :model="D21Info">
            <Col>
              <Row>
                <Col span="12">
                  <FormItem class="FormItemClass" label="规划批面积（总用地面积）：" prop="totalArea">
                    <!--<Input placeholder="..." v-model="D21Info.totalArea" class="writeInput"/>-->
                    {{(D21Info !== null && D21Info.totalArea !== null)? D21Info.totalArea +'（m²/平方米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="拟征地现状土地类别：">
                    <!--<Input placeholder="..." v-model="D21Info.areaClass" class="writeInput"/>-->
                    {{D21Info.areaClass}}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Form>
        </Row>

        <Row v-if="D22Info.archId !== ''">
          <Form class="checkFormClass" :model="D22Info">
            <Col>
              <Row>
                <Col span="12">
                  <FormItem class="FormItemClass" label="规划批面积（总用地面积）：" prop="totalArea">
                    <!--<Input placeholder="..." v-model="D22Info.totalArea" class="writeInput"/>-->
                    {{(D22Info !== null && D22Info.totalArea !== null)? D22Info.totalArea +'（m²/平方米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="拟征地现状土地类别：">
                    <!--<Input placeholder="..." v-model="D22Info.areaClass" class="writeInput"/>-->
                    {{D22Info.areaClass}}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Form>
        </Row>

        <Row v-if="D31Info.archId !== ''">
          <Form class="checkFormClass" :model="D31Info">
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="设计单位：">
                    <!--<Input placeholder="..." v-model="D31Info.designCompany" class="writeInput"/>-->
                    {{D31Info.designCompany}}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Form>
        </Row>

        <Row v-if="D32Info.archId !== ''">
          <Form class="checkFormClass" :model="D32Info">
            <Col>
              <Row>
                <Col span="12">
                  <FormItem class="FormItemClass" label="起止点：">
                    <!--<Input placeholder="..." v-model="D32Info.roadStart" class="writeInput"/>-->
                    {{D32Info.roadStart}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="断面形式：">
                    <!--<Input placeholder="..." v-model="D32Info.roadTypeAspect" class="writeInput"/>-->
                    {{D32Info.roadTypeAspect}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="道路长度：">
                    <!--<Input placeholder="..." v-model="D32Info.roadLength" class="writeInput"/>-->
                    {{(D32Info !== null && D32Info.roadLength !== null)? D32Info.roadLength +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="道路开口：">
                    <!--<Input placeholder="..." v-model="D32Info.roadCrossing" class="writeInput"/>-->
                    {{D32Info.roadCrossing}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="平面位置：">
                    <!--<Input placeholder="..." v-model="D32Info.roadAspectPosition" class="writeInput"/>-->
                    {{D32Info.roadAspectPosition}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="跨越区域：">
                    <!--<Input placeholder="..." v-model="D32Info.bridgeCrossingArea" class="writeInput"/>-->
                    {{D32Info.bridgeCrossingArea}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="桥面长度：">
                    <!--<Input placeholder="..." v-model="D32Info.bridgeLength" class="writeInput"/>-->
                    {{(D32Info !== null && D32Info.bridgeLength !== null)? D32Info.bridgeLength +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="总长度：">
                    <!--<Input placeholder="..." v-model="D32Info.bridgeTotalLength" class="writeInput"/>-->
                    {{(D32Info !== null && D32Info.bridgeTotalLength !== null)? D32Info.bridgeTotalLength +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="净空高度：">
                    <!--<Input placeholder="..." v-model="D32Info.bridgeHight" class="writeInput"/>-->
                    {{(D32Info !== null && D32Info.bridgeHight !== null)? D32Info.bridgeHight +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="平面位置：">
                    <!--<Input placeholder="..." v-model="D32Info.bridgeAspectPosition" class="writeInput"/>-->
                    {{D32Info.bridgeAspectPosition}}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Form>
        </Row>

        <Row v-if="D34Info.archId !== ''">
          <Form class="checkFormClass" :model="D34Info">
            <Col>
              <Row>
                <Col span="12">
                  <FormItem class="FormItemClass" label="起止点：">
                    <!--<Input placeholder="..." v-model="D34Info.overheadPipeStart" class="writeInput"/>-->
                    {{D34Info.overheadPipeStart}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="管径规格：">
                    <!--<Input placeholder="..." v-model="D34Info.overheadPipeType" class="writeInput"/>-->
                    {{D34Info.overheadPipeType}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="管线长度：">
                    <!--<Input placeholder="..." v-model="D34Info.overheadPipeLength" class="writeInput"/>-->
                    {{(D34Info !== null && D34Info.overheadPipeLength !== null)? D34Info.overheadPipeLength +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="架空高度：">
                    <!--<Input placeholder="..." v-model="D34Info.overheadPipeHight" class="writeInput"/>-->
                    {{(D34Info !== null && D34Info.overheadPipeHight !== null)? D34Info.overheadPipeHight +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="平面位置：">
                    <!--<Input placeholder="..." v-model="D34Info.overheadPipeEtc" class="writeInput"/>-->
                    {{D34Info.overheadPipeEtc}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="起止点：">
                    <!--<Input placeholder="..." v-model="D34Info.underPipeStart" class="writeInput"/>-->
                    {{D34Info.underPipeStart}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="管径规格：">
                    <!--<Input placeholder="..." v-model="D34Info.underPipeType" class="writeInput"/>-->
                    {{D34Info.underPipeType}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="管线长度：">
                    <!--<Input placeholder="..." v-model="D34Info.underPipeLength" class="writeInput"/>-->
                    {{(D34Info !== null && D34Info.underPipeLength !== null)? D34Info.underPipeLength +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="埋设深度：">
                    <!--<Input placeholder="..." v-model="D34Info.underPipeHight" class="writeInput"/>-->
                    {{(D34Info !== null && D32Info.underPipeHight !== null)? D32Info.underPipeHight +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="平面位置：">
                    <!--<Input placeholder="..." v-model="D34Info.underPipePosition" class="writeInput"/>-->
                    {{D34Info.underPipePosition}}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Form>
        </Row>

        <Row v-if="D63Info.archId !== ''">
          <Form class="checkFormClass" :model="D63Info">
            <Col>
              <Row>
                <Col span="12">
                  <FormItem class="FormItemClass" label="起止点：">
                    <!--<Input placeholder="..." v-model="D63Info.overheadPipeStart" class="writeInput"/>-->
                    {{D63Info.overheadPipeStart}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="管径规格：">
                    <!--<Input placeholder="..." v-model="D63Info.overheadPipeType" class="writeInput"/>-->
                    {{D63Info.overheadPipeType}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="管线长度：">
                    <!--<Input placeholder="..." v-model="D63Info.overheadPipeLength" class="writeInput"/>-->
                    {{(D63Info !== null && D63Info.overheadPipeLength !== null)? D63Info.overheadPipeLength +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="架空高度：">
                    <!--<Input placeholder="..." v-model="D63Info.overheadPipeHight" class="writeInput"/>-->
                    {{(D63Info !== null && D63Info.overheadPipeHight !== null)? D63Info.overheadPipeHight +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="其他：">
                    <!--<Input placeholder="..." v-model="D63Info.overheadPipeEtc" class="writeInput"/>-->
                    {{D63Info.overheadPipeEtc}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="起止点：">
                    <!--<Input placeholder="..." v-model="D63Info.underPipeStart" class="writeInput"/>-->
                    {{D63Info.underPipeStart}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="管径规格：">
                    <!--<Input placeholder="..." v-model="D63Info.underPipeType" class="writeInput"/>-->
                    {{D63Info.underPipeType}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="管线长度：">
                    <!--<Input placeholder="..." v-model="D63Info.underPipeLength" class="writeInput"/>-->
                    {{(D63Info !== null && D63Info.underPipeLength !== null)? D63Info.underPipeLength +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="埋设深度：">
                    <!--<Input placeholder="..." v-model="D63Info.underPipeHight" class="writeInput"/>-->
                    {{(D63Info !== null && D63Info.underPipeHight !== null)? D63Info.underPipeHight +'（m/米）': ''}}
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem class="FormItemClass" label="其他：">
                    <!--<Input placeholder="..." v-model="D63Info.underPipeEtc" class="writeInput"/>-->
                    {{D63Info.underPipeEtc}}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Form>
        </Row>
      </Col>

      <!-- 个性专业表格信息 -->
      <Col span="20" offset="1" class="TableFontCss">
        <Row v-if="showD212">
          用地性质详细著录表
          <Table border :columns="UseAreaInfoColumns" :data="UseAreaInfoData" :height="tableHeight2"></Table>
        </Row>

        <Row v-if="showD31">
          报建项目详细表
          <Table border :columns="D31BuildProjColumns" :data="D31BuildProjData" :height="tableHeight2"></Table>
        </Row>
        <Row v-if="showD31">
          公建配套表
          <Table border :columns="D31PubBuildColumns" :data="D31PubBuildData" :height="tableHeight2"></Table>
        </Row>

        <Row v-if="showD61">
          公建配套详细表
          <Table border :columns="PubBuildInfoColumns" :data="PubBuildInfoData" :height="tableHeight2"></Table>
        </Row>
        <Row v-if="showD61">
          验收建筑层数与面积
          <Table border :columns="NumAreaInfoColumns" :data="NumAreaInfoData" :height="tableHeight2"></Table>
        </Row>
        <Row v-if="showD6123">
          验收测量记录册
          <Table border :columns="MeasureInfoColumns" :data="MeasureInfoData" :height="tableHeight2"></Table>
        </Row>
      </Col>

      <!-- 个性专业三大基本表格信息 -->
      <Col span="20" offset="1">
        <Row :gutter="16">
          <!-- 专业：地图型号 -->
          <Col span="8" class="TableFontCss">
            地图型号
            <Table border :columns="PMcolumns" :data="PMtableData" :height="tableHeight2"></Table>
          </Col>

          <!-- 专业：局历史审批文件编号 -->
          <Col span="8" class="TableFontCss">
            局历史审批文件编号
            <Table border :columns="PAHcolumns" :data="PAHtableData" :height="tableHeight2"></Table>
          </Col>

          <!-- 专业：建设工程规划许可证号-->
          <Col span="8" class="TableFontCss">
            建设工程规划许可证号
            <Table border :columns="PPNcolumns" :data="PPNtableData" :height="tableHeight2"></Table>
          </Col>
        </Row>
      </Col>
    </Row>

    <!-- 文件信息 -->
    <!--文件信息表格-->
    <Row v-if="file" class="displayClass">
      <Col span="22" offset="1" class="TableFontCss">
        <Table border :columns="columns" :data="tableData" :height="tableHeight" style="margin-top: 40px"></Table>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {CommonFunction} from "../../js/global";

  export default {
    name: "CheckLayout",
    props: ['checkParams'],
    data() {
      return {
        //基本
        base: true,
        baseArch: {
          id: '',
          archId: '',
          dispatchDocNo: '',
          registerNo: '',
          archNo: '',
          archTitle: '',
          company: '',
          date: '',
          inputDate: '',
          archPage: '',
          dispatchNoType: '',
          dispatchNoYear: '',
          dispatchNoNum: '',
          storageType: '',
          secretLv: '',
          operator: '',
          archAuditor: '',
          archfileCreator: '',
          archType: '',
          publicProperty: '',
          classId: ''
        },
        pubProperty: ['主动公开', '依申请公开', '免于公开', '(不填)'],
        //专业
        prof: false,
        profArch: {
          id: '',
          archId: '',
          archNo: '',
          buildCompany: '',
          buildProject: '',
          classId: ''
        },
        buildingAddressInfo: {
          id: '',
          archId: '',
          area: '',
          road: '',
          street: '',
          no: ''
        },
        PMcolumns: [
          {
            title: '序号',
            width: 100,
            type: 'index'
          },
          {
            title: '地图型号',
            key: 'mapNo'
          }
        ],
        PMtableData: [],
        PAHcolumns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '文种类别',
            key: 'hisType'
          },
          {
            title: '年份',
            key: 'hisYear'
          },
          {
            title: '流水号',
            key: 'hisNum'
          }
        ],
        PAHtableData: [],
        PPNcolumns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '文种类别',
            key: 'projType'
          },
          {
            title: '年份',
            key: 'projYear'
          },
          {
            title: '流水号',
            key: 'projNum'
          }
        ],
        PPNtableData: [],
        //专业个性
        C61Info: {
          id: '',
          archId: '',
          totalArea: '',
          buildArea: '',
          roadArea: '',
          plotRatio: '',
          buildDensity: '',
          greenSpaceRatio: '',
          population: '',
          plotRatioArea: '',
        },
        C62Info: {
          id: '',
          archId: '',
          designCompany: ''
        },
        C63Info: {
          id: '',
          archId: '',
          designCompany: ''
        },
        D21Info: {
          id: '',
          archId: '',
          totalArea: '',
          areaClass: ''
        },
        D22Info: {
          id: '',
          archId: '',
          totalArea: '',
          areaClass: ''
        },
        UseAreaInfoColumns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '用地性质',
            key: 'areaNature'
          },
          {
            title: '用地代码',
            key: 'areaCode'
          },
          {
            title: '分类用地面积',
            key: 'typeArea'
          }
        ],
        UseAreaInfoData: [], //D21,D22特有
        D31Info: {
          id: '',
          archId: '',
          designCompany: ''
        },
        D31BuildProjColumns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '项目名称',
            key: 'projectName'
          },
          {
            title: '幢数',
            key: 'buildingNum'
          },
          {
            title: '地上层数',
            key: 'overgroundFloor'
          },
          {
            title: '地下层数',
            key: 'undergroundFloor'
          },
          {
            title: '地上面积',
            key: 'overgroundArea'
          },
          {
            title: '地下面积',
            key: 'undergroundArea'
          },
          {
            title: '总建筑面积',
            key: 'totalArea'
          }
        ],
        D31BuildProjData: [],
        D31PubBuildColumns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '功能名称',
            key: 'functionName'
          },
          {
            title: '设计面积',
            key: 'designArea'
          },
          {
            title: '规划面积',
            key: 'planArea'
          },
          {
            title: '备注',
            key: 'etc'
          }
        ],
        D31PubBuildData: [],
        D32Info: {
          id: '',
          archId: '',
          roadStart: '',
          roadTypeAspect: '',
          roadLength: '',
          roadCrossing: '',
          roadAspectPosition: '',
          bridgeCrossingArea: '',
          bridgeLength: '',
          bridgeTotalLength: '',
          bridgeHight: '',
          bridgeAspectPosition: ''
        },
        D34Info: {
          id: '',
          archId: '',
          overheadPipeStart: '',
          overheadPipeType: '',
          overheadPipeLength: '',
          overheadPipeHight: '',
          overheadPipeEtc: '',
          underPipeStart: '',
          underPipeType: '',
          underPipeLength: '',
          underPipeHight: '',
          underPipePosition: ''
        },
        D63Info: {
          id: '',
          archId: '', // 读取出来
          overheadPipeStart: '',
          overheadPipeType: '',
          overheadPipeLength: '',
          overheadPipeHight: '',
          overheadPipeEtc: '',
          underPipeStart: '',
          underPipeType: '',
          underPipeLength: '',
          underPipeHight: '',
          underPipeEtc: ''
        },
        PubBuildInfoColumns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '项目名称',
            key: 'projectName'
          },
          {
            title: '独立用地面积',
            key: 'independentArea'
          },
          {
            title: '建筑面积',
            key: 'buildArea'
          },
          {
            title: '位置',
            key: 'position'
          }
        ],
        PubBuildInfoData: [], //D61特有
        NumAreaInfoColumns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '项目名称',
            key: 'projectName'
          },
          {
            title: '幢数',
            key: 'buildingNum'
          },
          {
            title: '地上层数',
            key: 'overgroundFloor'
          },
          {
            title: '地下层数',
            key: 'undergroundFloor'
          },
          {
            title: '地上面积',
            key: 'overgroundArea'
          },
          {
            title: '地下面积',
            key: 'undergroundArea'
          },
          {
            title: '总建筑面积',
            key: 'totalArea'
          }
        ],
        NumAreaInfoData: [], //D61特有
        MeasureInfoColumns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '记录册编号',
            key: 'remarkNo'
          }
        ],
        MeasureInfoData: [], //D61,D62,D63共有
        //专业信息显示配置
        showD212: false,
        showD31: false,
        showD61: false,
        showD6123: false,
        tableHeight2: '200px',
        //文件
        file: false,
        columns: [
          {
            title: '序号',
            width: 70,
            key: 'fileIndex'
          },
          {
            title: '文件编号',
            key: 'fileNo'
          },
          {
            title: '档号',
            key: 'archNo'
          },
          {
            title: '文件题名',
            render: (h, params) => {
              return h('Tooltip', {
                props: {
                  'content': params.row.fileTitle,
                  'max-width': 300
                }
              }, params.row.fileTitle.length > 23 ? params.row.fileTitle.substring(0, 23) + '...' : params.row.fileTitle)
            }
          },
          {
            title: '页号',
            key: 'pageNo'
          },
          {
            title: '文件材料分类',
            key: 'fileType'
          },
          {
            title: '责任者',
            key: 'liableId'
          },
          {
            title: '日期',
            key: 'fileDate',
            render: (h, params) => {
              let datadate = CommonFunction.dateFormate(new Date(params.row.fileDate))
              return h('div', datadate)
            }
          }
        ],
        tableData: [],
        tableHeight: '500px',
        //质检不通过原因说明框
        showModal: false,
        modalTitle: '',
        reason: '',
        reasonText: {
          minRows: 5,
          maxRows: 15
        },
        //按钮变色控制参数
        butOnSelect: {
          activeIndex: 1
        }
      }
    },
    methods: {
      //加载档案所有信息
      loadWriteCheck() {
        this.resetData();
        this.axios.get('/api/Arch/ArchID', {
          params: {
            'archId': this.checkParams.archId,
            'classId': this.checkParams.classId
          }
        })
          .then(res => {
            this.baseArch = res.data.data.list[0].baseInfoVO;
            this.modalTitle = '档号：' + this.baseArch.archNo;
            this.profArch = res.data.data.list[0].profInfoVO;
            this.buildingAddressInfo = res.data.data.list[0].buildAddVO;
            this.PMtableData = res.data.data.list[0].mapInfoVO;
            this.PAHtableData = res.data.data.list[0].areaHisVO;
            this.PPNtableData = res.data.data.list[0].projNoVO;
            this.tableData = res.data.data.list[0].fileInfoVO;
            //个性
            if (this.checkParams.archType === 'C61') {
              //同下 --2019/01/14
              if (res.data.data.list[0].c61SpecInfoVO !== null) {
                this.C61Info = res.data.data.list[0].c61SpecInfoVO;
              } else {
                this.C61Info.archId = this.checkParams.archId
              }
            }
            if (this.checkParams.archType === 'C62') {
              //同下 --2019/01/14
              if (res.data.data.list[0].c62SpecInfoVO !== null) {
                this.C62Info = res.data.data.list[0].c62SpecInfoVO;
              } else {
                this.C62Info.archId = this.checkParams.archId
              }
            }
            if (this.checkParams.archType === 'C63') {
              //同下 --2019/01/14
              if (res.data.data.list[0].c63SpecInfoVO !== null) {
                this.C63Info = res.data.data.list[0].c63SpecInfoVO;
              } else {
                this.C63Info.archId = this.checkParams.archId
              }
            }
            if (this.checkParams.archType === 'D21') {
              this.showD212 = true;
              if (res.data.data.list[0].d21SpecInfoVO !== null) {
                this.D21Info = res.data.data.list[0].d21SpecInfoVO;
              } else {
                this.D21Info.archId = this.checkParams.archId
              }
              this.UseAreaInfoData = res.data.data.list[0].d21UseAreaVO;
            }
            if (this.checkParams.archType === 'D22') {
              this.showD212 = true;
              //专业信息特性信息的archId不能为‘’（空字符串）  --2019/01/14
              if (res.data.data.list[0].d22SpecInfoVO !== null) {
                this.D22Info = res.data.data.list[0].d22SpecInfoVO;
              } else {
                this.D22Info.archId = this.checkParams.archId
              }
              this.UseAreaInfoData = res.data.data.list[0].d22UseAreaVO;
            }
            if (this.checkParams.archType === 'D31') {
              this.showD31 = true;
              //专业信息特性信息的archId不能为‘’（空字符串）  --2019/01/14
              if (res.data.data.list[0].d31SpecInfoVO !== null) {
                this.D31Info = res.data.data.list[0].d31SpecInfoVO;
              } else {
                this.D31Info.archId = this.checkParams.archId
              }
              this.D31BuildProjData = res.data.data.list[0].d31BuildProjInfoList;
              this.D31PubBuildData = res.data.data.list[0].d31PubBuildInfoList
            }
            if (this.checkParams.archType === 'D32') {
              this.D32Info = res.data.data.list[0].d32PlanInfoList;
            }
            if (this.checkParams.archType === 'D34') {
              this.D34Info = res.data.data.list[0].d34PlanInfoVO;
            }
            if (this.checkParams.archType === 'D61') {
              this.showD61 = true;
              this.showD6123 = true;
              this.PubBuildInfoData = res.data.data.list[0].d61PubBuildInfoList;
              this.NumAreaInfoData = res.data.data.list[0].d61NumAreaInfoList;
              this.MeasureInfoData = res.data.data.list[0].d61MeasureInfoList;
            }
            if (this.checkParams.archType === 'D62') {
              this.showD6123 = true;
              this.MeasureInfoData = res.data.data.list[0].d62MeasureInfoList;
            }
            if (this.checkParams.archType === 'D63') {
              this.showD6123 = true;
              this.D63Info = res.data.data.list[0].d63PipelineInfoVO;
              this.MeasureInfoData = res.data.data.list[0].d63MeasureInfoList;
            }
          })
      },
      //显示档案基本信息
      showBaseInfo() {
        if (this.prof === true || this.file === true) {
          this.prof = false;
          this.file = false
        }
        this.base = true;
        this.butOnSelect.activeIndex = 1;
      },
      //显示档案专业信息
      showProfInfo() {
        if (this.base === true || this.file === true) {
          this.base = false;
          this.file = false
        }
        this.prof = true;
        this.butOnSelect.activeIndex = 2;
      },
      //显示档案文件信息
      showFileInfo() {
        if (this.base === true || this.prof === true) {
          this.base = false;
          this.prof = false
        }
        this.file = true;
        this.butOnSelect.activeIndex = 3;
      },
      //质检通过
      successCheck() {
        this.axios.post('/api/loadArch/writeCheckComplete', this.qs.stringify({
          archID: this.baseArch.archId,
          result: '通过'
        })).then(res => {
          this.$Message.success('质检完成！');
          this.goBack();
        })
      },
      //质检不通过
      failCheck() {
        this.showModal = true;
      },
      //不通过确定
      modelOK() {
        this.axios.post('/api/loadArch/writeCheckComplete', this.qs.stringify({
          archID: this.baseArch.archId,
          result: '不通过',
          reason: this.reason
        })).then(res => {
          this.showModal = false;
          this.$Message.success('操作完成');
          this.goBack();
        })
      },
      //不通过取消
      modelCancel() {
        this.reason = '';
        this.showModal = false;
      },
      //返回
      goBack() {
        let type = {
          id: this.baseArch.classId,
          className: this.baseArch.archType
        };
        this.$emit('changeShowView', type)
      },
      //清空数据，重置
      resetData() {
        this.modalTitle = '';
        this.reason = '';
        this.C61Info.archId = '';
        this.C62Info.archId = '';
        this.C63Info.archId = '';
        this.D21Info.archId = '';
        this.D22Info.archId = '';
        this.D31Info.archId = '';
        this.D32Info.archId = '';
        this.D34Info.archId = '';
        this.D63Info.archId = '';
        this.UseAreaInfoData = [];
        this.D31BuildProjData = [];
        this.D31PubBuildData = [];
        this.PubBuildInfoData = [];
        this.NumAreaInfoData = [];
        this.MeasureInfoData = [];
        this.showD212 = false;
        this.showD31 = false;
        this.showD61 = false;
        this.showD6123 = false;
      },
      //基本信息使用，把发文号拆开显示
      getDispatchNoType(DispatchNo) {
        let index = DispatchNo.lastIndexOf("〔");
        return DispatchNo.substring(0, index)
      },
      getDispatchNoYear(DispatchNo) {
        let index = DispatchNo.lastIndexOf("〔");
        let index2 = DispatchNo.lastIndexOf("〕");
        return DispatchNo.substring(index + 1, index2)
      },
      getDispatchNoNum(DispatchNo) {
        let index = DispatchNo.lastIndexOf("〕");
        return DispatchNo.substring(index + 1, DispatchNo.length)
      },
    },
    mounted() {
      this.loadWriteCheck();
    }
  }
</script>

<style scoped>

</style>
