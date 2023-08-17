# generator-dmc-uicomp-MaterialCard  
<img width="800" alt="image" src="https://github.com/subrahmanyam-pampana/generator-dmc-uicomp-MaterialCard/assets/79074273/a77b3f49-0b46-4cc4-a8e5-dddf328b101a">

## Installation

First, install [Yeoman](http://yeoman.io) and generator-dmcpodplugin using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-dmc-uicomp-MaterialCard
```

Then generate your new project:

```bash
yo dmc-uicomp-MaterialCard
```

## How To Use the MaterialCard

1. Include the Material Card XML View like below in your XML View 
```XML
 <mvc:XMLView viewName="<path to material card>.MaterialCard.MaterialCard" />

```

2. Publish the event like below to load the material card details in your controller. along with data, it taken `success` and `error` call back functions.

```js
let eventBus = this._getPodController().getOwnerComponent().getEventBus();
eventBus.publish("MaterialCard", "loadMaterialDetails", {
   material:"yourMaterial", version:"yourMaterialVersion",
   success:function(data){
        /* data =  {
          material: "string",
          description: "string",
          version: "string",
          image: "url",
          additionalData:"array of Objects" //response of get material/v1/materials public api call
        }
        */

      console.log(data)
     },
   error:function(err){
    console.log(err)
   }

})
```
