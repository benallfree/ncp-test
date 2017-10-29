const {promisify} = require('util')
const ncp = promisify(require('ncp'))
const path = require('path')
const fs = require('fs')
const access = promisify(fs.access)
const mkdirp = promisify(require('mkdirp'))
const _ = require('lodash')

class CLI {
  async copy (src, dst) {
    try {
      src = path.resolve(src)
      dst = path.resolve(dst)
      await access(src)
      await mkdirp(dst)
      await access(dst)
      await ncp(src, dst, {
        clobber: false,
        stopOnErr: false
      })
      console.log(`${src} -> ${dst}`)
    } catch (errs) {
      let errList = errs
      if (!_.isArray(errList)) {
        errList = [errList]
      }
      for (let i in errList) {
        let err = errList[i]
        switch (err.code) {
          case 'ENOENT':
            console.log(`ERROR: ${err.path} does not exist. (${err.code})`)
            break
          default:
            throw (err)
        }
      }
    }
  }
}

let cli = new CLI()

async function test () {
  await cli.copy('examples', 'dst/config')
  await cli.copy('migrations', 'dst/database/migrations')
  await cli.copy('doesntexist', 'dst/database/migrations')
}

test()
