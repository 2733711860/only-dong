<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 图片</el-breadcrumb-item>
				<el-breadcrumb-item>图片上传</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="form_content">
        <div class="unloaddiv">
        	<el-dialog :visible.sync="dialogVisible" size="tiny">
					  <img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
        	<el-upload
        		ref="imageUpload"
					  action="https://jsonplaceholder.typicode.com/posts/"
					  :on-preview="handlePictureCardPreview"
					  :on-remove="handleRemove"
					  :on-exceed="handleExceed"
					  :on-change="handleChange"
					  :file-list="fileList"
					  :auto-upload="false"
					  :limit="limit"
					  list-type="picture">
					  <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
					  <el-button style="margin-left: 10px;" size="small" type="success" @click="uploadFile">上传到服务器</el-button>
					</el-upload>
        </div>

        <el-dialog title="上传图片" :visible.sync="dialogUploadVisible" width="800" center>
        	<el-form ref="uploadForm" :model="uploadForm" :rules="uploadRules" status-icon label-width="100px" class="imageform">
	        	<el-form-item label="图片名称" prop="name">
	        		<el-input v-model="uploadForm.name" placeholder="请输入图片名称"></el-input>
	        	</el-form-item>
	          <el-form-item label="图片分类" prop="classify">
	            <el-select v-model="uploadForm.classify" placeholder="请选择图片分类">
					    	<el-option v-for="(item, index) in classifyList" :key="index" :label="item.text" :value="item.value"></el-option>
					    </el-select>
	          </el-form-item>
	          <el-form-item label="图片描述" prop="describe">
	            <el-input type="textarea" v-model="uploadForm.describe"></el-input>
	          </el-form-item>
	        </el-form>
	        <div style="text-align: right;">
	        	<el-button size="medium" @click="dialogUploadVisible = false">取 消</el-button>
    				<el-button size="medium" type="primary" @click="uploadfile">确 定</el-button>
	        </div>
				</el-dialog>
      </div>
		</div>
	</div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import { formatDate } from '@/utils/commonFunction.js'
import { mapGetters } from 'vuex'
export default {
	name: 'upload',
	data: function() {
		return {
			fileList: [], // 上传文件列表
			dialogVisible: false, // 图片预览
			dialogUploadVisible: false, // 上传图片框
			dialogImageUrl: '', // 图片预览url
      limit: 1, // 上传文件限制个数
      classifyList: [], // 图片分类列表
      uploadForm: {
      	name: '',
      	classify: '',
      	describe: ''
      },
      uploadRules: {
      	classify: [ { required: true, message: '请选择图片分类', trigger: 'change' } ]
      }
		}
	},
	components: {
		VueCropper
	},
	computed: {
  	...mapGetters(['user'])
  },
  mounted() {
  	this.getClassify()
	},
	methods: {
		async getClassify() { // 获取图片分类
			await this.$post(this.$api.getClassify).then(data => {
    		if (data.code == 200) {
    			this.classifyList = data.data.classifyList
					this.$message.success(data.msg);
				} else {
					this.$message.error(data.msg);
				}
	    })
		},
		handleRemove(file, fileList) { // 删除图片
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) { // 图片预览
      this.dialogImageUrl = file.url
      this.dialogVisible = true;
    },
    handleExceed() { // 上传文件超过限制个数
    	console.log('上传文件超过限制个数')
    },
    handleChange(file, fileList) { // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    	this.fileList = fileList
    	console.log(file, fileList)
    },
    uploadFile() { // 打开图片信息填写弹出框
    	if (this.fileList.length == 0) {
    		this.$message.error('请选择要上传的图片')
    	} else {
    		this.dialogUploadVisible = true
    	}
    },
    uploadfile() { // 弹出框确认按钮
   		this.$refs.uploadForm.validate((valid) => {
        if (valid) {
        	this.dialogUploadVisible = false
        	this.submitImage()
        } else {
          this.$message.error('请输入完整表单信息')
          return false
        }
      })
    },
    async submitImage() { // 上传图片接口
    	let formDate = new FormData()
    	formDate.append("file", this.fileList[0].raw);
    	formDate.append("name", this.uploadForm.name);
    	formDate.append("describe", this.uploadForm.describe);
    	formDate.append("classify", this.uploadForm.classify);
    	formDate.append("userName", this.user.userName);
    	formDate.append("userId", this.user.userId);
    	formDate.append("time", formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'));
    	await this.$post(this.$api.imageUpload, formDate).then(data => {
    		if (data.code == 200) {
					this.$message.success(data.msg);
				} else {
					this.$message.error(data.msg);
				}
	    })
    }
	}
}
</script>

<style scoped>
	.imageform{
		flex: 1;
		min-width: 450px;
		max-width: 600px;
	}

	.unloaddiv{
		margin: 40px 0;
		min-width: 450px;
		max-width: 700px;
	}

	.content-title {
		font-weight: 400;
		line-height: 50px;
		margin: 10px 0;
		font-size: 22px;
		color: #1f2f3d;
	}

	.pre-img {
		width: 100px;
		height: 100px;
		background: #f8f8f8;
		border: 1px solid #eee;
		border-radius: 5px;
	}

	.crop-demo {
		display: flex;
		align-items: flex-end;
	}

	.crop-demo-btn {
		position: relative;
		width: 100px;
		height: 40px;
		line-height: 40px;
		padding: 0 20px;
		margin-left: 30px;
		background-color: #409eff;
		color: #fff;
		font-size: 14px;
		border-radius: 4px;
		box-sizing: border-box;
	}

	.crop-input {
		position: absolute;
		width: 100px;
		height: 40px;
		left: 0;
		top: 0;
		opacity: 0;
		cursor: pointer;
	}
</style>

