<template>
    <div class="roles-members">
        <div class="search-wrap">
            <el-form ref="searchForm" :inline="true" :model="searchFormData">
                <el-form-item label="姓名">
                    <el-input v-model="searchFormData.name" size="small" placeholder="请输入姓名"/>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="searchFormData.phone" size="small" placeholder="请输入手机号"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchHandle">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-wrap">
            <el-table
                v-loading="isTableLoading"
                ref="memberTable"
                :data="memberTableData"
                size="small"
                class="member-table"
            >
                <el-table-column prop="name" width="100" label="姓名" align="center"/>
                <el-table-column prop="phone" label="手机" align="center"/>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            :total="pageTotal"
            :page-size="10"
            background=""
            layout="prev, pager, next, jumper"
            @current-change="pageChangeHandle"
        />
    </div>
</template>
<script>
export default {
  props: {
    memberTableData: {
        type: Array
    },
    pageTotal: {
        type: Number
    },
    isTableLoading: {
        type: Boolean
    }
  },
  data() {
    return {
      searchFormData: {
        name: "",
        phone: ""
      }
    };
  },
  methods: {
    // 按条件查询角色人员
    searchHandle() {
      const param = {
        name: this.searchFormData.name,
        phone: this.searchFormData.phone
      };
      const data = this.$refs.rolesTree.getCurrentNode();
      this.getRolesPersonFun(data, param);
    },
    pageChangeHandle() {
        this.$emit('changePage')
    }
  }
};
</script>
