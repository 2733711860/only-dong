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
				<div class="basic_item">
					<div class="basic_name">图片名称</div>
					<el-input v-model="searchData.picName" placeholder="请输入图片名称"></el-input>
				</div>
				<div class="basic_item" style="margin-left: 30px;">
					<div class="basic_name">上传时间</div>
					<el-col :span="11">
			      <el-date-picker type="date" placeholder="起始日期" v-model="searchData.startDate" style="width: 100%;"></el-date-picker>
			    </el-col>
			    <el-col style="text-align: center;" :span="2">-</el-col>
			    <el-col :span="11">
			      <el-date-picker type="date" placeholder="截止日期" v-model="searchData.endDate" style="width: 100%;"></el-date-picker>
			    </el-col>
				</div>
			</div>
			<div class="basic_button">
				<div class="basic_item">
					<div class="basic_name">上传者姓名</div>
					<el-input v-model="searchData.picUserName" placeholder="请输入上传者姓名"></el-input>
				</div>
				<div class="basic_item" style="margin-left: 30px;">
					<el-button size="mini" type="primary" @click="init()">查询</el-button>
					<el-button size="mini">重置</el-button>
				</div>
			</div>
		  <el-table
		    ref="filterTable"
		    :data="tableData"
		    max-height="300"
		    tooltip-effect="dark"
		    @filter-change="filterChange"
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
		      width="150"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="describe"
		      label="图片描述"
		      min-width="250">
		    </el-table-column>
		    <el-table-column
		      prop="classify"
		      label="分类"
		      min-width="100"
		      :filters="classifyList"
		      :column-key="'time'"
		      filter-placement="bottom-end">
		      <template slot-scope="scope">
		        <el-tag
		          disable-transitions>{{classifyList.filter(item=>item.value==scope.row.classify)[0].text}}</el-tag>
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
			tableData: [], // 表格数据
      search: '', // 搜索关键字
      currentPage: 1, // 当前页
      selectValue: '1', // 搜索分类
      classifyList: [], // 图片分类列表
    	searchData: {
    		picName: '', // 搜索图片名称
	    	picUserName: '', // 上传者姓名
	    	picClassify: '', // 搜索图片类别
	    	startDate: '', // 搜索开始时间
	    	endDate: '' // 搜索结束时间
    	}
		}
	},
	mounted() {
		this.getClassify()
		this.init()
	},
	methods: {
		async getClassify() { // 获取图片分类
			await this.$post(this.$api.getClassify).then(data => {
    		if (data.code == 200) {
    			this.classifyList = data.data.classifyList
				} else {
					this.$message.error(data.msg);
				}
	    })
		},
		async init() { // 查询接口
			let param = {
				name: this.searchData.picName, // 图片名称
				classify: this.searchData.picClassify, // 图片分类
				userName: this.searchData.picUserName, // 上传者姓名
				page: 1, // 当前页
				pageSize: 10 // 每页10条
			}
			await this.$post(this.$api.search, param).then(data => {
    		if (data.code == 200) {
    			this.tableData = data.data.list
    			console.log(this.tableData)
    			this.$forceUpdate()
				} else {
					this.$message.error(data.msg);
				}
	    })
		},
		filterChange(filters) { // 筛选发生变化
			this.searchData.picClassify = filters.time
			this.init()
		},
    handleSelectionChange(val) { // 多选发生变化
    },
    handleClick(row) { // 点击行方法
      console.log(row);
    },
    handleSizeChange(val) { // 每页条数发生变化
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) { // 当前页变化
      console.log(`当前页: ${val}`);
    },
    resetForm() { // 重置
    	this.$refs.searchF.resetFields();
    }
	}
}
</script>

<style scoped="scoped">
	.basic_button{
		margin-bottom: 15px;
		display: flex;
	}
	.basic_item{
		display: flex;
		align-items: center;
	}
	.basic_name{
		width: 100px;
		color: #606266;
		font-size: 14px;
	}
	.tab_search{
		width: 350px;
	}
	.base_pagination{
		margin-top: 20px;
	}
</style>