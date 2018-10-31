const stlViewer = document.getElementById('stlViewer');

if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
var scene, camera, renderer, exporter, mesh;
init();
animate();
function init() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 200, 100, 200 );
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
    exporter = new THREE.STLExporter();
    //
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 200, 0 );
    scene.add( hemiLight );
    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 0, 200, 100 );
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 180;
    directionalLight.shadow.camera.bottom = - 100;
    directionalLight.shadow.camera.left = - 120;
    directionalLight.shadow.camera.right = 120;
    scene.add( directionalLight );
    // ground
    var ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );
    var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );
    // export mesh
    var geometry = new THREE.BoxBufferGeometry( 50, 50, 50 );
    var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    mesh.position.y = 25;
    scene.add( mesh );
    //
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    stlViewer.appendChild( renderer.domElement );
    //
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 25, 0 );
    controls.update();
    //
    var params = {
        ASCII: function() {
            exportASCII();
        },
        Binary: function() {
            exportBinary();
        }
    };
    var gui = new dat.GUI();
    var folder = gui.addFolder( 'Export' );
    folder.add( params, 'ASCII' );
    folder.add( params, 'Binary' );
    folder.open();
    //
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
function exportASCII() {
    var result = exporter.parse( mesh );
    saveString( result, 'box.stl' );
}
function exportBinary() {
    var result = exporter.parse( mesh, { binary: true } );
    saveArrayBuffer( result, 'box.stl' );
}
var link = document.createElement( 'a' );
link.style.display = 'none';
stlViewer.appendChild( link );
function save( blob, filename ) {
    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
}
function saveString( text, filename ) {
    save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}
function saveArrayBuffer( buffer, filename ) {
    save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}