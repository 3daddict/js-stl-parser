 
const benchy = '../assets/stl/3DBenchy.stl';
const squareAscii = '../assets/stl/square-ascii.STL';
const squareBinary = '../assets/stl/square-binary.STL';

var loader = new THREE.STLLoader();
loader.load(benchy, function(geometry) {
  let calculatedStlVolume = Math.round(getVolume(geometry));
  let stlSize = getSize(geometry);

  document.querySelector('#stlVolume').textContent = calculatedStlVolume;
  localStorage.setItem("stlVolume", calculatedStlVolume);

  let stlSizeOutput = {
    x: stlSize.x,
    y: stlSize.y,
    z: stlSize.z
  };

  document.querySelector('#stlSizeL').textContent = Math.round(stlSizeOutput.x);
  document.querySelector('#stlSizeW').textContent = Math.round(stlSizeOutput.y);
  document.querySelector('#stlSizeH').textContent = Math.round(stlSizeOutput.z);
  localStorage.setItem("stlSizeL", stlSizeOutput.x);
  localStorage.setItem("stlSizeW", stlSizeOutput.y);
  localStorage.setItem("stlSizeH", stlSizeOutput.z);
});

// check with known volume:
var hollowCylinderGeom = new THREE.LatheBufferGeometry([
  new THREE.Vector2(1, 0),
  new THREE.Vector2(2, 0),
  new THREE.Vector2(2, 2),
  new THREE.Vector2(1, 2),
  new THREE.Vector2(1, 0)
], 90).toNonIndexed();

function getVolume(geometry) {

  let position = geometry.attributes.position;
  let faces = position.count / 3;
  let sum = 0;
  let p1 = new THREE.Vector3(),
      p2 = new THREE.Vector3(),
      p3 = new THREE.Vector3();
  for (let i = 0; i < faces; i++) {
    p1.fromBufferAttribute(position, i * 3 + 0);
    p2.fromBufferAttribute(position, i * 3 + 1);
    p3.fromBufferAttribute(position, i * 3 + 2);
    sum += signedVolumeOfTriangle(p1, p2, p3);
  }
  return sum;

}

function signedVolumeOfTriangle(p1, p2, p3) {
  return p1.dot(p2.cross(p3)) / 6.0;
}

function getSize(geometry) {
  let size = new THREE.Vector3();
  geometry.computeBoundingBox();
  geometry.boundingBox.getSize( size );
  return size;
}
