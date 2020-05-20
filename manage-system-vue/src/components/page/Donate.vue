<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-redpacket_fill"></i> 完善用户信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
    	<div class="form_content">
        <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" class='elform'>
        	<el-form-item label="用户账号">
        		<el-input v-model="form.userId" disabled></el-input>
        	</el-form-item>
          <el-form-item label="用户姓名" prop="userName" required>
            <el-input v-model="form.userName"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" required>
        		<el-input v-model="form.password"></el-input>
        	</el-form-item>
          <el-form-item label="身份证号" prop="idCard" required>
            <el-input v-model="form.idCard"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" required>
				    <el-switch v-model="form.sex" active-text="女" inactive-text="男" disabled></el-switch>
				  </el-form-item>
          <el-form-item label="年龄" prop="age" required>
            <el-input v-model="form.age" disabled></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday" required>
            <el-input v-model="form.birthday" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobilePhone" required>
            <el-input v-model="form.mobilePhone"></el-input>
          </el-form-item>
          <el-form-item label="用户权限" prop="level">
				    <el-select v-model="form.level" placeholder="请选择用户权限">
				    	<el-option label="无" value="0"></el-option>
				      <el-option label="图片管理" value="1"></el-option>
				      <el-option label="音乐管理" value="2"></el-option>
				      <el-option label="全部" value="3"></el-option>
				    </el-select>
				  </el-form-item>
          <el-form-item style="text-align: center;">
          	<el-button size="medium" type="primary" @click="saveMsg()">保存信息</el-button>
          	<el-button size="medium" type="primary">修改密码</el-button>
          </el-form-item>
        </el-form>

        <div class="crop-demo">
          <img :src="form.avatar" class="pre-img">
          <div class="crop-demo-btn">上传头像
            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
          </div>
        </div>

        <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
          <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelCrop">取 消</el-button>
            <el-button type="primary" @click="cropperStart">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { checkIdCard, getSex, getAge, getBirth, checkMobile } from '../../utils/commonFunction.js'
import VueCropper  from 'vue-cropperjs'
export default {
	components: {
    VueCropper
  },
	data () {
		var checkUserName = (rule, value, callback) => { // 用户名校验
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    };
    var checkIdcard = (rule, value, callback) => { // 证件号码校验
      if (value === '') {
        callback(new Error('请输入证件号码'))
      } else if (!checkIdCard(value)) {
      	callback(new Error('证件号码格式错误'))
      } else {
      	this.form.age = getAge(value)
      	this.form.sex = getSex(value) == '女' ? '1' : '0'
      	this.form.birthday = getBirth(value)
      	callback()
      }
    };
    var checkMobilePhone = (rule, value, callback) => { // 手机号码校验
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!checkMobile(value)) {
      	callback(new Error('手机号格式错误'))
      } else {
      	callback()
      }
    };
    var checkPassword = (rule, value, callback) => {
    	if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
      	callback(new Error('密码长度最低为6位'))
      } else {
      	callback()
      }
    }
		return {
			form: {
				userName: '',
				userId: '',
				level: '',
				idCard: '',
				sex: '0', // 女为1，男为0
				age: '',
				birthday: '',
				mobilePhone: '',
				avatar: '',
				avatarFile: null, // 上传的头像file文件
				password: ''
			},
			rules: {
				userName: [ { validator: checkUserName, trigger: 'blur' } ],
				idCard: [ { validator: checkIdcard, trigger: 'blur' } ],
				mobilePhone: [ { validator: checkMobilePhone, trigger: 'blur' } ],
				password: [ { validator: checkPassword, trigger: 'blur' } ]
			},
			dialogVisible: false,
			imgSrc: '',
      defaultSrc: require('../../assets/img/img.jpg')
		}
	},
	computed: {
  	...mapGetters(['user'])
  },
  mounted () {
  	Object.assign(this.form, this.user)
  	this.form.avatar = this.user ? (this.user.avatar == '' ? this.defaultSrc : this.user.avatar) : this.defaultSrc
  	this.form.password = ''
  },
  methods: {
  	setImage (e) {
      const file = e.target.files[0]
      if (!file.type.includes('image/')) {
        return
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        this.dialogVisible = true
        this.imgSrc = event.target.result
        this.$refs.cropper && this.$refs.cropper.replace(event.target.result)
      }
      reader.readAsDataURL(file);
    },
    cropImage () { // 裁剪
      this.form.avatar = this.$refs.cropper.getCroppedCanvas().toDataURL()
      this.form.avatarFile = this.dataURLtoFile(this.form.avatar, '测试.png')
    },
    cancelCrop () { // 取消裁剪
      this.dialogVisible = false
      this.form.avatar = this.defaultSrc
    },
    async cropperStart () { // 裁剪确定
    	this.dialogVisible = false
    	let formDate = new FormData()
    	formDate.append("file", this.form.avatarFile);
    	formDate.append("userId", this.form.userId);
    	await this.$post(this.$api.upload, formDate).then(data => {
    		if (data.code == 200) {
					this.$message.success(data.msg);
				} else {
					this.$message.error(data.msg);
				}
	    })
    },
    dataURLtoFile (dataurl, filename) { // 将base64转换为文件
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    },
    saveMsg () {
    	this.$refs.form.validate((valid) => {
        if (valid) {
        	this.saveFunc()
        } else {
        	this.$message.error('请输入完整用户信息')
          return false
        }
      })
    },
    async saveFunc () {
			await this.$post(this.$api.improve, this.form).then(data => {
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

<style scoped="scoped">
	.form_content{
		display: flex;
	}
	.elform{
		flex: 1;
	}
	.crop-demo{
    display: flex;
    flex-flow: column;
    padding: 0 0 0 30px;
    justify-content: center;
    align-items: center;
  }
  .crop-demo-btn{
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-top: 50px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .pre-img{
  	width: 120px;
    height: 120px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 50%;
  }
  .crop-input{
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }
  @media (max-width: 800px) {
    .crop-demo {
      width: auto;
    }
  }
  @media (min-width: 800px) {
    .crop-demo {
      width: 30%;
    }
  }
</style>