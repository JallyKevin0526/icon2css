import getPixels from 'get-pixels'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'

class fileService {
    constructor() {
        this.form = new formidable.IncomingForm()
        this.form.hash = 'md5'
        this.form.encoding = 'utf-8'
        this.form.keepExtensions = true
        this.form.multiples = true
        this.form.uploadDir = path.join(__dirname, '../files')
        this.foo = ''
        this.flag = 0
    }

    icon2Css(req, res) {
        this.upload(req, res)
    }

    upload(req, res) {
        var allFile = [];
        this.form.on('file', function (filed, file) {
            allFile.push([filed, file]);//收集传过来的所有文件
        }).parse(req, async (err, fields, files) => {
            let num = parseInt(fields.num) || 0
            let len = allFile.length
            console.log(allFile.length)
            for (let k = num; k < len; k++) {
                let arr = this.updateName(allFile[k][1], k)
                await fs.rename(arr[1], arr[0], err => {
                    if (err) {
                        return res.json({
                            code: 1,
                            msg: '改名失败',
                            data: err.toString()
                        })
                    }
                    this.getPix(arr[0]).then(res => {
                        this.css(res, k, arr[2], len)
                    })
                })
            }
        })
    }

    css(pix, k, ext, len) {
        let str = `.icon_${k} {
    width: ${pix[0] / 40}rem;
    height: ${pix[1] / 40}rem;
    background: url("../images/icon/${k}${ext}") no-repeat center;
    background-size: 100% 100%
}
`
        this.foo += str
        console.log(k, len)
        this.flag += 1
        if (this.flag == len) {
            this.foo = `/*当前序号${len - 1}*/\n` + this.foo
            this.createFile()
        }
    }

    createFile() {
        let writerStream = fs.createWriteStream('icon.css');
        writerStream.write(this.foo, 'UTF8');
        writerStream.end();  //标记文件末尾  结束写入流，释放资源
        writerStream.on('finish', function () {
            console.log("写入完成。");
        });

    }


    updateName(files, k) {
        // 拿到扩展名
        console.log('files', files)
        let extname = path.extname(files.name)
        let oldpath = path.normalize(files.path)
        // 新的名称
        let newfilename = k + extname
        let newpath = path.join(__dirname, '../files/') + newfilename
        return [newpath, oldpath, extname]
    }

    getPix(url) {
        return new Promise(resolve => {
            getPixels(url, function (err, pixels) {
                console.log(pixels.shape)
                resolve(pixels.shape)
            })
        })
    }
}

export default fileService