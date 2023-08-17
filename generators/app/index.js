var Generator = require('yeoman-generator');
const path = require('path')

module.exports = class extends Generator {
    initializing(){
        console.log('App is running!')
    }

   async prompting(){
        this.rootDirectory = this.config.get("rootDirectory")

        if(!this.rootDirectory){
            const  {rootDirectory} = await this.prompt([{
                name:"rootDirectory",
                message:"Where are your components stored?"
            }])

            this.rootDirectory  = rootDirectory;
            this.config.set("rootDirectory", rootDirectory)
        }

       const {nameSpace} =   await this.prompt([{
            name:"nameSpace",
            message:"What is your application Name space?"
        }])

        this.nameSpace = nameSpace;
    }

    writing(){
        const viewPath = path.resolve(this.rootDirectory,'MaterialCard/MaterialCard.view.xml')
        const controllerPath = path.resolve(this.rootDirectory,'MaterialCard/MaterialCard.controller.js')
        const baseControllerPath = path.resolve(this.rootDirectory,'MaterialCard/BaseController.js')

        //MaterialCard.view.xml
        this.fs.copyTpl(
            this.templatePath('MaterialCard/MaterialCard.view.xml'),
            this.destinationPath(viewPath),
            {
                nameSpace: this.nameSpace,
                folder:this.rootDirectory
            }
        )

        //MaterialCard.controller.js
        this.fs.copyTpl(
            this.templatePath('MaterialCard/MaterialCard.controller.js'),
            this.destinationPath(controllerPath),
            {
                nameSpace: this.nameSpace.replaceAll('.','/'),
                folder:this.rootDirectory
            }
        )

        //BaseController.js
        this.fs.copyTpl(
            this.templatePath('MaterialCard/BaseController.js'),
            this.destinationPath(baseControllerPath),
            {
                nameSpace: this.nameSpace,
                folder:this.rootDirectory
            }
        )
    }
};