const gulp = require('gulp');
const connect = require('gulp-connect');
const watch = require('gulp-watch');
const notify = require('gulp-notify');
const spriter = require('gulp-css-spriter');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('connect', function () {
  connect.server({
    // host: '172.16.2.141',
    port: '8080',
    livereload: true
  });
});

//html
function task_html(path) {
  const name = path.match(/([a-zA-Z_-]+)\.(html)/)[1]
  gulp.src(path)
    .pipe(connect.reload()) //自动刷新
    .pipe(notify({
      message: name + '.html更新成功'
    })) //提醒任务完成
}

//less
function task_css(path) {
  const name = path.match(/([a-zA-Z_-]+)\.(styl|sass|scss|less)/)[1]
  gulp.src(path)
    .pipe(less({
      compress: false
    }))

    .pipe(gulp.dest('./css/'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 1%', 'not ie <= 8']
    }))
    .pipe(spriter({
      // 生成的spriter的位置
      spriteSheet: './images/' + name + '/bg_sprite.png',
      spritesmithOptions: {

      },
      // 生成样式文件图片引用地址的路径
      // 如下将生产：backgound:url(../images/sprite20324232.png)
      pathToSpriteSheetFromCSS: '../images/' + name + '/bg_sprite.png',
      spriteSheetBuildCallback: function (err, result) {
        //console.log(result)
      }
    }).on('error', function (err) {
      console.log('err', err)
    }))
    .pipe(new cleanCSS({
      format: 'keep-breaks'
    }))
    .pipe(gulp.dest('./css/'))
    .pipe(connect.reload()) //自动刷新
    .pipe(notify({
      message: name + '.css编译成功'
    })) //提醒任务完成
}


// 不生成雪碧图注释
/* @meta {"spritesheet": {"include": false}} */


// 监听文件 前面不加./ 会监听新增文件
gulp.task('watch', function () {
  gulp.watch(['html/*.html', 'html/*/*.html'], function (options) {
    task_html(options.path)
  });
  gulp.watch(['css/less/*.less'], function (options) {
    task_css(options.path)
  });
});

gulp.task('default', ['connect', 'watch']);