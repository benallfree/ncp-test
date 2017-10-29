const {promisify} = require('util')
const ncp = promisify(require('ncp'))

class CLI
{
  async copy(src,dst) {
    let errs = await ncp(src, dst, {
      clobber: false,
      stopOnErr: false,
    })
  }
}

let cli = new CLI()

cli.copy('src', 'dst')