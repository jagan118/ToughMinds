import it like : recomended
 // Dynamic import - works better with Vite/Angular 17+
    import('three/examples/jsm/loaders/GLTFLoader.js').then((module) => {
      const { GLTFLoader } = module;
      const loader = new GLTFLoader();
    
or normal import {//}

but our gbl.file will be in assets in it models but to load them we need to mention :
            {
                "glob": "**/*",
                "input": "src/assets",
                "output": "/assets"
              }
              this in angular.js in the assets object search for it 
by default there will be publick folder 
if u mention that they will load from specified path              