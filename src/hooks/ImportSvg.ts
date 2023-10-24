const svgList = new Map()
let globModules= import.meta.glob('../assets/qweather-icons/icons/*.svg', {eager: true, import: 'default'})
Object.entries(globModules).forEach( async ([path, globModule]) => {
    // console.log(path, globModule)
    const pathSplit = path.split('/')
    svgList.set(pathSplit[pathSplit.length - 1],  globModule)
})

const useImportSvg = () =>{
  return{
    svgList
  }
}

export default useImportSvg