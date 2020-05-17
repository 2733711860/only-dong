<template>
	<div class="login-wrap">
		<div class="slideshow">
			<div class="slideshow-image"></div>
			<div class="slideshow-image"></div>
			<div class="slideshow-image"></div>
			<div class="slideshow-image"></div>
		</div>
		<div class="ms-login">
			<div class="ms-title">
				<el-tabs v-model="activeName">
			    <el-tab-pane label="登陆" name="first"></el-tab-pane>
			    <el-tab-pane label="注册" name="second"></el-tab-pane>
			  </el-tabs>
			</div>
			<div class="form_div">
				<!--登陆-->
				<el-form :model="loginParam" :rules="rules" ref="login" label-width="0px" :class="{'active':activeName=='first'}" class="ms-content sign-in-htm">
					<el-form-item prop="userId">
						<el-input v-model="loginParam.userId" placeholder="userId">
							<el-button slot="prepend" icon="el-icon-lx-people"></el-button>
						</el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="password" v-model="loginParam.password" @keyup.enter.native="submitForm()">
							<el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
						</el-input>
					</el-form-item>

					<div class="checkccc">
						<div class="checkccc_wz">验证码</div>
						<el-input v-model="loginParam.checkcode" style="flex: 1;"></el-input>
						<img :src="checkSrc" @click="getCheckcode" />
					</div>

					<div class="login-btn">
						<el-button type="primary" @click="submitForm()">登录</el-button>
					</div>
				</el-form>

				<!--注册-->
				<el-form :model="logoutParam" :rules="logoutrules" ref="logout" label-width="0px" :class="{'active':activeName=='second'}" class="ms-content sign-up-htm">
					<el-form-item prop="logoutUserId">
						<el-input v-model="logoutParam.logoutUserId" placeholder="userId">
							<el-button slot="prepend" icon="el-icon-lx-people"></el-button>
						</el-input>
					</el-form-item>
					<el-form-item prop="logoutPassword">
						<el-input type="password" placeholder="password" v-model="logoutParam.logoutPassword">
							<el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
						</el-input>
					</el-form-item>
					<el-form-item prop="reLogoutPassword">
						<el-input type="password" placeholder="repeat password" v-model="logoutParam.reLogoutPassword">
							<el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
						</el-input>
					</el-form-item>
					<div class="checkccc">
						<div class="checkccc_wz">验证码</div>
						<el-input v-model="logoutParam.checkcode" style="flex: 1;"></el-input>
						<img :src="checkSrc" @click="getCheckcode" />
					</div>
					<div class="login-btn">
						<el-button type="primary" @click="registForm()">注册</el-button>
					</div>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
	import lrz from "lrz"
	import { mapMutations, mapActions, mapGetters } from 'vuex'
	export default {
		data: function() {
			return {
				activeName: 'first',
				checkSrc: '',
				code_token: '',
				loginParam: {
					userId: '',
					password: '',
					checkcode: ''
				},
				logoutParam: {
					logoutUserId: '',
					logoutPassword: '',
					reLogoutPassword: '',
					checkcode: ''
				},
				rules: {
					userId: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					checkcode: [{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}]
				},
				logoutrules: {
					logoutUserId: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					logoutPassword: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					reLogoutPassword: [{
						required: true,
						message: '请再次输入密码',
						trigger: 'blur'
					}],
					checkcode: [{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}]
				}
			};
		},
		computed: {
  	...mapGetters(['user']),
  	},
		mounted () {
			this.getCheckcode()
		},
		methods: {
			async getCheckcode () {
				await this.$get(this.$api.getCheckCode).then(data => {
					this.checkSrc = data.data.imgSrc
					this.code_token = data.data.token
		    })
			},

			submitForm() {
				this.$refs.login.validate(valid => {
					if(valid) {
						this.loginD()
					} else {
						this.$message.error('请输入账号和密码');
						return false;
					}
				});
			},

			async loginD () {
				let param = {
					userId: this.loginParam.userId,
					password: this.loginParam.password,
					checkCode: this.loginParam.checkcode,
					code_token: this.code_token
				}
				await this.$post(this.$api.login, param).then(data => {
					if (data.code == 200) {
						this.setUser(data.data.userMsg[0])
						this.$router.push('/');
					} else {
						this.getCheckcode()
						this.$message.error(data.msg);
					}
		    })
			},

			registForm() {
				this.$refs.logout.validate(valid => {
					if(valid) {
						if (this.logoutParam.checkcode == '') {
							this.$message.error('请填写验证码！');
						} else {
							this.regist()
						}
					} else {
						this.$message.error('请输入完整表单');
					}
				});
			},

			async regist () {
				let param = {
					userId: this.logoutParam.logoutUserId,
					password: this.logoutParam.logoutPassword,
					re_password: this.logoutParam.reLogoutPassword,
					checkCode: this.logoutParam.checkcode,
					code_token: this.code_token
				}
				await this.$post(this.$api.register, param).then(data => {
					if (data.code == 200) {
						this.setUser(data.data.userMsg)
						this.$router.push('/');
					} else {
						this.getCheckcode()
						this.$message.error(data.msg);
					}
		    })
			},

			...mapActions(['setUser'])
		}
	};
</script>

