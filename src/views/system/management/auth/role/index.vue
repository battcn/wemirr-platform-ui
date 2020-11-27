<template>
  <d2-container  :class="{'page-compact':crud.pageOptions.compact}">
    <d2-crud-x
        ref="d2Crud"
        v-bind="_crudProps"
        v-on="_crudListeners"
        :options="options"
        @edit="editHandle"
        @distribution-user="distributionUserHandle"
        @distribution-resource="distributionResourceHandle"
    >
      <div slot="header">
        <crud-search ref="search" :options="crud.searchOptions" @submit="doSearch"  />
        <el-button-group>
          <el-button size="small" type="primary" @click="addRow"><i class="el-icon-plus"></i> 新增</el-button>
        </el-button-group>
        <crud-toolbar :search.sync="crud.searchOptions.show"
                      :compact.sync="crud.pageOptions.compact"
                      :columns="crud.columns"
                      @refresh="doRefresh()"
                      @columns-filter-changed="handleColumnsFilterChanged"/>

      </div>
      <template slot="scopeTypeSlot" slot-scope="scope">
        <el-tag>{{enums.DataScopeType[scope.row.scopeType]}}</el-tag>
      </template>
      <template slot="scopeTypeFormSlot" slot-scope="scope">
        <el-radio-group  @change="dsTypeChange"  v-model="scope.form.scopeType">
          <el-radio-button :key="index" :label="key" :value="key" v-for="(item, key, index) in enums.DataScopeType">
            {{ item }}
          </el-radio-button>
        </el-radio-group>
        <el-form-item :hidden="orgHidden" prop="orgList" v-model="scope.form.orgList" style="margin-top: 10px">
          <el-tree
            :data="orgList"
            :default-checked-keys="orgList"
            :default-expanded-keys="orgList"
            default-expand-all
            highlight-current
            node-key="id"
            ref="orgTree"
            show-checkbox
          />
        </el-form-item>
      </template>
    </d2-crud-x>

    <user-role
      :dialog-visible="userRoleDialog.isVisible"
      @close="userRoleDialog.isVisible = false"
      @success="successHandler"
      ref="userRole"
    />
    <role-edit
      :dialog-visible="dialog.isVisible"
      :type="dialog.type"
      @close="dialog.isVisible = false"
      @success="successHandler"
      ref="edit"
    />
    <role-authority
      :dialog-visible="roleAuthorityDialog.isVisible"
      @close="roleAuthorityDialog.isVisible = false"
      @success="successHandler"
      ref="roleAuthority"
    />

  </d2-container>
</template>

<script>
import RoleEdit from './edit'
import RoleAuthority from './role-authority'
import UserRole from './user-role'
import * as api from './api'
import { GetList as OrgTree } from '@/views/system/management/user/org/api.js'
import { crudOptions } from './crud'
import { d2CrudPlus } from 'd2-crud-plus'
export default {
  name: 'formSelect',
  mixins: [d2CrudPlus.crud],
  components: { RoleEdit, RoleAuthority, UserRole },
  data () {
    return {
      orgList: [],
      topics: [{ name: 'a', id: 1 }],
      orgHidden: true,
      enums: {
        DataScopeType: {
          50: '全部',
          40: '本级以及子级',
          30: '本级',
          20: '自定义',
          10: '个人'
        }
      },
      dialog: {
        isVisible: false,
        type: 'add'
      },
      userRoleDialog: {
        isVisible: false
      },
      roleAuthorityDialog: {
        isVisible: false
      },
      options: {
        border: true,
        stripe: true
      }
    }
  },
  mounted () {
    this.initOrg()
  },
  methods: {
    initOrg () {
      OrgTree({ status: true })
        .then((res) => {
          console.log('this.orgList = response', res)
          this.orgList = res.data
        })
    },
    getCrudOptions () {
      return crudOptions(this)
    },
    pageRequest (query) {
      return api.GetList(query)
    },
    addRequest (row) {
      row.orgList = this.$refs.orgTree.getCheckedKeys()
      return api.AddObj(row)
    },
    updateRequest (row) {
      row.orgList = this.$refs.orgTree.getCheckedKeys()
      return api.UpdateObj(row)
    },
    delRequest (row) {
      return api.DelObj(row.id)
    },
    editHandle (event) {
      this.dialog.type = 'edit'
      this.dialog.isVisible = true
      this.$refs.edit.setRole(event.row)
    },
    successHandler () {
      this.doSearch()
    },
    distributionUserHandle (event) {
      this.userRoleDialog.isVisible = true
      this.$refs.userRole.setUserRole(event.row)
    },
    distributionResourceHandle (event) {
      this.roleAuthorityDialog.isVisible = true
      this.$refs.roleAuthority.setRoleAuthority(event.row)
    },
    /**
       * 对话框打开前被调用
       * 此方法内无法执行 getEditFormTemplate，请写到doDialogOpened
       * @param context
       * @private
       */
    doDialogOpened (context) {
      console.log('context', context)
      if (context.mode === 'edit') {
        this.orgHidden = context.form.scopeType !== 20
        console.log(this.orgHidden)
        if (!this.orgHidden) {
          api.GetOrgDetails(context.row.id)
            .then((res) => {
              const orgIds = res.data.map(roleOrg => roleOrg.orgId)
              this.$refs.orgTree.setCheckedKeys(orgIds)
            })
        }
      }
    },
    dsTypeChange (value) {
      this.orgHidden = value !== '20'
    }
  }
}
</script>
