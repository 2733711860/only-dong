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
			<el-button @click="resetDateFilter">清除日期过滤器</el-button>
		  <el-button @click="clearFilter">清除所有过滤器</el-button>
		  <el-table
		    ref="filterTable"
		    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
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
		      fixed="right"
		      min-width="220">
		      <template slot="header" slot-scope="scope">
		        <el-input
		          v-model="search"
		          size="mini"
		          placeholder="输入图片名称进行搜索"/>
		      </template>
		      <template slot-scope="scope">
		        <el-button @click="handleClick(scope.row)" size="mini">预览</el-button>
		        <el-button size="mini">编辑</el-button>
		        <el-button size="mini" type="danger">删除</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		  
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
</template>

<script>
export default {
	data() {
		return {
			tableData: [{
				name: '落日余晖',
				userName: '张三丰',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '落日余晖',
				userName: '张三丰',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '落日余晖',
				userName: '张三丰',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '落日余晖',
				userName: '张三丰',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '落日余晖',
				userName: '张三丰',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '落日余晖',
				userName: '张三丰',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '落日余晖',
				userName: '张三丰',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      },{
				name: '落日余晖',
				userName: '张三丰',
        time: '2016-05-02',
        describe: '落日余晖，夕阳西下，人影依偎。',
        classifyName: '家'
      }],
      search: '',
      currentPage: 1
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