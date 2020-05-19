<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-calendar"></i> 图片
				</el-breadcrumb-item>
				<el-breadcrumb-item>图片列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="basic_button">
				<div style="display: flex;">
					<el-button @click="resetDateFilter">清除日期过滤器</el-button>
			  	<el-button @click="clearFilter">清除所有过滤器</el-button>
				</div>
				<el-input v-model="search" size="mini" class="tab_search">
			    <el-select v-model="selectValue" slot="prepend" style="width: 110px;">
			      <el-option label="图片名称" value="1"></el-option>
			      <el-option label="上传者" value="2"></el-option>
			    </el-select>
			  </el-input>
			</div>
		  <el-table
		    ref="filterTable"
		    :data="nowData"
		    max-height="300"
		    tooltip-effect="dark"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="图片名称"
		      width="150">
		    </el-table-column>
		    <el-table-column
		      prop="userName"
		      label="上传者"
		      width="120">
		    </el-table-column>
		    <el-table-column
		      prop="time"
		      label="上传日期"
		      sortable
		      width="150"
		      column-key="date"
		      :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]"
		      :filter-method="filterHandler"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="describe"
		      label="图片描述"
		      min-width="250">
		    </el-table-column>
		    <el-table-column
		      prop="classifyName"
		      label="分类"
		      min-width="100"
		      :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
		      :filter-method="filterTag"
		      filter-placement="bottom-end">
		      <template slot-scope="scope">
		        <el-tag
		          :type="scope.row.classifyName === '家' ? 'primary' : 'success'"
		          disable-transitions>{{scope.row.classifyName}}</el-tag>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作"
		      fixed="right"
		      min-width="220">
		      <template slot-scope="scope">
		        <el-button @click="handleClick(scope.row)" size="mini">预览</el-button>
		        <el-button size="mini">编辑</el-button>
		        <el-button size="mini" type="danger">删除</el-button>
		      </template>
		    </el-table-column>
		  </el-table>

		  <div class="base_pagination">
		  	<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-sizes="[100, 200, 300, 400]"
		      :page-size="100"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="400">
		    </el-pagination>
		  </div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tableData: [{
				name: '落日余晖',
				userName: '张无忌',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '夕阳西下',
				userName: '李清照',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '几度夕阳红',
				userName: '张三丰',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '青山不改',
				userName: '辛弃疾',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '绿水长流',
				userName: '李世民',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '后会有期',
				userName: '李世民',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '江湖再见',
				userName: '张三丰',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '落日余晖',
				userName: '张无忌',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      }],
      search: '',
      currentPage: 1,
      selectValue: '1'
		}
	},
	computed: {
		nowData () { // 当前表格数据
			if (this.selectValue == '1') { // 根据图片名称过滤
				return this.tableData.filter(data => !this.search || data.name.toLowerCase().includes(this.search.toLowerCase()))
			} else if (this.selectValue == '2') { // 根据上传者姓名进行过滤
				return this.tableData.filter(data => !this.search || data.userName.toLowerCase().includes(this.search.toLowerCase()))
			} else {
				return this.tableData
			}
		}
	},
	methods: {
		resetDateFilter() { // 清除日期选择
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() { // 清除所有过滤器
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) { // 格式处理
      return row.address;
    },
    filterTag(value, row) { // 标签筛选
      return row.classifyName === value;
    },
    filterHandler(value, row, column) { // 日期筛选
      const property = column['property'];
      return row[property] === value;
    },
    handleSelectionChange(val) { // 多选发生变化
    	console.log(val)
    },
    handleClick(row) { // 点击行方法
      console.log(row);
    },
    handleSizeChange(val) { // 每页条数发生变化
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) { // 当前页变化
      console.log(`当前页: ${val}`);
    }
	}
}
</script>

<style scoped="scoped">
	.basic_button{
		margin-bottom: 15px;
		display: flex;
		justify-content: space-between;
	}
	.tab_search{
		width: 350px;
	}
	.base_pagination{
		margin-top: 20px;
	}
</style>