<style scoped>
	.checkccc{
		color: white;
		display: flex;
		margin-bottom: 18px;
		align-items: center;
	}
	.checkccc_wz{
		margin-right: 10px;
	}
	.checkccc img{
		width: 100px;
		height: 50px;
		margin-left: 10px;
	}
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.ms-title {
		width: 100%;
		line-height: 50px;
		text-align: center;
		font-size: 20px;
		color: #fff;
		padding: 0 30px;
	}

	.ms-login {
		position: absolute;
		z-index: 4;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 400px;
		/*margin: -190px 0 0 -175px;*/
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.3);
		overflow: hidden;
	}
	.sign-in-htm{
		padding-top: 50px;
	}
	.upload_c{
		text-align: center;
		margin-bottom: 18px;
	}
	.login_upload{
		width: 60px;
		height: 60px;
		border: 1px solid #DFDFDF;
		border-radius: 50%;
	}
	.login_upload img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.form_div{
		position: relative;
		min-height: 350px;
		padding: 0 30px 10px 30px;
	}

	.ms-content {
		width: 340px;
		-webkit-transform:rotateY(180deg);
      transform:rotateY(180deg);
		-webkit-backface-visibility:hidden;
      backface-visibility:hidden;
		-webkit-transition:all .4s linear;
      transition:all .4s linear;
      position: absolute;
	}

	.login-btn {
		text-align: center;
	}

	.login-btn button {
		width: 100%;
		height: 36px;
		margin-bottom: 10px;
	}

	.login-tips {
		font-size: 12px;
		line-height: 30px;
		color: #fff;
	}
	.fileinput-button{
	position: relative;
	display: inline-block;
	overflow: hidden;
}
.fileinput-button span{
	position: relative;
	display: inline-block;
	overflow: hidden;
	padding: 25px;
	border-radius: 10px;
	background-color: #fbfdff;
	border: 1px dashed #c0ccda;
	color: #dcdee0;
}

.fileinput-button input {
	position: absolute;
	height: 100%;
	width: 100%;
	left: 0px;
	top: 0px;
	opacity: 0;
	-ms-filter: 'alpha(opacity=0)';
}


	.slideshow {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /*filter: blur(1px);*/
}

.slideshow-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background: no-repeat 50% 50%;
  background-size: cover;
  -webkit-animation-name: kenburns; /*为动画命名*/
          animation-name: kenburns;
  -webkit-animation-timing-function: linear; /*从开头到结尾以相同的速度来播放动画*/
          animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite; /*规定动画应该无限次播放*/
          animation-iteration-count: infinite;
  -webkit-animation-duration: 20s; /*动画完成一个周期所需要的时间*/
          animation-duration: 20s;
  opacity: 1;
  -webkit-transform: scale(1.2); /*缩放函数*/
          transform: scale(1.2);
}
.slideshow-image:nth-child(1) {
  -webkit-animation-name: kenburns-1;
          animation-name: kenburns-1;
  z-index: 3;
  background-image: url(../../assets/img/1.jpg);
}
.slideshow-image:nth-child(2) {
  -webkit-animation-name: kenburns-2;
          animation-name: kenburns-2;
  z-index: 2;
  background-image: url(../../assets/img/2.jpg);
}
.slideshow-image:nth-child(3) {
  -webkit-animation-name: kenburns-3;
          animation-name: kenburns-3;
  z-index: 1;
  background-image: url(../../assets/img/3.jpg);
}
.slideshow-image:nth-child(4) {
  -webkit-animation-name: kenburns-4;
          animation-name: kenburns-4;
  z-index: 0;
  background-image: url(../../assets/img/4.jpg);
}

@-webkit-keyframes kenburns-1 {
  0% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  1.5625% {
    opacity: 1;
  }
  23.4375% {
    opacity: 1;
  }
  26.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  98.4375% {
    opacity: 0;
    -webkit-transform: scale(1.21176);
            transform: scale(1.21176);
  }
  100% {
    opacity: 1;
  }
}

@keyframes kenburns-1 {
  0% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  1.5625% {
    opacity: 1;
  }
  23.4375% {
    opacity: 1;
  }
  26.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  98.4375% {
    opacity: 0;
    -webkit-transform: scale(1.21176);
            transform: scale(1.21176);
  }
  100% {
    opacity: 1;
  }
}
@-webkit-keyframes kenburns-2 {
  23.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  26.5625% {
    opacity: 1;
  }
  48.4375% {
    opacity: 1;
  }
  51.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
}
@keyframes kenburns-2 {
  23.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  26.5625% {
    opacity: 1;
  }
  48.4375% {
    opacity: 1;
  }
  51.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
}
@-webkit-keyframes kenburns-3 {
  48.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  51.5625% {
    opacity: 1;
  }
  73.4375% {
    opacity: 1;
  }
  76.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
}
@keyframes kenburns-3 {
  48.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  51.5625% {
    opacity: 1;
  }
  73.4375% {
    opacity: 1;
  }
  76.5625% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
}
@-webkit-keyframes kenburns-4 {
  73.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  76.5625% {
    opacity: 1;
  }
  98.4375% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
}
@keyframes kenburns-4 {
  73.4375% {
    opacity: 1;
    -webkit-transform: scale(1.2);
            transform: scale(1.2);
  }
  76.5625% {
    opacity: 1;
  }
  98.4375% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    -webkit-transform: scale(1);
            transform: scale(1);
  }
}

.active{
	-webkit-transform:rotate(0);
    -ms-transform:rotate(0);
      transform:rotate(0);
}
</style>
<style>
	.el-tabs__nav-wrap::after{
		background-color: initial;
	}
	.el-tabs__item{
		color: white;
	}
</style>